export const DYNAMIC_SCHEMA_NAME: string = 'DynamicSchemas';
export const DynamicSchema: Realm.ObjectSchema = {
    name: DYNAMIC_SCHEMA_NAME,
    primaryKey: 'name',
    properties: {
        name: 'string',
        schema: 'string',
        metadata: 'string',
    },
};

export const DYNAMIC_REALM_NAME: string = 'DynamicRealms';
export const DynamicRealm: Realm.ObjectSchema = {
    name: DYNAMIC_REALM_NAME,
    primaryKey: 'realmPath',
    properties: {
        realmPath: 'string',
        schemaNames: 'string[]',
        schemaVersion: { type: 'int', default: 0 },
    },
};
