/**
 * Parse a plain path structure.
 * @param path The path structure to parse
 * @returns Token container
 * @internal
 */
export function ParsePath(path) {
    const args = [];
    const kwargs = new Map;
    let enteredKwargs = false;
    const validElems = path.split("/")
        .map(x => x.trim().replace(/\+/gm, " "))
        .filter(x => x.length > 0);
    for (const elem of validElems) {
        const match = /^([a-z0-9A-ZäöüÄÖÜ_\-]+)(:(.*))?$/ig.exec(elem);
        if (match) {
            const key = match[1];
            const value = match[3];
            if (key && value) {
                enteredKwargs = true;
                let keyvalues = kwargs.get(key);
                if (!keyvalues) {
                    keyvalues = [];
                    kwargs.set(key, keyvalues);
                }
                keyvalues.push(value);
            }
            else if (!value && enteredKwargs) {
                console.error("Cannot parse positional path argument after keyword argument");
                continue;
            }
            else
                args.push(elem);
        }
        else if (enteredKwargs) {
            console.error("Cannot parse positional path argument after keyword argument");
        }
        else
            args.push(elem);
    }
    return {
        args,
        kwargs
    };
}
/**
 * Parse a search params object
 * @param searchParams Search params object
 * @returns Search map
 * @internal
 */
export function ParseSearch(searchParams) {
    const map = new Map;
    for (const key of new Set(searchParams.keys())) {
        const vals = searchParams.getAll(key).map(s => s.trim()).filter(s => s.length > 0);
        if (vals.length > 0)
            map.set(key, vals);
    }
    return map;
}
