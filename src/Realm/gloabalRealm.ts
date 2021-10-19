import { INIT_ERROR } from '../Errors';

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

    setRealm(realm: Realm): void {
        this.realm = realm;
        Object.freeze(this.realm);
    }
}

export const globalRealm: RealmSingleton = new RealmSingleton();
