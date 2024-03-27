import {sts, Block, Bytes, Option, Result, StorageType, RuntimeCtx} from '../support'
import * as v13 from '../v13'

export const totalIssuance =  {
    /**
     *  The total units issued in the system.
     */
    v13: new StorageType('Balances.TotalIssuance', 'Default', [], sts.bigint()) as TotalIssuanceV13,
}

/**
 *  The total units issued in the system.
 */
export interface TotalIssuanceV13  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const inactiveIssuance =  {
    /**
     *  The total units of outstanding deactivated balance in the system.
     */
    v13: new StorageType('Balances.InactiveIssuance', 'Default', [], sts.bigint()) as InactiveIssuanceV13,
}

/**
 *  The total units of outstanding deactivated balance in the system.
 */
export interface InactiveIssuanceV13  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): bigint
    get(block: Block): Promise<(bigint | undefined)>
}

export const account =  {
    /**
     *  The Balances pallet example of storing the balance of an account.
     * 
     *  # Example
     * 
     *  ```nocompile
     *   impl pallet_balances::Config for Runtime {
     *     type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
     *   }
     *  ```
     * 
     *  You can also store the balance of an account in the `System` pallet.
     * 
     *  # Example
     * 
     *  ```nocompile
     *   impl pallet_balances::Config for Runtime {
     *    type AccountStore = System
     *   }
     *  ```
     * 
     *  But this comes with tradeoffs, storing account balances in the system pallet stores
     *  `frame_system` data alongside the account data contrary to storing account balances in the
     *  `Balances` pallet, which uses a `StorageMap` to store balances data only.
     *  NOTE: This is only used in the case that this pallet is used to store balances.
     */
    v13: new StorageType('Balances.Account', 'Default', [v13.AccountId32], v13.AccountData) as AccountV13,
}

/**
 *  The Balances pallet example of storing the balance of an account.
 * 
 *  # Example
 * 
 *  ```nocompile
 *   impl pallet_balances::Config for Runtime {
 *     type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
 *   }
 *  ```
 * 
 *  You can also store the balance of an account in the `System` pallet.
 * 
 *  # Example
 * 
 *  ```nocompile
 *   impl pallet_balances::Config for Runtime {
 *    type AccountStore = System
 *   }
 *  ```
 * 
 *  But this comes with tradeoffs, storing account balances in the system pallet stores
 *  `frame_system` data alongside the account data contrary to storing account balances in the
 *  `Balances` pallet, which uses a `StorageMap` to store balances data only.
 *  NOTE: This is only used in the case that this pallet is used to store balances.
 */
