import { globalRealm } from '../Realm/gloabalRealm';
import { DYNAMIC_REALM_NAME } from '../Schemas';

/**
 * Private helper method for removing a DynamicSchema's schema name from its DynamicRealm's list
 * Subscequently deletes the DynamicRealm if it no longer contains any schema names
 *
 * @param schema the DynamicSchema whose name will be removed from its DynamicRealm's list
 */
export function _rmRealmSchemaName(schema: DynamicSchemaProperties): void {
    // 1. Get DynamicRealm
    const realmSchema: DynamicRealmProperties = globalRealm.getRealm().objectForPrimaryKey(DYNAMIC_REALM_NAME, schema.realmPath);

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
    const realmSchema: DynamicRealmProperties = globalRealm.getRealm().objectForPrimaryKey(DYNAMIC_REALM_NAME, realmPath);

    // 2. Increment schemaVersion
    if (realmSchema) {
        realmSchema.schemaVersion++;
    }
}
