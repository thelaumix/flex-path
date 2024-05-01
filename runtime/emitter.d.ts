import { CallbackEmitter } from "lux-callback-emitter";
/**
 * Emitter instance for any path changes
 * @internal
 */
export declare const updatedEmitter: CallbackEmitter<UpdateEventMap>;
/***********
 ** TYPES **
 ***********/
/**
 * Definer for update emitter
 * @internal
 */
export type UpdateEventMap = {
    [ev in `${"main" | "hash"}-args-${number}`]: (newArg: PathParamSingle) => void;
} & {
    [ev in `${"main" | "hash"}-${"kwargs" | "search"}-${string}`]: (newArg: PathParamMulti) => void;
} & {
    [ev in `${"main" | "hash"}-${"args"}`]: (...args: string[]) => void;
};
export type PathParamSingle = string | undefined;
export type PathParamMulti = ReadonlyArray<string>;
