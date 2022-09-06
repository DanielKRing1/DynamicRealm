import { getAllLoadableRealmRows, getLoadableRealmRow, getLoadableSchemaRow } from '../MetaRealms';
import { LoadableRealmRow, LoadableSchemaRow } from '../MetaRealms/types';

export const getLoadableRealmPaths = (metaRealmPath: string): string[] => {
    const allLoadableRealmRows: Realm.Results<LoadableRealmRow> = getAllLoadableRealmRows(metaRealmPath);
    return allLoadableRealmRows.map((realm) => realm.realmPath);
}

export const getSchemaNames = (metaRealmPath: string, loadableRealmPath: string): string[] => {
    // 1. Get LoadableRealm
    const loadableRealmRow: LoadableRealmRow = getLoadableRealmRow({ metaRealmPath, loadableRealmPath });

    return loadableRealmRow !== undefined ? Array.from(loadableRealmRow.schemaNames) : [];
}

export const getProperties = (metaRealmPath: string, schemaName: string): Realm.PropertiesTypes => {
    const loadableSchemaRow: LoadableSchemaRow = getLoadableSchemaRow({ metaRealmPath, schemaName });

    return loadableSchemaRow !== undefined ? JSON.parse(loadableSchemaRow.schema).properties : {};
}