import { FlexPathExternalUrlMiddleware } from "../misc/types.js";
import FP_PosArgs from "./args.js";
import FP_KwArgs from "./kwargs.js";
import { HistoryCallMode } from "./location-controller.js";
/**
 * FlexPath global controller
 *
 * **Documentation:** https://www.npmjs.com/package/flex-path
 */
declare class FlexPath_t {
    /** Main positional argument controller */
    args: FP_PosArgs;
    /** Main keyword argument controller */
    kwargs: FP_KwArgs;
    /** Main search query controller */
    search: FP_KwArgs;
    /** Additional hash positional argument controller */
    hashArgs: FP_PosArgs;
    /** Additional hash keyword argument controller */
    hashKwargs: FP_KwArgs;
    /** Additional hash search query controller */
    hashSearch: FP_KwArgs;
    /** Raw and **full** path, including search queries and hash. Updating this will navigate towards it. If you supply an external path, it will be opened in a new tab. */
    get raw(): string;
    set raw(path: string);
    /** Current URL update mode. This defaults to **push**. */
    get stateMode(): string;
    set stateMode(mode: HistoryCallMode);
    /**
     * Freezes the history state machine. This allows multiple updates without invoking a history state call each time.
     *
     * **Remember to `Unfreeze()` the engine again once you're done!**
     */
    Freeze(): void;
    /**
     * Unfreezes the history state machine and applys all intermediate updates.
     * @param mode *(optional)* Override the current global state mode for this unfreeze action
     */
    Unfreeze(mode?: HistoryCallMode): void;
    /**
     * Adds a custom middleware for any navigation events attempting to open an external URL.
     * @param middleware
     */
    UseExternalUrlMiddleware(middleware: FlexPathExternalUrlMiddleware): void;
    /**
     * Navigates to the specified location in the current tab.
     * @param path Desired path
     */
    NavigateTo(path: string | URL): void;
    /**
     * Navigates to the specified location
     * @param path Desired path
     * @param target navigation target
     */
    NavigateTo(path: string | URL, target: string): void;
    /**
     * Navigates to the specified location
     * @param path Desired path
     * @param newTab Whether to open the target in a new tab
     */
    NavigateTo(path: string | URL, newTab: boolean): void;
}
/**
 * Retrieves the current path
 * @internal
 */
export declare function currentPath(): string;
/**
 * FlexPath global controller
 */
declare const FlexPath: FlexPath_t;
export default FlexPath;
