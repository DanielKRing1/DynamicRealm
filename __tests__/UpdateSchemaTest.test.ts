jest.mock('realm');

import Realm from 'realm';

import DynamicRealm, { Dict, SaveSchemaParams } from '../src';

const META_REALM_PATH = 'CustomRealmPath.path';
const LOADABLE_REALM_PATH = 'RealmPath1.path';

const SCHEMA_1: Realm.ObjectSchema = {
    name: 'Schema1',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'string',
    },
};
const SCHEMA_1_MORE_PROPERTIES: Realm.ObjectSchema = {
    name: 'Schema1',
    primaryKey: 'name',
    properties: {
        new_field: 'string',
        name: 'string',
        data: 'string',
    },
};
const SCHEMA_1_LESS_PROPERTIES: Realm.ObjectSchema = {
    name: 'Schema1',
    primaryKey: 'name',
    properties: {
        name: 'string',
    },
};
const SCHEMA_PARAMS_1: SaveSchemaParams = {
    metaRealmPath: META_REALM_PATH,
    loadableRealmPath: LOADABLE_REALM_PATH,
    schema: SCHEMA_1,
};

const SCHEMA_2: Realm.ObjectSchema = {
    name: 'Schema2',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'int',
    },
};
const SCHEMA_PARAMS_2: SaveSchemaParams = {
    metaRealmPath: META_REALM_PATH,
    loadableRealmPath: LOADABLE_REALM_PATH,
    schema: SCHEMA_2,
};

describe('Updating a loadable schema in DynamicRealm', () => {

    it('Successfully add properties to an existing loadable schema', async () => {
        // 1. Initialize a new MetaRealm
        await DynamicRealm.openMetaRealm({ metaRealmPath: META_REALM_PATH });

        // 2. Save 2 loadable schemas to a single loadable realm, within this new MetaRealm
        await DynamicRealm.saveSchemas([ SCHEMA_PARAMS_1, SCHEMA_PARAMS_2 ]);
        
        // 3. Update Schema 1 to have more properties
        await DynamicRealm.updateSchema({
            metaRealmPath: SCHEMA_PARAMS_1.metaRealmPath,
            loadableRealmPath: SCHEMA_PARAMS_1.loadableRealmPath,
            schema: SCHEMA_1_MORE_PROPERTIES,
        });

        // 4. Check that the schema's properties were updated
        const actualProperties1: Dict<any> = DynamicRealm.getProperties(SCHEMA_PARAMS_1.metaRealmPath, SCHEMA_PARAMS_1.schema.name);
        const expectedProperties1: Dict<any> = SCHEMA_1_MORE_PROPERTIES.properties;

        expect(actualProperties1).toEqual(expectedProperties1);

        // 5. Check that the LoadableRealm's schema version was incremented
        const realm1: Realm = await DynamicRealm.loadRealm(SCHEMA_PARAMS_1.metaRealmPath, SCHEMA_PARAMS_1.loadableRealmPath);

        const actualSchemaVersion1: number = realm1.schemaVersion;
        const expectedSchemaVersion1: number = 1;
        expect(actualSchemaVersion1).toBe(expectedSchemaVersion1);

        // 6. Update Schema 1 to have less properties
        await DynamicRealm.updateSchema({
            metaRealmPath: SCHEMA_PARAMS_1.metaRealmPath,
            loadableRealmPath: SCHEMA_PARAMS_1.loadableRealmPath,
            schema: SCHEMA_1_LESS_PROPERTIES,
        });

        // 7. Check that the schema's properties were updated
        const actualProperties2: Dict<any> = DynamicRealm.getProperties(SCHEMA_PARAMS_1.metaRealmPath, SCHEMA_PARAMS_1.schema.name);
        const expectedProperties2: Dict<any> = SCHEMA_1_LESS_PROPERTIES.properties;

        expect(actualProperties2).toEqual(expectedProperties2);

        // 8. Check that the LoadableRealm's schema version was incremented
        const realm2: Realm = await DynamicRealm.loadRealm(SCHEMA_PARAMS_1.metaRealmPath, SCHEMA_PARAMS_1.loadableRealmPath);

        const actualSchemaVersion2: number = realm2.schemaVersion;
        const expectedSchemaVersion2: number = 2;
        expect(actualSchemaVersion2).toEqual(expectedSchemaVersion2);
    });
});
