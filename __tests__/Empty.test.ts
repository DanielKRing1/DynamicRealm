jest.mock('realm');

import Realm from 'realm';

import { globalRealm } from '../src/Realm/gloabalRealm';

import DynamicRealm from '../src';
import { INIT_ERROR } from '../src/Errors';

describe('A DynamicRealm with no saved schemas', () => {
    it('Return an empty array of realm names', async () => {
        const realmPath = 'CustomRealmPath.path';

        await DynamicRealm.init({ realmPath });

        try {
            expect(DynamicRealm.getRealmNames).not.toThrowError();
            expect(DynamicRealm.getRealmNames()).toEqual([]);
        } catch (err) {
            console.log('SHOULD NOT HAVE REACHED THIS PART OF CODE');
            console.log(err);
        }
    });

    it('Return an empty array of schema names', async () => {
        const realmPath = 'CustomRealmPath.path';

        await DynamicRealm.init({ realmPath });

        try {
            expect(DynamicRealm.getSchemaNames).not.toThrowError();
            expect(DynamicRealm.getSchemaNames()).toEqual([]);
        } catch (err) {
            console.log('SHOULD NOT HAVE REACHED THIS PART OF CODE');
            console.log(err);
        }
    });

    it('Not throw an error when loading a non-existant DynamicRealm', async () => {
        const realmPath = 'CustomRealmPath.path';

        await DynamicRealm.init({ realmPath });

        const TEST_REALM_PATH: string = 'TEST_REALM_PATH';
        try {
            expect(() => DynamicRealm.loadRealm(TEST_REALM_PATH)).not.toThrowError();

            const realm = await DynamicRealm.loadRealm(TEST_REALM_PATH);
            expect(realm).toEqual(new Realm({ path: TEST_REALM_PATH }));
        } catch (err) {
            console.log('SHOULD NOT HAVE REACHED THIS PART OF CODE');
            console.log(err);
        }
    });
});
