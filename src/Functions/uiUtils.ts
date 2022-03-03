import { globalRealm } from '../Realm/globalRealm';
import { DYNAMIC_REALM_NAME } from '../Schemas';
import { MetaRealmProperties } from '../Schemas/types/types';
import { getMetaRealm_wr } from './metaRealmOperations';
import { getSchema, getSchemas } from './metaSchemaOperations';

function getRealms(): Realm.Results<MetaRealmProperties> {
    return globalRealm.getRealm().objects<MetaRealmProperties>(DYNAMIC_REALM_NAME);
}

export function getRealmNames(): string[] {
    return getRealms().map((realm) => realm.realmPath);
}

export function getSchemaNames(realmPath: string = undefined): string[] {
    // 1. Get schema names
    let schemaNames: string[];
    if (!!realmPath) {
        // 1.1.1. Get specified MetaRealm
        const metaRealm: MetaRealmProperties = getMetaRealm_wr(realmPath);
        // 1.1.2. Get schema names
        schemaNames = metaRealm.schemaNames;
    } else {
        // 1.2.1. Get all MetaRealms
        const metaRealms: Realm.Results<MetaRealmProperties> = getRealms();

        // 1.2.2. Flatten all schema names into one list
        schemaNames = [];
        metaRealms.forEach((metaRealm: MetaRealmProperties) => {
            if (!!metaRealm.schemaNames) schemaNames.push(...metaRealm.schemaNames);
        });
    }

    // 2. Get MetaSchemas
    const schemas: Realm.ObjectSchema[] = getSchemas(schemaNames);

    return schemas.map((schema) => schema.name);
}

export function getProperties(schemaName: string): Realm.PropertiesTypes {
    const schema: Realm.ObjectSchema = getSchema(schemaName);

    return schema.properties;
}
