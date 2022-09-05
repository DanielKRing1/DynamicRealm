import Realm from 'realm';

import { Dict } from "..";
import { LoadableRealm, LoadableSchema } from '../StaticSchemas';

function createMetaRealmsManager() {
    const metaRealmsMap: Dict<Realm> = {};

    /**
     * Get a MetaRealm or
     * Open a new one if one does not exist or it is closed
     * 
     * @param metaRealmPath 
     * @returns 
     */
    const getMetaRealm = async (metaRealmPath: string): Promise<Realm> => {
        // 1. Open Realm if not exists or is closed
        if(!hasOpenMetaRealm(metaRealmPath)) {
            let _realmInstance: Realm = await Realm.open({ schema: [ LoadableRealm, LoadableSchema ], path: metaRealmPath });
            metaRealmsMap[metaRealmPath] = _realmInstance;
        }

        // 2. If still not exists, throw an error
        if(!hasOpenMetaRealm(metaRealmPath)) _throwNoRealmError(metaRealmPath);

        // 3. Return open Realm
        return metaRealmsMap[metaRealmPath];
    };

    /**
     * Close open MetaRealm
     * Then delete from MetaRealm map
     * 
     * @param metaRealmPath 
     */
    const closeMetaRealm = (metaRealmPath: string) => {
        if(hasOpenMetaRealm(metaRealmPath)) {
            const realm: Realm = metaRealmsMap[metaRealmPath];
            realm.close();
        }

        if(hasMetaRealm(metaRealmPath)) delete metaRealmsMap[metaRealmPath];
    }

    const closeAll = () => {
        const metaRealmPaths: string[] = getAllMetaRealmPaths();
        for(let metaRealmPath of metaRealmPaths) {
            closeMetaRealm(metaRealmPath);
        }
    }

    const hasMetaRealm = (metaRealmPath: string): boolean => !!metaRealmsMap[metaRealmPath];

    const hasOpenMetaRealm = (metaRealmPath: string): boolean => {
        if(hasMetaRealm(metaRealmPath)) {
            const realm: Realm = metaRealmsMap[metaRealmPath];
            return !realm.isClosed;
        }

        return false;
    }

    const getAllMetaRealmPaths = () => Object.keys(metaRealmsMap);
    const getAllMetaRealms = () => Object.values(metaRealmsMap);

    const getAllOpenMetaRealmPaths = () => getAllMetaRealmPaths().filter((metaRealmName) => !metaRealmsMap[metaRealmName].isClosed);
    const getAllOpenMetaRealms = () => getAllMetaRealms().filter((metaRealm: Realm) => !metaRealm.isClosed);

    // INTERNAL UTILS

    const _throwNoRealmError = (metaRealmPath: string) => {
        throw new Error(`A Realm does not exist at "${metaRealmPath}", and one could not be opened`);
    }

    return {
        getMetaRealm,
        hasMetaRealm,
        hasOpenMetaRealm,
        closeMetaRealm,
        closeAll,

        getAllMetaRealmPaths,
        getAllMetaRealms,
        getAllOpenMetaRealmPaths,
        getAllOpenMetaRealms,
    };
};

export default createMetaRealmsManager();
