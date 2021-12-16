"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateMetadata = exports.getMetadata = void 0;
var gloabalRealm_1 = require("../Realm/gloabalRealm");
var dynamicSchemaOperations_1 = require("./dynamicSchemaOperations");
function getMetadata(schemaName) {
    // 1. Get schema
    var schema = (0, dynamicSchemaOperations_1._getDynamicSchema)(schemaName);
    // 2. Convert metadat string to obj
    var metadataObj = JSON.parse(schema.metadata);
    return metadataObj;
}
exports.getMetadata = getMetadata;
function updateMetadata(schemaName, updateHandler) {
    // 1. Get schema
    var schema = (0, dynamicSchemaOperations_1._getDynamicSchema)(schemaName);
    var result;
    gloabalRealm_1.globalRealm.getRealm().write(function () {
        // 2. Convert metadat string to obj
        var metadataObj = JSON.parse(schema.metadata);
        // 3. Execute updateHandler on the obj
        result = updateHandler(metadataObj);
        // 4. Write full metadata object back into realm
        schema.metadata = JSON.stringify(result);
    });
    return result;
}
exports.updateMetadata = updateMetadata;
