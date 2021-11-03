import { globalRealm } from '../Realm/gloabalRealm';
import { DYNAMIC_REALM_NAME } from '../Schemas';
import { getSchema, getSchemas } from './dynamicSchemaOperations';

export function getRealmNames(): string[] {
    return globalRealm
        .getRealm()
        .objects<DynamicRealmProperties>(DYNAMIC_REALM_NAME)
        .map((realm) => realm.realmPath);
}

export function getSchemaNames(realmPath: string = undefined): string[] {
    // 1. Get schema names
    let schemaNames: string[];
    if (!!realmPath) {
        // 1.1.1. Get specified DynamicRealm
        const dynamicRealmSchema: DynamicRealmProperties = globalRealm.getRealm().objectForPrimaryKey(DYNAMIC_REALM_NAME, realmPath);
        // 1.1.2. Get schema names
        schemaNames = dynamicRealmSchema.schemaNames;
    } else {
        // 1.2.1. Get all DynamicRealms
        const dynamicRealmSchemas: DynamicRealmProperties[] = Array.from(globalRealm.getRealm().objects(DYNAMIC_REALM_NAME));
        // 1.2.2. Flatten all schema names into one list
        schemaNames = [];
        dynamicRealmSchemas.forEach((dynamicRealmSchema: DynamicRealmProperties) => schemaNames.push(...dynamicRealmSchema.schemaNames));
    }

    // 2. Get DynamicSchemas
    const schemas: Realm.ObjectSchema[] = getSchemas(schemaNames);

    return schemas.map((schema) => schema.name);
}

export function getProperties(schemaName: string): Realm.PropertiesTypes {
    const schema: Realm.ObjectSchema = getSchema(schemaName);

    return schema.properties;
}
