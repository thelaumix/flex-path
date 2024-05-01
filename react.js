var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _FlexPathComponent_instances, _FlexPathComponent__fpMounted, _FlexPathComponent__fpListeners, _FlexPathComponent__pushListener, _FlexPathComponent__makeAddFn;
/*!
 * FlexPath React Extension
 * 2024 Lukas A. Schopf // thelaumix productions
 */
import { Component, useEffect, useState } from "react";
import { updatedEmitter } from "./runtime/emitter.js";
import { Container } from "./runtime/storage.js";
import { validateKey } from "./controllers/kwargs.js";
/**
 * React capable class component natively supporting modular re-rendering
 * @abstract
 */
export class FlexPathComponent extends Component {
    constructor(props) {
        super(props);
        _FlexPathComponent_instances.add(this);
        _FlexPathComponent__fpMounted.set(this, false);
        _FlexPathComponent__fpListeners.set(this, new Set);
        /**
         * Adds a listener to this class that reacts to FlexPath struct updates.
         *
         * Listeners will *automatically be disabled once the component unmounts*. If rerendering is not disabled,
         *   the forced update is guaranteed to occur **after** the callback invocation
         *
         * @param handler Update handler function
         * @param skipRerendering Whether to skip the forced render update in case the path changes.
         */
        this.addFpArgsListener = __classPrivateFieldGet(this, _FlexPathComponent_instances, "m", _FlexPathComponent__makeAddFn).call(this, "main", "args", true);
        /**
         * Adds a listener to this class that reacts to FlexPath positional argument updates.
         *
         * Listeners will *automatically be disabled once the component unmounts*. If rerendering is not disabled,
         *   the forced update is guaranteed to occur **after** the callback invocation
         *
         * @param index Argument index
         * @param handler Update handler function
         * @param skipRerendering Whether to skip the forced render update in case the path changes.
         */
        this.addFpArgListener = __classPrivateFieldGet(this, _FlexPathComponent_instances, "m", _FlexPathComponent__makeAddFn).call(this, "main", "args", false);
        /**
         * Adds a listener to this class that reacts to FlexPath keyword argument updates.
         *
         * Listeners will *automatically be disabled once the component unmounts*. If rerendering is not disabled,
         *   the forced update is guaranteed to occur **after** the callback invocation
         *
         * @param key Argument keyword literal
         * @param handler Update handler function
         * @param skipRerendering Whether to skip the forced render update in case the path changes.
         */
        this.addFpKwargsListener = __classPrivateFieldGet(this, _FlexPathComponent_instances, "m", _FlexPathComponent__makeAddFn).call(this, "main", "kwargs", false);
        /**
         * Adds a listener to this class that reacts to FlexPath search param updates.
         *
         * Listeners will *automatically be disabled once the component unmounts*. If rerendering is not disabled,
         *   the forced update is guaranteed to occur **after** the callback invocation
         *
         * @param key Search param literal
         * @param handler Update handler function
         * @param skipRerendering Whether to skip the forced render update in case the path changes.
         */
        this.addFpSearchListener = __classPrivateFieldGet(this, _FlexPathComponent_instances, "m", _FlexPathComponent__makeAddFn).call(this, "main", "search", false);
        /**
         * Adds a listener to this class that reacts to FlexPath hash struct updates.
         *
         * Listeners will *automatically be disabled once the component unmounts*. If rerendering is not disabled,
         *   the forced update is guaranteed to occur **after** the callback invocation
         *
         * @param handler Update handler function
         * @param skipRerendering Whether to skip the forced render update in case the path changes.
         */
        this.addFpHashArgsListener = __classPrivateFieldGet(this, _FlexPathComponent_instances, "m", _FlexPathComponent__makeAddFn).call(this, "hash", "args", true);
        /**
         * Adds a listener to this class that reacts to FlexPath positional hash argument updates.
         *
         * Listeners will *automatically be disabled once the component unmounts*. If rerendering is not disabled,
         *   the forced update is guaranteed to occur **after** the callback invocation
         *
         * @param index Argument index
         * @param handler Update handler function
         * @param skipRerendering Whether to skip the forced render update in case the path changes.
         */
        this.addFpHashArgListener = __classPrivateFieldGet(this, _FlexPathComponent_instances, "m", _FlexPathComponent__makeAddFn).call(this, "hash", "args", false);
        /**
         * Adds a listener to this class that reacts to FlexPath hash keyword argument updates.
         *
         * Listeners will *automatically be disabled once the component unmounts*. If rerendering is not disabled,
         *   the forced update is guaranteed to occur **after** the callback invocation
         *
         * @param key Argument keyword literal
         * @param handler Update handler function
         * @param skipRerendering Whether to skip the forced render update in case the path changes.
         */
        this.addFpHashKwargsListener = __classPrivateFieldGet(this, _FlexPathComponent_instances, "m", _FlexPathComponent__makeAddFn).call(this, "hash", "kwargs", false);
        /**
         * Adds a listener to this class that reacts to FlexPath hash search param updates.
         *
         * Listeners will *automatically be disabled once the component unmounts*. If rerendering is not disabled,
         *   the forced update is guaranteed to occur **after** the callback invocation
         *
         * @param key Search param literal
         * @param handler Update handler function
         * @param skipRerendering Whether to skip the forced render update in case the path changes.
         */
        this.addFpHashSearchListener = __classPrivateFieldGet(this, _FlexPathComponent_instances, "m", _FlexPathComponent__makeAddFn).call(this, "hash", "search", false);
        const fnMount = this.componentDidMount;
        this.componentDidMount = () => {
            if (!__classPrivateFieldGet(this, _FlexPathComponent__fpMounted, "f")) {
                __classPrivateFieldSet(this, _FlexPathComponent__fpMounted, true, "f");
                __classPrivateFieldGet(this, _FlexPathComponent__fpListeners, "f").forEach(listener => listener.enabled = true);
            }
            fnMount?.call(this);
        };
        const fnUnmnt = this.componentWillUnmount;
        this.componentWillUnmount = () => {
            if (__classPrivateFieldGet(this, _FlexPathComponent__fpMounted, "f")) {
                __classPrivateFieldSet(this, _FlexPathComponent__fpMounted, false, "f");
                __classPrivateFieldGet(this, _FlexPathComponent__fpListeners, "f").forEach(listener => listener.enabled = false);
            }
            fnUnmnt?.call(this);
        };
    }
}
_FlexPathComponent__fpMounted = new WeakMap(), _FlexPathComponent__fpListeners = new WeakMap(), _FlexPathComponent_instances = new WeakSet(), _FlexPathComponent__pushListener = function _FlexPathComponent__pushListener(listener) {
    if (!__classPrivateFieldGet(this, _FlexPathComponent__fpMounted, "f"))
        listener.enabled = false;
    __classPrivateFieldGet(this, _FlexPathComponent__fpListeners, "f").add(listener);
}, _FlexPathComponent__makeAddFn = function _FlexPathComponent__makeAddFn(layer, map, nokey) {
    if (map === "args") {
        if (nokey) {
            return (handler, skipRerendering, callInitial) => {
                __classPrivateFieldGet(this, _FlexPathComponent_instances, "m", _FlexPathComponent__pushListener).call(this, updatedEmitter.GetListener(`${layer}-args`, async (...args) => {
                    if (handler)
                        await handler(...args);
                    if (skipRerendering !== true)
                        this.forceUpdate();
                }));
                if (callInitial && handler)
                    handler(...Container[layer].args);
            };
        }
        else {
            return (index, handler, skipRerendering, callInitial) => {
                if (typeof index !== "number" || index < 0 || (index % 1) !== 0)
                    throw new Error("Invalid index value");
                __classPrivateFieldGet(this, _FlexPathComponent_instances, "m", _FlexPathComponent__pushListener).call(this, updatedEmitter.GetListener(`${layer}-args-${index}`, async (val) => {
                    if (handler)
                        await handler(val);
                    if (skipRerendering !== true)
                        this.forceUpdate();
                }));
                if (callInitial && handler)
                    handler(Container[layer].args[index]);
            };
        }
    }
    else {
        return (key, handler, skipRerendering, callInitial) => {
            if (typeof key !== "string")
                throw new Error("Invalid key value");
            validateKey(key);
            __classPrivateFieldGet(this, _FlexPathComponent_instances, "m", _FlexPathComponent__pushListener).call(this, updatedEmitter.GetListener(`${layer}-${map}-${key}`, async (vals) => {
                if (handler)
                    await handler(vals);
                if (skipRerendering !== true)
                    this.forceUpdate();
            }));
            if (callInitial && handler)
                handler(Container[layer][map].get(key) || []);
        };
    }
};
/** Initial value helper */
function getInitialValue(layer, map, nokey, key) {
    if (map === "args" && (typeof key === "number" || key == null))
        return nokey ? Container[layer][map] : Container[layer][map][key];
    else if (map !== "args" && typeof key === "string") {
        validateKey(key);
        return Container[layer][map].get(key) || [];
    }
    else
        throw new Error("Invalid key value");
}
function makeHook(layer, map, nokey) {
    return (key) => {
        const [val, setVal] = useState(getInitialValue(layer, map, nokey, key));
        useEffect(() => {
            const listener = updatedEmitter.GetListener((map == "args" && key == null) ? `${layer}-${map}` : `${layer}-${map}-${key}`, (...args) => {
                if (map == "args") {
                    if (key == null)
                        setVal(args);
                    else
                        setVal(args[0]);
                }
                else {
                    setVal(args[0]);
                }
            });
            return () => { listener.enabled = false; };
        }, [val]);
        return val;
    };
}
/**
 * **React Hook:**
 * Returns a stateful value holding the current FlexPath args
 */
