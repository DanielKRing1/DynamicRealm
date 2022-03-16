import { CREATE_LOADABLE_REALM_SCHEMA } from '../Realm/constants';
import { metaRealmManager } from '../Realm/metaRealmsManager';
import { LOADABLE_REALM_TABLE_NAME } from '../Schemas';
import { LoadableRealmRowProperties, LoadableSchemaRowProperties } from '../Schemas/types/types';

/**
 * Opens a write transaction
 *
 * @param realmPath
 * @returns
 */
export function getLoadableRealmRow_wr(metaRealmPath: string, loadableRealmPath: string): LoadableRealmRowProperties {
    let loadableRealmRow: LoadableRealmRowProperties;

    metaRealmManager.getMetaRealm(metaRealmPath).write(() => {
        loadableRealmRow = getLoadableRealmRow(metaRealmPath, loadableRealmPath);
    });

    return loadableRealmRow;
}

export function getLoadableRealmRow(metaRealmPath: string, loadableRealmPath: string): LoadableRealmRowProperties {
    // 1. Check if MetaRealm exists
    let loadableRealmRow: LoadableRealmRowProperties = metaRealmManager.getMetaRealm(metaRealmPath).objectForPrimaryKey(LOADABLE_REALM_TABLE_NAME, loadableRealmPath);

    // 2. Create MetaRealm object if not exists
    if (!loadableRealmRow) {
        // 2.1. Create object
        const metaRealmSchemaObj: LoadableRealmRowProperties = CREATE_LOADABLE_REALM_SCHEMA({ realmPath: loadableRealmPath });

        // 5.1.2. Save
        loadableRealmRow = metaRealmManager.getMetaRealm(metaRealmPath).create(LOADABLE_REALM_TABLE_NAME, metaRealmSchemaObj);
    }

    return loadableRealmRow;
}

/**
 * Private helper method for removing a MetaSchema's schema name from its MetaRealm's list
 * Subscequently deletes the MetaRealm if it no longer contains any schema names
 *
 * @param schema the MetaSchema whose name will be removed from its MetaRealm's list
 */
export function _rmRealmSchemaName(metaRealmPath: string, loadableSchemaRow: LoadableSchemaRowProperties): void {
    // 1. Get MetaRealm
    const loadableRealmRow: LoadableRealmRowProperties = getLoadableRealmRow(metaRealmPath, loadableSchemaRow.realmPath);

    // 2. Remove schema name from MetaRealm
    if (!!loadableRealmRow) {
        const index = loadableRealmRow.schemaNames.indexOf(loadableSchemaRow.name);
        loadableRealmRow.schemaNames.splice(index, 1);

        // 3. Delete metaRealmRow if no longer contains any schema names
        if (loadableRealmRow.schemaNames.length == 0) metaRealmManager.getMetaRealm(loadableSchemaRow.realmPath).delete(loadableRealmRow);
    }
}

export function _incrementLoadableRealmSchemaVersion(metaRealmPath: string, loadableRealmPath: string) {
    // 1. Get MetaRealm
    const loadableRealmRow: LoadableRealmRowProperties = getLoadableRealmRow(metaRealmPath, loadableRealmPath);

    // 2. Increment schemaVersion
    if (loadableRealmRow) {
        loadableRealmRow.schemaVersion++;
    }
}
