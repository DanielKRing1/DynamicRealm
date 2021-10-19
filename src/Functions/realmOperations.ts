import { DEFAULT_PATH } from '../Realm/constants';
import { globalRealm } from '../Realm/gloabalRealm';
import { DYNAMIC_REALM_NAME, DynamicRealm, DynamicSchema } from '../Schemas';
import { getSchemas } from './dynamicSchemaOperations';

export async function init({ realmPath: path = DEFAULT_PATH }: InitParams = {}): Promise<void> {
    // 1. Open a realm containing only the DynamicSchema
    const realm = await Realm.open({ schema: [DynamicRealm, DynamicSchema], path });

    // 2. Store realm in global wrapper
    globalRealm.setRealm(realm);
}

export async function loadRealm(realmName: string): Promise<Realm> {
    // 1. Get DynamicRealm
    const realmSchema: DynamicRealmProperties = globalRealm.getRealm().objectForPrimaryKey(DYNAMIC_REALM_NAME, realmName);

    // 2. Get DynamicSchemas
    const entries: DynamicSchemaProperties[] = getSchemas(realmSchema.schemaNames);

    // 3. Map to Realm.ObjectSchemas
    const schema: Realm.ObjectSchema[] = entries.map((entry: DynamicSchemaProperties) => ({
        name: entry.name,
        primaryKey: entry.primaryKey,
        properties: JSON.parse(entry.schema),
    }));

    // 4. Open Realm
    return Realm.open({ schema, path: realmSchema.realmPath, schemaVersion: realmSchema.schemaVersion });
}

/**
 * Loads a realm with all schemas if no schemaNames provided, else
 * Loads a realm with only the schemas of the provided schemaNames
 *
 * @param schemaNames a list of schema names to load into the realm;
 *                      will load all schemas if not provided
 * @returns
 */
export async function loadRealmFromSchemas({ realmPath: path, schemaNames = [] }: LoadRealmParams): Promise<Realm> {
    // 1. Get DynamicSchemas
    const entries: DynamicSchemaProperties[] = getSchemas(schemaNames);

    // 2. Map to Realm.ObjectSchemas
    const schema: Realm.ObjectSchema[] = entries.map((entry: DynamicSchemaProperties) => ({
        name: entry.name,
        primaryKey: entry.primaryKey,
        properties: JSON.parse(entry.schema),
    }));

    // 3. Open Realm
    return Realm.open({ schema, path });
}
