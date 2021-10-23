jest.mock('realm');

import Realm from 'realm';

import DynamicRealm from '../src';

const REALM_PATH_1 = 'RealmPath1.path';
const REALM_PATH_2 = 'RealmPath2.path';
const REALM_PATH_3 = 'RealmPath3.path';

const SCHEMA_1: Realm.ObjectSchema = {
    name: 'Schema1',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'string',
    },
};
const SCHEMA_PARAMS_1: SaveSchemaParams = {
    realmPath: REALM_PATH_1,
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
    realmPath: REALM_PATH_1,
    schema: SCHEMA_2,
};

const SCHEMA_3: Realm.ObjectSchema = {
    name: 'Schema3',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'float',
    },
};
const SCHEMA_PARAMS_3: SaveSchemaParams = {
    realmPath: REALM_PATH_1,
    schema: SCHEMA_3,
};

const SCHEMA_4: Realm.ObjectSchema = {
    name: 'Schema4',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'int',
    },
};
const SCHEMA_PARAMS_4: SaveSchemaParams = {
    realmPath: REALM_PATH_2,
    schema: SCHEMA_4,
};

const SCHEMA_5: Realm.ObjectSchema = {
    name: 'Schema5',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'double',
    },
};
const SCHEMA_PARAMS_5: SaveSchemaParams = {
    realmPath: REALM_PATH_2,
    schema: SCHEMA_5,
};

const SCHEMA_6: Realm.ObjectSchema = {
    name: 'Schema6',
    primaryKey: 'name',
    properties: {
        name: 'string',
    },
};

const SCHEMA_PARAMS_6: SaveSchemaParams = {
    realmPath: REALM_PATH_3,
    schema: SCHEMA_6,
};

describe('DynamicRealm', () => {
    it('Should open a realm, given a list of schema names', async () => {
        const realmPath = 'CustomRealmPath.path';
        const testRealmPath1 = 'MySchemaLiveHere1.path';
        const testRealmPath2 = 'MySchemaLiveHere2.path';
        const testRealmPath3 = 'MySchemaLiveHere3.path';

        await DynamicRealm.init({ realmPath });

        DynamicRealm.saveSchemas([SCHEMA_PARAMS_1, SCHEMA_PARAMS_2, SCHEMA_PARAMS_3, SCHEMA_PARAMS_4, SCHEMA_PARAMS_5, SCHEMA_PARAMS_6]);

        // 1. Open a realm with Schemas 1, 2, and 4
        const realm1: Realm = await DynamicRealm.loadRealmFromSchemas({ realmPath: testRealmPath1, schemaNames: [SCHEMA_1.name, SCHEMA_2.name, SCHEMA_4.name] });
        expect(realm1.schema).toEqual([SCHEMA_1, SCHEMA_2, SCHEMA_4]);

        // 2. Open a realm with Schemas 1-6
        const realm2: Realm = await DynamicRealm.loadRealmFromSchemas({
            realmPath: testRealmPath2,
            schemaNames: [SCHEMA_1.name, SCHEMA_2.name, SCHEMA_3.name, SCHEMA_4.name, SCHEMA_5.name, SCHEMA_6.name],
        });
        expect(realm2.schema).toEqual([SCHEMA_1, SCHEMA_2, SCHEMA_3, SCHEMA_4, SCHEMA_5, SCHEMA_6]);

        // 3. Open a realm with Schemas 1-6 and a non-existant schema
        const realm3: Realm = await DynamicRealm.loadRealmFromSchemas({
            realmPath: testRealmPath3,
            schemaNames: [SCHEMA_1.name, 'non-existant schema name 1', SCHEMA_2.name, SCHEMA_3.name, SCHEMA_4.name, SCHEMA_5.name, SCHEMA_6.name, 'non-existant schema name 2'],
        });
        expect(realm3.schema).toEqual([SCHEMA_1, SCHEMA_2, SCHEMA_3, SCHEMA_4, SCHEMA_5, SCHEMA_6]);
    });

    it('Should open a realm, given a realm name', async () => {
        const realmPath = 'CustomRealmPath.path';

        await DynamicRealm.init({ realmPath });

        DynamicRealm.saveSchemas([SCHEMA_PARAMS_1, SCHEMA_PARAMS_2, SCHEMA_PARAMS_3, SCHEMA_PARAMS_4, SCHEMA_PARAMS_5, SCHEMA_PARAMS_6]);

        // 1. Load realm1, should have Schemas 1, 2, and 3
        const realm1: Realm = await DynamicRealm.loadRealm(REALM_PATH_1);
        expect(realm1.schema).toEqual([SCHEMA_1, SCHEMA_2, SCHEMA_3]);

        // 2. Load realm2, should have Schemas 4 and 5
        const realm2: Realm = await DynamicRealm.loadRealm(REALM_PATH_2);
        expect(realm2.schema).toEqual([SCHEMA_4, SCHEMA_5]);

        // 3. Load realm3, should have Schemas 6
        const realm3: Realm = await DynamicRealm.loadRealm(REALM_PATH_3);
        expect(realm3.schema).toEqual([SCHEMA_6]);
    });
});
