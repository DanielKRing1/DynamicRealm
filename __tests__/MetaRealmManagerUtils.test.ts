import fs from 'fs';
import MetaRealmManager from '../src/MetaRealms/metaRealmManager';
import LoadableRealmManager from '../src/LoadableRealms/loadableRealmManager';
import {
    saveSchema,
    updateSchema,
    rmSchema,
    getAllLoadableSchemaRows,
    getLoadableSchemaRow,
    getAllLoadableRealmRows,
    getLoadableRealmRow
} from '../src/MetaRealms';
import { LoadableRealmRow, LoadableRealmRowProperties, LoadableSchemaRowProperties, SaveSchemaParams } from '../src/MetaRealms/types';

const TEST_NAME: string = 'MetaRealmManagerUtils';
const TEST_DIRECTORY: string = `__tests__/${TEST_NAME}`;
const META_REALM_PATH1: string = `${TEST_DIRECTORY}/MetaRealm1.path`;
const META_REALM_PATH2: string = `${TEST_DIRECTORY}/MetaRealm2.path`;
const LOADABLE_REALM_PATH1: string = `LoadableRealm1.path`;
const LOADABLE_REALM_PATH2: string = `LoadableRealm2.path`;

const LOADABLE_SCHEMA_1: Realm.ObjectSchema = {
    name: 'LoadableSchema1',
    primaryKey: 'name',
    properties: {
        name: 'string',
        schema1Data: 'string',
    },
};

const LOADABLE_SCHEMA_2: Realm.ObjectSchema = {
    name: 'LoadableSchema2',
    primaryKey: 'name',
    properties: {
        name: 'string',
        schema2Data: 'string',
    },
};

const LOADABLE_SCHEMA_3: Realm.ObjectSchema = {
    name: 'LoadableSchema3',
    primaryKey: 'name',
    properties: {
        name: 'string',
        schema3Data: 'string',
    },
};

const LOADABLE_SCHEMA_4: Realm.ObjectSchema = {
    name: 'LoadableSchema4',
    primaryKey: 'name',
    properties: {
        name: 'string',
        schema5Data: 'string',
    },
};

const LOADABLE_SCHEMA_5: Realm.ObjectSchema = {
    name: 'LoadableSchema5',
    primaryKey: 'name',
    properties: {
        name: 'string',
        schema5Data: 'string',
    },
};
const LOADABLE_SCHEMA_5_V3: Realm.ObjectSchema = {
    name: 'LoadableSchema5',
    primaryKey: 'name',
    properties: {
        name: 'string',
        changedColumn: 'string',
    },
};
const LOADABLE_SCHEMA_5_V4: Realm.ObjectSchema = {
    name: 'LoadableSchema5',
    primaryKey: 'name',
    properties: {
        name: 'string',
        changedColumn: 'string',
        anotherColumns: 'number',
    },
};

const EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V1: LoadableRealmRowProperties[] = [
    {
        realmPath: LOADABLE_REALM_PATH1,
        schemaNames: [ LOADABLE_SCHEMA_1.name, LOADABLE_SCHEMA_2.name, LOADABLE_SCHEMA_3.name ],
        schemaVersion: 0,
    }
];
const EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V2: LoadableRealmRowProperties[] = [
    {
        realmPath: LOADABLE_REALM_PATH1,
        schemaNames: [ LOADABLE_SCHEMA_1.name, LOADABLE_SCHEMA_2.name, LOADABLE_SCHEMA_3.name ],
        schemaVersion: 1,
    }
];
const EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1: LoadableSchemaRowProperties[] = [
    {
        name: LOADABLE_SCHEMA_1.name,
        schema: JSON.stringify(LOADABLE_SCHEMA_1),
        metadata: '{}',
    },
    {
        name: LOADABLE_SCHEMA_2.name,
        schema: JSON.stringify(LOADABLE_SCHEMA_2),
        metadata: '{}',
    },
    {
        name: LOADABLE_SCHEMA_3.name,
        schema: JSON.stringify(LOADABLE_SCHEMA_3),
        metadata: '{}',
    }
];

const EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1: LoadableSchemaRowProperties[] = [
    {
        name: LOADABLE_SCHEMA_2.name,
        schema: JSON.stringify(LOADABLE_SCHEMA_2),
        metadata: '{}',
    },
    {
        name: LOADABLE_SCHEMA_3.name,
        schema: JSON.stringify(LOADABLE_SCHEMA_3),
        metadata: '{}',
    }
];
const EXPECTED_LOADABLE_REALM_ROWS_MR2_LR1: LoadableRealmRowProperties[] = [
    {
        realmPath: LOADABLE_REALM_PATH1,
        schemaNames: [ LOADABLE_SCHEMA_2.name, LOADABLE_SCHEMA_3.name ],
        schemaVersion: 0,
    }
];

const EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR2: LoadableSchemaRowProperties[] = [
    {
        name: LOADABLE_SCHEMA_4.name,
        schema: JSON.stringify(LOADABLE_SCHEMA_4),
        metadata: '{}',
    },
    {
        name: LOADABLE_SCHEMA_5.name,
        schema: JSON.stringify(LOADABLE_SCHEMA_5),
        metadata: '{}',
    }
];
const EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR2_V3: LoadableSchemaRowProperties[] = [
    {
        name: LOADABLE_SCHEMA_4.name,
        schema: JSON.stringify(LOADABLE_SCHEMA_4),
        metadata: '{}',
    },
    {
        name: LOADABLE_SCHEMA_5.name,
        schema: JSON.stringify(LOADABLE_SCHEMA_5_V3),
        metadata: '{}',
    }
];
const EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR2_V4: LoadableSchemaRowProperties[] = [
    {
        name: LOADABLE_SCHEMA_4.name,
        schema: JSON.stringify(LOADABLE_SCHEMA_4),
        metadata: '{}',
    },
    {
        name: LOADABLE_SCHEMA_5.name,
        schema: JSON.stringify(LOADABLE_SCHEMA_5_V4),
        metadata: '{}',
    }
];
const EXPECTED_LOADABLE_REALM_ROWS_MR2_LR2_V1: LoadableRealmRowProperties[] = [
    {
        realmPath: LOADABLE_REALM_PATH2,
        schemaNames: [ LOADABLE_SCHEMA_4.name, LOADABLE_SCHEMA_5.name ],
        schemaVersion: 0,
    }
];
const EXPECTED_LOADABLE_REALM_ROWS_MR2_LR2_V2: LoadableRealmRowProperties[] = [
    {
        realmPath: LOADABLE_REALM_PATH2,
        schemaNames: [ LOADABLE_SCHEMA_2.name, LOADABLE_SCHEMA_3.name, LOADABLE_SCHEMA_4.name, LOADABLE_SCHEMA_5.name ],
        schemaVersion: 0,
    }
];

const EXPECTED_LOADABLE_REALM_ROWS_MR2_LR2_V3: LoadableRealmRowProperties[] = [
    {
        realmPath: LOADABLE_REALM_PATH2,
        schemaNames: [ LOADABLE_SCHEMA_2.name, LOADABLE_SCHEMA_3.name, LOADABLE_SCHEMA_4.name, LOADABLE_SCHEMA_5.name ],
        schemaVersion: 1,
    }
];
const EXPECTED_LOADABLE_REALM_ROWS_MR2_LR2_V4: LoadableRealmRowProperties[] = [
    {
        realmPath: LOADABLE_REALM_PATH2,
        schemaNames: [ LOADABLE_SCHEMA_2.name, LOADABLE_SCHEMA_3.name, LOADABLE_SCHEMA_4.name, LOADABLE_SCHEMA_5.name ],
        schemaVersion: 2,
    }
];

