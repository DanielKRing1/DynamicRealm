import { metaRealmManager } from '../Realm/metaRealmsManager';
import { LoadableSchemaRowProperties } from '../Schemas/types/types';
import { getLoadableSchemaRow } from './metaSchemaOperations';

export function getMetadata<R>(metaRealmPath: string, schemaName: string): R {
    // 1. Get schema
    const loadableSchemaRow: LoadableSchemaRowProperties = getLoadableSchemaRow(metaRealmPath, schemaName);

    // 2. Convert metadat string to obj
    const metadataObj: any = JSON.parse(loadableSchemaRow.metadata);

    return metadataObj;
}

export function updateMetadata<R>(metaRealmPath: string, schemaName: string, updateHandler: (allMetaData: any) => R): R {
    // 1. Get schema
    const loadableSchemaRow: LoadableSchemaRowProperties = getLoadableSchemaRow(metaRealmPath, schemaName);

    let result: R;
    metaRealmManager.getMetaRealm(metaRealmPath).write(() => {
        // 2. Convert metadat string to obj
        const metadataObj: any = JSON.parse(loadableSchemaRow.metadata);

        // 3. Execute updateHandler on the obj
        result = updateHandler(metadataObj);

        // 4. Write full metadata object back into realm
        loadableSchemaRow.metadata = JSON.stringify(result);
    });

    return result;
}
