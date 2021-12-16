export declare function saveSchemas(params: SaveSchemaParams[]): void;
export declare const MetadataType: Dict<string>;
export declare function saveSchema({ realmPath, schema, overwrite, metadataType }: SaveSchemaParams): void;
export declare function _getDynamicSchema(schemaName: string): DynamicSchemaProperties;
export declare function _getDynamicSchemas(schemaNames?: string[]): DynamicSchemaProperties[];
export declare function getSchema(schemaName: string): Realm.ObjectSchema;
/**
 * Get all schemas if no schemaNames provided, else
 * Get the schemas of only the provided schemaNames
 *
 * @param schemaNames a list of schema names to query for;
 *                      will return all schemas if not provided
 * @returns
 */
export declare function getSchemas(schemaNames?: string[]): Realm.ObjectSchema[];
export declare function rmSchema(schemaName: string): boolean;
export declare function rmSchemas(schemaNames: string[]): string[];
