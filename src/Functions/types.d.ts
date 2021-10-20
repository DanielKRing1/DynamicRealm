type InitParams = {
    realmPath?: string;
};
type SaveSchemaParams = {
    realmName: string;
    realmPath: string;
    schema: Realm.ObjectSchema;
};
type LoadRealmParams = {
    realmPath: string;
    schemaNames: string[];
};
