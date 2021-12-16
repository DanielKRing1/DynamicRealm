export type DynamicSchemaProperties = {
    name: string;
    realmPath: string;
    schema: string;
    metadata: string;
};
export type DynamicRealmProperties = {
    realmPath: string;
    schemaNames: string[];
    schemaVersion: number;
};
export type OptionalDynamicRealmProperties = {
    realmPath?: string;
    schemaNames?: string[];
    schemaVersion?: number;
};
