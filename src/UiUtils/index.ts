import { getAllLoadableRealmRows, getLoadableRealmRow, getLoadableSchemaRow } from '../MetaRealms';
import { LoadableRealmRow, LoadableSchemaRow } from '../MetaRealms/types';

export const getLoadableRealmPaths = async (metaRealmPath: string): Promise<string[]> => {
    const allLoadableRealmRows: Realm.Results<LoadableRealmRow> = await getAllLoadableRealmRows(metaRealmPath);
    return allLoadableRealmRows.map((realm) => realm.realmPath);
}

export const getSchemaNames = async (metaRealmPath: string, loadableRealmPath: string): Promise<string[]> => {
    // 1. Get LoadableRealm
    const loadableRealmRow: LoadableRealmRow = await getLoadableRealmRow({ metaRealmPath, loadableRealmPath });

    return loadableRealmRow !== undefined ? Array.from(loadableRealmRow.schemaNames) : [];
}

export const getProperties = async (metaRealmPath: string, schemaName: string): Promise<Realm.PropertiesTypes> => {
    const loadableSchemaRow: LoadableSchemaRow = await getLoadableSchemaRow({ metaRealmPath, schemaName });

    return loadableSchemaRow !== undefined ? JSON.parse(loadableSchemaRow.schema).properties : {};
}