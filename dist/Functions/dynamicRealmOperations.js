"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._incrementRealmSchemaVersion = exports._rmRealmSchemaName = exports.getDynamicRealm = exports.getDynamicRealm_wr = void 0;
var constants_1 = require("../Realm/constants");
var gloabalRealm_1 = require("../Realm/gloabalRealm");
var Schemas_1 = require("../Schemas");
/**
 * Opens a write transaction
 *
 * @param realmPath
 * @returns
 */
function getDynamicRealm_wr(realmPath) {
    var dynamicRealm;
    gloabalRealm_1.globalRealm.getRealm().write(function () {
        dynamicRealm = getDynamicRealm(realmPath);
    });
    return dynamicRealm;
}
exports.getDynamicRealm_wr = getDynamicRealm_wr;
function getDynamicRealm(realmPath) {
    // 1. Check if DynamicRealm exists
    var dynamicRealm = gloabalRealm_1.globalRealm.getRealm().objectForPrimaryKey(Schemas_1.DYNAMIC_REALM_NAME, realmPath);
    // 2. Create DynamicRealm object if not exists
    if (!dynamicRealm) {
        // 2.1. Create object
        var dynamicRealmSchemaObj = (0, constants_1.CREATE_DYNAMIC_REALM_SCHEMA)({ realmPath: realmPath });
        // 5.1.2. Save
        dynamicRealm = gloabalRealm_1.globalRealm.getRealm().create(Schemas_1.DYNAMIC_REALM_NAME, dynamicRealmSchemaObj);
    }
    return dynamicRealm;
}
exports.getDynamicRealm = getDynamicRealm;
/**
 * Private helper method for removing a DynamicSchema's schema name from its DynamicRealm's list
 * Subscequently deletes the DynamicRealm if it no longer contains any schema names
 *
 * @param schema the DynamicSchema whose name will be removed from its DynamicRealm's list
 */
function _rmRealmSchemaName(schema) {
    // 1. Get DynamicRealm
    var realmSchema = getDynamicRealm(schema.realmPath);
    // 2. Remove schema name from DynamicRealm
    if (realmSchema) {
        var index = realmSchema.schemaNames.indexOf(schema.name);
        realmSchema.schemaNames.splice(index, 1);
        // 3. Delete DynamicRealm if no longer contains any schema names
        if (realmSchema.schemaNames.length == 0)
            gloabalRealm_1.globalRealm.getRealm().delete(realmSchema);
    }
}
exports._rmRealmSchemaName = _rmRealmSchemaName;
function _incrementRealmSchemaVersion(realmPath) {
    // 1. Get DynamicRealm
    var realmSchema = getDynamicRealm(realmPath);
    // 2. Increment schemaVersion
    if (realmSchema) {
        realmSchema.schemaVersion++;
    }
}
exports._incrementRealmSchemaVersion = _incrementRealmSchemaVersion;
