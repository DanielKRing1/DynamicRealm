"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CREATE_DYNAMIC_REALM_SCHEMA = exports.DEFAULT_DYNAMIC_REALM_SCHEMA = exports.DEFAULT_PATH = void 0;
exports.DEFAULT_PATH = 'DynamicRealm.path';
exports.DEFAULT_DYNAMIC_REALM_SCHEMA = {
    realmPath: exports.DEFAULT_PATH,
    schemaNames: [],
    schemaVersion: 0,
};
var CREATE_DYNAMIC_REALM_SCHEMA = function (_a) {
    var realmPath = _a.realmPath, _b = _a.schemaNames, schemaNames = _b === void 0 ? [] : _b, _c = _a.schemaVersion, schemaVersion = _c === void 0 ? 0 : _c;
    return {
        realmPath: realmPath,
        schemaNames: schemaNames,
        schemaVersion: schemaVersion,
    };
};
exports.CREATE_DYNAMIC_REALM_SCHEMA = CREATE_DYNAMIC_REALM_SCHEMA;
