jest.mock('realm');
import Realm from 'realm';

describe('Adding new schemas via DynamicRealm', () => {
    it("Should add the new schema json to the 'dynamic' realm schema", () => {
        console.log(Realm);
    });
});
