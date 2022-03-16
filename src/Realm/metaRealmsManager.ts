import Realm from 'realm';

import { Dict } from "..";
import { LoadableRealm, LoadableSchema } from '../Schemas';

function createMetaRealmsManager() {
    const metaRealmsMap: Dict<Realm> = {};

    const addMetaRealm = async (metaRealmPath: string): Promise<boolean> => {
        if(!hasMetaRealm(metaRealmPath)) {
            metaRealmsMap[metaRealmPath] = await _openMetaRealm(metaRealmPath);
            return true;
        }

        return false;
    };

    const getMetaRealm = (metaRealmPath: string): Realm => {
        // // 1. Open Realm if not exists
        // if(!hasMetaRealm(metaRealmPath)) await addMetaRealm(metaRealmPath);
        
        // 2. If still not exists, throw an error
        if(!hasMetaRealm(metaRealmPath)) _throwNoRealmError(metaRealmPath);

        // 3. Return open Realm
        return metaRealmsMap[metaRealmPath];
    }

    const getAllMetaRealmNames = () => Object.keys(metaRealmsMap);
    const getAllMetaRealms = () => Object.values(metaRealmsMap);

    const rmMetaRealm = (metaRealmPath: string) => {
        if(hasMetaRealm(metaRealmPath)) {
            const realm: Realm = metaRealmsMap[metaRealmPath];
            realm.close();

            delete metaRealmsMap[metaRealmPath];
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

    // INTERNAL UTILS

    async function _openMetaRealm(metaRealmPath: string): Promise<Realm> {
        let _realmInstance: Realm = await Realm.open({ schema: [ LoadableRealm, LoadableSchema ], path: metaRealmPath });
        
        return _realmInstance;
    }

    const _throwNoRealmError = (metaRealmPath: string) => {
        throw new Error(`A Realm does not exist at "${metaRealmPath}", and one could not be opened`);
    }

    return {
        addMetaRealm,
        getMetaRealm,
        rmMetaRealm,
        hasMetaRealm,
        hasOpenMetaRealm,

        getAllMetaRealmNames,
        getAllMetaRealms,
    };
};

export const metaRealmManager = createMetaRealmsManager();
