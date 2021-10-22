jest.mock('realm');

import Realm from 'realm';

import DynamicRealm from '../src';
import { MetadataType } from '../src/Functions/dynamicSchemaOperations';

const REALM_PATH_1 = 'RealmPath1.path';

const REALM_NAME_1 = 'Realm1';

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
    metadataType: MetadataType.List,
};

// METADATA

const SCHEMA_1_METADATA_1_KEY = 'entry1';
const SCHEMA_1_METADATA_1 = {
    entry: 'Schema1 Metadata1',
    timestamp: Date.now(),
};
const SCHEMA_1_METADATA_2_KEY = 'entry2';
const SCHEMA_1_METADATA_2 = {
    entry: 'Schema1 Metadata2',
    timestamp: Date.now(),
};
const SCHEMA_1_METADATA_3_KEY = 'entry3';
const SCHEMA_1_METADATA_3 = {
    entry: 'Schema1 Metadata3',
    timestamp: Date.now(),
};

const SCHEMA_2_METADATA_1 = 'Schema2 Metadata1';
const SCHEMA_2_METADATA_2 = 'Schema2 Metadata2';
const SCHEMA_2_METADATA_3 = 'Schema2 Metadata3';

describe('Metadata', () => {
    it('Should be addable as an object', async () => {
        const realmPath = 'CustomRealmPath.path';

        await DynamicRealm.init({ realmPath });

        DynamicRealm.saveSchemas([SCHEMA_PARAMS_1, SCHEMA_PARAMS_2]);

        let allMetadata: Object;

        allMetadata = DynamicRealm.updateMetadata<Object>(SCHEMA_1.name, (allMetadata: Object) => {
            allMetadata[SCHEMA_1_METADATA_1_KEY] = SCHEMA_1_METADATA_1;
            allMetadata[SCHEMA_1_METADATA_2_KEY] = SCHEMA_1_METADATA_2;
            return allMetadata;
        });

        // 1. Add first 2 metadata entries
        expect(allMetadata).toEqual({
            [SCHEMA_1_METADATA_1_KEY]: SCHEMA_1_METADATA_1,
            [SCHEMA_1_METADATA_2_KEY]: SCHEMA_1_METADATA_2,
        });
        expect(DynamicRealm.getMetadata(SCHEMA_1.name)).toEqual({
            [SCHEMA_1_METADATA_1_KEY]: SCHEMA_1_METADATA_1,
            [SCHEMA_1_METADATA_2_KEY]: SCHEMA_1_METADATA_2,
        });

        // 2. Add 3rd metadata entry
        allMetadata = DynamicRealm.updateMetadata<Object>(SCHEMA_1.name, (allMetadata: Object) => {
            allMetadata[SCHEMA_1_METADATA_3_KEY] = SCHEMA_1_METADATA_3;
            return allMetadata;
        });

        expect(allMetadata).toEqual({
            [SCHEMA_1_METADATA_1_KEY]: SCHEMA_1_METADATA_1,
            [SCHEMA_1_METADATA_2_KEY]: SCHEMA_1_METADATA_2,
            [SCHEMA_1_METADATA_3_KEY]: SCHEMA_1_METADATA_3,
        });
        expect(DynamicRealm.getMetadata(SCHEMA_1.name)).toEqual({
            [SCHEMA_1_METADATA_1_KEY]: SCHEMA_1_METADATA_1,
            [SCHEMA_1_METADATA_2_KEY]: SCHEMA_1_METADATA_2,
            [SCHEMA_1_METADATA_3_KEY]: SCHEMA_1_METADATA_3,
        });

        expect(DynamicRealm.getMetadata(SCHEMA_2.name)).toEqual([]);
    });

    it('Should be addable as an array', async () => {
        const realmPath = 'CustomRealmPath.path';

        await DynamicRealm.init({ realmPath });

        DynamicRealm.saveSchemas([SCHEMA_PARAMS_1, SCHEMA_PARAMS_2]);

        let allMetadata: any[];

        allMetadata = DynamicRealm.updateMetadata<any[]>(SCHEMA_2.name, (allMetadata: any[]) => {
            allMetadata.push(SCHEMA_2_METADATA_1);
            allMetadata.push(SCHEMA_2_METADATA_2);
            return allMetadata;
        });

        // 1. Add first 2 metadata entries
        expect(allMetadata).toEqual([SCHEMA_2_METADATA_1, SCHEMA_2_METADATA_2]);
        expect(DynamicRealm.getMetadata(SCHEMA_2.name)).toEqual([SCHEMA_2_METADATA_1, SCHEMA_2_METADATA_2]);

        // 2. Add 3rd metadata entry
        allMetadata = DynamicRealm.updateMetadata<any[]>(SCHEMA_2.name, (allMetadata: any[]) => {
            allMetadata.push(SCHEMA_2_METADATA_3);
            return allMetadata;
        });

        expect(allMetadata).toEqual([SCHEMA_2_METADATA_1, SCHEMA_2_METADATA_2, SCHEMA_2_METADATA_3]);
        expect(DynamicRealm.getMetadata(SCHEMA_2.name)).toEqual([SCHEMA_2_METADATA_1, SCHEMA_2_METADATA_2, SCHEMA_2_METADATA_3]);

        expect(DynamicRealm.getMetadata(SCHEMA_1.name)).toEqual({});
    });
});
