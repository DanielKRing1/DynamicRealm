import { LoadableRealmRowProperties, OptionalLoadableRealmRowProperties } from "../Schemas/types/types";

export const DEFAULT_META_REALM_PATH: string = 'DynamicRealm.path';
export const DEFAULT_META_REALM_SCHEMA: LoadableRealmRowProperties = {
    realmPath: DEFAULT_META_REALM_PATH,
    schemaNames: [],
    schemaVersion: 0,
};
export const CREATE_META_REALM_SCHEMA = ({ realmPath, schemaNames = [], schemaVersion = 0 }: OptionalLoadableRealmRowProperties) => {
    return {
        realmPath,
        schemaNames,
        schemaVersion,
    };
};
