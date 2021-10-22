import { globalRealm } from '../Realm/gloabalRealm';
import { getSchema } from './dynamicSchemaOperations';

export function getMetadata<R>(schemaName: string): R {
    // 1. Get schema
    const schema: DynamicSchemaProperties = getSchema(schemaName);

    // 2. Convert metadat string to obj
    const metadataObj: any = JSON.parse(schema.metadata);

    return metadataObj;
}

export function updateMetadata<R>(schemaName: string, updateHandler: (allMetaData: any) => R): R {
    // 1. Get schema
    const schema: DynamicSchemaProperties = getSchema(schemaName);

    let result: R;
    globalRealm.getRealm().write(() => {
        // 2. Convert metadat string to obj
        const metadataObj: any = JSON.parse(schema.metadata);

        // 3. Execute updateHandler on the obj
        result = updateHandler(metadataObj);

        // 4. Write full metadata object back into realm
        schema.metadata = JSON.stringify(result);
    });

    return result;
}
