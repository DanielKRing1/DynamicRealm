type DynamicSchemaProperties = {
    name: string;
    primaryKey: string;
    realmName: string;
    schema: string;
    metadata: string;
};
type DynamicRealmProperties = {
    name: string;
    realmPath: string;
    schemaNames: string[];
    schemaVersion: number;
};
