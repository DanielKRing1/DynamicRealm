import { OptionalExceptFor } from '../types/types';

export type LoadableRealmParams = {
    metaRealmPath: string;
    loadableRealmPath: string;
};
export type LoadableSchemaParams = {
    metaRealmPath: string;
    schemaName: string;
};
export type SaveSchemaParams = {
    schema: Realm.ObjectSchema;
} & LoadableRealmParams;
export type UpdateSchemaParams = {
    schema: Realm.ObjectSchema;
} & LoadableRealmParams;
export type RmSchemaParams = {
    schemaName: string;
} & LoadableRealmParams;
export type LoadRealmParams = {
    schemaNames: string[];
} & LoadableRealmParams;

export type LoadableSchemaRowProperties = {
    name: string;
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
export type OptionalLoadableRealmRowProperties = OptionalExceptFor<LoadableRealmRowProperties, 'realmPath'>;
