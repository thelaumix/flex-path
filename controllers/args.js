var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FP_PosArgs_instances, _FP_PosArgs_layer, _FP_PosArgs_container_get, _FP_PosArgs_invokeListenerFunc;
import { Container } from "../runtime/storage.js";
import { UpdateHistory } from "./location-controller.js";
import { updatedEmitter } from "../runtime/emitter.js";
/**
 * Positional argument handler.
 *
 * Supports array-like indexing to quickly access and update positional argument fields. These updates will ALWAYS be lowercased.
 * For case sensitive updates, refer to `SetCase()`
 */
class FP_PosArgs {
    constructor(layer) {
        _FP_PosArgs_instances.add(this);
        /** @internal */
        _FP_PosArgs_layer.set(this, void 0);
        __classPrivateFieldSet(this, _FP_PosArgs_layer, layer, "f");
        /**
         * Proxy to enable indexing on the args class
         */
        return new Proxy(this, {
            get: (_, prop) => {
                //@ts-expect-error TS won't get it
                if (Number(prop) == prop) {
                    return this.Get(parseInt(prop));
                }
                return (...x) => this[prop](...x);
            },
            set: (_, prop, newValue) => {
                const nprop = Number(prop);
                //@ts-expect-error TS won't get it
                if (nprop == prop) {
                    if (nprop < 0)
                        throw new Error("Negative indices are not allowed");
                    if (typeof newValue === "string") {
                        this.Set(nprop, newValue);
                    }
                    else if (newValue == null) {
                        const arglen = __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).args.length;
                        __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).args.splice(nprop, arglen - nprop);
                        UpdateHistory();
                    }
                    else
                        throw new Error("Argument update failed");
                    return true;
                }
                return false;
            }
        });
    }
    /**
     * Fetches a complete array of all path arguments
     */
    GetAll() {
        return [...__classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).args];
    }
    /**
     * Fetches the positional argument value at the given index.
     *
     * This call is **case insensitive**, always returning lowercase.
     * @param index Argument position index
     */
    Get(index) {
        if ((index % 1) !== 0)
            throw new Error("Bro, indices shall not be fractions!");
        const val = this.GetCase(index);
        if (val)
            return val.toLowerCase();
    }
    /**
     * Fetches the positional argument value at the given index.
     *
     * This call is **case sensitive**.
     * @param index Argument position index
     */
    GetCase(index) {
        if (typeof index !== "number")
            throw new Error("Positional argument index must be typeof number");
        else if (index < 0)
            throw new Error("Positional argument index cannot be negative");
        else if ((index % 1) !== 0)
            throw new Error("Bro, indices shall not be fractions!");
        return Container[__classPrivateFieldGet(this, _FP_PosArgs_layer, "f")].args[index];
    }
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
    Set(index, argument, keepKwargs = false, keepSearch = false) {
        this.SetCase(index, argument.toLowerCase(), keepKwargs, keepSearch);
    }
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
    SetCase(index, argument, keepKwargs = false, keepSearch = false) {
        if (typeof index !== "number")
            throw new Error("Positional argument index must be typeof number");
        else if (index < 0)
            throw new Error("Positional argument index cannot be negative");
        else if ((argument = argument.trim().replace(/\+/gm, " ")).length == 0)
            throw new Error("Empty arguments cannot be supplied");
        else if ((index % 1) !== 0)
            throw new Error("Bro, indices shall not be fractions!");
        const args = __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).args;
        if (index > args.length)
            throw new Error("Index can at max be one higher than the current path tree, otherwise index position could not be guaranteed.");
        args.length = Math.min(index + 1, args.length);
        ;
        args[index] = argument;
        if (!keepKwargs)
            __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).kwargs.clear();
        if (!keepSearch)
            __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).search.clear();
        // If this is not a hash path update, clear hash
        if (__classPrivateFieldGet(this, _FP_PosArgs_layer, "f") != "hash") {
            Container.hash.args.length = 0;
            Container.hash.kwargs.clear();
            Container.hash.search.clear();
        }
        UpdateHistory();
    }
    /**
     * Clear all positional arguments.
     * @param keepKwargs Whether to keep the current kwargs
     * @param keepSearch Whether to keep the current search query
     */
    Clear(keepKwargs = false, keepSearch = false) {
        __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).args.length = 0;
        if (!keepKwargs)
            __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).kwargs.clear();
        if (!keepSearch)
            __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).search.clear();
        // If this is not a hash path update, clear hash
        if (__classPrivateFieldGet(this, _FP_PosArgs_layer, "f") != "hash") {
            Container.hash.args.length = 0;
            Container.hash.kwargs.clear();
            Container.hash.search.clear();
        }
        UpdateHistory();
    }
    Pop(amount) {
        if (typeof amount === "number") {
            if (amount <= 0)
                throw new Error("Cannot pop 0 or less positional arguments");
            else if ((amount % 1) !== 0)
                throw new Error("Bro, indices shall not be fractions!");
            const args = __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).args;
            amount = Math.min(args.length, amount);
            const popped = args.splice(args.length - 1 - amount, amount);
            UpdateHistory();
            return popped;
        }
        else if (amount != null)
            throw new Error("Pop amount must be numeric or empty");
        else {
            return __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).args.pop() ?? "";
        }
    }
    Push(...args) {
        const nargs = args.filter(s => typeof s === "string")
            .map(s => s.trim().toLowerCase())
            .filter(s => s.length > 0);
        if (nargs.length == 0)
            throw new Error("Cannot push empty positional argument");
        else if (nargs.length != args.length)
            throw new Error("Argument update rejected due to invalid fields");
        __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).args.push(...args);
        UpdateHistory();
    }
    PushCase(...args) {
        const nargs = args.filter(s => typeof s === "string")
            .map(s => s.trim())
            .filter(s => s.length > 0);
        if (nargs.length == 0)
            throw new Error("Cannot push empty positional argument");
        else if (nargs.length != args.length)
            throw new Error("Argument update rejected due to invalid fields");
        __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).args.push(...args);
        UpdateHistory();
    }
    /**
     * Updates the argument stack. This will also clear everything else but positional arguments.
     *
     * This call is **case insensitive**, always inserting lowercase values.
     * @param args New values (CASE SESITIVE)
     */
    Update(...args) {
        const nargs = args.filter(s => typeof s === "string").map(s => s.toLowerCase());
        this.UpdateCase(...nargs);
    }
    /**
     * Updates the argument stack. This will also clear everything else but positional arguments.
     *
     * This call is **case sensitive**.
     * @param args New values (CASE SESITIVE)
     */
    UpdateCase(...args) {
        const nargs = args.filter(s => typeof s === "string")
            .map(s => s.trim())
            .filter(s => s.length > 0);
        if (nargs.length == 0)
            throw new Error("Cannot push empty positional argument");
        else if (nargs.length != args.length)
            throw new Error("Argument update rejected due to invalid fields");
        __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).args = args;
        __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).kwargs.clear();
        __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).search.clear();
        // If this is not a hash path update, clear hash
        if (__classPrivateFieldGet(this, _FP_PosArgs_layer, "f") != "hash") {
            Container.hash.args.length = 0;
            Container.hash.kwargs.clear();
            Container.hash.search.clear();
        }
        UpdateHistory();
    }
    /**
     * Validates the argument amount. Will throw if the validation fails.
     * @param expectedLength Argument length to expect
     * @throws If the validation did not pass
     */
    ValidateLength(expectedLength) {
        const length = __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).args.length;
        if (length !== expectedLength)
            throw new Error(`Positional argument validation length did not pass. Got ${length}, expected ${expectedLength}.`);
    }
    /**
     * Validates the argument value at the given index case insensitive. Will throw if the validation fails.
     * @param index Argument index to validate
     * @param targetValue Value to expect
     * @throws If the validation did not pass
     */
    ValidateIndex(index, targetValue) {
        let testValue = __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).args[index];
        if (typeof testValue !== "string" || typeof targetValue !== "string" || (testValue = testValue.toLowerCase()) !== (targetValue = targetValue.toLowerCase().trim()))
            throw new Error(`Case insensitive positional argument validation did not pass. Got ${testValue}, expected ${targetValue}.`);
    }
    /**
     * Validates the argument value at the given index case sensitive. Will throw if the validation fails.
     * @param index Argument index to validate
     * @param targetValue Value to expect
     * @throws If the validation did not pass
     */
    ValidateIndexCase(index, targetValue) {
        const testValue = __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).args[index];
        if (testValue !== targetValue)
            throw new Error(`Case sensitive positional argument validation did not pass. Got ${testValue}, expected ${targetValue}.`);
    }
    /**
     * Validates the argument path case insensitive. Will throw if the validation fails.
     * @param args Path structure to validate. Passing "false" will ignore the current value.
     * @throws If the validation did not pass
     */
    ValidatePath(...args) {
        for (let i = 0; i < args.length; i++) {
            const testValue = __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).args[i];
            const targetValue = args[i];
            if (targetValue === false)
                continue;
            else if (typeof targetValue !== "string")
                throw new Error(`Case sensitive positional path validation failed at index ${i}: Target is non-string`);
            else if (typeof testValue !== "string" || (testValue.toLowerCase()) != (targetValue.toLowerCase()))
                throw new Error(`Case sensitive positional path validation failed at index ${i}: Got ${testValue}, expected ${targetValue}.`);
        }
    }
    /**
     * Validates the argument path case sensitive. Will throw if the validation fails.
     * @param args Path structure to validate. Passing "false" will ignore the current value.
     * @throws If the validation did not pass
     */
    ValidatePathCase(...args) {
        for (let i = 0; i < args.length; i++) {
            const testValue = __classPrivateFieldGet(this, _FP_PosArgs_instances, "a", _FP_PosArgs_container_get).args[i];
            const targetValue = args[i];
            if (targetValue === false)
                continue;
            else if (typeof targetValue !== "string")
                throw new Error(`Case sensitive positional path validation failed at index ${i}: Target is non-string`);
            else if (testValue != targetValue)
                throw new Error(`Case sensitive positional path validation failed at index ${i}: Got ${testValue}, expected ${targetValue}.`);
        }
    }
    OnUpdate(indexOrHandler, handler) {
        switch (typeof indexOrHandler) {
            case "number": return __classPrivateFieldGet(this, _FP_PosArgs_instances, "m", _FP_PosArgs_invokeListenerFunc).call(this, handler, "On", indexOrHandler);
            case "function": return __classPrivateFieldGet(this, _FP_PosArgs_instances, "m", _FP_PosArgs_invokeListenerFunc).call(this, indexOrHandler, "On");
            default: throw new Error("Invalid parameters for callback emitter registration");
        }
    }
    OffUpdate(indexOrHandler, handler) {
        switch (typeof indexOrHandler) {
            case "number": return __classPrivateFieldGet(this, _FP_PosArgs_instances, "m", _FP_PosArgs_invokeListenerFunc).call(this, handler, "Off", indexOrHandler);
            case "function": return __classPrivateFieldGet(this, _FP_PosArgs_instances, "m", _FP_PosArgs_invokeListenerFunc).call(this, indexOrHandler, "Off");
            default: throw new Error("Invalid parameters for callback emitter registration");
        }
    }
    OnceUpdate(indexOrHandler, handler) {
        switch (typeof indexOrHandler) {
            case "number": return __classPrivateFieldGet(this, _FP_PosArgs_instances, "m", _FP_PosArgs_invokeListenerFunc).call(this, handler, "Once", indexOrHandler);
            case "function": return __classPrivateFieldGet(this, _FP_PosArgs_instances, "m", _FP_PosArgs_invokeListenerFunc).call(this, indexOrHandler, "Once");
            default: throw new Error("Invalid parameters for callback emitter registration");
        }
    }
    GetUpdateListener(indexOrHandler, handler) {
        switch (typeof indexOrHandler) {
            case "number": return __classPrivateFieldGet(this, _FP_PosArgs_instances, "m", _FP_PosArgs_invokeListenerFunc).call(this, handler, "GetListener", indexOrHandler);
            case "function": return __classPrivateFieldGet(this, _FP_PosArgs_instances, "m", _FP_PosArgs_invokeListenerFunc).call(this, indexOrHandler, "GetListener");
            default: throw new Error("Invalid parameters for callback emitter registration");
        }
    }
}
_FP_PosArgs_layer = new WeakMap(), _FP_PosArgs_instances = new WeakSet(), _FP_PosArgs_container_get = function _FP_PosArgs_container_get() {
    return Container[__classPrivateFieldGet(this, _FP_PosArgs_layer, "f")];
}, _FP_PosArgs_invokeListenerFunc = function _FP_PosArgs_invokeListenerFunc(handler, funcName, index) {
    if (typeof handler !== "function")
        throw new Error("Handler is not functional type");
    if (index) {
        if (typeof index !== "number" || index < 0 || (index % 1) != 0)
            throw new Error("Index must be a whole number >= 0");
        return updatedEmitter[funcName](`${__classPrivateFieldGet(this, _FP_PosArgs_layer, "f")}-args-${index}`, handler);
    }
    else {
        return updatedEmitter[funcName](`${__classPrivateFieldGet(this, _FP_PosArgs_layer, "f")}-args`, handler);
    }
};
export default FP_PosArgs;
