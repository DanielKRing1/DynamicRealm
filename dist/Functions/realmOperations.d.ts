import Realm from 'realm';
import { InitParams, LoadRealmParams } from './types/types';
export declare function isInitialized(): boolean;
export declare function init({ realmPath, force }?: InitParams): Promise<void>;
export declare function loadRealm(realmPath: string): Promise<Realm>;
/**
 * Loads a realm with all schemas if no schemaNames provided, else
 * Loads a realm with only the schemas of the provided schemaNames
 *
 * @param schemaNames a list of schema names to load into the realm;
 *                      will load all schemas if not provided
 * @returns
 */
export declare function loadRealmFromSchemas({ realmPath: path, schemaNames }: LoadRealmParams): Promise<Realm>;
