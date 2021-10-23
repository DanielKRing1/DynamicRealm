// TYPES

type Schema = {
    name: string;
    primaryKey?: string;
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
        params.schema.forEach((schema: Schema) => (this.data[schema.name] = []));

        this.path = params.path;
        this.schemaVersion = params.schemaVersion || 0;
    }

    // Read
    objects(schemaName: string): any[] {
        return this.data[schemaName];
    }
    objectForPrimaryKey(schemaName: string, primaryKey: string): any {
        // 1. Get Schema, to read primaryKey
        const schemaToSearch: Schema = this.schema.find((schema: Schema) => schema.name === schemaName);
        if (!schemaToSearch) return;

        // Get pk
        const { primaryKey: key } = schemaToSearch;
        // 2. Get row with matching pk
        return this.data[schemaName].find((row: any) => row[key] === primaryKey);
    }

    // Write
    write(fn: () => void): void {
        fn();
    }

    create(schemaName: string, row: any): any {
        // 1. Get Schema, to read primaryKey
        const schemaToSearch: Schema = this.schema.find((schema: Schema) => schema.name === schemaName);
        if (!schemaToSearch) return;

        // 2. Prevent duplicate pk
        const { primaryKey } = schemaToSearch;
        const isDuplicate: boolean = !!primaryKey && !!this.data[schemaName].find((existingRow: any) => row[primaryKey] === existingRow[primaryKey]);

        // 3. Add new row
        if (!isDuplicate) this.data[schemaName].push(row);

        return !isDuplicate ? row : undefined;
    }

    delete(schema: Realm.ObjectSchema) {
        const index: number = this.schema.findIndex((s: Realm.ObjectSchema) => s.name === schema.name);
        if (index > -1) this.schema.splice(index, 1);
    }
}
