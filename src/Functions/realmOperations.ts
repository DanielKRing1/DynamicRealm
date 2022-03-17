import Realm from 'realm';

import { DEFAULT_META_REALM_PATH } from '../Realm/constants';
import { metaRealmManager } from '../Realm/metaRealmsManager';
import { LoadableRealmRowProperties } from '../Schemas/types/types';
import { getLoadableRealmRow_wr } from './metaRealmOperations';
import { getSchemas } from './metaSchemaOperations';
import { InitParams, LoadRealmParams } from './types/types';

export function isInitialized(metaRealmPath: string) {
    return metaRealmManager.hasMetaRealm(metaRealmPath);
}

/**
 * Open meta Realm that tracks existing Realm schemas
 * 
 * @param param0 
 * @returns 
 */
export async function openMetaRealm({ metaRealmPath = DEFAULT_META_REALM_PATH, force = false }: InitParams = {}): Promise<Realm> {
    // 1. Does not have an open meta Realm, and May or may not have a Realm -- but try to remove it
    if(metaRealmManager.hasOpenMetaRealm(metaRealmPath) && !force) return metaRealmManager.getMetaRealm(metaRealmPath);

    if(metaRealmManager.hasOpenMetaRealm(metaRealmPath) && force) metaRealmManager.rmMetaRealm(metaRealmPath);

    // 2. Open a new meta Realm
    await metaRealmManager.addMetaRealm(metaRealmPath);
    
    // 3. Get the open meta Realm, or open a new one
    const metaRealm: Realm = metaRealmManager.getMetaRealm(metaRealmPath);

    return metaRealm;
}

export async function loadRealm(metaRealmPath: string, loadableRealmPath: string): Promise<Realm> {
    // 1. Get MetaRealm row
    const loadableRealmRow: LoadableRealmRowProperties = getLoadableRealmRow_wr(metaRealmPath, loadableRealmPath);

    // 2. Get MetaSchemas
    const schema: Realm.ObjectSchema[] = getSchemas(metaRealmPath, loadableRealmRow.schemaNames);

    // 3. Open Realm
    const realm: Realm = await Realm.open({ schema, path: loadableRealmRow.realmPath, schemaVersion: loadableRealmRow.schemaVersion });

    return realm;
}

/**
 * Loads a realm with all schemas if no schemaNames provided, else
 * Loads a realm with only the schemas of the provided schemaNames
 *
 * @param schemaNames a list of schema names to load into the realm;
 *                      will load all schemas if not provided
 * @returns
 */
export async function loadRealmFromSchemas({ metaRealmPath, loadableRealmPath: path, schemaNames = [] }: LoadRealmParams): Promise<Realm> {
    // 1. Get MetaSchemas
    const schema: Realm.ObjectSchema[] = getSchemas(metaRealmPath, schemaNames);

    // 2. Open Realm
    const realm: Realm = await Realm.open({ schema, path });

    return realm;
}
