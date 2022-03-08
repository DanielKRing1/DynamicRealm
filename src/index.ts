import { saveSchema, saveSchemas, getSchema, getSchemas, rmSchema, rmSchemas } from './Functions/metaSchemaOperations';
import { getMetadata, updateMetadata } from './Functions/metadataOperations';
import { openMetaRealm, isInitialized, loadRealm, loadRealmFromSchemas } from './Functions/realmOperations';
import { getRealmNames, getSchemaNames, getProperties } from './Functions/uiUtils';
import { ARRAY_METADATA_HANDLERS, DICT_METADATA_HANDLERS } from './Metadata/defaultHandlers';

export * from './Functions/types/types';
export * from './Metadata/types/types';
export * from './Schemas/types/types';
export * from './types/types';

export default {
    openMetaRealm,
    isInitialized,
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

    getRealmNames,
    getSchemaNames,
    getProperties,

    ARRAY_METADATA_HANDLERS,
    DICT_METADATA_HANDLERS,
};
