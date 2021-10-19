export const DYNAMIC_SCHEMA_NAME: string = 'Dynamic';
export const DynamicSchema: Realm.ObjectSchema = {
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

export const DYNAMIC_REALM_NAME: string = 'Realms';
export const DynamicRealm: Realm.ObjectSchema = {
    name: DYNAMIC_REALM_NAME,
    primaryKey: 'name',
    properties: {
        name: 'string',
        realmPath: 'string',
        schemaNames: 'string[]',
        schemaVersion: { type: 'int', default: 0 },
    },
};
