jest.mock('realm');

import DynamicRealm from '../src';

const REALM_NAME_1 = 'Realm1';
const REALM_NAME_2 = 'Realm2';
const REALM_NAME_3 = 'Realm3';

const REALM_PATH_1 = 'RealmPath1.path';
const REALM_PATH_2 = 'RealmPath1.path';

const SCHEMA_1: Realm.ObjectSchema = {
    name: 'Schema1',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'string',
    },
};
const SCHEMA_PARAMS_1: SaveSchemaParams = {
    realmName: REALM_NAME_1,
    realmPath: REALM_PATH_1,
    schema: SCHEMA_1,
};
const SCHEMA_1_EXPECTED_ROW = {
    name: SCHEMA_1.name,
    primaryKey: SCHEMA_1.primaryKey,
    realmName: SCHEMA_PARAMS_1.realmName,
    schema: JSON.stringify(SCHEMA_1),
    metadata: '',
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
    realmName: REALM_NAME_1,
    realmPath: REALM_PATH_1,
    schema: SCHEMA_2,
};
const SCHEMA_2_EXPECTED_ROW = {
    name: SCHEMA_2.name,
    primaryKey: SCHEMA_2.primaryKey,
    realmName: SCHEMA_PARAMS_2.realmName,
    schema: JSON.stringify(SCHEMA_2),
    metadata: '',
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
    realmName: REALM_NAME_1,
    realmPath: REALM_PATH_1,
    schema: SCHEMA_3,
};
const SCHEMA_3_EXPECTED_ROW = {
    name: SCHEMA_3.name,
    primaryKey: SCHEMA_3.primaryKey,
    realmName: SCHEMA_PARAMS_3.realmName,
    schema: JSON.stringify(SCHEMA_3),
    metadata: '',
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
    realmName: REALM_NAME_2,
    realmPath: REALM_PATH_2,
    schema: SCHEMA_4,
};
const SCHEMA_4_EXPECTED_ROW = {
    name: SCHEMA_4.name,
    primaryKey: SCHEMA_4.primaryKey,
    realmName: SCHEMA_PARAMS_4.realmName,
    schema: JSON.stringify(SCHEMA_4),
    metadata: '',
};

const REALM_NAME_SCHEMA_5 = REALM_NAME_2;
const SCHEMA_5: Realm.ObjectSchema = {
    name: 'Schema5',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'double',
    },
};
const SCHEMA_PARAMS_5: SaveSchemaParams = {
    realmName: REALM_NAME_2,
    realmPath: REALM_PATH_2,
    schema: SCHEMA_5,
};
const SCHEMA_5_EXPECTED_ROW = {
    name: SCHEMA_5.name,
    primaryKey: SCHEMA_5.primaryKey,
    realmName: SCHEMA_PARAMS_5.realmName,
    schema: JSON.stringify(SCHEMA_5),
    metadata: '',
};

const REALM_NAME_SCHEMA_6 = REALM_NAME_3;
const SCHEMA_6: Realm.ObjectSchema = {
    name: 'Schema6',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'date',
    },
};
const SCHEMA_PARAMS_6: SaveSchemaParams = {
    realmName: REALM_NAME_2,
    realmPath: REALM_PATH_2,
    schema: SCHEMA_6,
};
const SCHEMA_6_EXPECTED_ROW = {
    name: SCHEMA_6.name,
    primaryKey: SCHEMA_6.primaryKey,
    realmName: SCHEMA_PARAMS_6.realmName,
    schema: JSON.stringify(SCHEMA_6),
    metadata: '',
};

describe('Getting schemas via DynamicRealm before adding any schemas', () => {
    beforeAll(() => {
        const realmPath = 'CustomRealmPath.path';

        DynamicRealm.init({ realmPath });
    });

    it('Should return an empty array', () => {
        // Tests
        expect(DynamicRealm.getSchema(SCHEMA_1.name)).toEqual(undefined);
        expect(DynamicRealm.getSchemas()).toEqual([]);
    });
});

describe('Adding duplicate rows', () => {
    beforeAll(() => {
        const realmPath = 'CustomRealmPath.path';

        DynamicRealm.init({ realmPath });
    });

    it('Should not create duplicate rows in the realm', () => {
        DynamicRealm.saveSchema(SCHEMA_PARAMS_1);
        DynamicRealm.saveSchema(SCHEMA_PARAMS_1);
        DynamicRealm.saveSchema(SCHEMA_PARAMS_1);

        // Tests
        expect(DynamicRealm.getSchema(SCHEMA_1.name)).toEqual(SCHEMA_1_EXPECTED_ROW);
    });
});

