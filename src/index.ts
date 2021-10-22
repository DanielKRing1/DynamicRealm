import { saveSchema, saveSchemas, getSchema, getSchemas, rmSchema, rmSchemas } from './Functions/dynamicSchemaOperations';
import { getMetadata, updateMetadata } from './Functions/metadataOperations';
import { init, loadRealm, loadRealmFromSchemas } from './Functions/realmOperations';
import { ARRAY_METADATA_HANDLERS, DICT_METADATA_HANDLERS } from './Metadata/defaultHandlers';

export default {
    init,
    saveSchema,
    saveSchemas,

    getSchema,
    getSchemas,

    rmSchema,
    rmSchemas,

    loadRealm,
    loadRealmFromSchemas,

    getMetadata,
    updateMetadata,

    ARRAY_METADATA_HANDLERS,
    DICT_METADATA_HANDLERS,
};
