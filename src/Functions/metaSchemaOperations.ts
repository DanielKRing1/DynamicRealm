import { metaRealmManager } from '../Realm/metaRealmsManager';
import { LOADABLE_SCHEMA_TABLE_NAME } from '../Schemas';
import { LoadableSchemaRowProperties, LoadableRealmRowProperties } from '../Schemas/types/types';
import { Dict } from '../types/types';
import { getLoadableRealmRow, _incrementLoadableRealmSchemaVersion, _rmRealmSchemaName } from './metaRealmOperations';
import { SaveSchemaParams, UpdateSchemaParams } from './types/types';

export function saveSchemas(params: SaveSchemaParams[]) {
    params.forEach((param: SaveSchemaParams) => saveSchema(param));
}

export const MetadataType: Dict<string> = {
    Object: 'object',
    List: 'list',
};
export function saveSchema({ metaRealmPath, loadableRealmPath, schema, overwrite = false, metadataType = MetadataType.Object }: SaveSchemaParams): Promise<void> {
    // 1. Check if schema already exists
    const existingLoadableSchema: LoadableSchemaRowProperties = metaRealmManager.getMetaRealm(metaRealmPath).objectForPrimaryKey(LOADABLE_SCHEMA_TABLE_NAME, schema.name);
    if(existingLoadableSchema && !overwrite) return;

    // 2. Create MetaSchema object to save
    const schemaObj: LoadableSchemaRowProperties = {
        // 2.1. Record the 'name' property for simple querying
        name: schema.name,
        realmPath: loadableRealmPath,
        // 2.2. Stringify the schema object
        schema: JSON.stringify(schema),
        // 2.3. Init the metadata as empty
        metadata: metadataType === MetadataType.Object ? '{}' : '[]',
    };

    metaRealmManager.getMetaRealm(metaRealmPath).write(() => {
        // 3. If exists, remove this schema and increment MetaRealm schema verison
        if (!!existingLoadableSchema) {
            // 3.1. Remove schema row from MetaSchema table + Remove schemaName from MetaRealm.metaRealmPath row
            rmSchema(metaRealmPath, schema.name);
            // 3.2. Increment LoadableRealm schema version
            _incrementLoadableRealmSchemaVersion(metaRealmPath, loadableRealmPath);
        }

        // 4. Add the new schema to the MetaSchema table
        metaRealmManager.getMetaRealm(metaRealmPath).create(LOADABLE_SCHEMA_TABLE_NAME, schemaObj);

        // 5. Get or create the MetaRealm
        const metaRealmRow: LoadableRealmRowProperties = getLoadableRealmRow(metaRealmPath, loadableRealmPath);

        // 6. Add new MetaSchema's name to MetaRealm
        metaRealmRow.schemaNames.push(schema.name);
    });
}

export async function updateLoadableSchema({ metaRealmPath, loadableRealmPath, schema }: UpdateSchemaParams): Promise<void> {
    await saveSchema({ metaRealmPath, loadableRealmPath, schema, overwrite: true });
}

export function getLoadableSchemaRow(metaRealmPath: string, schemaName: string): LoadableSchemaRowProperties {
    return metaRealmManager.getMetaRealm(metaRealmPath).objectForPrimaryKey(LOADABLE_SCHEMA_TABLE_NAME, schemaName);
}

export function getLoadableSchemaRows(metaRealmPath: string, schemaNames: string[]): LoadableSchemaRowProperties[] {
    // console.log('here7');
    if (!schemaNames) {
        return Array.from(metaRealmManager.getMetaRealm(metaRealmPath).objects(LOADABLE_SCHEMA_TABLE_NAME));
    }

    return schemaNames.map((schemaName: string) => getLoadableSchemaRow(metaRealmPath, schemaName)).filter((metaSchemaRow: LoadableSchemaRowProperties) => !!metaSchemaRow);
}

export function getSchema(metaRealmPath: string, schemaName: string): Realm.ObjectSchema {
    const loadableSchemaRow: LoadableSchemaRowProperties = getLoadableSchemaRow(metaRealmPath, schemaName);
    if (!!loadableSchemaRow) return JSON.parse(loadableSchemaRow.schema);
}

/**
 * Get all schemas if no schemaNames provided, else
 * Get the schemas of only the provided schemaNames
 *
 * @param schemaNames a list of schema names to query for;
 *                      will return all schemas if not provided
 * @returns
 */
export function getSchemas(metaRealmPath: string, schemaNames: string[] = undefined): Realm.ObjectSchema[] {
    return getLoadableSchemaRows(metaRealmPath, schemaNames).map((loadableSchemaRow: LoadableSchemaRowProperties) => JSON.parse(loadableSchemaRow.schema));
}

export function rmSchema(metaRealmPath: string, schemaName: string): boolean {
    let schemaExists = false;

    // 1. Get schema to delete
    const loadableSchemaRow: LoadableSchemaRowProperties = getLoadableSchemaRow(metaRealmPath, schemaName);

    metaRealmManager.getMetaRealm(metaRealmPath).write(() => {
        // 2. Schema exists
        if (!!loadableSchemaRow) {
            // 2.1. Mark as exists
            schemaExists = true;

            // 2.2. Delete from MetaSchema
            metaRealmManager.getMetaRealm(metaRealmPath).delete(loadableSchemaRow);

            // 2.3. Remove schema name from MetaRealm
            _rmRealmSchemaName(metaRealmPath, loadableSchemaRow);
        }
    });

    return schemaExists;
}

export function rmSchemas(metaRealmPath: string, schemaNames: string[]): string[] {
    let removedSchemas;

    // 1. Get schemas to delete
    const loadableSchemaRows: LoadableSchemaRowProperties[] = getLoadableSchemaRows(metaRealmPath, schemaNames);

    // 2. Mark schemas that exist
    removedSchemas = loadableSchemaRows.map((loadableSchemaRow: LoadableSchemaRowProperties) => loadableSchemaRow.name);

    metaRealmManager.getMetaRealm(metaRealmPath).write(() => {
        // 3. Delete schemas
        loadableSchemaRows.forEach((loadableSchemaRow: LoadableSchemaRowProperties) => {
            // 3.1. Delete
            metaRealmManager.getMetaRealm(metaRealmPath).delete(loadableSchemaRow);
            // 3.2. Remove schema name from MetaRealm
            _rmRealmSchemaName(metaRealmPath, loadableSchemaRow);
        });
    });

    return removedSchemas;
}
