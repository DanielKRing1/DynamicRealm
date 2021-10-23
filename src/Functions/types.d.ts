type InitParams = {
    realmPath?: string;
};
type SaveSchemaParams = {
    realmPath: string;
    schema: Realm.ObjectSchema;
    metadataType?: string;
};
type LoadRealmParams = {
    realmPath: string;
    schemaNames: string[];
};
