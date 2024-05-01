/**
 * Settings container
 * @internal
 */
export declare const Settings: ControllerSettings;
/**
 * Performs a history update respecting the provided mode
 * @param mode Update mode
 * @returns nothing
 * @internal
 */
export declare const UpdateHistory: (mode?: HistoryCallMode) => void;
type ControllerSettings = {
    historyCallMode: HistoryCallMode;
    frozen: boolean;
};
/**
 * History update mode
 * @internal
 */
export type HistoryCallMode = "replace" | "push";
export {};
