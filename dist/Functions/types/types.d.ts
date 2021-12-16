export declare type InitParams = {
    realmPath?: string;
    force?: boolean;
};
export declare type SaveSchemaParams = {
    realmPath: string;
    schema: Realm.ObjectSchema;
    overwrite?: boolean;
    metadataType?: string;
};
export declare type LoadRealmParams = {
    realmPath: string;
    schemaNames: string[];
};
