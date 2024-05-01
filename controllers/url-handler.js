import { ParsePath, ParseSearch } from "../misc/parsers.js";
import { UpdateField } from "../runtime/storage.js";
import FP_PosArgs from "./args.js";
import FP_KwArgs from "./kwargs.js";
import { Settings, UpdateHistory } from "./location-controller.js";
/** Initializes the runtime */
function Init() {
    window.addEventListener("popstate", MakeUpdateHandler("main"));
    window.addEventListener("hashchange", MakeUpdateHandler("hash"));
    window.addEventListener("click", (ev) => {
        const targetElement = ev.target.closest("a");
        if (!targetElement)
            return;
        if (targetElement.nodeName === "A") {
            ev.preventDefault();
            const href = targetElement.attributes.getNamedItem("href")?.value;
            const target = targetElement.attributes.getNamedItem("target")?.value;
            if (typeof href === "string" && href.length >= 1) {
                if (href.startsWith("#"))
                    window.location.hash = href;
                else
                    navigateToPath(href, target || "");
            }
        }
    });
    // Intitial call
    MakeUpdateHandler("main")();
}
//@ts-ignore
if (!window.__flexpath_init)
    Init(), window.__flexpath_init = true;
/** Generates a layer specific update handler function */
function MakeUpdateHandler(layer) {
    return () => {
        if (layer === "main") {
            const basePath = ParsePath(location.pathname);
            UpdateField("main", "args", basePath.args);
            UpdateField("main", "kwargs", basePath.kwargs);
            if (location.search.length > 1) {
                const baseSearch = ParseSearch(new URLSearchParams(location.search));
                UpdateField("main", "search", baseSearch);
            }
            else {
                UpdateField("main", "search", new Map);
            }
        }
        if (window.location.hash.length > 1) {
            const hashUrl = new URL("/" + window.location.hash.substring(1), "http://lux/");
            const hashPath = ParsePath(hashUrl.pathname);
            UpdateField("hash", "args", hashPath.args);
            UpdateField("hash", "kwargs", hashPath.kwargs);
            if (hashUrl.search.length > 1) {
                const hashSearch = ParseSearch(new URLSearchParams(hashUrl.search));
                UpdateField("hash", "search", hashSearch);
            }
            else {
                UpdateField("hash", "search", new Map);
            }
        }
        else {
            UpdateField("hash", "args", []);
            UpdateField("hash", "kwargs", new Map);
            UpdateField("hash", "search", new Map);
        }
    };
}
const EXTURL_MIDDLEWARES = new Set;
/**
 * FlexPath global controller
 */
class FlexPath_t {
    constructor() {
        /** Main positional argument controller */
        this.args = new FP_PosArgs("main");
        /** Main keyword argument controller */
        this.kwargs = new FP_KwArgs("main", "kwargs");
        /** Main search query controller */
        this.search = new FP_KwArgs("main", "search");
        /** Additional hash positional argument controller */
        this.hashArgs = new FP_PosArgs("hash");
        /** Additional hash keyword argument controller */
        this.hashKwargs = new FP_KwArgs("hash", "kwargs");
        /** Additional hash search query controller */
        this.hashSearch = new FP_KwArgs("hash", "search");
    }
    /** Raw and **full** path, including search queries and hash. Updating this will navigate towards it. If you supply an external path, it will be opened in a new tab. */
    get raw() {
        return currentPath();
    }
    set raw(path) {
        navigateToPath(path);
    }
    /** Current URL update mode. This defaults to **push**. */
    get stateMode() {
        return Settings.historyCallMode;
    }
    set stateMode(mode) {
        if (["push", "replace"].includes(mode))
            return;
        Settings.historyCallMode = mode;
    }
    /**
     * Freezes the history state machine. This allows multiple updates without invoking a history state call each time.
     *
     * **Remember to `Unfreeze()` the engine again once you're done!**
     */
    Freeze() {
        Settings.frozen = true;
    }
    /**
     * Unfreezes the history state machine and applys all intermediate updates.
     * @param mode *(optional)* Override the current global state mode for this unfreeze action
     */
    Unfreeze(mode) {
        if (!Settings.frozen)
            return;
        Settings.frozen = false;
        UpdateHistory(mode);
    }
    /**
     * Adds a custom middleware for any navigation events attempting to open an external URL.
     * @param middleware
     */
    UseExternalUrlMiddleware(middleware) {
        if (typeof middleware !== "function")
            throw new Error("Cannot pass non-functions as a middleware");
        EXTURL_MIDDLEWARES.add(middleware);
    }
    NavigateTo(path, target) {
        if (path instanceof URL)
            path = path.href;
        navigateToPath(path, typeof target === "boolean" ? (target ? "_blank" : "") : target);
    }
}
const SINGLETON = new FlexPath_t();
/**
 * Handles navigation to a specified path
 * @param path Raw path value
 * @param defaultTarget Target fallback
 */
function navigateToPath(path, defaultTarget) {
    const url = new URL(path, `${location.protocol}//${location.host}/`);
    const full = buildFullPath(url);
    if (url.host !== location.host || (defaultTarget != "" && defaultTarget != null))
        openExternal(url, defaultTarget ?? "_blank");
    else if (full != currentPath()) {
        history.pushState(null, "", full);
        MakeUpdateHandler("main")();
    }
}
/**
 * Handles external URL opening
 * @internal
 */
async function openExternal(url, targetDefault) {
    let accepted = true;
    const options = {
        newTab: targetDefault != null && targetDefault.length > 0,
        target: targetDefault
    };
    if (url.host !== location.host) {
        for (const middleware of EXTURL_MIDDLEWARES) {
            let resolve;
            const promise = new Promise(res => resolve = res);
            try {
                middleware(url, (acc, opts) => {
                    if (!acc) {
                        accepted = false;
                    }
                    else if (opts) {
                        for (const k in opts)
                            options[k] = opts[k];
                    }
                    resolve(acc);
                });
                await promise;
            }
            catch (e) {
                console.error(e);
            }
            if (!accepted)
                return;
        }
    }
    if (options.newTab)
        window.open(url, options.target || "_blank");
    else
        window.location.href = url.href;
}
/**
 * Retrieves the current path
 * @internal
 */
export function currentPath() {
    return buildFullPath(location);
}
/**
 * Builds a full path from containers
 * @internal
 */
function buildFullPath(root) {
    return root.pathname + (root.search.length > 1 ? root.search : "") + (root.hash.length > 1 ? root.hash : "");
}
// Hide behind proxy to prevent any overriding
/**
 * FlexPath global controller
 */
const FlexPath = new Proxy(SINGLETON, {
    get: (target, p) => {
        return target[p];
    },
    set: (target, p, newValue) => {
        if (["raw", "stateMode"].includes(p)) {
            target[p] = newValue;
            return true;
        }
        return false;
    }
});
export default FlexPath;
