"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rmSchemas = exports.rmSchema = exports.getSchemas = exports.getSchema = exports._getDynamicSchemas = exports._getDynamicSchema = exports.saveSchema = exports.MetadataType = exports.saveSchemas = void 0;
var gloabalRealm_1 = require("../Realm/gloabalRealm");
var Schemas_1 = require("../Schemas");
var dynamicRealmOperations_1 = require("./dynamicRealmOperations");
function saveSchemas(params) {
    params.forEach(function (param) { return saveSchema(param); });
}
exports.saveSchemas = saveSchemas;
exports.MetadataType = {
    Object: 'object',
    List: 'list',
};
function saveSchema(_a) {
    var realmPath = _a.realmPath, schema = _a.schema, _b = _a.overwrite, overwrite = _b === void 0 ? false : _b, _c = _a.metadataType, metadataType = _c === void 0 ? exports.MetadataType.Object : _c;
    // 1. Check if schema already exists
    var existingSchema = gloabalRealm_1.globalRealm.getRealm().objectForPrimaryKey(Schemas_1.DYNAMIC_SCHEMA_NAME, schema.name);
    if (existingSchema && !overwrite)
        return;
    // 2. Create DynamicSchema object to save
    var schemaObj = {
        // 2.1. Record the 'name' property for simple querying
        name: schema.name,
        realmPath: realmPath,
        // 2.2. Stringify the schema object
        schema: JSON.stringify(schema),
        // 2.3. Init the metadata as empty
        metadata: metadataType === exports.MetadataType.Object ? '{}' : '[]',
    };
    gloabalRealm_1.globalRealm.getRealm().write(function () {
        // 3. If exists, remove Schema and increment DynamicRealm
        if (existingSchema) {
            rmSchema(schema.name);
            (0, dynamicRealmOperations_1._incrementRealmSchemaVersion)(realmPath);
        }
        // 4. Add the new schema to the DynamicSchema table
        gloabalRealm_1.globalRealm.getRealm().create(Schemas_1.DYNAMIC_SCHEMA_NAME, schemaObj);
        // 5. Get or create the DynamicRealm
        var dynamicRealm = (0, dynamicRealmOperations_1.getDynamicRealm)(realmPath);
        // 6. Add new DynamicSchema's name to DynamicRealm
        dynamicRealm.schemaNames.push(schema.name);
    });
}
exports.saveSchema = saveSchema;
function _getDynamicSchema(schemaName) {
    return gloabalRealm_1.globalRealm.getRealm().objectForPrimaryKey(Schemas_1.DYNAMIC_SCHEMA_NAME, schemaName);
}
exports._getDynamicSchema = _getDynamicSchema;
function _getDynamicSchemas(schemaNames) {
    if (schemaNames === void 0) { schemaNames = []; }
    if (schemaNames.length === 0)
        return Array.from(gloabalRealm_1.globalRealm.getRealm().objects(Schemas_1.DYNAMIC_SCHEMA_NAME));
    return schemaNames.map(function (schemaName) { return _getDynamicSchema(schemaName); }).filter(function (dynamicSchema) { return !!dynamicSchema; });
}
exports._getDynamicSchemas = _getDynamicSchemas;
function getSchema(schemaName) {
    var dynamicSchema = _getDynamicSchema(schemaName);
    if (dynamicSchema)
        return JSON.parse(dynamicSchema.schema);
}
exports.getSchema = getSchema;
/**
 * Get all schemas if no schemaNames provided, else
 * Get the schemas of only the provided schemaNames
 *
 * @param schemaNames a list of schema names to query for;
 *                      will return all schemas if not provided
 * @returns
 */
function getSchemas(schemaNames) {
    if (schemaNames === void 0) { schemaNames = undefined; }
    if (!schemaNames)
        schemaNames = [];
    return _getDynamicSchemas(schemaNames).map(function (dynamicSchema) { return JSON.parse(dynamicSchema.schema); });
}
exports.getSchemas = getSchemas;
function rmSchema(schemaName) {
    var schemaExists = false;
    // 1. Get schema to delete
    var schema = _getDynamicSchema(schemaName);
    gloabalRealm_1.globalRealm.getRealm().write(function () {
        // 2. Schema exists
        if (schema) {
            // 2.1. Mark as exists
            schemaExists = true;
            // 2.2. Delete from DynamicSchema
            gloabalRealm_1.globalRealm.getRealm().delete(schema);
            // 2.3. Remove schema name from DynamicRealm
            (0, dynamicRealmOperations_1._rmRealmSchemaName)(schema);
        }
    });
    return schemaExists;
}
exports.rmSchema = rmSchema;
function rmSchemas(schemaNames) {
    var removedSchemas;
    // 1. Get schemas to delete
    var schemas = _getDynamicSchemas(schemaNames);
    // 2. Mark schemas that exist
    removedSchemas = schemas.map(function (schema) { return schema.name; });
    gloabalRealm_1.globalRealm.getRealm().write(function () {
        // 3. Delete schemas
        schemas.forEach(function (schema) {
            // 3.1. Delete
            gloabalRealm_1.globalRealm.getRealm().delete(schema);
            // 3.2. Remove schema name from DynamicRealm
            (0, dynamicRealmOperations_1._rmRealmSchemaName)(schema);
        });
    });
    return removedSchemas;
}
exports.rmSchemas = rmSchemas;
