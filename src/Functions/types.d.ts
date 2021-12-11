type InitParams = {
    realmPath?: string;
    force?: boolean;
};
type SaveSchemaParams = {
    realmPath: string;
    schema: Realm.ObjectSchema;
    overwrite?: boolean;
    metadataType?: string;
};
type LoadRealmParams = {
    realmPath: string;
    schemaNames: string[];
};
