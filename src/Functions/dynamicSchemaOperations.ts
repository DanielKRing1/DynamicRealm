import { globalRealm } from '../Realm/gloabalRealm';
import { DYNAMIC_SCHEMA_NAME, DYNAMIC_REALM_NAME } from '../Schemas';
import { _incrementRealmSchemaVersion, _rmRealmSchemaName } from './dynamicRealmOperations';

export function saveSchema({ realmName, realmPath, schema }: SaveSchemaParams): void {
    // 1. Create DynamicSchema object to save
    const schemaObj: DynamicSchemaProperties = {
        // 1.1. Record the 'name' property for simple querying
        name: schema.name,
        primaryKey: schema.primaryKey,
        realmName,
        // 1.2. Stringify the schema object
        schema: JSON.stringify(schema),
        // 1.3. Init the metadata as empty
        metadata: '',
    };

    globalRealm.getRealm().write(() => {
        // 2. Check if schema already exists
        const existingSchema: DynamicSchemaProperties = globalRealm.getRealm().objectForPrimaryKey(DYNAMIC_SCHEMA_NAME, schema.name);

        // 3. If exists, increment DynamicRealm
        if (existingSchema) _incrementRealmSchemaVersion(realmName);

        // 4. Add the new schema to the DynamicSchema table
        globalRealm.getRealm().create(DYNAMIC_SCHEMA_NAME, schemaObj);

        // 5. Check if DynamicRealm exists
        let realmSchema: DynamicRealmProperties = globalRealm.getRealm().objectForPrimaryKey(DYNAMIC_REALM_NAME, realmName);
        // 5.1. Create DynamicRealm object if not exists
        if (!realmSchema) {
            // // 5.1.1. Create object
            const realmSchemaObj: DynamicRealmProperties = {
                name: realmName,
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

export function getSchema(schemaName: string): DynamicSchemaProperties {
    return globalRealm.getRealm().objectForPrimaryKey(DYNAMIC_SCHEMA_NAME, schemaName);
}

/**
 * Get all schemas if no schemaNames provided, else
 * Get the schemas of only the provided schemaNames
 *
 * @param schemaNames a list of schema names to query for;
 *                      will return all schemas if not provided
 * @returns
 */
export function getSchemas(schemaNames: string[] = []): DynamicSchemaProperties[] {
    if (schemaNames.length === 0) return Array.from(globalRealm.getRealm().objects(DYNAMIC_SCHEMA_NAME));

    const schemas: DynamicSchemaProperties[] = [];
    schemaNames.forEach((schemaName: string) => {
        const schema: DynamicSchemaProperties = getSchema(schemaName);
        if (schema) schemas.push(schema);
    });

    return schemas;
}

export function rmSchema(schemaName: string): boolean {
    let schemaExists = true;

    globalRealm.getRealm().write(() => {
        // 1. Get schema to delete
        const schema: DynamicSchemaProperties = getSchema(schemaName);

        // 2. Schema does not exist
        if (!schema) schemaExists = false;
        // 3. Schema exists
        else {
            // 3.1. Delete
            globalRealm.getRealm().delete(schema);

            // 3.2. Remove schema name from DynamicRealm
            _rmRealmSchemaName(schema);
        }
    });

    return schemaExists;
}

export function rmSchemas(schemaNames: string[]): string[] {
    let removedSchemas;

    globalRealm.getRealm().write(() => {
        // 1. Get schemas to delete
        const schemas: DynamicSchemaProperties[] = getSchemas(schemaNames);

        // 2. Mark schemas that exist
        removedSchemas = schemas.map((schema: DynamicSchemaProperties) => schema.name);

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
