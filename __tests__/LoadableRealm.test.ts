import fs from 'fs';
import MetaRealmManager from '../src/MetaRealms/metaRealmManager';
import LoadableRealmManager from '../src/LoadableRealms/LoadableRealmManager';
import { saveSchema } from '../src/MetaRealms';

const TEST_NAME: string = 'LoadableRealm';
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
            await expect(LoadableRealmManager.loadRealm({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1 })).rejects.toThrowError();
            await expect(LoadableRealmManager.loadRealm({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1 })).rejects.toThrowError();

            await expect(LoadableRealmManager.reloadRealm({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1 })).rejects.toThrowError();
            await expect(LoadableRealmManager.reloadRealm({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1 })).rejects.toThrowError();

            expect(() => LoadableRealmManager.closeLoadableRealm({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1 })).not.toThrowError();
            expect(() => LoadableRealmManager.closeLoadableRealm({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1 })).not.toThrowError();
    });

    it('Should have no open LoadableRealms', async () => {

        expect(LoadableRealmManager.getAllLoadableRealmKeys()).toEqual([]);
        expect(LoadableRealmManager.getAllLoadableRealms()).toEqual([]);
        expect(LoadableRealmManager.getAllOpenLoadableRealmKeys()).toEqual([]);
        expect(LoadableRealmManager.getAllOpenLoadableRealmKeys()).toEqual([]);
    });

    it('Should be able to open 1 LoadableRealm with LoadableSchemas 1-3 in MetaRealm1.LoadableRealm1', async () => {

        await saveSchema({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_1 });
        await saveSchema({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_2 });
        await saveSchema({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_3 });

        const realm = await LoadableRealmManager.loadRealm({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1 });

        expect(() => LoadableRealmManager.getAllLoadableRealmKeys()).not.toThrowError();
        expect(LoadableRealmManager.getAllLoadableRealmKeys()).toEqual([ `${META_REALM_PATH1}-${LOADABLE_REALM_PATH1}` ]);
        expect(() => LoadableRealmManager.getAllLoadableRealms()).not.toThrowError();
        // TODO CHECK THIS; ADD SNAPSHOT
        expect(LoadableRealmManager.getAllLoadableRealms()).toMatchSnapshot();
        
        expect(() => LoadableRealmManager.getAllOpenLoadableRealmKeys()).not.toThrowError();
        expect(LoadableRealmManager.getAllOpenLoadableRealmKeys()).toEqual([ `${META_REALM_PATH1}-${LOADABLE_REALM_PATH1}` ]);
        expect(() => LoadableRealmManager.getAllOpenLoadableRealms()).not.toThrowError();
        // TODO CHECK THIS; ADD SNAPSHOT
        expect(LoadableRealmManager.getAllOpenLoadableRealms()).toMatchSnapshot();

        // TODO CHECK THIS; ADD SNAPSHOT
        expect(realm).toMatchSnapshot();

        const TEST_ROW1 = { name: 'Test1', schema1Data:'Hello!' };
        const TEST_ROW2 = { name: 'Test2', schema1Data:'World!' };

        realm.write(() => {
            realm.create(LOADABLE_SCHEMA_1.name, TEST_ROW1);
            realm.create(LOADABLE_SCHEMA_1.name, TEST_ROW2);
        });
        
        const results = realm.objects(LOADABLE_SCHEMA_1.name);

        expect(realm.objects(LOADABLE_SCHEMA_1.name).toJSON()).toEqual([ TEST_ROW1, TEST_ROW2 ]);
    });

    it('Should be able to open another LoadableRealm with LoadableSchemas 2-3 in MetaRealm2.LoadableRealm1', async () => {

        await saveSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_2 });
        await saveSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_3 });

        const realm = await LoadableRealmManager.loadRealm({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH1 });

        expect(() => LoadableRealmManager.getAllLoadableRealmKeys()).not.toThrowError();
        expect(LoadableRealmManager.getAllLoadableRealmKeys()).toEqual([ `${META_REALM_PATH1}-${LOADABLE_REALM_PATH1}`, `${META_REALM_PATH2}-${LOADABLE_REALM_PATH1}` ]);
        expect(() => LoadableRealmManager.getAllLoadableRealms()).not.toThrowError();
        expect(LoadableRealmManager.getAllLoadableRealms()).toMatchSnapshot();
        
        expect(() => LoadableRealmManager.getAllOpenLoadableRealmKeys()).not.toThrowError();
        expect(LoadableRealmManager.getAllOpenLoadableRealmKeys()).toEqual([ `${META_REALM_PATH1}-${LOADABLE_REALM_PATH1}`, `${META_REALM_PATH2}-${LOADABLE_REALM_PATH1}` ]);
        expect(() => LoadableRealmManager.getAllOpenLoadableRealms()).not.toThrowError();
        expect(LoadableRealmManager.getAllOpenLoadableRealms()).toMatchSnapshot();

        expect(realm).toMatchSnapshot();

        const TEST_ROW21 = { name: 'Test21', schema2Data:'Hello!' };
        const TEST_ROW22 = { name: 'Test22', schema2Data:'World!' };
        const TEST_ROW31 = { name: 'Test31', schema3Data:'Hello!' };
        const TEST_ROW32 = { name: 'Test32', schema3Data:'World!' };

        realm.write(() => {
            realm.create(LOADABLE_SCHEMA_2.name, TEST_ROW21);
            realm.create(LOADABLE_SCHEMA_2.name, TEST_ROW22);

            realm.create(LOADABLE_SCHEMA_3.name, TEST_ROW31);
            realm.create(LOADABLE_SCHEMA_3.name, TEST_ROW32);
        });

        expect(realm.objects(LOADABLE_SCHEMA_2.name).toJSON()).toEqual([ TEST_ROW21, TEST_ROW22 ]);
        expect(realm.objects(LOADABLE_SCHEMA_3.name).toJSON()).toEqual([ TEST_ROW31, TEST_ROW32 ]);
    });

    it('Should be able to open another LoadableRealm with LoadableSchemas 4-5 in MetaRealm2.LoadableRealm2', async () => {

        await saveSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH2, schema: LOADABLE_SCHEMA_4 });
        await saveSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH2, schema: LOADABLE_SCHEMA_5 });

        const realm21 = await LoadableRealmManager.reloadRealm({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH1 });

        const realm22 = await LoadableRealmManager.reloadRealm({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH2 });

        expect(() => LoadableRealmManager.getAllLoadableRealmKeys()).not.toThrowError();
        expect(LoadableRealmManager.getAllLoadableRealmKeys()).toEqual([ `${META_REALM_PATH1}-${LOADABLE_REALM_PATH1}`, `${META_REALM_PATH2}-${LOADABLE_REALM_PATH1}`, `${META_REALM_PATH2}-${LOADABLE_REALM_PATH2}` ]);
        expect(() => LoadableRealmManager.getAllLoadableRealms()).not.toThrowError();
        expect(LoadableRealmManager.getAllLoadableRealms()).toMatchSnapshot();
        
        expect(() => LoadableRealmManager.getAllOpenLoadableRealmKeys()).not.toThrowError();
        expect(LoadableRealmManager.getAllOpenLoadableRealmKeys()).toEqual([ `${META_REALM_PATH1}-${LOADABLE_REALM_PATH1}`, `${META_REALM_PATH2}-${LOADABLE_REALM_PATH1}`, `${META_REALM_PATH2}-${LOADABLE_REALM_PATH2}` ]);
        expect(() => LoadableRealmManager.getAllOpenLoadableRealms()).not.toThrowError();
        expect(LoadableRealmManager.getAllOpenLoadableRealms()).toMatchSnapshot();

        expect(realm21).toMatchSnapshot();
        expect(realm22).toMatchSnapshot();

        const TEST_ROW21 = { name: 'Test21', schema2Data:'Hello!' };
        const TEST_ROW22 = { name: 'Test22', schema2Data:'World!' };
        const TEST_ROW31 = { name: 'Test31', schema3Data:'Hello!' };
        const TEST_ROW32 = { name: 'Test32', schema3Data:'World!' };
        const TEST_ROW41 = { name: 'Test41', schema4Data:'Hello!' };
        const TEST_ROW42 = { name: 'Test42', schema4Data:'World!' };
        const TEST_ROW51 = { name: 'Test51', schema5Data:'Hello!' };
        const TEST_ROW52 = { name: 'Test52', schema5Data:'World!' };


        realm21.write(() => {
            expect(() => realm21.create(LOADABLE_SCHEMA_2.name, TEST_ROW21)).toThrowError();
            expect(() => realm21.create(LOADABLE_SCHEMA_2.name, TEST_ROW22)).toThrowError();

            expect(() => realm21.create(LOADABLE_SCHEMA_3.name, TEST_ROW31)).toThrowError();
            expect(() => realm21.create(LOADABLE_SCHEMA_3.name, TEST_ROW32)).toThrowError();
        });

        realm22.write(() => {
            realm22.create(LOADABLE_SCHEMA_4.name, TEST_ROW41);
            realm22.create(LOADABLE_SCHEMA_4.name, TEST_ROW42);

            realm22.create(LOADABLE_SCHEMA_5.name, TEST_ROW51);
            realm22.create(LOADABLE_SCHEMA_5.name, TEST_ROW52);
        });

        expect(realm21.objects(LOADABLE_SCHEMA_2.name).toJSON()).toEqual([ TEST_ROW21, TEST_ROW22 ]);
        expect(realm21.objects(LOADABLE_SCHEMA_3.name).toJSON()).toEqual([ TEST_ROW31, TEST_ROW32 ]);
        expect(realm22.objects(LOADABLE_SCHEMA_4.name).toJSON()).toEqual([ TEST_ROW41, TEST_ROW42 ]);
        expect(realm22.objects(LOADABLE_SCHEMA_5.name).toJSON()).toEqual([ TEST_ROW51, TEST_ROW52 ]);
    });

    afterAll(async () => {
        await LoadableRealmManager.closeAll();
        await MetaRealmManager.closeAll();
    });
});
