import Realm from 'realm';

import { Dict } from "..";
import { MetaRealm, metaSchema } from '../Schemas';

function createMetaRealmsManager() {
    const metaRealmsMap: Dict<Realm> = {};

    const addMetaRealm = async (metaRealmPath: string): Promise<boolean> => {
        if(!hasMetaRealm(metaRealmPath)) {
            metaRealmsMap[metaRealmPath] = await _openMetaRealm(metaRealmPath);
            return true;
        }

        return false;
    };

    const getMetaRealm = async (metaRealmPath: string): Promise<Realm> => {
        // 1. Open Realm if not exists
        if(!hasMetaRealm(metaRealmPath)) await addMetaRealm(metaRealmPath);
        
        // 2. If still not exists, throw an error
        if(!hasMetaRealm(metaRealmPath)) _throwNoRealmError(metaRealmPath);

        // 3. Return open Realm
        return metaRealmsMap[metaRealmPath];
    }

    const hasMetaRealm = (metaRealmPath: string): boolean => !!metaRealmsMap[metaRealmPath];

    // INTERNAL UTILS

    async function _openMetaRealm(metaRealmPath: string): Promise<Realm> {
        let _realmInstance: Realm = await Realm.open({ schema: [MetaRealm, metaSchema], path: metaRealmPath });
        
        return _realmInstance;
    }

    const _throwNoRealmError = (metaRealmPath: string) => new Error(`A Realm does not exist at "${metaRealmPath}", and one could not be opened`);

    return {
        addMetaRealm,
        getMetaRealm,
        hasMetaRealm,
    };
};

export const metaRealmManager = createMetaRealmsManager();
