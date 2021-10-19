import Realm from 'realm';
import { INIT_ERROR } from '../Errors';
import { DynamicRealm, DynamicSchema } from '../Schemas';

class RealmSingleton {
    static _instance: RealmSingleton;

    dynamicRealm: Realm = null;

    constructor() {
        // Short-circuit
        if (RealmSingleton._instance != null) return RealmSingleton._instance;
    }

    getRealm(): Realm {
        if (this.dynamicRealm === null) throw INIT_ERROR;

        return this.dynamicRealm;
    }

    async openRealm(realmPath: string): Promise<void> {
        this.dynamicRealm = await Realm.open({ schema: [DynamicRealm, DynamicSchema], path: realmPath });

        Object.freeze(this.dynamicRealm);

        console.log(Realm);
    }
}

export const globalRealm: RealmSingleton = new RealmSingleton();
