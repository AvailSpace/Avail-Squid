import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {CurrencyFee} from "./_currencyFee"

@Entity_()
export class StakingNominate {
    constructor(props?: Partial<StakingNominate>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: true})
    action!: string | undefined | null

    @Column_("text", {nullable: true})
    extrinsicHash!: string | undefined | null

    @Column_("int4", {nullable: true})
    extrinsicIndex!: number | undefined | null

    @Index_()
    @Column_("timestamp with time zone", {nullable: false})
    timestamp!: Date

    @Index_()
    @Column_("int4", {nullable: false})
    blockNumber!: number

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new CurrencyFee(undefined, obj)}, nullable: true})
    currencyFee!: CurrencyFee | undefined | null

    @Column_("text", {nullable: true})
    sender!: string | undefined | null

    @Column_("text", {array: true, nullable: true})
    targets!: (string | undefined | null)[] | undefined | null

    @Column_("bool", {nullable: true})
    success!: boolean | undefined | null

    @Column_("text", {nullable: true})
    params!: string | undefined | null
}
