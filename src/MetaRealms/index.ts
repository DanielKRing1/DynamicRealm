import { Results } from 'realm';
import { CREATE_LOADABLE_REALM_SCHEMA, LoadableRealm, LOADABLE_REALM_TABLE_NAME, LOADABLE_SCHEMA_TABLE_NAME } from '../StaticSchemas';
import MetaRealmManager from './metaRealmManager';
import { LoadableRealmParams, LoadableRealmRow, LoadableRealmRowProperties, LoadableSchemaParams, LoadableSchemaRow, LoadableSchemaRowProperties, RmSchemaParams, SaveSchemaParams, UpdateSchemaParams } from './types';

/**
 * Create new LoadableSchema row and
 * Add schemaName to LoadableRealm row's list of schemaNames if not already included
 * 
 * @param param0 
 */
export const saveSchema = ({ metaRealmPath, loadableRealmPath, schema }: SaveSchemaParams): void => {
    // 1. Get MetaRealm
    const metaRealm: Realm = MetaRealmManager.getMetaRealm(metaRealmPath);

    // 2. Create MetaSchema object to save
    const schemaObj: LoadableSchemaRowProperties = {
        // 2.1. Record the 'name' property for simple querying
        name: schema.name,
        // 2.2. Stringify the schema object
        schema: JSON.stringify(schema),
        // 2.3. Init the metadata as empty
        metadata: '{}',
    };

    // 4. Add the new schema to the MetaSchema table
    _write(metaRealm, () => {
        metaRealm.create(LOADABLE_SCHEMA_TABLE_NAME, schemaObj);
    })

    // 5. Get or create the MetaRealm
    const loadableRealmRow: LoadableRealmRow = getLoadableRealmRow({ metaRealmPath, loadableRealmPath });

    // 6. Add new MetaSchema's name to MetaRealm
    // Do not re-push schema name into LoadableRealm row's list of schemaNames
    _write(metaRealm, () => {
        // @ts-ignore
        // Realm stores values as Set but returns them as list
        if(loadableRealmRow !== undefined && !loadableRealmRow.schemaNames.has(schema.name)) loadableRealmRow.schemaNames.add(schema.name);
    })
}

export const updateSchema = ({ metaRealmPath, loadableRealmPath, schema }: UpdateSchemaParams): boolean => {
    // 1. Get LoadableRealmRow
    const loadableSchemaRow: LoadableSchemaRowProperties = getLoadableSchemaRow({ metaRealmPath, schemaName: schema.name });
    // 2. Get LoadableRealmRow
    const loadableRealmRow: LoadableRealmRowProperties = getLoadableRealmRow({ metaRealmPath, loadableRealmPath });

    const metaRealm: Realm = MetaRealmManager.getMetaRealm(metaRealmPath);

    _write(metaRealm, () => {
        // 3. Update schema
        if(loadableSchemaRow !== undefined) loadableSchemaRow.schema = JSON.stringify(schema);

        // 4. Increment schemaVersion
        if(loadableRealmRow !== undefined) loadableRealmRow.schemaVersion += 1;
    });
    
    return loadableSchemaRow !== undefined && loadableRealmRow !== undefined;
}

/**
 * Delete LoadableSchema row and
 * Remove schema names from LoadableREalm row's list of schemaNames
 * 
 * @param param0 
 * @returns 
 */
export const rmSchema = ({ metaRealmPath, loadableRealmPath, schemaName }: RmSchemaParams): boolean => {
    // 1. Get LoadableRealmRow
    const loadableSchemaRow: LoadableSchemaRowProperties = getLoadableSchemaRow({ metaRealmPath, schemaName });
    // 2. Get LoadableRealmRow
    const loadableRealmRow: LoadableRealmRowProperties = getLoadableRealmRow({ metaRealmPath, loadableRealmPath });

    const metaRealm: Realm = MetaRealmManager.getMetaRealm(metaRealmPath);

    _write(metaRealm, () => {
        // 3. Delete LoadableSchema row
        if(loadableSchemaRow !== undefined) metaRealm.delete(loadableSchemaRow);

        if(loadableRealmRow !== undefined) {
            // @ts-ignore
            // Realm stores values as Set but returns them as list
            // 4. Remove LoadableSchema name from LoadableRealm row's schemaNames
            loadableRealmRow.schemaNames.delete(schemaName);

            // 5. Increment schemaVersion
            loadableRealmRow.schemaVersion += 1;
        }
    });

    return loadableSchemaRow !== undefined && loadableSchemaRow !== undefined;
}

