import Realm from 'realm';

import { DEFAULT_PATH } from '../Realm/constants';
import { globalRealm } from '../Realm/gloabalRealm';
import { DynamicRealmProperties } from '../Schemas/types/types';
import { getDynamicRealm_wr } from './dynamicRealmOperations';
import { getSchemas } from './dynamicSchemaOperations';
import { InitParams, LoadRealmParams } from './types/types';

let _isInitialized: boolean = false;

export function isInitialized() {
    return _isInitialized;
}

export async function init({ realmPath = DEFAULT_PATH, force = false }: InitParams = {}): Promise<void> {
    // Do not re-initialize
    if(_isInitialized && !force) return;

    // 1. Open a realm containing only the DynamicSchema and
    // Store realm in global wrapper
    await globalRealm.openRealm(realmPath);

    // 2. Set initialized
    _isInitialized = true;
}

export async function loadRealm(realmPath: string): Promise<Realm> {
    // 1. Get DynamicRealm
    const dynamicRealm: DynamicRealmProperties = getDynamicRealm_wr(realmPath);

    // 2. Get DynamicSchemas
    const schema: Realm.ObjectSchema[] = getSchemas(dynamicRealm.schemaNames);

    // 3. Open Realm
    return Realm.open({ schema, path: dynamicRealm.realmPath, schemaVersion: dynamicRealm.schemaVersion });
}

/**
 * Loads a realm with all schemas if no schemaNames provided, else
 * Loads a realm with only the schemas of the provided schemaNames
 *
 * @param schemaNames a list of schema names to load into the realm;
 *                      will load all schemas if not provided
 * @returns
 */
export async function loadRealmFromSchemas({ realmPath: path, schemaNames = [] }: LoadRealmParams): Promise<Realm> {
    // 1. Get DynamicSchemas
    const schema: Realm.ObjectSchema[] = getSchemas(schemaNames);

    // 2. Open Realm
    return Realm.open({ schema, path });
}
