/**
 * Opens a write transaction
 *
 * @param realmPath
 * @returns
 */
export declare function getDynamicRealm_wr(realmPath: string): DynamicRealmProperties;
export declare function getDynamicRealm(realmPath: string): DynamicRealmProperties;
/**
 * Private helper method for removing a DynamicSchema's schema name from its DynamicRealm's list
 * Subscequently deletes the DynamicRealm if it no longer contains any schema names
 *
 * @param schema the DynamicSchema whose name will be removed from its DynamicRealm's list
 */
export declare function _rmRealmSchemaName(schema: DynamicSchemaProperties): void;
export declare function _incrementRealmSchemaVersion(realmPath: string): void;
