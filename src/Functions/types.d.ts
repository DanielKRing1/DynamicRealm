type InitParams = {
    realmPath: string;
};
type SaveSchemaParams = {
    realmName: string;
    realmPath: string;
    newSchema: Realm.ObjectSchema;
};
type LoadRealmParams = {
    realmPath: string;
    schemaNames: string[];
};
