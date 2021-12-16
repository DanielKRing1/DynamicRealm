export declare type DefaultMetadataHandlers = {
    add: (allMetadata: any, newMetadata: any) => void;
    remove: (allMetadata: any, id: any) => boolean;
    find: (allMetadata: any, id: any) => any;
};
