import { metaRealmManager } from '../Realm/metaRealmsManager';
import { META_REALM_NAME } from '../Schemas';
import { LoadableRealmRowProperties } from '../Schemas/types/types';
import { getLoadableRealmRow_wr } from './metaRealmOperations';
import { getSchema, getSchemas } from './metaSchemaOperations';

function getRealms(metaRealmPath: string): Realm.Results<LoadableRealmRowProperties> {
    return metaRealmManager.getMetaRealm(metaRealmPath).objects<LoadableRealmRowProperties>(META_REALM_NAME);
}

export function getRealmNames(metaRealmPath: string): string[] {
    return getRealms(metaRealmPath).map((realm) => realm.realmPath);
}

export function getSchemaNames(metaRealmPath: string, loadableRealmPath: string = undefined): string[] {
    // 1. Get schema names
    let schemaNames: string[];
    if (!!loadableRealmPath) {
        // 1.1.1. Get specified LoadableRealm
        const loadableRealmRow: LoadableRealmRowProperties = getLoadableRealmRow_wr(metaRealmPath, loadableRealmPath);
        // 1.1.2. Get schema names
        schemaNames = loadableRealmRow.schemaNames;
    } else {
        // 1.2.1. Get all LoadableRealms
        const loadableRealmRows: Realm.Results<LoadableRealmRowProperties> = getRealms(metaRealmPath);

        // 1.2.2. Flatten all schema names into one list
        schemaNames = [];
        loadableRealmRows.forEach((loadableRealmRow: LoadableRealmRowProperties) => {
            if (!!loadableRealmRow.schemaNames) schemaNames.push(...loadableRealmRow.schemaNames);
        });
    }

    // 2. Get MetaSchemas
    // const schemas: Realm.ObjectSchema[] = getSchemas(metaRealmPath, schemaNames);

    // return schemas.map((schema) => schema.name);

    return schemaNames;
}

export function getProperties(metaRealmPath: string, schemaName: string): Realm.PropertiesTypes {
    const schema: Realm.ObjectSchema = getSchema(metaRealmPath, schemaName);

    return schema.properties;
}