describe('Querying for non-existant schemas', () => {
    beforeAll(() => {
        const realmPath = 'CustomRealmPath.path';

        DynamicRealm.init({ realmPath });
    });

    it('Should return an empty array', () => {
        DynamicRealm.saveSchema(SCHEMA_PARAMS_1);
        DynamicRealm.saveSchema(SCHEMA_PARAMS_1);
        DynamicRealm.saveSchema(SCHEMA_PARAMS_1);

        // Tests
        expect(DynamicRealm.getSchemas([SCHEMA_1.name, SCHEMA_2.name])).toEqual([SCHEMA_1_EXPECTED_ROW]);
        expect(DynamicRealm.getSchemas([SCHEMA_2.name])).toEqual([]);
    });
});

describe('Adding new schemas via DynamicRealm', () => {
    beforeAll(() => {
        const realmPath = 'CustomRealmPath.path';

        DynamicRealm.init({ realmPath });
    });

    it("Should allow users to 'get' the new schema json from the 'dynamic' realm schema", () => {
        DynamicRealm.saveSchema(SCHEMA_PARAMS_1);
        DynamicRealm.saveSchema(SCHEMA_PARAMS_2);
        DynamicRealm.saveSchema(SCHEMA_PARAMS_3);

        // Tests
        expect(DynamicRealm.getSchema(SCHEMA_1.name)).toEqual(SCHEMA_1_EXPECTED_ROW);
        expect(DynamicRealm.getSchemas()).toEqual([SCHEMA_1_EXPECTED_ROW, SCHEMA_2_EXPECTED_ROW, SCHEMA_3_EXPECTED_ROW]);
        expect(DynamicRealm.getSchemas([SCHEMA_1.name, SCHEMA_2.name])).toEqual([SCHEMA_1_EXPECTED_ROW, SCHEMA_2_EXPECTED_ROW]);
        expect(DynamicRealm.getSchemas([SCHEMA_1.name, SCHEMA_2.name, SCHEMA_3.name])).toEqual([SCHEMA_1_EXPECTED_ROW, SCHEMA_2_EXPECTED_ROW, SCHEMA_3_EXPECTED_ROW]);
        expect(DynamicRealm.getSchemas([SCHEMA_1.name, SCHEMA_2.name, SCHEMA_4.name, SCHEMA_6.name])).toEqual([SCHEMA_1_EXPECTED_ROW, SCHEMA_2_EXPECTED_ROW]);

        DynamicRealm.saveSchema(SCHEMA_PARAMS_4);
        DynamicRealm.saveSchema(SCHEMA_PARAMS_5);
        DynamicRealm.saveSchema(SCHEMA_PARAMS_6);

        // Tests
        expect(DynamicRealm.getSchema(SCHEMA_1.name)).toEqual(SCHEMA_1_EXPECTED_ROW);
        expect(DynamicRealm.getSchemas()).toEqual([SCHEMA_1_EXPECTED_ROW, SCHEMA_2_EXPECTED_ROW, SCHEMA_3_EXPECTED_ROW, SCHEMA_4_EXPECTED_ROW, SCHEMA_5_EXPECTED_ROW, SCHEMA_6_EXPECTED_ROW]);
        expect(DynamicRealm.getSchemas([SCHEMA_1.name, SCHEMA_2.name, SCHEMA_4.name, SCHEMA_6.name])).toEqual([
            SCHEMA_1_EXPECTED_ROW,
            SCHEMA_2_EXPECTED_ROW,
            SCHEMA_4_EXPECTED_ROW,
            SCHEMA_6_EXPECTED_ROW,
        ]);
        expect(DynamicRealm.getSchemas([SCHEMA_1.name, SCHEMA_2.name, SCHEMA_3.name, SCHEMA_4.name, SCHEMA_5.name, SCHEMA_6.name])).toEqual([
            SCHEMA_1_EXPECTED_ROW,
            SCHEMA_2_EXPECTED_ROW,
            SCHEMA_3_EXPECTED_ROW,
            SCHEMA_4_EXPECTED_ROW,
            SCHEMA_5_EXPECTED_ROW,
            SCHEMA_6_EXPECTED_ROW,
        ]);
    });
});
