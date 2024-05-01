/**
 * Parse a plain path structure.
 * @param path The path structure to parse
 * @returns Token container
 * @internal
 */
export declare function ParsePath(path: string): ParsedPath;
/**
 * Parse a search params object
 * @param searchParams Search params object
 * @returns Search map
 * @internal
 */
export declare function ParseSearch(searchParams: URLSearchParams): ParsedSearch;
/***********
 ** TYPES **
 ***********/
/**
 * An object representation of parsed flexpath arguments
 * @internal
 */
export type ParsedPath = {
    /** Local arguments */
    args: string[];
    /** Keyword arguments */
    kwargs: Map<string, string[]>;
};
/**
 * A map containing any search param literals
 * @internal
 */
export type ParsedSearch = Map<string, string[]>;
