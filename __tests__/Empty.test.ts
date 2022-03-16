jest.mock('realm');

import Realm from 'realm';

import MetaRealm from '../src';

describe('A MetaRealm with no saved schemas', () => {
    it('Return an empty array of realm names', async () => {
        const metaRealmPath = 'CustomRealmPath.path';

        await MetaRealm.openMetaRealm({ metaRealmPath });

        try {
            expect(() => MetaRealm.getLoadableRealmNames(metaRealmPath)).not.toThrowError();
            expect(MetaRealm.getLoadableRealmNames(metaRealmPath)).toEqual([]);
        } catch (err) {
            console.log('SHOULD NOT HAVE REACHED THIS PART OF CODE');
            console.log(err);
        }
    });

    it('Return an empty array of schema names', async () => {
        const metaRealmPath = 'CustomRealmPath.path';

        await MetaRealm.openMetaRealm({ metaRealmPath });

        try {
            expect(() => MetaRealm.getSchemaNames(metaRealmPath)).not.toThrowError();
            expect(MetaRealm.getSchemaNames(metaRealmPath)).toEqual([]);
        } catch (err) {
            console.log('SHOULD NOT HAVE REACHED THIS PART OF CODE');
            console.log(err);
        }
    });

    it('Not throw an error when loading a non-existant MetaRealm', async () => {
        const metaRealmPath = 'CustomRealmPath.path';

        await MetaRealm.openMetaRealm({ metaRealmPath });

        const TEST_REALM_PATH: string = 'TEST_REALM_PATH';
        try {
            expect(() => MetaRealm.loadRealm(metaRealmPath, TEST_REALM_PATH)).not.toThrowError();

            const realm = await MetaRealm.loadRealm(metaRealmPath, TEST_REALM_PATH);
            expect(realm).toEqual(new Realm({ path: TEST_REALM_PATH }));
        } catch (err) {
            console.log('SHOULD NOT HAVE REACHED THIS PART OF CODE');
            console.log(err);
        }
    });
});
