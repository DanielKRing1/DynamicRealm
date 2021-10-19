import { globalRealm } from '../Realm/gloabalRealm';
import { getSchema } from './dynamicSchemaOperations';

export function updateMetadata<R>(schemaName: string, updateHandler: (allMetaData: any) => R): R {
    const schema: DynamicSchemaProperties = getSchema(schemaName);

    let result: R;
    globalRealm.getRealm().write(() => {
        result = updateHandler(schema.metadata);
    });

    return result;
}
