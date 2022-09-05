import { OptionalLoadableRealmRowProperties } from "../MetaRealms/types";

/**
 * SCHEMAS THAT ARE SAVED AND THAT CAN BE LOADED
 */
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

/**
 * GROUPINGS FOR LOADABLE SCHEMAS:
 * WHAT SET OF SCHEMAS WILL BE LOADED INTO A REALM
 */
export const LOADABLE_REALM_TABLE_NAME: string = 'LOADABLE_REALMS';
export const LoadableRealm: Realm.ObjectSchema = {
    name: LOADABLE_REALM_TABLE_NAME,
    primaryKey: 'realmPath',
    properties: {
        realmPath: 'string',
        schemaNames: { type: 'string<>', default: [] },
        schemaVersion: { type: 'int', default: 0 },
    },
};

// @ts-ignore
// Realm expects an array to initialize the set
export const CREATE_LOADABLE_REALM_SCHEMA = ({ realmPath, schemaNames = [], schemaVersion = 0 }: OptionalLoadableRealmRowProperties) => {
    return {
        realmPath,
        schemaNames,
        schemaVersion,
    };
};
