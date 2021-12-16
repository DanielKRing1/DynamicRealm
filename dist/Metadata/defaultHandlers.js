"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DICT_METADATA_HANDLERS = exports.ARRAY_METADATA_HANDLERS = void 0;
var Errors_1 = require("../Errors");
// For array data
exports.ARRAY_METADATA_HANDLERS = {
    add: function (allMetadata, newMetadata) {
        allMetadata.push(newMetadata);
    },
    remove: function (allMetadata, id) {
        if (!Number.isInteger(id))
            throw Errors_1.METADATA_ARRAY_INTEGER_ERROR;
        if (allMetadata.length < id)
            return false;
        allMetadata.splice(id, 1);
        return true;
    },
    find: function (allMetadata, id) {
        if (!Number.isInteger(id))
            throw Errors_1.METADATA_ARRAY_INTEGER_ERROR;
        return allMetadata.length >= id ? allMetadata[id] : null;
    },
};
// For dict data
exports.DICT_METADATA_HANDLERS = {
    add: function (allMetadata, _a) {
        var key = _a.key, value = _a.value;
        allMetadata[key] = value;
    },
    remove: function (allMetadata, id) {
        if (!allMetadata.hasOwnProperty(id))
            return false;
        delete allMetadata[id];
        return true;
    },
    find: function (allMetadata, id) {
        return allMetadata.hasOwnProperty(id) ? allMetadata[id] : null;
    },
};
