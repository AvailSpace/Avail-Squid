import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_, ManyToOne as ManyToOne_} from "typeorm"
import * as marshal from "./marshal"
import {Amount} from "./_amount"
import {Account} from "./account.model"

@Entity_()
export class StakingChill {
    constructor(props?: Partial<StakingChill>) {
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

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.toJSON(), from: obj => obj == null ? undefined : new Amount(undefined, obj)}, nullable: true})
    fee!: Amount | undefined | null

    @Index_()
    @ManyToOne_(() => Account, {nullable: true})
    sender!: Account | undefined | null

    @Column_("bool", {nullable: true})
    success!: boolean | undefined | null

    @Column_("text", {nullable: true})
    stash!: string | undefined | null
}
