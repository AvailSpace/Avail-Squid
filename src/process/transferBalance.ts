import { Event } from "@subsquid/substrate-processor";
import { Transfer, Amount, Account } from "../model";
import { Fields, ctx } from "../processor";
import { DataRawAddress,  } from "../util/interfaces";
import { hexToNativeAddress } from "../util/util";
import importAccount from "./accountManager";
export class TransferBalance {
    transfersData: Map<string, Transfer> = new Map();
    async process(event: Event<Fields>){
        let addressHex = "";
        if (event.extrinsic?.signature?.address){
            addressHex = (event.extrinsic!.signature!.address as DataRawAddress).value;
            importAccount(addressHex);
        }

        if(event.args.from){
            importAccount(event.args.from);
        }

        if(event.args.to){
            importAccount(event.args.to);
        }

        let signature = event.extrinsic?.signature?.signature as {value: string};
        let amount = {
            amount: event.args.amount,
            symbol: "AVL",
            decimal: 18,
        };

        let fee = {
            amount: event.extrinsic!.fee || BigInt(0),
            symbol: "AVL",
            decimal: 18
        }

        const idExist = await ctx.store.findOne(Transfer,
            {
                where: 
                {id: event.id}
            });
        if(idExist == undefined){
         this.transfersData.set(event.id, new Transfer({
            id: event.id,
            action: event.name,
            extrinsicHash: event.extrinsic!.hash,
            extrinsicIndex: event.extrinsicIndex || 0,
            timestamp: new Date(event.block.timestamp!),
            from: await ctx.store.findOne(Account, {
                where: {
                    address: hexToNativeAddress(event.args.from)
                }
            }), 
            to: await ctx.store.findOne(Account, {
                where: {
                    address: hexToNativeAddress(event.args.to)
                }
            }),
            amount: new Amount(amount),
            fee: new Amount(fee),
            sender: await ctx.store.findOne(Account, {
                where: {
                    address: hexToNativeAddress(addressHex)
                }
            }),
            signature: signature.value,
            blockNumber: event.extrinsic!.block.height,
            success: event.extrinsic!.success,
            params: event.call!.args,
         }));
        }
    }

    async save(){
        await ctx.store.insert([...this.transfersData.values()]);
    }
}