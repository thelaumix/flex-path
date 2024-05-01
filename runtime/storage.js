import { updatedEmitter } from "./emitter.js";
/**
 * Static container
 * @internal
 */
export const Container = {
    main: {
        args: [],
        kwargs: new Map(),
        search: new Map()
    },
    hash: {
        args: [],
        kwargs: new Map(),
        search: new Map()
    }
};
export function UpdateField(layer, field, newContent) {
    const cache = Container[layer][field];
    let didUpdateAnything = false;
    if (field === "args" && cache instanceof Array && newContent instanceof Array) {
        // Run equality check for each old and new index
        for (let i = 0; i < Math.max(cache.length, newContent.length); i++) {
            const vOld = cache[i];
            const vNew = newContent[i];
            // In case nothing has changed, pass
            if (vOld === vNew)
                continue;
            // Update field
            cache[i] = vNew;
            // Emit new value
            updatedEmitter.Emit(`${layer}-${field}-${i}`, vNew);
            didUpdateAnything = true;
        }
        Container[layer][field] = cache.filter(x => x);
        if (didUpdateAnything)
            updatedEmitter.Emit(`${layer}-${field}`, ...Container[layer][field]);
    }
    else if (field !== "args" && cache instanceof Map && newContent instanceof Map) {
        const allKeys = new Set([...cache.keys(), ...newContent.keys()]);
        for (const key of allKeys) {
            const vOld = cache.get(key) ?? [];
            const vNew = newContent.get(key) ?? [];
            // In case nothing has changed, pass
            if (JSON.stringify(vOld) === JSON.stringify(vNew))
                continue;
            // If new value is empty, delete field
            if (vNew.length == 0)
                cache.delete(key);
            // Otherwise, update value
            else
                cache.set(key, vNew);
            // Emit new value
            updatedEmitter.Emit(`${layer}-${field}-${key}`, vNew);
            didUpdateAnything = true;
        }
    }
    else
        throw new Error("Typing mismatch");
    return didUpdateAnything;
}
/**
 * Builds a container path for the given layer
 * @internal
 */
export function BuildContainerPath(layer) {
    const subcontainer = Container[layer];
    const baseSegments = subcontainer.args.filter(x => x).map(s => s.replace(/ /gm, "+"));
    const searchSegments = [];
    for (const [key, values] of subcontainer.kwargs.entries()) {
        for (const value of values) {
            baseSegments.push(`${key}:${value.replace(/ /gm, "+")}`);
        }
    }
    if (subcontainer.search.size > 0) {
        for (const [key, values] of subcontainer.search.entries()) {
            for (const value of values) {
                searchSegments.push(`${key}=${encodeURIComponent(value).replace(/%20/gm, "+")}`);
            }
        }
    }
    let path = baseSegments.join("/");
    if (searchSegments.length > 0)
        path += "?" + searchSegments.join("&");
    return path;
}
