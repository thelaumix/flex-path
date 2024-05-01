import { BuildContainerPath } from "../runtime/storage.js";
import { currentPath } from "./url-handler.js";
/**
 * Settings container
 * @internal
 */
export const Settings = {
    historyCallMode: "push",
    frozen: false
};
/** Pushes the current stack to history */
function PerformHistoryCall(method) {
    if (Settings.frozen)
        return;
    const cpath = currentPath();
    let newPath = "/" + BuildContainerPath("main");
    let hashPath = BuildContainerPath("hash");
    if (hashPath.length > 0)
        newPath += "#" + hashPath;
    if (cpath == newPath)
        return;
    history[`${method}State`](null, "", newPath);
}
/**
 * Performs a history update respecting the provided mode
 * @param mode Update mode
 * @returns nothing
 * @internal
 */
export const UpdateHistory = (mode) => PerformHistoryCall(mode ?? Settings.historyCallMode);
