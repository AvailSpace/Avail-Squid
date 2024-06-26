import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v13 from '../v13'

export const identityOf =  {
    /**
     *  Information that is pertinent to identify the entity behind an account.
     * 
     *  TWOX-NOTE: OK ― `AccountId` is a secure hash.
     */
    v13: new StorageType('Identity.IdentityOf', 'Optional', [v13.AccountId32], v13.Registration) as IdentityOfV13,
}

/**
 *  Information that is pertinent to identify the entity behind an account.
 * 
 *  TWOX-NOTE: OK ― `AccountId` is a secure hash.
 */
export interface IdentityOfV13  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v13.AccountId32): Promise<(v13.Registration | undefined)>
    getMany(block: Block, keys: v13.AccountId32[]): Promise<(v13.Registration | undefined)[]>
    getKeys(block: Block): Promise<v13.AccountId32[]>
    getKeys(block: Block, key: v13.AccountId32): Promise<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<v13.AccountId32[]>
    getPairs(block: Block): Promise<[k: v13.AccountId32, v: (v13.Registration | undefined)][]>
    getPairs(block: Block, key: v13.AccountId32): Promise<[k: v13.AccountId32, v: (v13.Registration | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v13.AccountId32, v: (v13.Registration | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<[k: v13.AccountId32, v: (v13.Registration | undefined)][]>
}

export const superOf =  {
    /**
     *  The super-identity of an alternative "sub" identity together with its name, within that
     *  context. If the account is not some other account's sub-identity, then just `None`.
     */
    v13: new StorageType('Identity.SuperOf', 'Optional', [v13.AccountId32], sts.tuple(() => [v13.AccountId32, v13.Data])) as SuperOfV13,
}

/**
 *  The super-identity of an alternative "sub" identity together with its name, within that
 *  context. If the account is not some other account's sub-identity, then just `None`.
 */
export interface SuperOfV13  {
    is(block: RuntimeCtx): boolean
    get(block: Block, key: v13.AccountId32): Promise<([v13.AccountId32, v13.Data] | undefined)>
    getMany(block: Block, keys: v13.AccountId32[]): Promise<([v13.AccountId32, v13.Data] | undefined)[]>
    getKeys(block: Block): Promise<v13.AccountId32[]>
    getKeys(block: Block, key: v13.AccountId32): Promise<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<v13.AccountId32[]>
    getPairs(block: Block): Promise<[k: v13.AccountId32, v: ([v13.AccountId32, v13.Data] | undefined)][]>
    getPairs(block: Block, key: v13.AccountId32): Promise<[k: v13.AccountId32, v: ([v13.AccountId32, v13.Data] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v13.AccountId32, v: ([v13.AccountId32, v13.Data] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<[k: v13.AccountId32, v: ([v13.AccountId32, v13.Data] | undefined)][]>
}

export const subsOf =  {
    /**
     *  Alternative "sub" identities of this account.
     * 
     *  The first item is the deposit, the second is a vector of the accounts.
     * 
     *  TWOX-NOTE: OK ― `AccountId` is a secure hash.
     */
    v13: new StorageType('Identity.SubsOf', 'Default', [v13.AccountId32], sts.tuple(() => [sts.bigint(), sts.array(() => v13.AccountId32)])) as SubsOfV13,
}

/**
 *  Alternative "sub" identities of this account.
 * 
 *  The first item is the deposit, the second is a vector of the accounts.
 * 
 *  TWOX-NOTE: OK ― `AccountId` is a secure hash.
 */
export interface SubsOfV13  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): [bigint, v13.AccountId32[]]
    get(block: Block, key: v13.AccountId32): Promise<([bigint, v13.AccountId32[]] | undefined)>
    getMany(block: Block, keys: v13.AccountId32[]): Promise<([bigint, v13.AccountId32[]] | undefined)[]>
    getKeys(block: Block): Promise<v13.AccountId32[]>
    getKeys(block: Block, key: v13.AccountId32): Promise<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<v13.AccountId32[]>
    getPairs(block: Block): Promise<[k: v13.AccountId32, v: ([bigint, v13.AccountId32[]] | undefined)][]>
    getPairs(block: Block, key: v13.AccountId32): Promise<[k: v13.AccountId32, v: ([bigint, v13.AccountId32[]] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v13.AccountId32, v: ([bigint, v13.AccountId32[]] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<[k: v13.AccountId32, v: ([bigint, v13.AccountId32[]] | undefined)][]>
}

export const registrars =  {
    /**
     *  The set of registrars. Not expected to get very big as can only be added through a
     *  special origin (likely a council motion).
     * 
     *  The index into this can be cast to `RegistrarIndex` to get a valid value.
     */
    v13: new StorageType('Identity.Registrars', 'Default', [], sts.array(() => sts.option(() => v13.RegistrarInfo))) as RegistrarsV13,
}

/**
 *  The set of registrars. Not expected to get very big as can only be added through a
 *  special origin (likely a council motion).
 * 
 *  The index into this can be cast to `RegistrarIndex` to get a valid value.
 */
export interface RegistrarsV13  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): (v13.RegistrarInfo | undefined)[]
    get(block: Block): Promise<((v13.RegistrarInfo | undefined)[] | undefined)>
}
