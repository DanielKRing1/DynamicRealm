jest.mock('realm');

import DynamicRealm from '../src';

describe('Adding new schemas via DynamicRealm', () => {
    it("Should add the new schema json to the 'dynamic' realm schema", () => {
        const realmPath = 'CustomRealmPath.path';

        DynamicRealm.init({ realmPath });
    });
});
