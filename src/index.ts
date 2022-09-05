import { saveSchema, rmSchema, updateSchema } from './MetaRealms';
import LoadableRealmManager from './LoadableRealms/loadableRealmManager';
import { getLoadableRealmPaths, getProperties, getSchemaNames } from './UiUtils';

export * from './MetaRealms/types';
export * from './types/types';

export default {
    saveSchema,
    updateSchema,
    rmSchema,

    ...LoadableRealmManager,

    getLoadableRealmPaths,
    getSchemaNames,
    getProperties,
};
