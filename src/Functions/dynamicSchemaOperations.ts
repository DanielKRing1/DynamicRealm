import { globalRealm } from '../Realm/globalRealm';
import { DYNAMIC_SCHEMA_NAME } from '../Schemas';
import { MetaSchemaProperties, MetaRealmProperties } from '../Schemas/types/types';
import { Dict } from '../types/types';
import { getMetaRealm, _incrementRealmSchemaVersion, _rmRealmSchemaName } from './metaRealmOperations';
import { SaveSchemaParams } from './types/types';

export function saveSchemas(params: SaveSchemaParams[]) {
    params.forEach((param: SaveSchemaParams) => saveSchema(param));
}

export const MetadataType: Dict<string> = {
    Object: 'object',
    List: 'list',
};
export function saveSchema({ realmPath, schema, overwrite = false, metadataType = MetadataType.Object }: SaveSchemaParams): void {
    // 1. Check if schema already exists
    const existingSchema: MetaSchemaProperties = globalRealm.getRealm().objectForPrimaryKey(DYNAMIC_SCHEMA_NAME, schema.name);
    if(existingSchema && !overwrite) return;

    // 2. Create MetaSchema object to save
    const schemaObj: MetaSchemaProperties = {
        // 2.1. Record the 'name' property for simple querying
        name: schema.name,
        realmPath,
        // 2.2. Stringify the schema object
        schema: JSON.stringify(schema),
        // 2.3. Init the metadata as empty
        metadata: metadataType === MetadataType.Object ? '{}' : '[]',
    };

    globalRealm.getRealm().write(() => {
        // 3. If exists, remove Schema and increment MetaRealm
        if (existingSchema) {
            rmSchema(schema.name);
            _incrementRealmSchemaVersion(realmPath);
        }

        // 4. Add the new schema to the MetaSchema table
        globalRealm.getRealm().create(DYNAMIC_SCHEMA_NAME, schemaObj);

        // 5. Get or create the MetaRealm
        const metaRealm: MetaRealmProperties = getMetaRealm(realmPath);

        // 6. Add new MetaSchema's name to MetaRealm
        metaRealm.schemaNames.push(schema.name);
    });
}

export function _getMetaSchema(schemaName: string): MetaSchemaProperties {
    return globalRealm.getRealm().objectForPrimaryKey(DYNAMIC_SCHEMA_NAME, schemaName);
}

export function _getMetaSchemas(schemaNames: string[]): MetaSchemaProperties[] {
    // console.log('here7');
    if (!schemaNames) {
        return Array.from(globalRealm.getRealm().objects(DYNAMIC_SCHEMA_NAME));
    }

    return schemaNames.map((schemaName: string) => _getMetaSchema(schemaName)).filter((metaSchema: MetaSchemaProperties) => !!metaSchema);
}

export function getSchema(schemaName: string): Realm.ObjectSchema {
    const metaSchema: MetaSchemaProperties = _getMetaSchema(schemaName);
    if (metaSchema) return JSON.parse(metaSchema.schema);
}

/**
 * Get all schemas if no schemaNames provided, else
 * Get the schemas of only the provided schemaNames
 *
 * @param schemaNames a list of schema names to query for;
 *                      will return all schemas if not provided
 * @returns
 */
export function getSchemas(schemaNames: string[] = undefined): Realm.ObjectSchema[] {
    return _getMetaSchemas(schemaNames).map((metaSchema: MetaSchemaProperties) => JSON.parse(metaSchema.schema));
}

export function rmSchema(schemaName: string): boolean {
    let schemaExists = false;

    // 1. Get schema to delete
    const schema: MetaSchemaProperties = _getMetaSchema(schemaName);

    globalRealm.getRealm().write(() => {
        // 2. Schema exists
        if (schema) {
            // 2.1. Mark as exists
            schemaExists = true;

            // 2.2. Delete from MetaSchema
            globalRealm.getRealm().delete(schema);

            // 2.3. Remove schema name from MetaRealm
            _rmRealmSchemaName(schema);
        }
    });

    return schemaExists;
}

export function rmSchemas(schemaNames: string[]): string[] {
    let removedSchemas;

    // 1. Get schemas to delete
    const schemas: MetaSchemaProperties[] = _getMetaSchemas(schemaNames);

    // 2. Mark schemas that exist
    removedSchemas = schemas.map((schema: MetaSchemaProperties) => schema.name);

    globalRealm.getRealm().write(() => {
        // 3. Delete schemas
        schemas.forEach((schema: MetaSchemaProperties) => {
            // 3.1. Delete
            globalRealm.getRealm().delete(schema);
            // 3.2. Remove schema name from MetaRealm
            _rmRealmSchemaName(schema);
        });
    });

    return removedSchemas;
}
