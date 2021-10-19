// TYPES

type Schema = {
    name: string;
    properties: Dict<any>;
};

// REALM MOCK CLASS

export default class Realm {
    schema: Schema[] = [];
    schemaVersion: number;

    data: Dict<any[]> = {};

    // Init
    static open(params: { schema: Schema[]; schemaVersion: number }): Realm {
        const realm: Realm = new Realm(params);

        return realm;
    }

    constructor(params: { schema: Schema[]; schemaVersion: number }) {
        this.schema = params.schema;
        this.schemaVersion = params.schemaVersion;
    }

    // Read
    objects(schemaName: string): any[] {
        return this.data[schemaName];
    }

    // Write
    write(fn: () => void): void {
        fn();
    }

    create(schemaName: string, newEntry: any) {
        this.data[schemaName].push(newEntry);
        return newEntry;
    }
}
