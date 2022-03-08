jest.mock('realm');

import Realm from 'realm';

import { metaRealmManager } from '../src/Realm/metaRealmsManager';

import DynamicRealm from '../src';
import { DEFAULT_META_REALM_PATH } from '../src/Realm/constants';

describe('GlobalRealm', () => {
    it('Should throw an error and have a null realm before being initialized', async () => {
        expect(() => metaRealmManager.getMetaRealm(DEFAULT_META_REALM_PATH)).toThrowError();

        expect(metaRealmManager.getAllMetaRealmNames()).toEqual([]);
    });

    it('Should own a MetaRealm instance after being initialized', async () => {
        const metaRealmPath = 'CustomMetaRealmPath.path';

        await DynamicRealm.openMetaRealm({ metaRealmPath });

        expect(metaRealmManager.getMetaRealm(metaRealmPath) != null).toBeTruthy();
        expect(metaRealmManager.getMetaRealm(metaRealmPath)).toBeInstanceOf(Realm);
    });

    it('Should be able to opennd operate more than 1 MetaRealm', async () => {
        const metaRealmPath1 = 'CustomMetaRealmPath1.path';
        const metaRealmPath2 = 'CustomMetaRealmPath2.path';
        const metaRealmPath3 = 'CustomMetaRealmPath3.path';

        await DynamicRealm.openMetaRealm({ metaRealmPath: metaRealmPath1 });
        await DynamicRealm.openMetaRealm({ metaRealmPath: metaRealmPath2 });
        await DynamicRealm.openMetaRealm({ metaRealmPath: metaRealmPath3 });

        expect(metaRealmManager.getMetaRealm(metaRealmPath1) != null).toBeTruthy();
        expect(metaRealmManager.getMetaRealm(metaRealmPath1)).toBeInstanceOf(Realm);

        expect(metaRealmManager.getMetaRealm(metaRealmPath2) != null).toBeTruthy();
        expect(metaRealmManager.getMetaRealm(metaRealmPath2)).toBeInstanceOf(Realm);

        expect(metaRealmManager.getMetaRealm(metaRealmPath3) != null).toBeTruthy();
        expect(metaRealmManager.getMetaRealm(metaRealmPath3)).toBeInstanceOf(Realm);

        // Just opened 3 MetaRealms + opened 1 MetaRealm earlier in test
        expect(metaRealmManager.getAllMetaRealmNames().length).toBe(4);
    });
});
