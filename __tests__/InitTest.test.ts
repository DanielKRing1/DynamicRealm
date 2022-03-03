jest.mock('realm');

import Realm from 'realm';

import { globalRealm } from '../src/Realm/globalRealm';

import MetaRealm from '../src';
import { INIT_ERROR } from '../src/Errors';

describe('GlobalRealm', () => {
    it('Should throw an error and have a null realm before being initialized', async () => {
        expect(() => globalRealm.getRealm()).toThrowError(INIT_ERROR);

        expect(globalRealm.metaRealm_Realm).toBeNull();
    });

    it('Should own a MetaRealm instance after being initialized', async () => {
        const realmPath = 'CustomRealmPath.path';

        await MetaRealm.init({ realmPath });

        expect(globalRealm.getRealm() != null).toBeTruthy();
        expect(globalRealm.getRealm()).toBeInstanceOf(Realm);
    });
});
