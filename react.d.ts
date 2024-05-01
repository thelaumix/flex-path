/*!
 * FlexPath React Extension
 * 2024 Lukas A. Schopf // thelaumix productions
 */
import { Component } from "react";
import { PathParamMulti, PathParamSingle } from "./runtime/emitter.js";
/**
 * React capable class component natively supporting modular re-rendering
 * @abstract
 */
export declare abstract class FlexPathComponent<P = {}, S = {}, SS = any> extends Component<P, S, SS> {
    #private;
    constructor(props: P);
    /**
     * Adds a listener to this class that reacts to FlexPath struct updates.
     *
     * Listeners will *automatically be disabled once the component unmounts*. If rerendering is not disabled,
     *   the forced update is guaranteed to occur **after** the callback invocation
     *
     * @param handler Update handler function
     * @param skipRerendering Whether to skip the forced render update in case the path changes.
     */
    protected addFpArgsListener: (handler?: (...args: PathParamMulti) => void | Promise<void>, skipRerendering?: boolean, callInitial?: boolean) => void;
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
    protected addFpArgListener: (index: number, handler?: (value: PathParamSingle) => void | Promise<void>, skipRerendering?: boolean, callInitial?: boolean) => void;
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
    protected addFpKwargsListener: (key: string, handler?: (values: PathParamMulti) => void | Promise<void>, skipRerendering?: boolean, callInitial?: boolean) => void;
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
    protected addFpSearchListener: (key: string, handler?: (values: PathParamMulti) => void | Promise<void>, skipRerendering?: boolean, callInitial?: boolean) => void;
    /**
     * Adds a listener to this class that reacts to FlexPath hash struct updates.
     *
     * Listeners will *automatically be disabled once the component unmounts*. If rerendering is not disabled,
     *   the forced update is guaranteed to occur **after** the callback invocation
     *
     * @param handler Update handler function
     * @param skipRerendering Whether to skip the forced render update in case the path changes.
     */
    protected addFpHashArgsListener: (handler?: (...args: PathParamMulti) => void | Promise<void>, skipRerendering?: boolean, callInitial?: boolean) => void;
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
    protected addFpHashArgListener: (index: number, handler?: (value: PathParamSingle) => void | Promise<void>, skipRerendering?: boolean, callInitial?: boolean) => void;
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
    protected addFpHashKwargsListener: (key: string, handler?: (values: PathParamMulti) => void | Promise<void>, skipRerendering?: boolean, callInitial?: boolean) => void;
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
    protected addFpHashSearchListener: (key: string, handler?: (values: PathParamMulti) => void | Promise<void>, skipRerendering?: boolean, callInitial?: boolean) => void;
}
/**
 * **React Hook:**
 * Returns a stateful value holding the current FlexPath args
 */
export declare const useFpArgs: () => PathParamMulti;
/**
 * **React Hook:**
 * Returns a stateful value holding the FlexPath argument at the given index
 * @param index Index to watch
 */
export declare const useFpArg: (index: number) => PathParamSingle;
/**
 * **React Hook:**
 * Returns a stateful value holding the FlexPath keyword argument(s) at the specified key
 * @param key Key literal for keyword arguments
 */
export declare const useFpKwargs: (key: string) => PathParamMulti;
/**
 * **React Hook:**
 * Returns a stateful value holding the FlexPath search parameter(s) at the specified key
 * @param key Search param literal
 */
export declare const useFpSearch: (key: string) => PathParamMulti;
/**
 * **React Hook:**
 * Returns a stateful value holding the current FlexPath hash args
 */
export declare const useFpHashArgs: () => PathParamMulti;
/**
 * **React Hook:**
 * Returns a stateful value holding the FlexPath hash argument at the given index
 * @param index Index to watch
 */
export declare const useFpHashArg: (index: number) => PathParamSingle;
/**
 * **React Hook:**
 * Returns a stateful value holding the FlexPath hash keyword argument(s) at the specified key
 * @param key Key literal for keyword arguments
 */
export declare const useFpHashKwargs: (key: string) => PathParamMulti;
/**
 * **React Hook:**
 * Returns a stateful value holding the FlexPath hash search parameter(s) at the specified key
 * @param key Search param literal
 */
export declare const useFpHashSearch: (key: string) => PathParamMulti;
