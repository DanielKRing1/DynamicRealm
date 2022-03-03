jest.mock('realm');

import Realm from 'realm';

import MetaRealm, { SaveSchemaParams } from '../src';

const REALM_PATH_1 = 'RealmPath1.path';
const REALM_PATH_2 = 'RealmPath2.path';
const REALM_PATH_3 = 'RealmPath3.path';
const UNKNOWN_REALM_PATH: string = 'UNKNOWN_REALM_PATH.path';

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

describe('MetaRealm', () => {
    it('Should expose the names of realms available', async () => {
        const realmPath = 'CustomRealmPath.path';

        await MetaRealm.init({ realmPath });

        expect(MetaRealm.getSchemaNames()).toEqual([]);

        MetaRealm.saveSchemas([SCHEMA_PARAMS_1, SCHEMA_PARAMS_2, SCHEMA_PARAMS_3, SCHEMA_PARAMS_4, SCHEMA_PARAMS_5, SCHEMA_PARAMS_6]);

        expect(MetaRealm.getRealmNames()).toEqual([REALM_PATH_1, REALM_PATH_2, REALM_PATH_3]);
    });

    it('Should expose the names of schemas available in a realm', async () => {
        const realmPath = 'CustomRealmPath.path';

        await MetaRealm.init({ realmPath });

        MetaRealm.saveSchemas([SCHEMA_PARAMS_1, SCHEMA_PARAMS_2, SCHEMA_PARAMS_3, SCHEMA_PARAMS_4, SCHEMA_PARAMS_5, SCHEMA_PARAMS_6]);

        expect(MetaRealm.getSchemaNames(REALM_PATH_1)).toEqual([SCHEMA_1.name, SCHEMA_2.name, SCHEMA_3.name]);
        expect(MetaRealm.getSchemaNames(REALM_PATH_2)).toEqual([SCHEMA_4.name, SCHEMA_5.name]);
        expect(MetaRealm.getSchemaNames(REALM_PATH_3)).toEqual([SCHEMA_6.name]);
        expect(MetaRealm.getSchemaNames()).toEqual([SCHEMA_1.name, SCHEMA_2.name, SCHEMA_3.name, SCHEMA_4.name, SCHEMA_5.name, SCHEMA_6.name]);
    });

    it('Should expose the properties that exist on a given schema', async () => {
        const realmPath = 'CustomRealmPath.path';

        await MetaRealm.init({ realmPath });

        MetaRealm.saveSchemas([SCHEMA_PARAMS_1, SCHEMA_PARAMS_2, SCHEMA_PARAMS_3, SCHEMA_PARAMS_4, SCHEMA_PARAMS_5, SCHEMA_PARAMS_6]);

        expect(MetaRealm.getProperties(SCHEMA_1.name)).toEqual(SCHEMA_1.properties);
        expect(MetaRealm.getProperties(SCHEMA_2.name)).toEqual(SCHEMA_2.properties);
        expect(MetaRealm.getProperties(SCHEMA_3.name)).toEqual(SCHEMA_3.properties);
        expect(MetaRealm.getProperties(SCHEMA_4.name)).toEqual(SCHEMA_4.properties);
        expect(MetaRealm.getProperties(SCHEMA_5.name)).toEqual(SCHEMA_5.properties);
        expect(MetaRealm.getProperties(SCHEMA_6.name)).toEqual(SCHEMA_6.properties);

        console.log(MetaRealm.getProperties(SCHEMA_1.name));
    });

    it('Should return an empty array for an unknown realm path', () => {
        expect(MetaRealm.getSchemaNames(UNKNOWN_REALM_PATH)).toEqual([]);
    });
});
