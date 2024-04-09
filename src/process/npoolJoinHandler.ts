import { Event } from "@subsquid/substrate-processor";
import { Amount, NominationPoolJoin, Account } from "../model";
import { Fields, ctx } from "../processor";
import { DataRawAddress,  } from "../util/interfaces";
import { hexToNativeAddress } from "../util/util";
import importAccount from "./accountManager";

export class NpoolJoinHandler {
    npoolJoinData: Map<string, NominationPoolJoin> = new Map();
    async process(event: Event<Fields>){
        let addressHex = "";
        if (event.extrinsic?.signature?.address){
            addressHex = (event.extrinsic!.signature!.address as DataRawAddress).value;
            importAccount(addressHex);
        }

        let amount = {
            amount: event.args.bonded,
            symbol: "AVL",
            decimal: 18,
        };

        let fee = {
            amount: event.extrinsic!.fee || BigInt(0),
            symbol: "AVL",
            decimal: 18
        }
        let signature = event.extrinsic?.signature?.signature as {value: string};

        const idExist = await ctx.store.findOne(NominationPoolJoin,
            {
                where: 
                {id: event.id}
            });

        if(idExist == undefined){
         this.npoolJoinData.set(event.id, new NominationPoolJoin({
            id: event.id,
            action: event.name,
            extrinsicHash: event.extrinsic!.hash,
            extrinsicIndex: event.extrinsicIndex || 0,
            timestamp: new Date(event.block.timestamp!),
            blockNumber: event.extrinsic!.block.height,
            sender: await ctx.store.findOne(Account, {
                where: {
                    address: hexToNativeAddress(addressHex)
                }
            }),
            signature: signature.value,
            success: event.extrinsic!.success,
            params: event.call!.args,
            amount: new Amount(amount),
            fee:new Amount(fee),
            poolId: event.args.poolId
         }));
        }
    }

    async save(){
        await ctx.store.insert([...this.npoolJoinData.values()]);
    }
}