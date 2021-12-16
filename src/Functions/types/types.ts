export type InitParams = {
    realmPath?: string;
    force?: boolean;
};
export type SaveSchemaParams = {
    realmPath: string;
    schema: Realm.ObjectSchema;
    overwrite?: boolean;
    metadataType?: string;
};
export type LoadRealmParams = {
    realmPath: string;
    schemaNames: string[];
};
