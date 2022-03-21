import { metaRealmManager } from '../Realm/metaRealmsManager';
import { LoadableSchema, LOADABLE_SCHEMA_TABLE_NAME } from '../Schemas';
import { LoadableSchemaRowProperties, LoadableRealmRowProperties, LoadableSchemaRow } from '../Schemas/types/types';
import { Dict } from '../types/types';
import { getLoadableRealmRow, _incrementLoadableRealmSchemaVersion, _rmRealmSchemaName } from './metaRealmOperations';
import { SaveSchemaParams, UpdateSchemaParams } from './types/types';

export function saveSchemas(params: SaveSchemaParams[]): void {
    params.forEach((param: SaveSchemaParams) => saveSchema(param));
}

export const MetadataType: Dict<string> = {
    Object: 'object',
    List: 'list',
};
export function saveSchema({ metaRealmPath, loadableRealmPath, schema, overwrite = false, metadataType = MetadataType.Object }: SaveSchemaParams): void {
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

export function updateSchema({ metaRealmPath, loadableRealmPath, schema }: UpdateSchemaParams): void {
    // // 1. Get existing Loadable Schema
    // const existingLoadableSchema: LoadableSchemaRowProperties = getLoadableSchemaRow(metaRealmPath, schema.name);
    // // 2. Throw an error if it cannot be found
    // if(!existingLoadableSchema) _throwNoLoadableSchemaRowError(metaRealmPath, schema.name, 'updateSchema');

    // // 3. Get loadableRealmPath from the schema
    // const loadableRealmPath: string = existingLoadableSchema.realmPath;

    // 4. Save the new schema
    saveSchema({ metaRealmPath, loadableRealmPath, schema, overwrite: true })
}

/**
 * Bulk update loadable schemas
 * 
 * These schemas are all expected to exist in the same metaRealmPath + loadableRealmPath pair
 *      to reduce the number of Loadable Realm schema version increments
 * If they do not, then simply use the "updateSchema" method to update each loadable schema individually
 * 
 * @param metaRealmPath 
 * @param loadableRealmPath 
 * @param schemasToUpdate 
 */
export function updateSchemas(metaRealmPath: string, loadableRealmPath: string, schemasToUpdate: Realm.ObjectSchema[]): void {
    // 1. Update each loadable schema
    schemasToUpdate.forEach((schema: Realm.ObjectSchema) => updateSchema({ metaRealmPath, loadableRealmPath, schema }));

    // 2. Undo each extra schema version increments to the targetted Loadable Realm (each increment after the first one)
    //      This is intended to avoid unnecessarily largest schema version numbers
    //      and treats bulk schema updates as a a single "batch" schema version increment
    const decrementCount: number = 0 - (schemasToUpdate.length - 1);
    if(decrementCount < 0) {
        metaRealmManager.getMetaRealm(metaRealmPath).write(() => {
            _incrementLoadableRealmSchemaVersion(metaRealmPath, loadableRealmPath, decrementCount);
        });
    }
}

export function getLoadableSchemaRow(metaRealmPath: string, schemaName: string): LoadableSchemaRow {
    return metaRealmManager.getMetaRealm(metaRealmPath).objectForPrimaryKey(LOADABLE_SCHEMA_TABLE_NAME, schemaName);
}

export function getLoadableSchemaRows(metaRealmPath: string, schemaNames: string[]): LoadableSchemaRow[] {
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
    const loadableSchemaRow: LoadableSchemaRow = getLoadableSchemaRow(metaRealmPath, schemaName);

    metaRealmManager.getMetaRealm(metaRealmPath).write(() => {
        // 2. Schema exists
        if (!!loadableSchemaRow) {
            // 2.1. Mark as exists
            schemaExists = true;

            // 2.2. Delete from MetaSchema
            metaRealmManager.getMetaRealm(metaRealmPath).delete(loadableSchemaRow);

            // 2.3. Remove schema name from MetaRealm
            _rmRealmSchemaName(metaRealmPath, loadableSchemaRow);

            // 2.4. Increment LoadableRealm's schema version
            _incrementLoadableRealmSchemaVersion(metaRealmPath, loadableSchemaRow.realmPath);
        }
    });

    return schemaExists;
}

export function rmSchemas(metaRealmPath: string, schemaNames: string[]): string[] {
    // 1. Get schemas to delete
    const loadableSchemaRows: LoadableSchemaRow[] = getLoadableSchemaRows(metaRealmPath, schemaNames);

    // 2. Mark schemas that exist
    let removedSchemas = loadableSchemaRows.map((loadableSchemaRow: LoadableSchemaRowProperties) => loadableSchemaRow.name);

    metaRealmManager.getMetaRealm(metaRealmPath).write(() => {
        // 3. Delete schemas
        loadableSchemaRows.forEach((loadableSchemaRow: LoadableSchemaRow) => {
            // 3.1. Delete
            metaRealmManager.getMetaRealm(metaRealmPath).delete(loadableSchemaRow);
            // 3.2. Remove schema name from MetaRealm
            _rmRealmSchemaName(metaRealmPath, loadableSchemaRow);
        });

        // 4. Optimization to Update each Loadable Realm (loadableRealmPath) schema version only once
        const loadableRealmPathSet: Set<string> = new Set<string>();
        loadableSchemaRows.forEach((loadableSchemaRow: LoadableSchemaRow) => loadableRealmPathSet.add(loadableSchemaRow.realmPath));
        loadableRealmPathSet.forEach((loadableRealmPath: string) => _incrementLoadableRealmSchemaVersion(metaRealmPath, loadableRealmPath));
    });

    return removedSchemas;
}

function _throwNoLoadableSchemaRowError(metaRealmPath: string, schemaName: string, callingMethodName: string) {
    throw new Error(`${callingMethodName} could not get LoadableSchemaRow "${schemaName}" from MetaRealm "${metaRealmPath}`);
};
