import Realm from 'realm';
import { INIT_ERROR } from '../Errors';
import { DynamicRealm, DynamicSchema } from '../Schemas';

class RealmSingleton {
    static _instance: RealmSingleton;

    // The actual REALM object that exposes the DynamicRealm info (wrapper for realmPath, schemaVersion, which schemas to include)
    dynamicRealm_Realm: Realm = null;

    constructor() {
        // Short-circuit
        if (RealmSingleton._instance != null) return RealmSingleton._instance;
    }

    getRealm(): Realm {
        if (this.dynamicRealm_Realm === null) throw INIT_ERROR;

        return this.dynamicRealm_Realm;
    }

    async openRealm(realmPath: string): Promise<void> {
        this.dynamicRealm_Realm = await Realm.open({ schema: [DynamicRealm, DynamicSchema], path: realmPath });

        Object.freeze(this.dynamicRealm_Realm);
    }
}

export const globalRealm: RealmSingleton = new RealmSingleton();
