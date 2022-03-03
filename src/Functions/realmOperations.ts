import Realm from 'realm';

import { DEFAULT_PATH } from '../Realm/constants';
import { globalRealm } from '../Realm/globalRealm';
import { MetaRealmProperties } from '../Schemas/types/types';
import { getMetaRealm_wr } from './metaRealmOperations';
import { getSchemas } from './metaSchemaOperations';
import { InitParams, LoadRealmParams } from './types/types';

let _isInitialized: boolean = false;

export function isInitialized() {
    return _isInitialized;
}

/**
 * Open meta Realm that tracks existing Realm schemas
 * 
 * @param param0 
 * @returns 
 */
export async function init({ realmPath = DEFAULT_PATH, force = false }: InitParams = {}): Promise<void> {
    // Do not re-initialize
    if(_isInitialized && !force) return;

    // 1. Open a realm containing only the MetaSchema and
    // Store realm in global wrapper
    await globalRealm.openRealm(realmPath);

    // 2. Set initialized
    _isInitialized = true;
}

export async function loadRealm(realmPath: string): Promise<Realm> {
    // 1. Get MetaRealm
    const metaRealm: MetaRealmProperties = getMetaRealm_wr(realmPath);

    // 2. Get MetaSchemas
    const schema: Realm.ObjectSchema[] = getSchemas(metaRealm.schemaNames);

    // 3. Open Realm
    return Realm.open({ schema, path: metaRealm.realmPath, schemaVersion: metaRealm.schemaVersion });
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
    // 1. Get MetaSchemas
    const schema: Realm.ObjectSchema[] = getSchemas(schemaNames);

    // 2. Open Realm
    return Realm.open({ schema, path });
}
