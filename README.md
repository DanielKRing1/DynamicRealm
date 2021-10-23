# DynamicRealm

Tool for easily using Realm with schemas that are not known until runtime, e.g. user-defined schemas

## WHY

Realm is great! If there is no need to share content between users, then a local Realm instance and the structure of the data to be stored is all that is needed.\
Often, apps aim to generalize their use case to be more accessible to a wider audience, especially "progress" and "daily tracking" apps.\
<b>Maybe the user should be able to define the structure of the data they want to track.</b>
<br/>
In this case, the Realm schemas are not known until the user defines them at runtime, so a Realm cannot be readily opened, and a solution for saving these "dynamic" schemas must be implemented.

## WHAT

DynamicRealm was made to solve this problem.
<b>DynamicRealm allows users to save any number of data structures (Realm schemas), while developers can use DynamicRealm to simply "load" realms with a set of these dynamic schemas.</b>

## HOW

#### Installation

Install via NPM:

```bash
npm install annoy.js
```

#### Example

```javascript
import DynamicRealm from '../src';

// 1. Init DynamicRealm
const realmPath = 'CustomRealmPath.path';
await DynamicRealm.init({ realmPath });

// 2.1. Define some new schemas
const REALM_PATH_1 = 'RealmPath1.path';
const REALM_PATH_2 = 'RealmPath2.path';
const SCHEMA_1: Realm.ObjectSchema = {
    name: 'Schema1',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'string',
    },
};
const SCHEMA_PARAMS_1: SaveSchemaParams = {
    realmPath: REALM_PATH_1,
    schema: SCHEMA_1,
};
const SCHEMA_2: Realm.ObjectSchema = {
    name: 'Schema2',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'int',
    },
};
const SCHEMA_PARAMS_2: SaveSchemaParams = {
    realmPath: REALM_PATH_1,
    schema: SCHEMA_2,
};
const SCHEMA_3: Realm.ObjectSchema = {
    name: 'Schema3',
    primaryKey: 'name',
    properties: {
        name: 'string',
        data: 'float',
    },
};
const SCHEMA_PARAMS_3: SaveSchemaParams = {
    realmPath: REALM_PATH_2,
    schema: SCHEMA_3,
};
// 2.2. Save these new schemas
// In REALM_PATH_1
DynamicRealm.saveSchema(SCHEMA_PARAMS_1);
DynamicRealm.saveSchema(SCHEMA_PARAMS_2);
// In REALM_PATH_2
DynamicRealm.saveSchema(SCHEMA_PARAMS_3);

// 3. Load a realm with these new schemas

// 3.1. Based on selected schemas
const someRealmPath: string = 'SomeRealmPath.path';
const customRealm: Realm = await DynamicRealm.loadRealmFromSchemas({ realmPath: someRealmPath, schemaNames: [SCHEMA_1.name, SCHEMA_2.name, SCHEMA_3.name] });

// 3.2. Based on realmPath
const realm1: Realm = await DynamicRealm.loadRealm(REALM_PATH_1);
const realm2: Realm = await DynamicRealm.loadRealm(REALM_PATH_2);
```

#### Public Api

###### Init

###### Save Schema

###### Save Schemas

###### Get Schema

###### Get Schemas

###### Remove Schema

###### Remove Schemas

###### Laod Realm

###### Load Realm from a Set of Schemas

###### Get Metadata

###### Update Metadata
