import Realm from 'realm';

// CONSTANTS

const DEFAULT_PATH: string = 'DynamicRealm.path';

// For array data
const ARRAY_METADATA_HANDLERS: DefaultMetadataHandlers = {
    add: (allMetadata: any[], newMetadata: any) => {
        allMetadata.push(newMetadata);
    },
    remove(allMetadata: any[], id: number): boolean {
        if (!Number.isInteger(id)) throw METADATA_ARRAY_INTEGER_ERROR;
        if (allMetadata.length < id) return false;

        allMetadata.splice(id, 1);
        return true;
    },
    find(allMetadata: any[], id: number): any {
        if (!Number.isInteger(id)) throw METADATA_ARRAY_INTEGER_ERROR;
        return allMetadata.length >= id ? allMetadata[id] : null;
    },
};

// For dict data
const DICT_METADATA_HANDLERS: DefaultMetadataHandlers = {
    add: (allMetadata: any[], { key, value }: KeyValuePair) => {
        allMetadata[key] = value;
    },
    remove(allMetadata: any[], id: any): boolean {
        if (!allMetadata.hasOwnProperty(id)) return false;

        delete allMetadata[id];
        return true;
    },
    find(allMetadata: any[], id: any): any {
        return allMetadata.hasOwnProperty(id) ? allMetadata[id] : null;
    },
};

// ERRORS

const INIT_ERROR = new Error('Please init DynamicRealm (with dynamicRealm.init()) before using it!');
const METADATA_ARRAY_INTEGER_ERROR = new Error('Please provide an integer value to access your metadata');

// SCHEMAS

const DYNAMIC_SCHEMA_NAME: string = 'Dynamic';
const DynamicSchema: Realm.ObjectSchema = {
    name: DYNAMIC_SCHEMA_NAME,
    primaryKey: 'name',
    properties: {
        name: 'string',
        primaryKey: 'string',
        realmName: 'string',
        schema: 'string',
        metadata: 'string',
    },
};

const DYNAMIC_REALM_NAME: string = 'Realms';
const DynamicRealm: Realm.ObjectSchema = {
    name: DYNAMIC_REALM_NAME,
    primaryKey: 'name',
    properties: {
        name: 'string',
        realmPath: 'string',
        schemaNames: 'string[]',
        schemaVersion: { type: 'int', default: 0 },
    },
};

// TYPES

type InitParams = {
    realmPath: string;
};
type SaveSchemaParams = {
    realmName: string;
    realmPath: string;
    newSchema: Realm.ObjectSchema;
};
type LoadRealmParams = {
    realmPath: string;
    schemaNames: string[];
};

type KeyValuePair = {
    key: any;
    value: any;
};

type DynamicSchemaProperties = {
    name: string;
    primaryKey: string;
    realmName: string;
    schema: string;
    metadata: string;
};
type DynamicRealmProperties = {
    name: string;
    realmPath: string;
    schemaNames: string[];
    schemaVersion: number;
};

type DefaultMetadataHandlers = {
    add: (allMetadata: any, newMetadata: any) => void;
    remove: (allMetadata: any, id: any) => boolean;
    find: (allMetadata: any, id: any) => any;
};

// GLOBALS

let realm: Realm = null;

// FUNCTIONS

async function init({ realmPath: path = DEFAULT_PATH }: InitParams): Promise<void> {
    // 1. Open a realm containing only the DynamicSchema
    realm = await Realm.open({ schema: [DynamicRealm, DynamicSchema], path });
}

function saveSchema({ realmName, realmPath, newSchema }: SaveSchemaParams): void {
    if (realm === null) throw INIT_ERROR;

    // 1. Create DynamicSchema object to save
    const schemaObj: DynamicSchemaProperties = {
        // 1.1. Record the 'name' property for simple querying
        name: newSchema.name,
        primaryKey: newSchema.primaryKey,
        realmName,
        // 1.2. Stringify the schema object
        schema: JSON.stringify(newSchema),
        // 1.3. Init the metadata as empty
        metadata: '',
    };

    realm.write(() => {
        // 2. Check if schema already exists
        const existingSchema: DynamicSchemaProperties = realm.objectForPrimaryKey(DYNAMIC_SCHEMA_NAME, newSchema.name);

        // 3. If exists, increment DynamicRealm
        if (existingSchema) _incrementRealmSchemaVersion(realmName);

        // 4. Add the new schema to the DynamicSchema table
        realm.create(DYNAMIC_SCHEMA_NAME, schemaObj);

        // 5. Check if DynamicRealm exists
        let realmSchema: DynamicRealmProperties = realm.objectForPrimaryKey(DYNAMIC_REALM_NAME, realmName);
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
            realmSchema = realm.create(DYNAMIC_REALM_NAME, realmSchemaObj);
        }

        // 6. Add new DynamicSchema's name to DynamicRealm
        realmSchema.schemaNames.push(newSchema.name);
    });
}

function getSchema(schemaName: string): DynamicSchemaProperties {
    if (realm === null) throw INIT_ERROR;

    return realm.objectForPrimaryKey(DYNAMIC_SCHEMA_NAME, schemaName);
}

/**
 * Get all schemas if no schemaNames provided, else
 * Get the schemas of only the provided schemaNames
 *
 * @param schemaNames a list of schema names to query for;
 *                      will return all schemas if not provided
 * @returns
 */
