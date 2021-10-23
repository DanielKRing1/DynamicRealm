type DynamicSchemaProperties = {
    name: string;
    realmPath: string;
    schema: string;
    metadata: string;
};
type DynamicRealmProperties = {
    realmPath: string;
    schemaNames: string[];
    schemaVersion: number;
};
