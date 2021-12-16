"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dynamicSchemaOperations_1 = require("./Functions/dynamicSchemaOperations");
var metadataOperations_1 = require("./Functions/metadataOperations");
var realmOperations_1 = require("./Functions/realmOperations");
var uiUtils_1 = require("./Functions/uiUtils");
var defaultHandlers_1 = require("./Metadata/defaultHandlers");
exports.default = {
    init: realmOperations_1.init,
    isInitialized: realmOperations_1.isInitialized,
    saveSchema: dynamicSchemaOperations_1.saveSchema,
    saveSchemas: dynamicSchemaOperations_1.saveSchemas,
    getSchema: dynamicSchemaOperations_1.getSchema,
    getSchemas: dynamicSchemaOperations_1.getSchemas,
    rmSchema: dynamicSchemaOperations_1.rmSchema,
    rmSchemas: dynamicSchemaOperations_1.rmSchemas,
    loadRealm: realmOperations_1.loadRealm,
    loadRealmFromSchemas: realmOperations_1.loadRealmFromSchemas,
    getMetadata: metadataOperations_1.getMetadata,
    updateMetadata: metadataOperations_1.updateMetadata,
    getRealmNames: uiUtils_1.getRealmNames,
    getSchemaNames: uiUtils_1.getSchemaNames,
    getProperties: uiUtils_1.getProperties,
    ARRAY_METADATA_HANDLERS: defaultHandlers_1.ARRAY_METADATA_HANDLERS,
    DICT_METADATA_HANDLERS: defaultHandlers_1.DICT_METADATA_HANDLERS,
};
