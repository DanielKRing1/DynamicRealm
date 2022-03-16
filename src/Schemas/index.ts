export const LOADABLE_SCHEMA_TABLE_NAME: string = 'LOADABLE_SCHEMAS';
export const LoadableSchema: Realm.ObjectSchema = {
    name: LOADABLE_SCHEMA_TABLE_NAME,
    primaryKey: 'name',
    properties: {
        name: 'string',
        schema: 'string',
        metadata: 'string',
    },
};

export const LOADABLE_REALM_TABLE_NAME: string = 'LOADABLE_REALMS';
export const LoadableRealm: Realm.ObjectSchema = {
    name: LOADABLE_REALM_TABLE_NAME,
    primaryKey: 'realmPath',
    properties: {
        realmPath: 'string',
        schemaNames: 'string[]',
        schemaVersion: { type: 'int', default: 0 },
    },
};