export const getAllLoadableSchemaRows = (metaRealmPath: string): Realm.Results<LoadableSchemaRow> => {
    // 1. Get MetaRealm
    const metaRealm: Realm = MetaRealmManager.getMetaRealm(metaRealmPath);
    
    // 2. Get LoadableSchema rows
    const loadableSchemaRows: Results<LoadableSchemaRow> = metaRealm.objects(LOADABLE_SCHEMA_TABLE_NAME);

    return loadableSchemaRows;
}

/**
 * Get LoadableSchema row

* LoadableSchema Table
 * 0..* row of < PK: schemaName, schema data... >
 * 
 * @param param0 
 * @returns 
 */
export const getLoadableSchemaRow = ({ metaRealmPath, schemaName }: LoadableSchemaParams): LoadableSchemaRow | undefined => {
    // 1. Get MetaRealm
    const metaRealm: Realm = MetaRealmManager.getMetaRealm(metaRealmPath);
    
    // 2. Get LoadableSchema row
    const loadableSchemaRow: LoadableSchemaRow | undefined = metaRealm.objectForPrimaryKey(LOADABLE_SCHEMA_TABLE_NAME, schemaName);

    return loadableSchemaRow;
}

export const getAllLoadableRealmRows = (metaRealmPath: string): Realm.Results<LoadableRealmRow> => {
    // 1. Get MetaRealm
    const metaRealm: Realm = MetaRealmManager.getMetaRealm(metaRealmPath);

    // 2. Get LoadableRealm rows
    const loadableRealmRows: Results<LoadableRealmRow> = metaRealm.objects<LoadableRealmRow>(LOADABLE_REALM_TABLE_NAME);

    return loadableRealmRows;
}


/**
 * This method will create the default LoadableRealm row when executed
 * 
 * Get LoadableRealm row and create it with loadableRealmPath PK if not exists
 * 
 * LoadableRealm Table
 * 0..* rows of < PK: loadableRealmPath, schemasToLoad: [schemaNames], schemaVersion: number >
 * 
 * @param param0 
 * @returns 
 */
export const getLoadableRealmRow = ({ metaRealmPath, loadableRealmPath }: LoadableRealmParams): LoadableRealmRow => {
    // 1. Get MetaRealm
    const metaRealm: Realm = MetaRealmManager.getMetaRealm(metaRealmPath);
    
    // 2. Get LoadableRealm row
    let loadableRealmRow: LoadableRealmRow | undefined = metaRealm.objectForPrimaryKey(LOADABLE_REALM_TABLE_NAME, loadableRealmPath);

    // 3. Create LoadableRealm row if not exists
    if (!loadableRealmRow) {
        // 3.1. Create object
        const loadableRealmSchemaObj: LoadableRealmRowProperties = CREATE_LOADABLE_REALM_SCHEMA({ realmPath: loadableRealmPath });

        // 3.2. Save
        _write(metaRealm, () => {
            loadableRealmRow = metaRealm.create(LOADABLE_REALM_TABLE_NAME, loadableRealmSchemaObj);
        });
    }

    return loadableRealmRow as LoadableRealmRow;
}

export const _write = (metaRealm: Realm, writeCb: () => void) => {
    try {
        metaRealm.write(writeCb);
    }
    catch(err) {
        console.log(err)
        // Error thrown to prevent writing duplicate; Do nothing
    }
}
