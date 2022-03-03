import { CREATE_DYNAMIC_REALM_SCHEMA } from '../Realm/constants';
import { globalRealm } from '../Realm/globalRealm';
import { DYNAMIC_REALM_NAME } from '../Schemas';
import { DynamicRealmProperties, DynamicSchemaProperties } from '../Schemas/types/types';

/**
 * Opens a write transaction
 *
 * @param realmPath
 * @returns
 */
export function getDynamicRealm_wr(realmPath: string): DynamicRealmProperties {
    let dynamicRealm: DynamicRealmProperties;

    globalRealm.getRealm().write(() => {
        dynamicRealm = getDynamicRealm(realmPath);
    });

    return dynamicRealm;
}

export function getDynamicRealm(realmPath: string): DynamicRealmProperties {
    // 1. Check if DynamicRealm exists
    let dynamicRealm: DynamicRealmProperties = globalRealm.getRealm().objectForPrimaryKey(DYNAMIC_REALM_NAME, realmPath);

    // 2. Create DynamicRealm object if not exists
    if (!dynamicRealm) {
        // 2.1. Create object
        const dynamicRealmSchemaObj: DynamicRealmProperties = CREATE_DYNAMIC_REALM_SCHEMA({ realmPath });

        // 5.1.2. Save
        dynamicRealm = globalRealm.getRealm().create(DYNAMIC_REALM_NAME, dynamicRealmSchemaObj);
    }

    return dynamicRealm;
}

/**
 * Private helper method for removing a DynamicSchema's schema name from its DynamicRealm's list
 * Subscequently deletes the DynamicRealm if it no longer contains any schema names
 *
 * @param schema the DynamicSchema whose name will be removed from its DynamicRealm's list
 */
export function _rmRealmSchemaName(schema: DynamicSchemaProperties): void {
    // 1. Get DynamicRealm
    const realmSchema: DynamicRealmProperties = getDynamicRealm(schema.realmPath);

    // 2. Remove schema name from DynamicRealm
    if (realmSchema) {
        const index = realmSchema.schemaNames.indexOf(schema.name);
        realmSchema.schemaNames.splice(index, 1);

        // 3. Delete DynamicRealm if no longer contains any schema names
        if (realmSchema.schemaNames.length == 0) globalRealm.getRealm().delete(realmSchema);
    }
}

export function _incrementRealmSchemaVersion(realmPath: string) {
    // 1. Get DynamicRealm
    const realmSchema: DynamicRealmProperties = getDynamicRealm(realmPath);

    // 2. Increment schemaVersion
    if (realmSchema) {
        realmSchema.schemaVersion++;
    }
}
