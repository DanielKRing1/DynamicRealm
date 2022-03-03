import { MetaRealmProperties, OptionalMetaRealmProperties } from "../Schemas/types/types";

export const DEFAULT_PATH: string = 'MetaRealm.path';
export const DEFAULT_DYNAMIC_REALM_SCHEMA: MetaRealmProperties = {
    realmPath: DEFAULT_PATH,
    schemaNames: [],
    schemaVersion: 0,
};
export const CREATE_DYNAMIC_REALM_SCHEMA = ({ realmPath, schemaNames = [], schemaVersion = 0 }: OptionalMetaRealmProperties) => {
    return {
        realmPath,
        schemaNames,
        schemaVersion,
    };
};
