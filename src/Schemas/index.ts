export const DYNAMIC_SCHEMA_NAME: string = 'MetaSchemas';
export const MetaSchema: Realm.ObjectSchema = {
    name: DYNAMIC_SCHEMA_NAME,
    primaryKey: 'name',
    properties: {
        name: 'string',
        schema: 'string',
        metadata: 'string',
    },
};

export const DYNAMIC_REALM_NAME: string = 'MetaRealms';
export const MetaRealm: Realm.ObjectSchema = {
    name: DYNAMIC_REALM_NAME,
    primaryKey: 'realmPath',
    properties: {
        realmPath: 'string',
        schemaNames: 'string[]',
        schemaVersion: { type: 'int', default: 0 },
    },
};