describe('MetaRealmManager utils', () => {
    beforeAll(() => {
        if (fs.existsSync(TEST_DIRECTORY)) fs.rmSync(TEST_DIRECTORY, { recursive: true });

        fs.mkdirSync(TEST_DIRECTORY);
    });

    // it('Should be usable and return empty arrays, even before saving any LoadableSchemas', async () => {
    //     expect((await getAllLoadableSchemaRows(META_REALM_PATH1)).toJSON()).toEqual([]);
    //     expect(await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH1, schemaName: LOADABLE_SCHEMA_1.name })).toEqual(undefined);
    //     expect((await getAllLoadableRealmRows(META_REALM_PATH1)).toJSON()).toEqual([]);
    //     expect((await getLoadableRealmRow({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1 })).toJSON()).toEqual({"realmPath": "LoadableRealm1.path", "schemaNames": [], "schemaVersion": 0});
    // });

    // it('Should update and rm non-existant schemas without throwing an error', async () => {
    //     expect(async () => await updateSchema({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_1 })).not.toThrowError();
    //     expect(async () => await rmSchema({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1, schemaName: LOADABLE_SCHEMA_1.name })).not.toThrowError();
    // });

    it('Should save and retrieve LoadableSchema1', async () => {
        await saveSchema({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_1 });

        expect((await getAllLoadableSchemaRows(META_REALM_PATH1)).toJSON()).toEqual([ EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1[0] ]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH1, schemaName: LOADABLE_SCHEMA_1.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1[0]);
        expect((await getAllLoadableRealmRows(META_REALM_PATH1)).toJSON()).toEqual([ {...EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V1[0], schemaNames: [EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V1[0].schemaNames[0]] } ]);
        expect((await getLoadableRealmRow({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1 })).toJSON()).toEqual({ ...EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V1[0], schemaNames: [EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V1[0].schemaNames[0]] });
    });

    it('Should delete LoadableSchema1', async () => {
        await rmSchema({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1, schemaName: LOADABLE_SCHEMA_1.name });

        expect((await getAllLoadableSchemaRows(META_REALM_PATH1)).toJSON()).toEqual([]);
        expect(await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH1, schemaName: LOADABLE_SCHEMA_1.name })).toEqual(undefined);
        expect((await getAllLoadableRealmRows(META_REALM_PATH1)).toJSON()).toEqual([{ ...EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V2[0], schemaNames: [] }]);
        expect((await getLoadableRealmRow({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1 })).toJSON()).toEqual({ ...EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V2[0], schemaNames: [] });
    });

    it('Should save and retrieve LoadableSchema1 again', async () => {
        await saveSchema({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_1 });

        expect((await getAllLoadableSchemaRows(META_REALM_PATH1)).toJSON()).toEqual([ EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1[0] ]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH1, schemaName: LOADABLE_SCHEMA_1.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1[0]);
        expect((await getAllLoadableRealmRows(META_REALM_PATH1)).toJSON()).toEqual([ {...EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V2[0], schemaNames: [EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V2[0].schemaNames[0]] } ]);
        expect((await getLoadableRealmRow({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1 })).toJSON()).toEqual({ ...EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V2[0], schemaNames: [EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V2[0].schemaNames[0]] });
    });

    it('Should not have saved LoadableSchema2 or LoadableSchema3 yet, and should return undefined for both', async () => {
        expect(await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH1, schemaName: LOADABLE_SCHEMA_2.name })).toEqual(undefined);
        expect(await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH1, schemaName: LOADABLE_SCHEMA_3.name })).toEqual(undefined);
    });

    it('Should also save and retrieve LoadableSchema2 and LoadableSchema3', async () => {
        await saveSchema({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_2 });
        await saveSchema({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_3 });

        expect((await getAllLoadableSchemaRows(META_REALM_PATH1)).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH1, schemaName: LOADABLE_SCHEMA_1.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1[0]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH1, schemaName: LOADABLE_SCHEMA_2.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1[1]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH1, schemaName: LOADABLE_SCHEMA_3.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1[2]);
        expect((await getAllLoadableRealmRows(META_REALM_PATH1)).toJSON()).toEqual(EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V2);
        expect((await getLoadableRealmRow({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1 })).toJSON()).toEqual(EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V2[0]);
    });

    it('Should save and retrieve LoadableSchema2 and LoadableSchema3 again without errors', async () => {
        await saveSchema({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_2 });
        await saveSchema({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_3 });

        expect((await getAllLoadableSchemaRows(META_REALM_PATH1)).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH1, schemaName: LOADABLE_SCHEMA_1.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1[0]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH1, schemaName: LOADABLE_SCHEMA_2.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1[1]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH1, schemaName: LOADABLE_SCHEMA_3.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1[2]);
        expect((await getAllLoadableRealmRows(META_REALM_PATH1)).toJSON()).toEqual(EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V2);
        expect((await getLoadableRealmRow({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1 })).toJSON()).toEqual(EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V2[0]);
    });

    // METAREALM2.LOADABLEREALM1
    it('Should save and retrieve LoadableSchema2 and LoadableSchema3 to MetaRealm2.LoadableRealm1', async () => {
        await saveSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_2 });
        await saveSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH1, schema: LOADABLE_SCHEMA_3 });

        expect((await getAllLoadableSchemaRows(META_REALM_PATH2)).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1);
        expect(await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_1.name })).toEqual(undefined);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_2.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1[0]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_3.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1[1]);
        expect((await getAllLoadableRealmRows(META_REALM_PATH2)).toJSON()).toEqual(EXPECTED_LOADABLE_REALM_ROWS_MR2_LR1);
        expect((await getLoadableRealmRow({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH1 })).toJSON()).toEqual(EXPECTED_LOADABLE_REALM_ROWS_MR2_LR1[0]);
    });

    it('Should still retrieve MetaRealm1.LoadableRealm1 LoadableSchemas 1-3 and LoadableSchema3 without errors', async () => {
        expect((await getAllLoadableSchemaRows(META_REALM_PATH1)).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH1, schemaName: LOADABLE_SCHEMA_1.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1[0]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH1, schemaName: LOADABLE_SCHEMA_2.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1[1]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH1, schemaName: LOADABLE_SCHEMA_3.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR1_LR1[2]);
        expect((await getAllLoadableRealmRows(META_REALM_PATH1)).toJSON()).toEqual(EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V2);
        expect((await getLoadableRealmRow({ metaRealmPath: META_REALM_PATH1, loadableRealmPath: LOADABLE_REALM_PATH1 })).toJSON()).toEqual(EXPECTED_LOADABLE_REALM_ROWS_MR1_LR1_V2[0]);
    });

    // METAREALM2.LOADABLEREALM2
    it('Should save and retrieve LoadableSchema4 and LoadableSchema5 to MetaRealm2.LoadableRealm2', async () => {
        await saveSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH2, schema: LOADABLE_SCHEMA_4 });
        await saveSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH2, schema: LOADABLE_SCHEMA_5 });

        expect((await getAllLoadableSchemaRows(META_REALM_PATH2)).toJSON()).toEqual([ ...EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1, ...EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR2 ]);
        expect(await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_1.name })).toEqual(undefined);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_2.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1[0]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_3.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1[1]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_4.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR2[0]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_5.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR2[1]);

        expect((await getAllLoadableRealmRows(META_REALM_PATH2)).toJSON()).toEqual([ ...EXPECTED_LOADABLE_REALM_ROWS_MR2_LR1, ...EXPECTED_LOADABLE_REALM_ROWS_MR2_LR2_V1 ]);
        expect((await getLoadableRealmRow({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH2 })).toJSON()).toEqual(EXPECTED_LOADABLE_REALM_ROWS_MR2_LR2_V1[0]);
    });

    // TODO WHAT SHOULD HAPPEN? SHOULD THIS OVERWRITE THE EXISTING SCHEMA?? NAHHH...
    it('Should save and retrieve LoadableSchema2 and LoadableSchema3 to MetaRealm2.LoadableRealm2', async () => {
        await saveSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH2, schema: LOADABLE_SCHEMA_2 });
        await saveSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH2, schema: LOADABLE_SCHEMA_3 });

        expect((await getAllLoadableSchemaRows(META_REALM_PATH2)).toJSON()).toEqual([ ...EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1, ...EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR2 ]);
        expect(await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_1.name })).toEqual(undefined);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_2.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1[0]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_3.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1[1]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_4.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR2[0]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_5.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR2[1]);

        expect((await getAllLoadableRealmRows(META_REALM_PATH2)).toJSON()).toEqual([ ...EXPECTED_LOADABLE_REALM_ROWS_MR2_LR1, ...EXPECTED_LOADABLE_REALM_ROWS_MR2_LR2_V2 ]);
        expect((await getLoadableRealmRow({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH2 })).toJSON()).toEqual(EXPECTED_LOADABLE_REALM_ROWS_MR2_LR2_V2[0]);
    });

    it('Should update LoadableSchema5 in MetaRealm2.LoadableRealm2 and update the LoadableRealm schemaVersion and not affect the other row properties or the other LoadabeSchemas', async () => {
        await updateSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH2, schema: LOADABLE_SCHEMA_5_V3 });

        expect((await getAllLoadableSchemaRows(META_REALM_PATH2)).toJSON()).toEqual([ ...EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1, ...EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR2_V3 ]);
        expect(await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_1.name })).toEqual(undefined);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_2.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1[0]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_3.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1[1]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_4.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR2_V3[0]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_5.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR2_V3[1]);

        expect((await getAllLoadableRealmRows(META_REALM_PATH2)).toJSON()).toEqual([ ...EXPECTED_LOADABLE_REALM_ROWS_MR2_LR1, ...EXPECTED_LOADABLE_REALM_ROWS_MR2_LR2_V3 ]);
        expect((await getLoadableRealmRow({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH2 })).toJSON()).toEqual(EXPECTED_LOADABLE_REALM_ROWS_MR2_LR2_V3[0]);
    });

    it('Should update LoadableSchema5 in MetaRealm2.LoadableRealm2 and update the LoadableRealm schemaVersion and not affect the other row properties or the other LoadabeSchemas', async () => {
        await updateSchema({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH2, schema: LOADABLE_SCHEMA_5_V4 });

        expect((await getAllLoadableSchemaRows(META_REALM_PATH2)).toJSON()).toEqual([ ...EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1, ...EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR2_V4 ]);
        expect(await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_1.name })).toEqual(undefined);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_2.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1[0]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_3.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR1[1]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_4.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR2_V4[0]);
        expect((await getLoadableSchemaRow({ metaRealmPath: META_REALM_PATH2, schemaName: LOADABLE_SCHEMA_5.name })).toJSON()).toEqual(EXPECTED_LOADABLE_SCHEMA_ROWS_MR2_LR2_V4[1]);

        expect((await getAllLoadableRealmRows(META_REALM_PATH2)).toJSON()).toEqual([ ...EXPECTED_LOADABLE_REALM_ROWS_MR2_LR1, ...EXPECTED_LOADABLE_REALM_ROWS_MR2_LR2_V4 ]);
        expect((await getLoadableRealmRow({ metaRealmPath: META_REALM_PATH2, loadableRealmPath: LOADABLE_REALM_PATH2 })).toJSON()).toEqual(EXPECTED_LOADABLE_REALM_ROWS_MR2_LR2_V4[0]);
    });

    afterAll(async () => {
        await MetaRealmManager.closeAll();
        await LoadableRealmManager.closeAll();
    });      
});
