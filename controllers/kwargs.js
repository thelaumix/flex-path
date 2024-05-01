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
var _FP_KwArgs_instances, _FP_KwArgs_layer, _FP_KwArgs_map, _FP_KwArgs_container_get, _FP_KwArgs_invokeListenerFunc;
import { updatedEmitter } from "../runtime/emitter.js";
import { Container } from "../runtime/storage.js";
import { UpdateHistory } from "./location-controller.js";
export const validateKey = (arg) => {
    if (/^[a-z0-9äöü_\-]+$/ig.test(arg) !== true)
        throw new Error(`"${arg}" is not a valid key literal.`);
};
/**
 * Keyword argument handler
 *
 * Supports object-like indexing to quickly access and update fields. These updates will ALWAYS be lowercased.
 * For case sensitive updates, refer to `SetCase()` or `AddCase()`
 */
class FP_KwArgs {
    constructor(layer, map) {
        _FP_KwArgs_instances.add(this);
        _FP_KwArgs_layer.set(this, void 0);
        _FP_KwArgs_map.set(this, void 0);
        __classPrivateFieldSet(this, _FP_KwArgs_layer, layer, "f");
        __classPrivateFieldSet(this, _FP_KwArgs_map, map, "f");
        /**
         * Proxy to enable indexing on the kwargs class
         */
        return new Proxy(this, {
            get: (_, prop) => {
                if (typeof prop === "string" && this[prop] == null) {
                    return __classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).get(prop) || [];
                }
                return (...x) => this[prop](...x);
            },
            set: (_, prop, newValue) => {
                if (typeof prop === "string" && this[prop] == null) {
                    this.Set(prop, newValue);
                }
                return false;
            }
        });
    }
    /**
     * Fetches first value for the provided key.
     *
     * This call is <i>case insensitive</i>, always returning lowercase.
     * @param key Key to look up
     * @returns Current value or undefined.
     */
    Get(key) {
        return this.GetAll(key)[0];
    }
    /**
     * Fetches first value for the provided key.
     *
     * This call is <i>case sensitive</i>.
     * @param key Key to look up
     * @returns Current value or undefined.
     */
    GetCase(key) {
        return this.GetAllCase(key)[0];
    }
    /**
     * Fetches all values for the provided key.
     *
     * This call is <i>case insensitive</i>, always returning lowercase.
     * @param key Key to look up
     * @returns Array containing all current values.
     */
    GetAll(key) {
        validateKey(key);
        return (__classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).get(key) ?? []).map(x => x.toLowerCase());
    }
    /**
     * Fetches all values for the provided key.
     *
     * This call is <i>case sensitive</i>.
     * @param key Key to look up
     * @returns Array containing all current values.
     */
    GetAllCase(key) {
        validateKey(key);
        return __classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).get(key) ?? [];
    }
    /**
     * Clear all fields
     */
    Clear() {
        __classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).clear();
        UpdateHistory();
    }
    Set(key, ...values) {
        validateKey(key);
        values = values.flat()
            .filter(s => typeof s == "string")
            .map(s => s.trim().toLowerCase())
            .filter(s => s.length > 0);
        if (values.length == 0)
            throw new Error("Invalid value(s)");
        __classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).set(key, values);
        UpdateHistory();
    }
    SetCase(key, ...values) {
        validateKey(key);
        values = values.flat()
            .filter(s => typeof s == "string")
            .map(s => s.trim())
            .filter(s => s.length > 0);
        if (values.length == 0)
            throw new Error("Invalid value(s)");
        __classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).set(key, values);
        UpdateHistory();
    }
    /**
     * Adds one or more values to a given key literal.
     * This will also prevent duplicates from being inserted, thus acting like a `Set`.
     *
     * This call is **case insensitive**.
     * @param key Key to update
     * @param values New values *(case insensitive)*
     */
    Add(key, ...values) {
        validateKey(key);
        values = values.flat()
            .filter(s => typeof s == "string")
            .map(s => s.trim().toLowerCase())
            .filter(s => s.length > 0);
        if (values.length == 0)
            throw new Error("Invalid value(s)");
        const prev = __classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).get(key) || [];
        const prevLc = prev.map(x => x.toLowerCase());
        __classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).set(key, [...prev, ...values.filter(k => !prevLc.includes(k.toLowerCase()))]);
        UpdateHistory();
    }
    AddCase(key, ...values) {
        validateKey(key);
        values = values.flat()
            .filter(s => typeof s == "string")
            .map(s => s.trim())
            .filter(s => s.length > 0);
        if (values.length == 0)
            throw new Error("Invalid value(s)");
        const prev = __classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).get(key) || [];
        __classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).set(key, [...prev, ...values.filter(k => !prev.includes(k))]);
        UpdateHistory();
    }
    Delete(key, ...values) {
        validateKey(key);
        if (values.length == 0) {
            __classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).delete(key);
        }
        else {
            values = values.flat()
                .filter(s => typeof s == "string")
                .map(s => s.trim().toLowerCase())
                .filter(s => s.length > 0);
            if (values.length == 0)
                throw new Error("Invalid value(s)");
            const prev = __classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).get(key) || [];
            for (let i = prev.length - 1; i >= 0; i--) {
                if (values.includes(prev[i].toLowerCase()))
                    prev.splice(i, 1);
            }
            if (prev.length == 0)
                __classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).delete(key);
            else
                __classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).set(key, [...prev]);
        }
        UpdateHistory();
    }
    /**
     * Validates the existance of any values on the provided key literal. Will throw if the validation fails.
     * @param key Key literal to validate.
     * @throws If the validation did not pass
     */
    ValidateKey(key) {
        const map = __classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).get(key);
        if (!map || map.length == 0)
            throw new Error(`Key validation failed for ${__classPrivateFieldGet(this, _FP_KwArgs_layer, "f")} ${__classPrivateFieldGet(this, _FP_KwArgs_map, "f")}: ${key} not set`);
    }
    /**
     * Validates the existance of the provided values on the provided key literal **case insensitive**. Will throw if the validation fails.
     * @param key Key literal
     * @param values The values to be matched
     * @throws If the validation did not pass
     */
    ValidateValues(key, ...values) {
        const map = (__classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).get(key) || []).map(s => s.toLowerCase());
        if (map.length == 0)
            throw new Error(`Key validation failed for ${__classPrivateFieldGet(this, _FP_KwArgs_layer, "f")} ${__classPrivateFieldGet(this, _FP_KwArgs_map, "f")}: ${key} not set`);
        for (const val of values) {
            if (!map.includes(val.toLowerCase()))
                throw new Error(`Case insensitive key validation failed for ${__classPrivateFieldGet(this, _FP_KwArgs_layer, "f")} ${__classPrivateFieldGet(this, _FP_KwArgs_map, "f")} with key "${key}": Value "${val.toLowerCase()}" not set`);
        }
    }
    /**
     * Validates the existence of all provided values on the provided key literal **case sensitive**. Will throw if the validation fails.
     * @param key Key literal
     * @param values The values to be matched
     * @throws If the validation did not pass
     */
    ValidateValuesCase(key, ...values) {
        const map = (__classPrivateFieldGet(this, _FP_KwArgs_instances, "a", _FP_KwArgs_container_get).get(key) || []);
        if (map.length == 0)
            throw new Error(`Key validation failed for ${__classPrivateFieldGet(this, _FP_KwArgs_layer, "f")} ${__classPrivateFieldGet(this, _FP_KwArgs_map, "f")}: ${key} not set`);
        for (const val of values) {
            if (!map.includes(val))
                throw new Error(`Case sensitive key validation failed for ${__classPrivateFieldGet(this, _FP_KwArgs_layer, "f")} ${__classPrivateFieldGet(this, _FP_KwArgs_map, "f")} with key "${key}": Value "${val.toLowerCase()}" not set`);
        }
    }
    /**
     * Registers a handler function for value changes on the provided key.
     *
     * Event values will always be returned **case sensitive**
     * @param key Key literal
     * @param handler Update handler
     */
    OnUpdate(key, handler) {
        return __classPrivateFieldGet(this, _FP_KwArgs_instances, "m", _FP_KwArgs_invokeListenerFunc).call(this, handler, "On", key);
    }
    /**
     * Unregisters a handler function for value changes on the provided key.
     *
     * Event values will always be returned **case sensitive**
     * @param key Key literal
     * @param handler Update handler
     */
    OffUpdate(key, handler) {
        return __classPrivateFieldGet(this, _FP_KwArgs_instances, "m", _FP_KwArgs_invokeListenerFunc).call(this, handler, "Off", key);
    }
    /**
     * Registers a handler function for value changes on the provided key.
     *
     * Event values will always be returned **case sensitive**
     * @param key Key literal
     * @param handler Update handler
     */
    OnceUpdate(key, handler) {
        return __classPrivateFieldGet(this, _FP_KwArgs_instances, "m", _FP_KwArgs_invokeListenerFunc).call(this, handler, "Once", key);
    }
    /**
     * Creates a callback listener with the provided handler function for value changes on the provided key.
     *
     * Event values will always be returned **case sensitive**
     * @param key Key literal
     * @param handler Update handler
     */
    GetUpdateListener(key, handler) {
        return __classPrivateFieldGet(this, _FP_KwArgs_instances, "m", _FP_KwArgs_invokeListenerFunc).call(this, handler, "GetListener", key);
    }
}
_FP_KwArgs_layer = new WeakMap(), _FP_KwArgs_map = new WeakMap(), _FP_KwArgs_instances = new WeakSet(), _FP_KwArgs_container_get = function _FP_KwArgs_container_get() {
    return Container[__classPrivateFieldGet(this, _FP_KwArgs_layer, "f")][__classPrivateFieldGet(this, _FP_KwArgs_map, "f")];
}, _FP_KwArgs_invokeListenerFunc = function _FP_KwArgs_invokeListenerFunc(handler, funcName, key) {
    if (typeof handler !== "function")
        throw new Error("Handler is not functional type");
    validateKey(key);
    return updatedEmitter[funcName](`${__classPrivateFieldGet(this, _FP_KwArgs_layer, "f")}-${__classPrivateFieldGet(this, _FP_KwArgs_map, "f")}-${key}`, handler);
};
export default FP_KwArgs;
