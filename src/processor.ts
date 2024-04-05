import { assertNotNull } from "@subsquid/util-internal";
import { KnownArchives, lookupArchive } from "@subsquid/archive-registry";
import { Store, TypeormDatabase } from "@subsquid/typeorm-store";
import {
  Block,
  DataHandlerContext,
  SubstrateBatchProcessor,
  Event as _Event,
  Call as _Call,
  Extrinsic as _Extrinsic,
} from "@subsquid/substrate-processor";
import { TransferBalance } from "./process/transferBalance";
import { NpoolJoinHandler } from "./process/npoolJoinHandler";
import { NpoolUnbondHandler } from "./process/npoolUnbondHandler";
import { NpoolBondExtraHandler } from "./process/npoolBondExtraHandler";
import { NpoolWithdrawUnbondHandler } from "./process/npoolWithdrawHandler";
import { NpoolPaidOutHandler } from "./process/npoolPaidOutHandler";

export type Event = _Event<Fields>;
export type Call = _Call<Fields>;
export type Extrinsic = _Extrinsic<Fields>;
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>;

const network = process.env.NETWORK;
if (!network) {
  throw new Error("Network not set in environment.");
}

const ARCHIVE = process.env[
  `ARCHIVE_LOOKUP_NAME_${network.toUpperCase()}`
] as KnownArchives;
const USE_ONLY_RPC = process.env.USE_ONLY_RPC === "true";
export const SUPPORT_HOT_BLOCKS = process.env.SUPPORT_HOT_BLOCKS === "true";
const START_BLOCK = parseInt(process.env.START_BLOCK || "0");
const BATCH_SIZE = parseInt(process.env.PROCESSOR_BATCH_SIZE || "1000");

console.log(`
    Network: ${network}
    RPC URL: ${process.env.RPC_ENDPOINT}
    Archive: ${USE_ONLY_RPC ? "None" : ARCHIVE}
    Support hot blocks: ${SUPPORT_HOT_BLOCKS}
    Start block: ${START_BLOCK}
    Batch size: ${BATCH_SIZE}
`);

const database = new TypeormDatabase({ supportHotBlocks: SUPPORT_HOT_BLOCKS });
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
  },
};

export type Fields = typeof fields;
export const processor = new SubstrateBatchProcessor()
  .setGateway(lookupArchive(ARCHIVE, { release: "ArrowSquid" }))
  .setRpcEndpoint({
    url: assertNotNull(process.env.RPC_ENDPOINT),
    rateLimit: 10,
  })
  .setBlockRange({ from: START_BLOCK})
  .addEvent({
    call: true,
    extrinsic: true,
  })
  .setFields(fields);

export let ctx: DataHandlerContext<Store, Fields>;

processor.run(database, async (ctx_) => {
  ctx = ctx_;
  for (let i = 0; i < ctx.blocks.length; i += BATCH_SIZE) {
    const batch = ctx.blocks.slice(i, i + BATCH_SIZE);
    await processBatch(batch);
  }
});

const processBatch = async (batch: Block<Fields>[]) => {
  const transferBalance: TransferBalance = new TransferBalance();
  const npoolJoinHandler: NpoolJoinHandler = new NpoolJoinHandler();
  const npoolUnbondHandler: NpoolUnbondHandler = new NpoolUnbondHandler();
  const npoolBondExtraHandler: NpoolBondExtraHandler = new NpoolBondExtraHandler();
  const npoolWithdrawUnbondHandler: NpoolWithdrawUnbondHandler = new NpoolWithdrawUnbondHandler();
  const npoolPaidOutHandler: NpoolPaidOutHandler = new NpoolPaidOutHandler();

  if (batch.length > 1) ctx.log.debug(`Batch size: ${batch.length}`);

  for (const block of batch) {
    ctx.log.debug(`Processing block ${block.header.height}`);
    for (const call of block.calls) {
      if (call.name === "Balances.transfer") {
        for (const event of call.extrinsic?.events || []) {
            if (event.name === "Balances.Transfer") {
              await transferBalance.process(event);
              break;
          }
        }
      }

      if(call.name == "NominationPools.join") {
        for(const event of call.extrinsic?.events || []) {
          if(event.name === "NominationPools.Bonded") {
              await npoolJoinHandler.process(event);
              break;
          }
        }
      }

      if(call.name == "NominationPools.unbond") {
        for(const event of call.extrinsic?.events || []) {
          if(event.name === "NominationPools.Unbonded") {
              await npoolUnbondHandler.process(event);
              break;
          }
        }
      }

      if(call.name == "NominationPools.bond_extra") {
        for(const event of call.extrinsic?.events || []) {
          if(event.name === "NominationPools.Bonded") {
              await npoolBondExtraHandler.process(event);
              break;
          }
        }
      }

      if(call.name == "NominationPools.withdraw_unbonded") {
        for(const event of call.extrinsic?.events || []) {
          if(event.name === "NominationPools.Withdrawn") {
              await npoolWithdrawUnbondHandler.process(event);
              break;
          }
        }
      }

      for(const event of call.extrinsic?.events || []){
        if(event.name === "NominationPools.PaidOut") {
          await npoolPaidOutHandler.process(event);
        }
      }
    }
  }

  ctx.log.info(
    `Saving blocks from ${batch[0].header.height} to ${
      batch[batch.length - 1].header.height
    }`
  );
  await transferBalance.save();
  await npoolJoinHandler.save();
  await npoolUnbondHandler.save();
  await npoolBondExtraHandler.save();
  await npoolWithdrawUnbondHandler.save();
  await npoolPaidOutHandler.save();
};
