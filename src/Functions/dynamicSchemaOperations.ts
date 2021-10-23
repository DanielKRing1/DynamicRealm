import { globalRealm } from '../Realm/gloabalRealm';
import { DYNAMIC_SCHEMA_NAME, DYNAMIC_REALM_NAME } from '../Schemas';
import { _incrementRealmSchemaVersion, _rmRealmSchemaName } from './dynamicRealmOperations';

export function saveSchemas(params: SaveSchemaParams[]) {
    params.forEach((param: SaveSchemaParams) => saveSchema(param));
}

export const MetadataType: Dict<string> = {
    Object: 'object',
    List: 'list',
};
export function saveSchema({ realmPath, schema, metadataType = MetadataType.Object }: SaveSchemaParams): void {
    // 1. Create DynamicSchema object to save
    const schemaObj: DynamicSchemaProperties = {
        // 1.1. Record the 'name' property for simple querying
        name: schema.name,
        realmPath,
        // 1.2. Stringify the schema object
        schema: JSON.stringify(schema),
        // 1.3. Init the metadata as empty
        metadata: metadataType === MetadataType.Object ? '{}' : '[]',
    };

    globalRealm.getRealm().write(() => {
        // 2. Check if schema already exists
        const existingSchema: DynamicSchemaProperties = globalRealm.getRealm().objectForPrimaryKey(DYNAMIC_SCHEMA_NAME, schema.name);

        // 3. If exists, remove Schema and increment DynamicRealm
        if (existingSchema) {
            rmSchema(schema.name);
            _incrementRealmSchemaVersion(realmPath);
        }

        // 4. Add the new schema to the DynamicSchema table
        globalRealm.getRealm().create(DYNAMIC_SCHEMA_NAME, schemaObj);

        // 5. Check if DynamicRealm exists
        let realmSchema: DynamicRealmProperties = globalRealm.getRealm().objectForPrimaryKey(DYNAMIC_REALM_NAME, realmPath);
        // 5.1. Create DynamicRealm object if not exists
        if (!realmSchema) {
            // // 5.1.1. Create object
            const realmSchemaObj: DynamicRealmProperties = {
                realmPath,
                // Empty
                schemaNames: [],
                schemaVersion: 0,
            };

            // // 5.1.2. Save
            realmSchema = globalRealm.getRealm().create(DYNAMIC_REALM_NAME, realmSchemaObj);
        }

        // 6. Add new DynamicSchema's name to DynamicRealm
        realmSchema.schemaNames.push(schema.name);
    });
}

export function _getDynamicSchema(schemaName: string): DynamicSchemaProperties {
    return globalRealm.getRealm().objectForPrimaryKey(DYNAMIC_SCHEMA_NAME, schemaName);
}

export function _getDynamicSchemas(schemaNames: string[] = []): DynamicSchemaProperties[] {
    if (schemaNames.length === 0) return Array.from(globalRealm.getRealm().objects(DYNAMIC_SCHEMA_NAME));

    return schemaNames.map((schemaName: string) => _getDynamicSchema(schemaName)).filter((dynamicSchema: DynamicSchemaProperties) => !!dynamicSchema);
}

export function getSchema(schemaName: string): Realm.ObjectSchema {
    const dynamicSchema: DynamicSchemaProperties = _getDynamicSchema(schemaName);
    if (dynamicSchema) return JSON.parse(dynamicSchema.schema);
}

/**
 * Get all schemas if no schemaNames provided, else
 * Get the schemas of only the provided schemaNames
 *
 * @param schemaNames a list of schema names to query for;
 *                      will return all schemas if not provided
 * @returns
 */
export function getSchemas(schemaNames: string[] = []): Realm.ObjectSchema[] {
    return _getDynamicSchemas(schemaNames).map((dynamicSchema: DynamicSchemaProperties) => JSON.parse(dynamicSchema.schema));
}

export function rmSchema(schemaName: string): boolean {
    let schemaExists = false;

    // 1. Get schema to delete
    const schema: DynamicSchemaProperties = _getDynamicSchema(schemaName);

    globalRealm.getRealm().write(() => {
        // 2. Schema exists
        if (schema) {
            // 2.1. Mark as exists
            schemaExists = true;

            // 2.2. Delete from DynamicSchema
            globalRealm.getRealm().delete(schema);

            // 2.3. Remove schema name from DynamicRealm
            _rmRealmSchemaName(schema);
        }
    });

    return schemaExists;
}

export function rmSchemas(schemaNames: string[]): string[] {
    let removedSchemas;

    // 1. Get schemas to delete
    const schemas: DynamicSchemaProperties[] = _getDynamicSchemas(schemaNames);

    // 2. Mark schemas that exist
    removedSchemas = schemas.map((schema: DynamicSchemaProperties) => schema.name);

    globalRealm.getRealm().write(() => {
        // 3. Delete schemas
        schemas.forEach((schema: DynamicSchemaProperties) => {
            // 3.1. Delete
            globalRealm.getRealm().delete(schema);
            // 3.2. Remove schema name from DynamicRealm
            _rmRealmSchemaName(schema);
        });
    });

    return removedSchemas;
}
