import {assertNotNull} from '@subsquid/util-internal'
import {KnownArchives, lookupArchive} from '@subsquid/archive-registry'
import { Store, TypeormDatabase } from "@subsquid/typeorm-store"
import {
    Block,
    DataHandlerContext,
    SubstrateBatchProcessor,
    Event as _Event,
    Call as _Call,
    Extrinsic as _Extrinsic
} from '@subsquid/substrate-processor'
import { TransferManager } from "./process/transferManager";
import { AccountManager } from './process/accountManager';

export type Event = _Event<Fields>
export type Call = _Call<Fields>
export type Extrinsic = _Extrinsic<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>

const network = process.env.NETWORK;
if (!network) {
  throw new Error('Network not set in environment.')
}

const ARCHIVE = process.env[`ARCHIVE_LOOKUP_NAME_${network.toUpperCase()}`] as KnownArchives;
const USE_ONLY_RPC = process.env.USE_ONLY_RPC === 'true';
export const SUPPORT_HOT_BLOCKS = process.env.SUPPORT_HOT_BLOCKS === 'true';
const START_BLOCK = parseInt(process.env.START_BLOCK || '0');
const BATCH_SIZE = parseInt(process.env.PROCESSOR_BATCH_SIZE || '1000');

console.log(`
    Network: ${network}
    RPC URL: ${process.env.RPC_ENDPOINT}
    Archive: ${USE_ONLY_RPC ? 'None' : ARCHIVE}
    Support hot blocks: ${SUPPORT_HOT_BLOCKS}
    Start block: ${START_BLOCK}
    Batch size: ${BATCH_SIZE}
`);

const database = new TypeormDatabase({supportHotBlocks: SUPPORT_HOT_BLOCKS});
const fields = {
    event: {
      phase: true,
    },
    extrinsic: {
      signature: true,
      success: true,
      error: true,
      hash: true,
      version: true,
      fee: true,
    },
    call: {
      name: true,
      args: true,
    },
    block: {
      timestamp: true,
      stateRoot: true,
      extrinsicsRoot: true,
      validator: true,
    }
  };

export type Fields = typeof fields;

export const processor = new SubstrateBatchProcessor()
    .setGateway(lookupArchive(ARCHIVE, { release: 'ArrowSquid' }))
    .setRpcEndpoint({
        url: assertNotNull(process.env.RPC_ENDPOINT),
        rateLimit: 10,
    })
    .setBlockRange({ from: START_BLOCK })
    .addEvent({
        call: true,
        extrinsic: true
    })
    .setFields(fields)
    
export let ctx: DataHandlerContext<Store, Fields>;


processor.run(database, async (ctx_) => {
    ctx = ctx_;

    for (let i = 0; i < ctx.blocks.length; i += BATCH_SIZE) {
      const batch =  ctx.blocks.slice(i, i + BATCH_SIZE);
      await processBatch(batch);
    }
  }
); 

const processBatch = async (batch: Block<Fields>[]) => {

  const transferManager: TransferManager = new TransferManager();
  const accountManager: AccountManager = new AccountManager();
  

  if (batch.length > 1) ctx.log.debug(`Batch size: ${batch.length}`);
  for (const block of batch) {
    ctx.log.debug(`Processing block ${block.header.height}`);
    
    for (const event of block.events) {
        if(event.name === "Balances.Transfer"){
            let transferData = await transferManager.process(event);
            await accountManager.process(transferData);
        }
    }
  }

  ctx.log.info(`Saving blocks from ${batch[0].header.height} to ${batch[batch.length - 1].header.height}`);
  const accounts = await accountManager.save();
  await transferManager.save(accounts);
}

