jest.mock('realm');

import MetaRealm, { SaveSchemaParams } from '../src';
import { globalRealm } from '../src/Realm/globalRealm';

const REALM_PATH_1 = 'RealmPath1.path';
const REALM_PATH_2 = 'RealmPath2.path';

const SCHEMA_1: Realm.ObjectSchema = {
    name: 'Schema1',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'string',
    },
};
const SCHEMA_PARAMS_1: SaveSchemaParams = {
    realmPath: REALM_PATH_1,
    schema: SCHEMA_1,
};
const SCHEMA_1_EXPECTED_ROW = {
    name: SCHEMA_1.name,
    schema: JSON.stringify(SCHEMA_1),
    metadata: '{}',
};

const SCHEMA_2: Realm.ObjectSchema = {
    name: 'Schema2',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'int',
    },
};
const SCHEMA_PARAMS_2: SaveSchemaParams = {
    realmPath: REALM_PATH_1,
    schema: SCHEMA_2,
};
const SCHEMA_2_EXPECTED_ROW = {
    name: SCHEMA_2.name,
    schema: JSON.stringify(SCHEMA_2),
    metadata: '{}',
};

const SCHEMA_3: Realm.ObjectSchema = {
    name: 'Schema3',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'float',
    },
};
const SCHEMA_PARAMS_3: SaveSchemaParams = {
    realmPath: REALM_PATH_1,
    schema: SCHEMA_3,
};
const SCHEMA_3_EXPECTED_ROW = {
    name: SCHEMA_3.name,
    schema: JSON.stringify(SCHEMA_3),
    metadata: '{}',
};

const SCHEMA_4: Realm.ObjectSchema = {
    name: 'Schema4',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'int',
    },
};
const SCHEMA_PARAMS_4: SaveSchemaParams = {
    realmPath: REALM_PATH_2,
    schema: SCHEMA_4,
};
const SCHEMA_4_EXPECTED_ROW = {
    name: SCHEMA_4.name,
    schema: JSON.stringify(SCHEMA_4),
    metadata: '{}',
};

const SCHEMA_5: Realm.ObjectSchema = {
    name: 'Schema5',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'double',
    },
};
const SCHEMA_PARAMS_5: SaveSchemaParams = {
    realmPath: REALM_PATH_2,
    schema: SCHEMA_5,
};
const SCHEMA_5_EXPECTED_ROW = {
    name: SCHEMA_5.name,
    schema: JSON.stringify(SCHEMA_5),
    metadata: '{}',
};

const SCHEMA_6: Realm.ObjectSchema = {
    name: 'Schema6',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'date',
    },
};
const SCHEMA_PARAMS_6: SaveSchemaParams = {
    realmPath: REALM_PATH_2,
    schema: SCHEMA_6,
};
const SCHEMA_6_EXPECTED_ROW = {
    name: SCHEMA_6.name,
    schema: JSON.stringify(SCHEMA_6),
    metadata: '{}',
};

describe('Getting schemas via MetaRealm before adding any schemas', () => {
    beforeAll(() => {
        const realmPath = 'CustomRealmPath.path';

        MetaRealm.init({ realmPath });
    });

    it('Should return an empty array', () => {
        // Tests
        expect(MetaRealm.getSchema(SCHEMA_1.name)).toEqual(undefined);
        expect(MetaRealm.getSchemas()).toEqual([]);
    });
});

describe('Adding duplicate rows', () => {
    beforeAll(() => {
        const realmPath = 'CustomRealmPath.path';

        MetaRealm.init({ realmPath });
    });

    it('Should not create duplicate rows in the realm', () => {
        MetaRealm.saveSchema(SCHEMA_PARAMS_1);
        MetaRealm.saveSchema(SCHEMA_PARAMS_1);
        MetaRealm.saveSchema(SCHEMA_PARAMS_1);

        // Tests
        expect(MetaRealm.getSchema(SCHEMA_1.name)).toEqual(SCHEMA_1);
    });
});

describe('Querying for non-existant schemas', () => {
    beforeAll(() => {
        const realmPath = 'CustomRealmPath.path';

        MetaRealm.init({ realmPath });
    });

    it('Should return an empty array', () => {
        MetaRealm.saveSchema(SCHEMA_PARAMS_1);
        MetaRealm.saveSchema(SCHEMA_PARAMS_1);
        MetaRealm.saveSchema(SCHEMA_PARAMS_1);

        // Tests
        expect(MetaRealm.getSchemas([SCHEMA_1.name, SCHEMA_2.name])).toEqual([SCHEMA_1]);
        expect(MetaRealm.getSchemas([SCHEMA_2.name])).toEqual([]);
    });
});

describe('Adding new schemas via MetaRealm', () => {
    beforeAll(() => {
        const realmPath = 'CustomRealmPath.path';

        MetaRealm.init({ realmPath });
    });

    it("Should allow users to 'get' the new schema json from the 'dynamic' realm schema", () => {
        MetaRealm.saveSchema(SCHEMA_PARAMS_1);
        MetaRealm.saveSchema(SCHEMA_PARAMS_2);
        MetaRealm.saveSchema(SCHEMA_PARAMS_3);

        // Tests
        expect(MetaRealm.getSchema(SCHEMA_1.name)).toEqual(SCHEMA_1);
        expect(MetaRealm.getSchemas()).toEqual([SCHEMA_1, SCHEMA_2, SCHEMA_3]);
        expect(MetaRealm.getSchemas([SCHEMA_1.name, SCHEMA_2.name])).toEqual([SCHEMA_1, SCHEMA_2]);
        expect(MetaRealm.getSchemas([SCHEMA_1.name, SCHEMA_2.name, SCHEMA_3.name])).toEqual([SCHEMA_1, SCHEMA_2, SCHEMA_3]);
        expect(MetaRealm.getSchemas([SCHEMA_1.name, SCHEMA_2.name, SCHEMA_4.name, SCHEMA_6.name])).toEqual([SCHEMA_1, SCHEMA_2]);

        MetaRealm.saveSchema(SCHEMA_PARAMS_4);
        MetaRealm.saveSchema(SCHEMA_PARAMS_5);
        MetaRealm.saveSchema(SCHEMA_PARAMS_6);

        // Tests
        expect(MetaRealm.getSchema(SCHEMA_1.name)).toEqual(SCHEMA_1);
        expect(MetaRealm.getSchemas()).toEqual([SCHEMA_1, SCHEMA_2, SCHEMA_3, SCHEMA_4, SCHEMA_5, SCHEMA_6]);
        expect(MetaRealm.getSchemas([SCHEMA_1.name, SCHEMA_2.name, SCHEMA_4.name, SCHEMA_6.name])).toEqual([SCHEMA_1, SCHEMA_2, SCHEMA_4, SCHEMA_6]);
        expect(MetaRealm.getSchemas([SCHEMA_1.name, SCHEMA_2.name, SCHEMA_3.name, SCHEMA_4.name, SCHEMA_5.name, SCHEMA_6.name])).toEqual([
            SCHEMA_1,
            SCHEMA_2,
            SCHEMA_3,
            SCHEMA_4,
            SCHEMA_5,
            SCHEMA_6,
        ]);

        console.log(globalRealm.getRealm());
    });
});
