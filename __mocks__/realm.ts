// TYPES

type Schema = {
    name: string;
    properties: Dict<any>;
};

// DATA

let schema: Schema[] = [];
let data: Dict<any[]> = {};

// REALM OBJECT

export default {
    schema,

    data,

    // Init
    open: (params: { schema: Schema[] }): void => {
        schema = params.schema;
    },

    // Read
    objects: (schemaName: string): any[] => {
        return data[schemaName];
    },

    // Write
    write: (fn: () => void): void => {
        fn();
    },

    create: (schemaName: string, data: any) => {
        data[schemaName].push(data);
        return data;
    },
};
