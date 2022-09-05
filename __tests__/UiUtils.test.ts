import fs from 'fs';
import MetaRealmManager from '../src/MetaRealms/metaRealmManager';
import LoadableRealmManager from '../src/LoadableRealms/LoadableRealmManager';
import { saveSchema } from '../src/MetaRealms';
import { getLoadableRealmPaths, getProperties, getSchemaNames } from '../src/UiUtils';

const TEST_NAME: string = 'UiUtils';
const TEST_DIRECTORY: string = `__tests__/${TEST_NAME}`;
const META_REALM_PATH1: string = `${TEST_DIRECTORY}/MetaRealm1.path`;
const META_REALM_PATH2: string = `${TEST_DIRECTORY}/MetaRealm2.path`;
const LOADABLE_REALM_PATH1: string = `LoadableRealm1.path`;
const LOADABLE_REALM_PATH2: string = `LoadableRealm2.path`;

const LOADABLE_SCHEMA_1: Realm.ObjectSchema = {
    name: 'LoadableSchema1',
    primaryKey: 'name',
    properties: {
        name: 'string',
        schema1Data: 'string',
    },
};

const LOADABLE_SCHEMA_2: Realm.ObjectSchema = {
    name: 'LoadableSchema2',
    primaryKey: 'name',
    properties: {
        name: 'string',
        schema2Data: 'string',
    },
};

const LOADABLE_SCHEMA_3: Realm.ObjectSchema = {
    name: 'LoadableSchema3',
    primaryKey: 'name',
    properties: {
        name: 'string',
        schema3Data: 'string',
    },
};

const LOADABLE_SCHEMA_4: Realm.ObjectSchema = {
    name: 'LoadableSchema4',
    primaryKey: 'name',
    properties: {
        name: 'string',
        schema4Data: 'string',
    },
};

const LOADABLE_SCHEMA_5: Realm.ObjectSchema = {
    name: 'LoadableSchema5',
    primaryKey: 'name',
    properties: {
        name: 'string',
        schema5Data: 'string',
    },
};

describe('LoadableRealmManager', () => {
    beforeAll(() => {
        if (fs.existsSync(TEST_DIRECTORY)) fs.rmSync(TEST_DIRECTORY, { recursive: true });

        fs.mkdirSync(TEST_DIRECTORY);
    });

    it('Should fail to open a non-existant LoadableRealm', async () => {

        expect(async () => getLoadableRealmPaths(META_REALM_PATH1)).not.toThrowError();
        expect(async () => getSchemaNames(META_REALM_PATH1, LOADABLE_REALM_PATH1)).not.toThrowError();
        expect(async () => getProperties(META_REALM_PATH1, LOADABLE_SCHEMA_1.name)).not.toThrowError();

        expect(await getLoadableRealmPaths(META_REALM_PATH1)).toEqual([ LOADABLE_REALM_PATH1 ]);
        expect(await getSchemaNames(META_REALM_PATH1, LOADABLE_REALM_PATH1)).toEqual([]);
        expect(await getProperties(META_REALM_PATH1, LOADABLE_SCHEMA_1.name)).toEqual({});
    });

    it('Should be able to open 1 LoadableRealm with LoadableSchemas 1-3 in MetaRealm1.LoadableRealm1', async () => {

        await saveSchema({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_1 });
        await saveSchema({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_2 });
        await saveSchema({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_3 });

        expect(await getLoadableRealmPaths(META_REALM_PATH1)).toEqual([ LOADABLE_REALM_PATH1 ]);
        expect(await getSchemaNames(META_REALM_PATH1, LOADABLE_REALM_PATH1)).toEqual([ LOADABLE_SCHEMA_1.name, LOADABLE_SCHEMA_2.name, LOADABLE_SCHEMA_3.name, ]);
        expect(await getProperties(META_REALM_PATH1, LOADABLE_SCHEMA_1.name)).toEqual(LOADABLE_SCHEMA_1.properties);
    });

    it('Should be able to open another LoadableRealm with LoadableSchemas 2-3 in MetaRealm2.LoadableRealm1', async () => {

        await saveSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_2 });
        await saveSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_3 });

        expect(await getLoadableRealmPaths(META_REALM_PATH2)).toEqual([ LOADABLE_REALM_PATH1 ]);
        expect(await getSchemaNames(META_REALM_PATH2, LOADABLE_REALM_PATH1)).toEqual([ LOADABLE_SCHEMA_2.name, LOADABLE_SCHEMA_3.name, ]);
        expect(await getProperties(META_REALM_PATH2, LOADABLE_SCHEMA_1.name)).toEqual({});
        expect(await getProperties(META_REALM_PATH2, LOADABLE_SCHEMA_2.name)).toEqual(LOADABLE_SCHEMA_2.properties);
    });

    it('Should be able to open another LoadableRealm with LoadableSchemas 4-5 in MetaRealm2.LoadableRealm2', async () => {

        await saveSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH2, schema: LOADABLE_SCHEMA_4 });
        await saveSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH2, schema: LOADABLE_SCHEMA_5 });

        expect(await getLoadableRealmPaths(META_REALM_PATH2)).toEqual([ LOADABLE_REALM_PATH1, LOADABLE_REALM_PATH2 ]);
        expect(await getSchemaNames(META_REALM_PATH2, LOADABLE_REALM_PATH2)).toEqual([ LOADABLE_SCHEMA_4.name, LOADABLE_SCHEMA_5.name ]);
        expect(await getProperties(META_REALM_PATH2, LOADABLE_SCHEMA_4.name)).toEqual(LOADABLE_SCHEMA_4.properties);
        expect(await getProperties(META_REALM_PATH2, LOADABLE_SCHEMA_5.name)).toEqual(LOADABLE_SCHEMA_5.properties);
    });

    afterAll(async () => {
        await MetaRealmManager.closeAll();
        await LoadableRealmManager.closeAll();
    });      
});
