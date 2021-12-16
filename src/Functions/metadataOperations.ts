import { globalRealm } from '../Realm/gloabalRealm';
import { DynamicSchemaProperties } from '../Schemas/types/types';
import { getSchema, _getDynamicSchema } from './dynamicSchemaOperations';

export function getMetadata<R>(schemaName: string): R {
    // 1. Get schema
    const schema: DynamicSchemaProperties = _getDynamicSchema(schemaName);

    // 2. Convert metadat string to obj
    const metadataObj: any = JSON.parse(schema.metadata);

    return metadataObj;
}

export function updateMetadata<R>(schemaName: string, updateHandler: (allMetaData: any) => R): R {
    // 1. Get schema
    const schema: DynamicSchemaProperties = _getDynamicSchema(schemaName);

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
