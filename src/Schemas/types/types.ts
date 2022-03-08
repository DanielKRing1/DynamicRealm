export type LoadableSchemaRowProperties = {
    name: string;
    realmPath: string;
    schema: string;
    metadata: string;
};
export type LoadableRealmRowProperties = {
    realmPath: string;
    schemaNames: string[];
    schemaVersion: number;
};
export type OptionalLoadableRealmRowProperties = {
    realmPath?: string;
    schemaNames?: string[];
    schemaVersion?: number;
};
