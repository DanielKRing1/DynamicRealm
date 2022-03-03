import { globalRealm } from '../Realm/globalRealm';
import { DYNAMIC_REALM_NAME } from '../Schemas';
import { DynamicRealmProperties } from '../Schemas/types/types';
import { getDynamicRealm_wr } from './dynamicRealmOperations';
import { getSchema, getSchemas } from './dynamicSchemaOperations';

function getRealms(): Realm.Results<DynamicRealmProperties> {
    return globalRealm.getRealm().objects<DynamicRealmProperties>(DYNAMIC_REALM_NAME);
}

export function getRealmNames(): string[] {
    return getRealms().map((realm) => realm.realmPath);
}

export function getSchemaNames(realmPath: string = undefined): string[] {
    // 1. Get schema names
    let schemaNames: string[];
    if (!!realmPath) {
        // 1.1.1. Get specified DynamicRealm
        const dynamicRealm: DynamicRealmProperties = getDynamicRealm_wr(realmPath);
        // 1.1.2. Get schema names
        schemaNames = dynamicRealm.schemaNames;
    } else {
        // 1.2.1. Get all DynamicRealms
        const dynamicRealms: Realm.Results<DynamicRealmProperties> = getRealms();

        // 1.2.2. Flatten all schema names into one list
        schemaNames = [];
        dynamicRealms.forEach((dynamicRealm: DynamicRealmProperties) => {
            if (!!dynamicRealm.schemaNames) schemaNames.push(...dynamicRealm.schemaNames);
        });
    }

    // 2. Get DynamicSchemas
    const schemas: Realm.ObjectSchema[] = getSchemas(schemaNames);

    return schemas.map((schema) => schema.name);
}

export function getProperties(schemaName: string): Realm.PropertiesTypes {
    const schema: Realm.ObjectSchema = getSchema(schemaName);

    return schema.properties;
}
