export const META_SCHEMA_NAME: string = 'MetaSchemas';
export const MetaSchema: Realm.ObjectSchema = {
    name: META_SCHEMA_NAME,
    primaryKey: 'name',
    properties: {
        name: 'string',
        schema: 'string',
        metadata: 'string',
    },
};

export const META_REALM_NAME: string = 'MetaRealms';
export const MetaRealm: Realm.ObjectSchema = {
    name: META_REALM_NAME,
    primaryKey: 'realmPath',
    properties: {
        realmPath: 'string',
        schemaNames: 'string[]',
        schemaVersion: { type: 'int', default: 0 },
    },
};
