import { DynamicRealmProperties, OptionalDynamicRealmProperties } from "../Schemas/types/types";

export const DEFAULT_PATH: string = 'DynamicRealm.path';
export const DEFAULT_DYNAMIC_REALM_SCHEMA: DynamicRealmProperties = {
    realmPath: DEFAULT_PATH,
    schemaNames: [],
    schemaVersion: 0,
};
export const CREATE_DYNAMIC_REALM_SCHEMA = ({ realmPath, schemaNames = [], schemaVersion = 0 }: OptionalDynamicRealmProperties) => {
    return {
        realmPath,
        schemaNames,
        schemaVersion,
    };
};
