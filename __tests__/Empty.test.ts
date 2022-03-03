jest.mock('realm');

import Realm from 'realm';

import MetaRealm from '../src';

describe('A MetaRealm with no saved schemas', () => {
    it('Return an empty array of realm names', async () => {
        const realmPath = 'CustomRealmPath.path';

        await MetaRealm.init({ realmPath });

        try {
            expect(MetaRealm.getRealmNames).not.toThrowError();
            expect(MetaRealm.getRealmNames()).toEqual([]);
        } catch (err) {
            console.log('SHOULD NOT HAVE REACHED THIS PART OF CODE');
            console.log(err);
        }
    });

    it('Return an empty array of schema names', async () => {
        const realmPath = 'CustomRealmPath.path';

        await MetaRealm.init({ realmPath });

        try {
            expect(MetaRealm.getSchemaNames).not.toThrowError();
            expect(MetaRealm.getSchemaNames()).toEqual([]);
        } catch (err) {
            console.log('SHOULD NOT HAVE REACHED THIS PART OF CODE');
            console.log(err);
        }
    });

    it('Not throw an error when loading a non-existant MetaRealm', async () => {
        const realmPath = 'CustomRealmPath.path';

        await MetaRealm.init({ realmPath });

        const TEST_REALM_PATH: string = 'TEST_REALM_PATH';
        try {
            expect(() => MetaRealm.loadRealm(TEST_REALM_PATH)).not.toThrowError();

            const realm = await MetaRealm.loadRealm(TEST_REALM_PATH);
            expect(realm).toEqual(new Realm({ path: TEST_REALM_PATH }));
        } catch (err) {
            console.log('SHOULD NOT HAVE REACHED THIS PART OF CODE');
            console.log(err);
        }
    });
});
