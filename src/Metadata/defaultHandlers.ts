import { METADATA_ARRAY_INTEGER_ERROR } from '../Errors';
import { DefaultMetadataHandlers } from './types/types';

// For array data
export const ARRAY_METADATA_HANDLERS: DefaultMetadataHandlers = {
    add: (allMetadata: any[], newMetadata: any) => {
        allMetadata.push(newMetadata);
    },
    remove(allMetadata: any[], id: number): boolean {
        if (!Number.isInteger(id)) throw METADATA_ARRAY_INTEGER_ERROR;
        if (allMetadata.length < id) return false;

        allMetadata.splice(id, 1);
        return true;
    },
    find(allMetadata: any[], id: number): any {
        if (!Number.isInteger(id)) throw METADATA_ARRAY_INTEGER_ERROR;
        return allMetadata.length >= id ? allMetadata[id] : null;
    },
};

// For dict data
export const DICT_METADATA_HANDLERS: DefaultMetadataHandlers = {
    add: (allMetadata: any[], { key, value }: KeyValuePair) => {
        allMetadata[key] = value;
    },
    remove(allMetadata: any[], id: any): boolean {
        if (!allMetadata.hasOwnProperty(id)) return false;

        delete allMetadata[id];
        return true;
    },
    find(allMetadata: any[], id: any): any {
        return allMetadata.hasOwnProperty(id) ? allMetadata[id] : null;
    },
};
