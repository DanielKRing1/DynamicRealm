"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicRealm = exports.DYNAMIC_REALM_NAME = exports.DynamicSchema = exports.DYNAMIC_SCHEMA_NAME = void 0;
exports.DYNAMIC_SCHEMA_NAME = 'DynamicSchemas';
exports.DynamicSchema = {
    name: exports.DYNAMIC_SCHEMA_NAME,
    primaryKey: 'name',
    properties: {
        name: 'string',
        schema: 'string',
        metadata: 'string',
    },
};
exports.DYNAMIC_REALM_NAME = 'DynamicRealms';
exports.DynamicRealm = {
    name: exports.DYNAMIC_REALM_NAME,
    primaryKey: 'realmPath',
    properties: {
        realmPath: 'string',
        schemaNames: 'string[]',
        schemaVersion: { type: 'int', default: 0 },
    },
};
