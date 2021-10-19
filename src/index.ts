import Realm from 'realm';
import { saveSchema, getSchema, getSchemas, rmSchema, rmSchemas } from './Functions/dynamicSchemaOperations';
import { updateMetadata } from './Functions/metadataOperations';
import { init, loadRealm, loadRealmFromSchemas } from './Functions/realmOperations';
import { ARRAY_METADATA_HANDLERS, DICT_METADATA_HANDLERS } from './Metadata/defaultHandlers';

export default {
    init,
    saveSchema,

    getSchema,
    getSchemas,

    rmSchema,
    rmSchemas,

    loadRealm,
    loadRealmFromSchemas,

    updateMetadata,

    ARRAY_METADATA_HANDLERS,
    DICT_METADATA_HANDLERS,
};
