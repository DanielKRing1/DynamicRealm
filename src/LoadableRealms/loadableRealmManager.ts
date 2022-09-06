import Realm from 'realm';

import { Dict } from "..";
import { _write } from '../MetaRealms';
import MetaRealmManager from '../MetaRealms/metaRealmManager';
import { LoadableRealmParams, LoadableRealmRow, LoadableRealmRowProperties, LoadableSchemaRow, LoadableSchemaRowProperties, UpdateSchemaParams } from '../MetaRealms/types';
import { LoadableRealm, LoadableSchema, LOADABLE_REALM_TABLE_NAME, LOADABLE_SCHEMA_TABLE_NAME } from '../StaticSchemas';

function createLoadableRealmsManager() {
    const loadedRealmsMap: Dict<Realm> = {};

    /**
     * Get an existing LoadableRealm or
     * Open a new LoadableRealm if one does not exist or it is closed
     * 
     * @param loadableRealmPath 
     * @returns 
     */
    const loadRealm = async ({ metaRealmPath, loadableRealmPath }: LoadableRealmParams): Promise<Realm> => {
        const fullLoadableRealmPath: string = genFullLoadableRealmPath({ metaRealmPath, loadableRealmPath });

        // 1. Open Realm if not exists or is closed
        if(!hasOpenLoadableRealm({ metaRealmPath, loadableRealmPath })) {

            const metaRealm: Realm = MetaRealmManager.getMetaRealm(metaRealmPath);

            let loadableRealmRow: LoadableRealmRow;
            let loadableRealmSchemaVersion: number;
            let loadableSchemaNames: string[];
            try {
                loadableRealmRow = metaRealm.objectForPrimaryKey(LOADABLE_REALM_TABLE_NAME, loadableRealmPath);
                loadableRealmSchemaVersion = loadableRealmRow.schemaVersion;
                loadableSchemaNames = Array.from(loadableRealmRow.schemaNames);
            }
            catch(err) {
                _throwNoRealmRowError(metaRealmPath, loadableRealmPath);
            }

            const loadableSchemaRows: LoadableSchemaRow[] = loadableSchemaNames.map((schemaName: string) => metaRealm.objectForPrimaryKey(LOADABLE_SCHEMA_TABLE_NAME, schemaName));
            const loadableSchemas: Realm.ObjectSchema[] = loadableSchemaRows.map((schemaRow: LoadableSchemaRowProperties) => JSON.parse(schemaRow.schema));
            
            let _realmInstance: Realm;
            try {
                _realmInstance = await Realm.open({ schema: loadableSchemas, path: fullLoadableRealmPath, schemaVersion: loadableRealmSchemaVersion });
            }
            catch(err) {
                console.log(err);
            }

            loadedRealmsMap[fullLoadableRealmPath] = _realmInstance;
        }

        // 2. If still not exists, throw an error
        if(!hasOpenLoadableRealm({ metaRealmPath, loadableRealmPath })) _throwNoRealmError(loadableRealmPath);

        // 3. Return open Realm
        return loadedRealmsMap[fullLoadableRealmPath];
    };

    const loadRealmSync = ({ metaRealmPath, loadableRealmPath }: LoadableRealmParams): Realm => {
        const fullLoadableRealmPath: string = genFullLoadableRealmPath({ metaRealmPath, loadableRealmPath });

        // 1. Open Realm if not exists or is closed
        if(!hasOpenLoadableRealm({ metaRealmPath, loadableRealmPath })) {

            const metaRealm: Realm = MetaRealmManager.getMetaRealm(metaRealmPath);

            let loadableRealmRow: LoadableRealmRow;
            let loadableRealmSchemaVersion: number;
            let loadableSchemaNames: string[];
            try {
                loadableRealmRow = metaRealm.objectForPrimaryKey(LOADABLE_REALM_TABLE_NAME, loadableRealmPath);
                loadableRealmSchemaVersion = loadableRealmRow.schemaVersion;
                loadableSchemaNames = Array.from(loadableRealmRow.schemaNames);
            }
            catch(err) {
                _throwNoRealmRowError(metaRealmPath, loadableRealmPath);
            }

            const loadableSchemaRows: LoadableSchemaRow[] = loadableSchemaNames.map((schemaName: string) => metaRealm.objectForPrimaryKey(LOADABLE_SCHEMA_TABLE_NAME, schemaName));
            const loadableSchemas: Realm.ObjectSchema[] = loadableSchemaRows.map((schemaRow: LoadableSchemaRowProperties) => JSON.parse(schemaRow.schema));
            
            let _realmInstance: Realm;
            try {
                _realmInstance = new Realm({ schema: loadableSchemas, path: fullLoadableRealmPath, schemaVersion: loadableRealmSchemaVersion });
            }
            catch(err) {
                console.log(err);
            }

            loadedRealmsMap[fullLoadableRealmPath] = _realmInstance;
        }

        // 2. If still not exists, throw an error
        if(!hasOpenLoadableRealm({ metaRealmPath, loadableRealmPath })) _throwNoRealmError(loadableRealmPath);

        // 3. Return open Realm
        return loadedRealmsMap[fullLoadableRealmPath];
    };

    /**
     * Close an existing open LoadableRealm and
     * Open a new LoadableRealm
     * 
     * @param param0 
     * @returns 
     */
    const reloadRealm = async ({ metaRealmPath, loadableRealmPath }: LoadableRealmParams): Promise<Realm> => {
        closeLoadableRealm({ metaRealmPath, loadableRealmPath });

        return await loadRealm({ metaRealmPath, loadableRealmPath });
    }

    const reloadRealmSync = ({ metaRealmPath, loadableRealmPath }: LoadableRealmParams): Realm => {
        closeLoadableRealm({ metaRealmPath, loadableRealmPath });

        return loadRealmSync({ metaRealmPath, loadableRealmPath });
    }

    /**
     * Close open LoadableRealm
     * Then delete from LoadableRealm map
     * 
     * @param loadableRealmPath 
     */
    const closeLoadableRealm = ({ metaRealmPath, loadableRealmPath }: LoadableRealmParams) => {
        const fullLoadableRealmPath: string = genFullLoadableRealmPath({ metaRealmPath, loadableRealmPath });

        if(hasOpenLoadableRealm({ metaRealmPath, loadableRealmPath })) {
            const realm: Realm = loadedRealmsMap[fullLoadableRealmPath];
            realm.close();
        }

        if(hasLoadableRealm({ metaRealmPath, loadableRealmPath })) delete loadedRealmsMap[fullLoadableRealmPath];
    }

    const closeAll = () => {
        const loadableRealmKeys: string[] = getAllLoadableRealmKeys();
        for(let loadableRealmKey of loadableRealmKeys) {
            const loadedRealm: Realm = loadedRealmsMap[loadableRealmKey];
            loadedRealm.close();
            delete loadedRealmsMap[loadableRealmKey];
        }
    }

    const hasLoadableRealm = ({ metaRealmPath, loadableRealmPath }): boolean => {
        const fullLoadableRealmPath: string = genFullLoadableRealmPath({ metaRealmPath, loadableRealmPath });
        
        return !!loadedRealmsMap[fullLoadableRealmPath];
    }

    const hasOpenLoadableRealm = ({ metaRealmPath, loadableRealmPath }): boolean => {
        const fullLoadableRealmPath: string = genFullLoadableRealmPath({ metaRealmPath, loadableRealmPath });
        
        if(hasLoadableRealm({ metaRealmPath, loadableRealmPath })) {
            const realm: Realm = loadedRealmsMap[fullLoadableRealmPath];
            return !realm.isClosed;
        }

        return false;
    }

    const getAllLoadableRealmKeys = () => Object.keys(loadedRealmsMap);
    const getAllLoadableRealms = () => Object.values(loadedRealmsMap);

    const getAllOpenLoadableRealmKeys = () => getAllLoadableRealmKeys().filter((loadableRealmKey) => !loadedRealmsMap[loadableRealmKey].isClosed);
    const getAllOpenLoadableRealms = () => getAllLoadableRealms().filter((loadableRealm: Realm) => !loadableRealm.isClosed);

    // INTERNAL UTILS

    const genFullLoadableRealmPath = ({ metaRealmPath, loadableRealmPath }: LoadableRealmParams): string => `${metaRealmPath}-${loadableRealmPath}`;

    const _throwNoRealmError = (loadableRealmPath: string) => {
        throw new Error(`A Realm does not exist at "${loadableRealmPath}", and one could not be opened`);
    }

    const _throwNoRealmRowError = (metaRealmPath: string, loadableRealmPath: string) => {
        throw new Error(`A LoadableRealmRow does not exist for realm path "${metaRealmPath}-${loadableRealmPath}"`);
    }

    return {
        loadRealm,
        reloadRealm,
        loadRealmSync,
        reloadRealmSync,
        
        hasLoadableRealm,
        hasOpenLoadableRealm,
        closeLoadableRealm,
        closeAll,

        getAllLoadableRealmKeys,
        getAllLoadableRealms,
        getAllOpenLoadableRealmKeys,
        getAllOpenLoadableRealms,
    };
};

export default createLoadableRealmsManager();
