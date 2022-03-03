export type MetaSchemaProperties = {
    name: string;
    realmPath: string;
    schema: string;
    metadata: string;
};
export type MetaRealmProperties = {
    realmPath: string;
    schemaNames: string[];
    schemaVersion: number;
};
export type OptionalMetaRealmProperties = {
    realmPath?: string;
    schemaNames?: string[];
    schemaVersion?: number;
};