function getSchemas(schemaNames: string[] = []): DynamicSchemaProperties[] {
    if (realm === null) throw INIT_ERROR;

    if (schemaNames === []) return Array.from(realm.objects(DYNAMIC_SCHEMA_NAME));

    return schemaNames.map((schemaName: string) => getSchema(schemaName));
}

function rmSchema(schemaName: string): boolean {
    if (realm === null) throw INIT_ERROR;

    let schemaExists = true;

    realm.write(() => {
        // 1. Get schema to delete
        const schema: DynamicSchemaProperties = getSchema(schemaName);

        // 2. Schema does not exist
        if (!schema) schemaExists = false;
        // 3. Schema exists
        else {
            // 3.1. Delete
            realm.delete(schema);

            // 3.2. Remove schema name from DynamicRealm
            _rmRealmSchemaName(schema);
        }
    });

    return schemaExists;
}

function rmSchemas(schemaNames: string[]): string[] {
    if (realm === null) throw INIT_ERROR;

    let removedSchemas;

    realm.write(() => {
        // 1. Get schemas to delete
        const schemas: DynamicSchemaProperties[] = getSchemas(schemaNames);

        // 2. Mark schemas that exist
        removedSchemas = schemas.map((schema: DynamicSchemaProperties) => schema.name);

        // 3. Delete schemas
        schemas.forEach((schema: DynamicSchemaProperties) => {
            // 3.1. Delete
            realm.delete(schema);
            // 3.2. Remove schema name from DynamicRealm
            _rmRealmSchemaName(schema);
        });
    });

    return removedSchemas;
}

/**
 * Private helper method for removing a DynamicSchema's schema name from its DynamicRealm's list
 * Subscequently deletes the DynamicRealm if it no longer contains any schema names
 *
 * @param schema the DynamicSchema whose name will be removed from its DynamicRealm's list
 */
function _rmRealmSchemaName(schema: DynamicSchemaProperties): void {
    // 1. Get DynamicRealm
    const realmSchema: DynamicRealmProperties = realm.objectForPrimaryKey(DYNAMIC_REALM_NAME, schema.realmName);

    // 2. Remove schema name from DynamicRealm
    if (realmSchema) {
        const index = realmSchema.schemaNames.indexOf(schema.name);
        realmSchema.schemaNames.splice(index, 1);

        // 3. Delete DynamicRealm if no longer contains any schema names
        if (realmSchema.schemaNames.length == 0) realm.delete(realmSchema);
    }
}

function _incrementRealmSchemaVersion(realmName: string) {
    // 1. Get DynamicRealm
    const realmSchema: DynamicRealmProperties = realm.objectForPrimaryKey(DYNAMIC_REALM_NAME, realmName);

    // 2. Increment schemaVersion
    if (realmSchema) {
        realmSchema.schemaVersion++;
    }
}

async function loadRealm(realmName: string): Promise<Realm> {
    if (realm === null) throw INIT_ERROR;

    // 1. Get DynamicRealm
    const realmSchema: DynamicRealmProperties = realm.objectForPrimaryKey(DYNAMIC_REALM_NAME, realmName);

    // 2. Get DynamicSchemas
    const entries: DynamicSchemaProperties[] = getSchemas(realmSchema.schemaNames);

    // 3. Map to Realm.ObjectSchemas
    const schema: Realm.ObjectSchema[] = entries.map((entry: DynamicSchemaProperties) => ({
        name: entry.name,
        primaryKey: entry.primaryKey,
        properties: JSON.parse(entry.schema),
    }));

    // 4. Open Realm
    return Realm.open({ schema, path: realmSchema.realmPath, schemaVersion: realmSchema.schemaVersion });
}

/**
 * Loads a realm with all schemas if no schemaNames provided, else
 * Loads a realm with only the schemas of the provided schemaNames
 *
 * @param schemaNames a list of schema names to load into the realm;
 *                      will load all schemas if not provided
 * @returns
 */
async function loadRealmFromSchemas({ realmPath: path, schemaNames = [] }: LoadRealmParams): Promise<Realm> {
    if (realm === null) throw INIT_ERROR;

    // 1. Get DynamicSchemas
    const entries: DynamicSchemaProperties[] = getSchemas(schemaNames);

    // 2. Map to Realm.ObjectSchemas
    const schema: Realm.ObjectSchema[] = entries.map((entry: DynamicSchemaProperties) => ({
        name: entry.name,
        primaryKey: entry.primaryKey,
        properties: JSON.parse(entry.schema),
    }));

    // 3. Open Realm
    return Realm.open({ schema, path });
}

function updateMetadata<R>(schemaName: string, updateHandler: (allMetaData: any) => R): R {
    if (realm === null) throw INIT_ERROR;

    const schema: DynamicSchemaProperties = getSchema(schemaName);

    let result: R;
    realm.write(() => {
        result = updateHandler(schema.metadata);
    });

    return result;
}

export default {
    init,
    saveSchema,

    getSchema,
    getSchemas,

    rmSchema,
    rmSchemas,

    loadRealm,
    loadRealmFromSchemas,

    updateMetadata,

    ARRAY_METADATA_HANDLERS,
    DICT_METADATA_HANDLERS,
};
