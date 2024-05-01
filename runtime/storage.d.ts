import { ParsedPath, ParsedSearch } from "../misc/parsers.js";
import { FlexPathLayer } from "../misc/types.js";
/**
 * Static container
 * @internal
 */
export declare const Container: StorageContainer;
/**
 * Validates and updates a given field.
 * @param layer Layer to validate
 * @param field Field to validate
 * @param newContent New container
 * @returns Whether something changed at all
 * @internal
 */
export declare function UpdateField(layer: FlexPathLayer, field: "kwargs" | "search", newContent: ParsedSearch): boolean;
export declare function UpdateField(layer: FlexPathLayer, field: "args", newContent: string[]): boolean;
/**
 * Builds a container path for the given layer
 * @internal
 */
export declare function BuildContainerPath(layer: FlexPathLayer): string;
/***********
 ** TYPES **
 ***********/
type ContainerFields = {
    search: ParsedSearch;
} & ParsedPath;
type StorageContainer = {
    main: ContainerFields;
    hash: ContainerFields;
};
export {};
