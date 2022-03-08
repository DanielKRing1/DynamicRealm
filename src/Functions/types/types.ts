export type InitParams = {
    metaRealmPath?: string;
    force?: boolean;
};
export type SaveSchemaParams = {
    metaRealmPath: string;
    loadableRealmPath: string;
    schema: Realm.ObjectSchema;
    overwrite?: boolean;
    metadataType?: string;
};
export type LoadRealmParams = {
    metaRealmPath: string;
    loadableRealmPath: string;
    schemaNames: string[];
};
