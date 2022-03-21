export type LoadableSchemaRowProperties = {
    name: string;
    realmPath: string;
    schema: string;
    metadata: string;
};
export type LoadableSchemaRow = LoadableSchemaRowProperties & Realm.Object;
export type LoadableRealmRowProperties = {
    realmPath: string;
    schemaNames: string[];
    schemaVersion: number;
};
export type LoadableRealmRow = LoadableRealmRowProperties & Realm.Object;
export type OptionalLoadableRealmRowProperties = {
    realmPath?: string;
    schemaNames?: string[];
    schemaVersion?: number;
};
