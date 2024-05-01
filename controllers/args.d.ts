import { CallbackEmitterListener } from "lux-callback-emitter";
import { FlexPathLayer } from "../misc/types.js";
import { PathParamSingle } from "../runtime/emitter.js";
/**
 * Positional argument handler.
 *
 * Supports array-like indexing to quickly access and update positional argument fields. These updates will ALWAYS be lowercased.
 * For case sensitive updates, refer to `SetCase()`
 */
declare class FP_PosArgs implements PosArgsIndexable {
    #private;
    [argIndex: number]: string | undefined;
    constructor(layer: FlexPathLayer);
    /**
     * Fetches a complete array of all path arguments
     */
    GetAll(): ReadonlyArray<string>;
    /**
     * Fetches the positional argument value at the given index.
     *
     * This call is **case insensitive**, always returning lowercase.
     * @param index Argument position index
     */
    Get(index: number): string | undefined;
    /**
     * Fetches the positional argument value at the given index.
     *
     * This call is **case sensitive**.
     * @param index Argument position index
     */
    GetCase(index: number): string | undefined;
    /**
     * Updates the path arguments at the given index. The index will be clamped to the current max index + 1, allowing the addition of one argument.
     * Updating an argument with an index lower than the current highest index will clear the following positional argument.
     *
     * This call is **case insensitive**, always inserting a lowercase value.
     * @param index Argument position index
     * @param argument New value *(case insensitive)*
     * @param keepKwargs Whether to keep the current kwargs
     * @param keepSearch Whether to keep the current search query
     */
    Set(index: number, argument: string, keepKwargs?: boolean, keepSearch?: boolean): void;
    /**
     * Updates the path arguments at the given index. The index will be clamped to the current max index + 1, allowing the addition of one argument.
     * Updating an argument with an index lower than the current highest index will clear the following positional argument.
     *
     * This call is **case sensitive**.
     * @param index Argument position index
     * @param argument New value *(case sensitive)*
     * @param keepKwargs Whether to keep the current kwargs
     * @param keepSearch Whether to keep the current search query
     */
    SetCase(index: number, argument: string, keepKwargs?: boolean, keepSearch?: boolean): void;
    /**
     * Clear all positional arguments.
     * @param keepKwargs Whether to keep the current kwargs
     * @param keepSearch Whether to keep the current search query
     */
    Clear(keepKwargs?: boolean, keepSearch?: boolean): void;
    /**
     * Removes the last element from the positional argument stack.
     * @returns Popped argument
     */
    Pop(): string;
    /**
     * Removes the last n elements from the positional argument stack.
     * @param amount Amount of arguments to pop
     * @returns Array of popped arguments
     */
    Pop(amount: number): string[];
    /**
     * Pushes a new value to the argument stack.
     *
     * This call is **case insensitive**, always inserting a lowercase value.
     * @param argument New value *(case insensitive)*
     */
    Push(argument: string): void;
    /**
     * Pushes multiple positional argument values to the argument stack.
     *
     * This call is **case insensitive**, always inserting lowercase values.
     * @param args New values *(case insensitive)*
     */
    Push(...args: string[]): void;
    /**
     * Pushes a new value to the argument stack.
     *
     * This call is **case sensitive**.
     * @param argument New value
     */
    PushCase(argument: string): void;
    /**
     * Pushes multiple positional argument values to the argument stack.
     *
     * This call is **case sensitive**.
     * @param args New values
     */
    PushCase(...args: string[]): void;
    /**
     * Updates the argument stack. This will also clear everything else but positional arguments.
     *
     * This call is **case insensitive**, always inserting lowercase values.
     * @param args New values (CASE SESITIVE)
     */
    Update(...args: string[]): void;
    /**
     * Updates the argument stack. This will also clear everything else but positional arguments.
     *
     * This call is **case sensitive**.
     * @param args New values (CASE SESITIVE)
     */
    UpdateCase(...args: string[]): void;
    /**
     * Validates the argument amount. Will throw if the validation fails.
     * @param expectedLength Argument length to expect
     * @throws If the validation did not pass
     */
    ValidateLength(expectedLength: number): void;
    /**
     * Validates the argument value at the given index case insensitive. Will throw if the validation fails.
     * @param index Argument index to validate
     * @param targetValue Value to expect
     * @throws If the validation did not pass
     */
    ValidateIndex(index: number, targetValue: string): void;
    /**
     * Validates the argument value at the given index case sensitive. Will throw if the validation fails.
     * @param index Argument index to validate
     * @param targetValue Value to expect
     * @throws If the validation did not pass
     */
    ValidateIndexCase(index: number, targetValue: string): void;
    /**
     * Validates the argument path case insensitive. Will throw if the validation fails.
     * @param args Path structure to validate. Passing "false" will ignore the current value.
     * @throws If the validation did not pass
     */
    ValidatePath(...args: (string | false)[]): void;
    /**
     * Validates the argument path case sensitive. Will throw if the validation fails.
     * @param args Path structure to validate. Passing "false" will ignore the current value.
     * @throws If the validation did not pass
     */
    ValidatePathCase(...args: (string | false)[]): void;
    /**
     * Registers a handler function for functional argument update at specified position.
     *
     * Event values will always be returned **case sensitive**
     * @param index Argument index
     * @param handler Update handler
     */
    OnUpdate(index: number, handler: ArgUpdateEventHandler): void;
    /**
     * Registers a handler function for functional argument path update.
     *
     * Event values will always be returned **case sensitive**
     * @param handler Update handler
     */
    OnUpdate(handler: PathUpdateEventHandler): void;
    /**
     * Unregisters a handler function for functional argument update at specified position. This will call for any argument update.
     *
     * Event values will always be returned **case sensitive**
     * @param index Argument index
     * @param handler Update handler
     */
    OffUpdate(index: number, handler: ArgUpdateEventHandler): void;
    /**
     * Unregisters a handler function for functional argument path update. This will call for any argument update.
     *
     * Event values will always be returned **case sensitive**
     * @param handler Update handler
     */
    OffUpdate(handler: PathUpdateEventHandler): void;
    /**
     * Registers a handler function ONCE for functional argument update at specified position. This will call for any argument update.
     *
     * Event values will always be returned **case sensitive**
     * @param index Argument index
     * @param handler Update handler
     */
    OnceUpdate(index: number, handler: ArgUpdateEventHandler): void;
    /**
     * Registers a handler function ONCE for functional argument path update. This will call for any argument update.
     *
     * Event values will always be returned **case sensitive**
     * @param handler Update handler
     */
    OnceUpdate(handler: PathUpdateEventHandler): void;
    /**
     * Creates a callback listener with the provided handler function for functional argument update at specified position. This will call for any argument update.
     *
     * Event values will always be returned **case sensitive**
     * @param index Argument index
     * @param handler Update handler
     */
    GetUpdateListener(index: number, handler: ArgUpdateEventHandler): CallbackEmitterListener;
    /**
     * Creates a callback listener with the provided handler function for functional argument path update. This will call for any argument update.
     *
     * Event values will always be returned **case sensitive**
     * @param handler Update handler
     */
    GetUpdateListener(handler: PathUpdateEventHandler): CallbackEmitterListener;
}
export default FP_PosArgs;
interface PosArgsIndexable {
    [argIndex: number]: string | undefined;
}
type ArgUpdateEventHandler = (newArg: PathParamSingle) => void;
type PathUpdateEventHandler = (...args: string[]) => void;