export const useFpArgs = makeHook("main", "args", true);
/**
 * **React Hook:**
 * Returns a stateful value holding the FlexPath argument at the given index
 * @param index Index to watch
 */
export const useFpArg = makeHook("main", "args", false);
/**
 * **React Hook:**
 * Returns a stateful value holding the FlexPath keyword argument(s) at the specified key
 * @param key Key literal for keyword arguments
 */
export const useFpKwargs = makeHook("main", "kwargs", false);
/**
 * **React Hook:**
 * Returns a stateful value holding the FlexPath search parameter(s) at the specified key
 * @param key Search param literal
 */
export const useFpSearch = makeHook("main", "search", false);
/**
 * **React Hook:**
 * Returns a stateful value holding the current FlexPath hash args
 */
export const useFpHashArgs = makeHook("hash", "args", true);
/**
 * **React Hook:**
 * Returns a stateful value holding the FlexPath hash argument at the given index
 * @param index Index to watch
 */
export const useFpHashArg = makeHook("hash", "args", false);
/**
 * **React Hook:**
 * Returns a stateful value holding the FlexPath hash keyword argument(s) at the specified key
 * @param key Key literal for keyword arguments
 */
export const useFpHashKwargs = makeHook("hash", "kwargs", false);
/**
 * **React Hook:**
 * Returns a stateful value holding the FlexPath hash search parameter(s) at the specified key
 * @param key Search param literal
 */
export const useFpHashSearch = makeHook("hash", "search", false);
