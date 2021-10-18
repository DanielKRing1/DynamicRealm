import Realm from 'realm';

// CONSTANTS

const DEFAULT_PATH = 'DynamicRealm.path';

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
const DYNAMIC_SCHEMA_PROPERTIES: DynamicSchemaProperties = {
    name: 'string',
    primaryKey: 'string',
    schema: 'string',
    metadata: 'string',
};
const DynamicSchema: Realm.ObjectSchema = {
    name: DYNAMIC_SCHEMA_NAME,
    primaryKey: 'name',
    properties: DYNAMIC_SCHEMA_PROPERTIES,
};

// TYPES

type InitParams = {
    path: string;
};
type LoadRealmParams = {
    path: string;
    schemaNames: string[];
};

type KeyValuePair = {
    key: any;
    value: any;
};

type DynamicSchemaProperties = {
    name: string;
    primaryKey: string;
    schema: string;
    metadata: string;
};

type DefaultMetadataHandlers = {
    add: (allMetadata: any, newMetadata: any) => void;
    remove: (allMetadata: any, id: any) => boolean;
    find: (allMetadata: any, id: any) => any;
};

// GLOBALS

let realm: Realm = null;

// FUNCTIONS

async function init({ path = DEFAULT_PATH }: InitParams): Promise<void> {
    // 1. Open a realm containing only the DynamicSchema
    realm = await Realm.open({ schema: [DynamicSchema], path });
}

function saveSchema(newSchema: Realm.ObjectSchema): void {
    if (realm === null) throw INIT_ERROR;

    // 1. Create object to save
    const schemaObj: DynamicSchemaProperties = {
        // 1.1. Record the 'name' property for simple querying
        name: newSchema.name,
        primaryKey: newSchema.primaryKey,
        // 1.2. Stringify the schema object
        schema: JSON.stringify(newSchema),
        // 1.3. Init the metadata as empty
        metadata: '',
    };

    realm.write(() => {
        // 2. Add the new schema to the DynamicSchema table
        realm.create(DYNAMIC_SCHEMA_NAME, schemaObj);
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
        else realm.delete(schema);
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
        schemas.forEach((schema: DynamicSchemaProperties) => realm.delete(schema));
    });

    return removedSchemas;
}

/**
 * Loads a realm with all schemas if no schemaNames provided, else
 * Loads a realm with only the schemas of the provided schemaNames
 *
 * @param schemaNames a list of schema names to load into the realm;
 *                      will load all schemas if not provided
 * @returns
 */
async function loadRealm({ path, schemaNames = [] }: LoadRealmParams): Promise<Realm> {
    if (realm === null) throw INIT_ERROR;

    const entries: DynamicSchemaProperties[] = getSchemas(schemaNames);

    const schema: Realm.ObjectSchema[] = entries.map((entry: DynamicSchemaProperties) => ({
        name: entry.name,
        primaryKey: entry.primaryKey,
        properties: JSON.parse(entry.schema),
    }));

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
    updateMetadata,

    ARRAY_METADATA_HANDLERS,
    DICT_METADATA_HANDLERS,
};
