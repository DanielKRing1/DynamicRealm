// TYPES

type Schema = {
    name: string;
    properties: Dict<any>;
};

// REALM MOCK CLASS

export default class Realm {
    schema: Schema[] = [];
    path: string;
    schemaVersion: number;

    data: Dict<any[]> = {};

    // Init
    static open(params: { schema: Schema[]; path: string; schemaVersion: number }): Realm {
        const realm: Realm = new Realm(params);

        return realm;
    }

    constructor(params: { schema: Schema[]; path: string; schemaVersion: number }) {
        this.schema = params.schema;
        this.path = params.path;
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