export interface AccountV13  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v13.AccountData
    get(block: Block, key: v13.AccountId32): Promise<(v13.AccountData | undefined)>
    getMany(block: Block, keys: v13.AccountId32[]): Promise<(v13.AccountData | undefined)[]>
    getKeys(block: Block): Promise<v13.AccountId32[]>
    getKeys(block: Block, key: v13.AccountId32): Promise<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<v13.AccountId32[]>
    getPairs(block: Block): Promise<[k: v13.AccountId32, v: (v13.AccountData | undefined)][]>
    getPairs(block: Block, key: v13.AccountId32): Promise<[k: v13.AccountId32, v: (v13.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v13.AccountId32, v: (v13.AccountData | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<[k: v13.AccountId32, v: (v13.AccountData | undefined)][]>
}

export const locks =  {
    /**
     *  Any liquidity locks on some account balances.
     *  NOTE: Should only be accessed when setting, changing and freeing a lock.
     */
    v13: new StorageType('Balances.Locks', 'Default', [v13.AccountId32], sts.array(() => v13.BalanceLock)) as LocksV13,
}

/**
 *  Any liquidity locks on some account balances.
 *  NOTE: Should only be accessed when setting, changing and freeing a lock.
 */
export interface LocksV13  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v13.BalanceLock[]
    get(block: Block, key: v13.AccountId32): Promise<(v13.BalanceLock[] | undefined)>
    getMany(block: Block, keys: v13.AccountId32[]): Promise<(v13.BalanceLock[] | undefined)[]>
    getKeys(block: Block): Promise<v13.AccountId32[]>
    getKeys(block: Block, key: v13.AccountId32): Promise<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<v13.AccountId32[]>
    getPairs(block: Block): Promise<[k: v13.AccountId32, v: (v13.BalanceLock[] | undefined)][]>
    getPairs(block: Block, key: v13.AccountId32): Promise<[k: v13.AccountId32, v: (v13.BalanceLock[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v13.AccountId32, v: (v13.BalanceLock[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<[k: v13.AccountId32, v: (v13.BalanceLock[] | undefined)][]>
}

export const reserves =  {
    /**
     *  Named reserves on some account balances.
     */
    v13: new StorageType('Balances.Reserves', 'Default', [v13.AccountId32], sts.array(() => v13.ReserveData)) as ReservesV13,
}

/**
 *  Named reserves on some account balances.
 */
export interface ReservesV13  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v13.ReserveData[]
    get(block: Block, key: v13.AccountId32): Promise<(v13.ReserveData[] | undefined)>
    getMany(block: Block, keys: v13.AccountId32[]): Promise<(v13.ReserveData[] | undefined)[]>
    getKeys(block: Block): Promise<v13.AccountId32[]>
    getKeys(block: Block, key: v13.AccountId32): Promise<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<v13.AccountId32[]>
    getPairs(block: Block): Promise<[k: v13.AccountId32, v: (v13.ReserveData[] | undefined)][]>
    getPairs(block: Block, key: v13.AccountId32): Promise<[k: v13.AccountId32, v: (v13.ReserveData[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v13.AccountId32, v: (v13.ReserveData[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<[k: v13.AccountId32, v: (v13.ReserveData[] | undefined)][]>
}

export const holds =  {
    /**
     *  Holds on account balances.
     */
    v13: new StorageType('Balances.Holds', 'Default', [v13.AccountId32], sts.array(() => v13.IdAmount)) as HoldsV13,
}

/**
 *  Holds on account balances.
 */
export interface HoldsV13  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v13.IdAmount[]
    get(block: Block, key: v13.AccountId32): Promise<(v13.IdAmount[] | undefined)>
    getMany(block: Block, keys: v13.AccountId32[]): Promise<(v13.IdAmount[] | undefined)[]>
    getKeys(block: Block): Promise<v13.AccountId32[]>
    getKeys(block: Block, key: v13.AccountId32): Promise<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<v13.AccountId32[]>
    getPairs(block: Block): Promise<[k: v13.AccountId32, v: (v13.IdAmount[] | undefined)][]>
    getPairs(block: Block, key: v13.AccountId32): Promise<[k: v13.AccountId32, v: (v13.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v13.AccountId32, v: (v13.IdAmount[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<[k: v13.AccountId32, v: (v13.IdAmount[] | undefined)][]>
}

export const freezes =  {
    /**
     *  Freeze locks on account balances.
     */
    v13: new StorageType('Balances.Freezes', 'Default', [v13.AccountId32], sts.array(() => v13.Type_342)) as FreezesV13,
}

/**
 *  Freeze locks on account balances.
 */
export interface FreezesV13  {
    is(block: RuntimeCtx): boolean
    getDefault(block: Block): v13.Type_342[]
    get(block: Block, key: v13.AccountId32): Promise<(v13.Type_342[] | undefined)>
    getMany(block: Block, keys: v13.AccountId32[]): Promise<(v13.Type_342[] | undefined)[]>
    getKeys(block: Block): Promise<v13.AccountId32[]>
    getKeys(block: Block, key: v13.AccountId32): Promise<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block): AsyncIterable<v13.AccountId32[]>
    getKeysPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<v13.AccountId32[]>
    getPairs(block: Block): Promise<[k: v13.AccountId32, v: (v13.Type_342[] | undefined)][]>
    getPairs(block: Block, key: v13.AccountId32): Promise<[k: v13.AccountId32, v: (v13.Type_342[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block): AsyncIterable<[k: v13.AccountId32, v: (v13.Type_342[] | undefined)][]>
    getPairsPaged(pageSize: number, block: Block, key: v13.AccountId32): AsyncIterable<[k: v13.AccountId32, v: (v13.Type_342[] | undefined)][]>
}
