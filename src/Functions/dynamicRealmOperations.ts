import { CREATE_DYNAMIC_REALM_SCHEMA } from '../Realm/constants';
import { globalRealm } from '../Realm/globalRealm';
import { DYNAMIC_REALM_NAME } from '../Schemas';
import { MetaRealmProperties, MetaSchemaProperties } from '../Schemas/types/types';

/**
 * Opens a write transaction
 *
 * @param realmPath
 * @returns
 */
export function getMetaRealm_wr(realmPath: string): MetaRealmProperties {
    let metaRealm: MetaRealmProperties;

    globalRealm.getRealm().write(() => {
        metaRealm = getMetaRealm(realmPath);
    });

    return metaRealm;
}

export function getMetaRealm(realmPath: string): MetaRealmProperties {
    // 1. Check if MetaRealm exists
    let metaRealm: MetaRealmProperties = globalRealm.getRealm().objectForPrimaryKey(DYNAMIC_REALM_NAME, realmPath);

    // 2. Create MetaRealm object if not exists
    if (!metaRealm) {
        // 2.1. Create object
        const metaRealmSchemaObj: MetaRealmProperties = CREATE_DYNAMIC_REALM_SCHEMA({ realmPath });

        // 5.1.2. Save
        metaRealm = globalRealm.getRealm().create(DYNAMIC_REALM_NAME, metaRealmSchemaObj);
    }

    return metaRealm;
}

/**
 * Private helper method for removing a MetaSchema's schema name from its MetaRealm's list
 * Subscequently deletes the MetaRealm if it no longer contains any schema names
 *
 * @param schema the MetaSchema whose name will be removed from its MetaRealm's list
 */
export function _rmRealmSchemaName(schema: MetaSchemaProperties): void {
    // 1. Get MetaRealm
    const realmSchema: MetaRealmProperties = getMetaRealm(schema.realmPath);

    // 2. Remove schema name from MetaRealm
    if (realmSchema) {
        const index = realmSchema.schemaNames.indexOf(schema.name);
        realmSchema.schemaNames.splice(index, 1);

        // 3. Delete MetaRealm if no longer contains any schema names
        if (realmSchema.schemaNames.length == 0) globalRealm.getRealm().delete(realmSchema);
    }
}

export function _incrementRealmSchemaVersion(realmPath: string) {
    // 1. Get MetaRealm
    const realmSchema: MetaRealmProperties = getMetaRealm(realmPath);

    // 2. Increment schemaVersion
    if (realmSchema) {
        realmSchema.schemaVersion++;
    }
}
