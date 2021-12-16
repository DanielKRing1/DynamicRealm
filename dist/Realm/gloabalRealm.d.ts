import Realm from 'realm';
declare class RealmSingleton {
    static _instance: RealmSingleton;
    dynamicRealm_Realm: Realm;
    constructor();
    getRealm(): Realm;
    openRealm(realmPath: string): Promise<void>;
}
export declare const globalRealm: RealmSingleton;
export {};
