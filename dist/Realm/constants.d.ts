export declare const DEFAULT_PATH: string;
export declare const DEFAULT_DYNAMIC_REALM_SCHEMA: DynamicRealmProperties;
export declare const CREATE_DYNAMIC_REALM_SCHEMA: ({ realmPath, schemaNames, schemaVersion }: OptionalDynamicRealmProperties) => {
    realmPath: string;
    schemaNames: string[];
    schemaVersion: number;
};
