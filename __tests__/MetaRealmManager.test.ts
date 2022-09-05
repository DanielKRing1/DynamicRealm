import fs from'fs';
import MetaRealmManager from '../src/MetaRealms/metaRealmManager';
import LoadableRealmManager from '../src/LoadableRealms/loadableRealmManager';

const TEST_NAME: string = 'MetaRealmManager';
const TEST_DIRECTORY: string = `__tests__/${TEST_NAME}`;
const META_REALM_PATH1: string = `${TEST_DIRECTORY}/MetaRealm1.path`;
const META_REALM_PATH2: string = `${TEST_DIRECTORY}/MetaRealm2.path`;
const META_REALM_PATH3: string = `${TEST_DIRECTORY}/MetaRealm3.path`;

describe('MetaRealmManager', () => {
    beforeAll(() => {
        if (fs.existsSync(TEST_DIRECTORY)) fs.rmSync(TEST_DIRECTORY, { recursive: true });

        fs.mkdirSync(TEST_DIRECTORY);
    });

    it('Should be usable and return empty arrays, even before there is an open MetaRealm', async () => {
        expect(() => MetaRealmManager.getAllMetaRealmPaths()).not.toThrowError();
        expect(MetaRealmManager.getAllMetaRealmPaths()).toEqual([]);
        expect(() => MetaRealmManager.getAllMetaRealms()).not.toThrowError();
        expect(MetaRealmManager.getAllMetaRealms()).toEqual([]);
        
        expect(() => MetaRealmManager.getAllOpenMetaRealmPaths()).not.toThrowError();
        expect(MetaRealmManager.getAllOpenMetaRealmPaths()).toEqual([]);
        expect(() => MetaRealmManager.getAllOpenMetaRealms()).not.toThrowError();
        expect(MetaRealmManager.getAllOpenMetaRealms()).toEqual([]);
    });

    it('Should be able to open 1 MetaRealm', async () => {

        await MetaRealmManager.getMetaRealm(META_REALM_PATH1);

        expect(() => MetaRealmManager.getAllMetaRealmPaths()).not.toThrowError();
        expect(MetaRealmManager.getAllMetaRealmPaths()).toEqual([META_REALM_PATH1]);
        expect(() => MetaRealmManager.getAllMetaRealms()).not.toThrowError();
        expect(MetaRealmManager.getAllMetaRealms()).toMatchSnapshot();
        
        expect(() => MetaRealmManager.getAllOpenMetaRealmPaths()).not.toThrowError();
        expect(MetaRealmManager.getAllOpenMetaRealmPaths()).toEqual([META_REALM_PATH1]);
        expect(() => MetaRealmManager.getAllOpenMetaRealms()).not.toThrowError();
        expect(MetaRealmManager.getAllOpenMetaRealms()).toMatchSnapshot();
    });

    it('Should be able to open 2 more MetaRealms, for a total of 3', async () => {

        await MetaRealmManager.getMetaRealm(META_REALM_PATH2);
        await MetaRealmManager.getMetaRealm(META_REALM_PATH3);

        expect(() => MetaRealmManager.getAllMetaRealmPaths()).not.toThrowError();
        expect(MetaRealmManager.getAllMetaRealmPaths().sort()).toEqual([META_REALM_PATH1, META_REALM_PATH2, META_REALM_PATH3].sort());
        expect(() => MetaRealmManager.getAllMetaRealms()).not.toThrowError();
        expect(MetaRealmManager.getAllMetaRealms()).toMatchSnapshot();
        
        expect(() => MetaRealmManager.getAllOpenMetaRealmPaths()).not.toThrowError();
        expect(MetaRealmManager.getAllOpenMetaRealmPaths().sort()).toEqual([META_REALM_PATH1, META_REALM_PATH2, META_REALM_PATH3].sort());
        expect(() => MetaRealmManager.getAllOpenMetaRealms()).not.toThrowError();
        expect(MetaRealmManager.getAllOpenMetaRealms()).toMatchSnapshot();
    });

    it('Should be able to close the first MetaRealm', async () => {

        MetaRealmManager.closeMetaRealm(META_REALM_PATH1);

        expect(() => MetaRealmManager.getAllMetaRealmPaths()).not.toThrowError();
        expect(MetaRealmManager.getAllMetaRealmPaths().sort()).toEqual([META_REALM_PATH2, META_REALM_PATH3].sort());
        expect(() => MetaRealmManager.getAllMetaRealms()).not.toThrowError();
        expect(MetaRealmManager.getAllMetaRealms()).toMatchSnapshot();
        
        expect(() => MetaRealmManager.getAllOpenMetaRealmPaths()).not.toThrowError();
        expect(MetaRealmManager.getAllOpenMetaRealmPaths().sort()).toEqual([META_REALM_PATH2, META_REALM_PATH3].sort());
        expect(() => MetaRealmManager.getAllOpenMetaRealms()).not.toThrowError();
        expect(MetaRealmManager.getAllOpenMetaRealms()).toMatchSnapshot();
    });

    it('Should be able to reopen the first MetaRealms, for a total of 3', async () => {

        await MetaRealmManager.getMetaRealm(META_REALM_PATH1);

        expect(() => MetaRealmManager.getAllMetaRealmPaths()).not.toThrowError();
        expect(MetaRealmManager.getAllMetaRealmPaths().sort()).toEqual([META_REALM_PATH1, META_REALM_PATH2, META_REALM_PATH3].sort());
        expect(() => MetaRealmManager.getAllMetaRealms()).not.toThrowError();
        expect(MetaRealmManager.getAllMetaRealms()).toMatchSnapshot();
        
        expect(() => MetaRealmManager.getAllOpenMetaRealmPaths()).not.toThrowError();
        expect(MetaRealmManager.getAllOpenMetaRealmPaths().sort()).toEqual([META_REALM_PATH1, META_REALM_PATH2, META_REALM_PATH3].sort());
        expect(() => MetaRealmManager.getAllOpenMetaRealms()).not.toThrowError();
        expect(MetaRealmManager.getAllOpenMetaRealms()).toMatchSnapshot();
    });

    it('Should be able to close all open MetaRealms', async () => {

        MetaRealmManager.closeAll();

        expect(() => MetaRealmManager.getAllMetaRealmPaths()).not.toThrowError();
        expect(MetaRealmManager.getAllMetaRealmPaths()).toEqual([]);
        expect(() => MetaRealmManager.getAllMetaRealms()).not.toThrowError();
        expect(MetaRealmManager.getAllMetaRealms()).toEqual([]);
        
        expect(() => MetaRealmManager.getAllOpenMetaRealmPaths()).not.toThrowError();
        expect(MetaRealmManager.getAllOpenMetaRealmPaths()).toEqual([]);
        expect(() => MetaRealmManager.getAllOpenMetaRealms()).not.toThrowError();
        expect(MetaRealmManager.getAllOpenMetaRealms()).toEqual([]);
    });

    it('Should be able to close all open MetaRealms, even if none are open', async () => {

        MetaRealmManager.closeAll();

        expect(() => MetaRealmManager.getAllMetaRealmPaths()).not.toThrowError();
        expect(MetaRealmManager.getAllMetaRealmPaths()).toEqual([]);
        expect(() => MetaRealmManager.getAllMetaRealms()).not.toThrowError();
        expect(MetaRealmManager.getAllMetaRealms()).toEqual([]);
        
        expect(() => MetaRealmManager.getAllOpenMetaRealmPaths()).not.toThrowError();
        expect(MetaRealmManager.getAllOpenMetaRealmPaths()).toEqual([]);
        expect(() => MetaRealmManager.getAllOpenMetaRealms()).not.toThrowError();
        expect(MetaRealmManager.getAllOpenMetaRealms()).toEqual([]);
    });

    afterAll(async () => {
        await MetaRealmManager.closeAll();
        await LoadableRealmManager.closeAll();
    });      
});
