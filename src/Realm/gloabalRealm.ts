import Realm from 'realm';
import { INIT_ERROR } from '../Errors';
import { DynamicRealm, DynamicSchema } from '../Schemas';

class RealmSingleton {
    static _instance: RealmSingleton;

    realm: Realm;

    constructor() {
        // Short-circuit
        if (RealmSingleton._instance != null) return RealmSingleton._instance;
    }

    getRealm(): Realm {
        if (this.realm === null) throw INIT_ERROR;

        return this.realm;
    }

    async openRealm(realmPath: string): Promise<void> {
        this.realm = await Realm.open({ schema: [DynamicRealm, DynamicSchema], path: realmPath });

        Object.freeze(this.realm);
    }
}

export const globalRealm: RealmSingleton = new RealmSingleton();
