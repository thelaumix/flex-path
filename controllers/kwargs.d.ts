import { CallbackEmitterListener } from "lux-callback-emitter";
import { FlexPathLayer, FlexPathMapType } from "../misc/types.js";
import { PathParamMulti } from "../runtime/emitter.js";
export declare const validateKey: (arg: string) => void;
/**
 * Keyword argument handler
 *
 * Supports object-like indexing to quickly access and update fields. These updates will ALWAYS be lowercased.
 * For case sensitive updates, refer to `SetCase()` or `AddCase()`
 */
declare class FP_KwArgs {
    #private;
    constructor(layer: FlexPathLayer, map: FlexPathMapType);
    /**
     * Fetches first value for the provided key.
     *
     * This call is <i>case insensitive</i>, always returning lowercase.
     * @param key Key to look up
     * @returns Current value or undefined.
     */
    Get(key: string): string | undefined;
    /**
     * Fetches first value for the provided key.
     *
     * This call is <i>case sensitive</i>.
     * @param key Key to look up
     * @returns Current value or undefined.
     */
    GetCase(key: string): string | undefined;
    /**
     * Fetches all values for the provided key.
     *
     * This call is <i>case insensitive</i>, always returning lowercase.
     * @param key Key to look up
     * @returns Array containing all current values.
     */
    GetAll(key: string): string[];
    /**
     * Fetches all values for the provided key.
     *
     * This call is <i>case sensitive</i>.
     * @param key Key to look up
     * @returns Array containing all current values.
     */
    GetAllCase(key: string): string[];
    /**
     * Clear all fields
     */
    Clear(): void;
    /**
     * Sets the value(s) for a given key literal.
     *
     * This call is **case insensitive**.
     * @param key Key to update
     * @param values New values *(case insensitive)*
     */
    Set(key: string, values: string[]): void;
    Set(key: string, value: string, ...moreValues: string[]): void;
    /**
     * Sets the value(s) for a given key literal.
     *
     * This call is **case sensitive**.
     * @param key Key to update
     * @param values New values *(case sensitive)*
     */
    SetCase(key: string, values: string[]): void;
    SetCase(key: string, value: string, ...moreValues: string[]): void;
    /**
     * Adds one or more values to a given key literal.
     * This will also prevent duplicates from being inserted, thus acting like a `Set`.
     *
     * This call is **case insensitive**.
     * @param key Key to update
     * @param values New values *(case insensitive)*
     */
    Add(key: string, ...values: string[]): void;
    /**
     * Adds one or more values to a given key literal.
     * This will also prevent duplicates from being inserted, thus acting like a `Set`.
     *
     * This call is **case sensitive**.
     * @param key Key to update
     * @param values New values *(case sensitive)*
     */
    AddCase(key: string, value: string, ...moreValues: string[]): void;
    /**
     * Removes all values from a given key literal
     *
     * This call is **case sensitive**.
     * @param key Key to update
     */
    Delete(key: string): void;
    /**
     * Removes specific, **case sensitive** values from a given key literal.
     *
     * This call is **case sensitive**.
     * @param key Key to update
     * @param values New values *(case sensitive)*
     */
    Delete(key: string, value: string, ...moreValues: string[]): void;
    /**
     * Validates the existance of any values on the provided key literal. Will throw if the validation fails.
     * @param key Key literal to validate.
     * @throws If the validation did not pass
     */
    ValidateKey(key: string): void;
    /**
     * Validates the existance of the provided values on the provided key literal **case insensitive**. Will throw if the validation fails.
     * @param key Key literal
     * @param values The values to be matched
     * @throws If the validation did not pass
     */
    ValidateValues(key: string, ...values: string[]): void;
    /**
     * Validates the existence of all provided values on the provided key literal **case sensitive**. Will throw if the validation fails.
     * @param key Key literal
     * @param values The values to be matched
     * @throws If the validation did not pass
     */
    ValidateValuesCase(key: string, ...values: string[]): void;
    /**
     * Registers a handler function for value changes on the provided key.
     *
     * Event values will always be returned **case sensitive**
     * @param key Key literal
     * @param handler Update handler
     */
    OnUpdate(key: string, handler: KwargUpdateEventHandler): void;
    /**
     * Unregisters a handler function for value changes on the provided key.
     *
     * Event values will always be returned **case sensitive**
     * @param key Key literal
     * @param handler Update handler
     */
    OffUpdate(key: string, handler: KwargUpdateEventHandler): void;
    /**
     * Registers a handler function for value changes on the provided key.
     *
     * Event values will always be returned **case sensitive**
     * @param key Key literal
     * @param handler Update handler
     */
    OnceUpdate(key: string, handler: KwargUpdateEventHandler): void;
    /**
     * Creates a callback listener with the provided handler function for value changes on the provided key.
     *
     * Event values will always be returned **case sensitive**
     * @param key Key literal
     * @param handler Update handler
     */
    GetUpdateListener(key: string, handler: KwargUpdateEventHandler): CallbackEmitterListener;
}
export default FP_KwArgs;
type KwargUpdateEventHandler = (newValues: PathParamMulti) => void;
