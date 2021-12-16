"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProperties = exports.getSchemaNames = exports.getRealmNames = void 0;
var gloabalRealm_1 = require("../Realm/gloabalRealm");
var Schemas_1 = require("../Schemas");
var dynamicRealmOperations_1 = require("./dynamicRealmOperations");
var dynamicSchemaOperations_1 = require("./dynamicSchemaOperations");
function getRealms() {
    return gloabalRealm_1.globalRealm.getRealm().objects(Schemas_1.DYNAMIC_REALM_NAME);
}
function getRealmNames() {
    return getRealms().map(function (realm) { return realm.realmPath; });
}
exports.getRealmNames = getRealmNames;
function getSchemaNames(realmPath) {
    if (realmPath === void 0) { realmPath = undefined; }
    // 1. Get schema names
    var schemaNames;
    if (!!realmPath) {
        // 1.1.1. Get specified DynamicRealm
        var dynamicRealm = (0, dynamicRealmOperations_1.getDynamicRealm_wr)(realmPath);
        // 1.1.2. Get schema names
        schemaNames = dynamicRealm.schemaNames;
    }
    else {
        // 1.2.1. Get all DynamicRealms
        var dynamicRealms = getRealms();
        // 1.2.2. Flatten all schema names into one list
        schemaNames = [];
        dynamicRealms.forEach(function (dynamicRealm) {
            if (!!dynamicRealm.schemaNames)
                schemaNames.push.apply(schemaNames, dynamicRealm.schemaNames);
        });
    }
    // 2. Get DynamicSchemas
    var schemas = (0, dynamicSchemaOperations_1.getSchemas)(schemaNames);
    return schemas.map(function (schema) { return schema.name; });
}
exports.getSchemaNames = getSchemaNames;
function getProperties(schemaName) {
    var schema = (0, dynamicSchemaOperations_1.getSchema)(schemaName);
    return schema.properties;
}
exports.getProperties = getProperties;
