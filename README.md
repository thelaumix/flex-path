# FlexPath [![NPM package](https://img.shields.io/badge/npm-flex--path-%23CB3837?logo=npm)](https://react.dev/) [![React (optional)](https://img.shields.io/badge/React%20(optional)-%5E18.2.0-x?logo=react&logoColor=%2361DAFB&color=%2361DAFB)](https://react.dev/)


**FlexPath** attempts to translate the concept of Python's `*args` and `**kwargs` into an alternative URL scheme, with the aim of enhancing functionality and flexibility on SPAs. It manages the history state machine and `<a>` tag interactions, while allowing for complete control over the current path, arguments and parameters.

- **Getting Started**
	- [Usage](#usage)
	- [Naming & Scheme](#naming--scheme)
	- [Handling updates & events](#handling-events)
	- [React integration](#react-integration)
	- [Background & Motivation](#background--motivation)
- [**API Reference**](#api-reference)
- [Patch Notes](#patch-notes)
- [TODOs](#%F0%9F%97%92%EF%B8%8F-todos) *(aka. "plans for the future")*


## Usage

To start using the **FlexPath** library, you need to - for sure - import it first:

```ts
import FlexPath from 'flex-path';
```

From this point on, each `<a>`-tag will be routed through the FlexPath system, respecting the `target` attribute. From now on, you can easily use HTML `<a>` tags or the FlexPath API to navigate your page. Each modification to the FlexPath state machine will immediately update the URL accordingly.

```ts
/*** NAVIGATE SOMEWHERE ***/
FlexPath.args.Update("home", "info");
//   --> /home/info

// This can also be done by path strings...
FlexPath.raw = "/home/info"
// ...or by function call
FlexPath.NavigateTo("/home/info");



/*** UPDATE ARGUMENT 1 ***/
FlexPath.args.Set(1, "about");
//   --> /home/about

/*** UPDATE KWARG FOR SORTING ***/
FlexPath.kwargs.Set("sort", "name");
//   --> /home/about/sort:name

/*** GO TO HOME PAGE ***/
FlexPath.args.Clear();
//   --> /

/*** APPLY MULTIPLE CHANGES BY FREEZING ***/
FlexPath.Freeze();	  // <-- Everything after that won't be immediately applied
FlexPath.args.Update("shop", "items");
FlexPath.kwargs.Set("category", "pets");
FlexPath.kwargs.Set("sort", "relevant");
FlexPath.search.Set("view", "1");
FlexPath.Unfreeze();  // <-- Hereby any changes will be applied at once
//   --> /shop/items/category:pets/sort:relevant?view=1
```

> ⚠️ It is **highly recommended NOT to use** the standard APIs such as `history.pushState` or `location.hash` for changing the navigation along this, as they will likely collide with the FlexPath system.



## Naming & Scheme
FlexPath deconstructs any URL pathname by the following scheme:
```php
   /arg1/arg2/kwarg1:x/kwarg2:y?query=stuff#hash/can:be?the=same
   |--ARGS---|-----KWARGS------|--SEARCH--|--------HASH---------|
```

- **`ARGS`** are the "traditional" positional arguments, handled by a [positional stack controller](#positional-stack-controller). This can be used to dictate the basic structure of the current navigation position within the app.
- **`KWARGS`** are the new stuff. They come in a `key:value` representation, being a more readable and slightly more beautiful variant of traditional search query params. Kwargs are handled by a [keyword stack controller](#keyword-stack-controller)
	- Multiple keyword arguments can be chained together, so paths like `/x:12/x:abc` are possible.
	- **key** literals **must** consist of alphanumeric symbols as well as `_` and `-`. *(same goes for search params)*
- **`SEARCH`** is nothing new, just good old search queries. These fields are also handled by a [keyword stack controller](#keyword-stack-controller)
- **`HASH`** represents an entirely seperate subsystem here. While the hash can still be used to e.g. navigate to ID anchors, FlexPath allows for a completely seperate "sub path" to be stored within the hash, itself again consisting of `ARGS`, `KWARGS` and `SEARCH`.

The order is important, so `KWARGS` cannot precede `ARGS`. Multiple slashes will be ignored, so `//slash////path` won't result in multiple empty arguments.
The basic idea is to go from this
```
https://my-webpage.com/shop/items?category=523&filter=shower%20heads&sort=recent
```
to this
```
https://my-webpage.com/shop/items/category:523/filter:shower+heads/sort:recent
```
while *still* maintaining the ability to extend to search params and even the hash part if *really* needed. But the ultimate goal should be to *prevent* bloated URLs such as the above. Ideally, you should only be in need of `ARGS` and `KWARGS`.


## Handling events

To watch for any kind of path changes, FlexPath comes with a handful events to watch for updates in the path state machine. Events are provided by the stack controllers, allowing precise listening and flexible handling *(see the [*API Reference*](#api-reference) for more detailed information)*.

```ts
function handleArg0Update(newArg: string | undefined) {
	// Do something with the new argument value
}

function handleSearchUpdate(newValues: string[]) {
	// keyword argument updates always provide an array
	// due to their ability of containing multiple values
	// for the same key
}

FlexPath.args.OnUpdate(0, handleArg0Update);
FlexPath.kwargs.OnUpdate("search", handleSearchUpdate);


// When you don't wish to receive updates anymore, simply unregister the event
FlexPath.args.OffUpdate(0, handleArg0Update);
```

## React Integration

To integrate with the **React** framework more easily, FlexPath optionally provides a set of hooks as well as an abstract class component derivate to simplify path state updates.

### Hooks
```jsx
import { useFpArg, useFpKwargs } from 'flex-path/react'

function AwesomePathReactiveComponent() {
	const mainPage = useFpArg(0);
	const [search] = useFpKwargs("search")

	return <></>
}
```

- **`useFpArgs()`**: *string[]*<br>Entire positional argument stack
- **`useFpArg(index: number)`**: *string | undefined*<br>Specific positional argument
- **`useFpKwargs(key: string)`**: *string[]*<br>Keyword argument values
- **`useFpSearch(key: string)`**: *string[]*<br>Search param values
- **`useFpHashArgs()`**: *string[]*<br>Entire positional argument stack on hash subpath
- **`useFpHashArg(index: number)`**: *string | undefined*<br>Specific positional argument on hash subpath
- **`useFpHashKwargs(key: string)`**: *string[]*<br>Keyword argument values on hash subpath
- **`useFpHashSearch(key: string)`**: *string[]*<br>Search param values on hash subpath

### Class Components

The `FlexPathComponent` class inherits directly from React's very own `Component`, so the core functionalities are the same. Other than that, a `FlexPathComponent` comes with a built-in listener management, so any registered listeners and handlers will only be active after mounting and the initial render call, and are safely unregistered once the component unmounts.

```jsx
import { FlexPathComponent } from 'flex-path/react'

class AwesomePathReactiveComponent extends FlexPathComponent {
	constructor(props) {
		super(props);
		this.addFpArgListener(0, (newArg) => {...});
		
		// Listeners can also be added without a handler attached.
		// In this case, the event will only re-render the component.
		this.addFpKwargsListener("search");
	}
	
	render() {
		...
	}
}
```

  Any handlers provided to the listener will receive the respective value types described as return types in the [Hooks](#hooks) section. From within the class accessible methods are:

- **`addFpArgsListener(handler?, skipRendering?)`**<br>Entire  positional argument stack
- **`addFpArgListener(index:  number, handler?, skipRendering?)`**<br>Specific positional argument
- **`addFpKwargsListener(key:  string, handler?, skipRendering?)`**<br>Keyword  argument values
- **`addFpSearchListener(key:  string, handler?, skipRendering?)`**<br>Search  param values
- **`addFpHashArgsListener(handler?, skipRendering?)`**<br>Entire  positional argument stack on hash subpath
- **`addFpHashArgListener(index:  number, handler?, skipRendering?)`**<br>Specific positional argument on hash subpath
- **`addFpHashKwargsListener(key:  string, handler?, skipRendering?)`**<br>Keyword  argument values on hash subpath
- **`addFpHashSearchListener(key:  string, handler?, skipRendering?)`**<br>Search  param values on hash subpath

> To prevent further bloatage, no more state storing is done by the class component. Instead, it simply forces a rerender once one of the active listeners is invoked. 
> If you with to handle the values and updates with reacts built-in states instead of manually fetching the values from the `FlexPath` controller, you need to enable `skipRendering` and implement this functionality yourself.


## Background & Motivation

Dealing with the traditional URL scheme is fine and all, but with all the different layers, levels, subsystems, and complex structures that an SPA can take on, it can be pretty tough to navigate using classic linear-parametric URL path arguments. Not only can it be a hassle to worry about reliable and comprehensive handling of history events and link clicks, but the linear `/one/argument/chase/that/other` structure can also get pretty tedious. While it does a great job of representing a directory-like structure (that's where it comes from after all), it doesn't reflect the complexity of SPAs that is sometimes required in an equally useful way.

Search queries should definitely attempt to solve this problem, but they now raise a more aesthetic problem. Sending and receiving completely overloaded links in the style of `https://my-page.org/path/to/shop?view=article&filter=advanced%20socks%20with%20ears&orderby=name&ordermd=desc` immediately deconstructs any intentions of even trying to understand what the heck is going on there. This method cannot be called visually appealing.

So with that and Python's `*args` and `**kwargs` parameter system in mind, FlexPath attempts to union the traditional URL path scheme with a more sleak, modular approach.



# API Reference

| |Method Badges|
|-|-|
|🔤| **Case Sensitivity**<br>Method describes a *case insensitive* version, but a *case sensitive* variant exists.<br>Usually these variants are suffixed by `Case`. |
|⚡| **Event Related**<br>Method interacts with the event system.<br>See [lux-callback-emitter](https://www.npmjs.com/package/lux-callback-emitter) for details about handler registration schemes. |
|🔰| **Test Method**<br>Serves as a verificator. Throws an error if the test did not pass. |


## FlexPath Base

### Parameters

||Type|Description|
|-|-|-|
| `.args` | [PositionalStackController](#positional-stack-controller) | Controller for any positional arguments in the **main** URL path. |
| `.kwargs` | [KeywordStackController](#keyword-stack-controller) | Controller for all keyword arguments in the **main** URL path. |
| `.search` | [KeywordStackController](#keyword-stack-controller) | Controller for all search query values in the **main** URL path. |
| `.hashArgs` | [PositionalStackController](#positional-stack-controller) | Controller for any positional arguments in the **hash** URL path. |
| `.hashKwargs` | [KeywordStackController](#keyword-stack-controller) | Controller for all keyword arguments in the **hash** URL path. |
| `.hashSearch` | [KeywordStackController](#keyword-stack-controller) | Controller for all search query values in the **hash** URL path. |
| `.raw` | *string* | Raw and **full** path, including search queries and hash.<br>Updating this will navigate towards it. If you supply an external path, it will be opened in a new tab. |
| `.stateMode` | [*HistoryCallMode*](#historycallmode) | The global history state machine mode.<br>Defaults to `push`. |



### `.NavigateTo(path)`
Fetches the positional argument value at the given index, if existing. <br>This version is **case insensitive**, always returning lowercase. <br>**Returns:** *string*.
|Parameter|Description|
|-|-|
|`path` *: string \| URL*| URL or path literal to navigate to |


### `.NavigateTo(path, target)`
Same as above, but includes target specification
|Parameter|Description|
|-|-|
|`path` *: string \| URL* | URL or path literal to navigate to |
|`target` *: string* | Href target |


### `.NavigateTo(path, newTab)`
Same as above, but allows easy "new tab"-behaviour by targeting to `_blank` if `target` is set to `true`
|Parameter|Description|
|-|-|
|`path` *: string \| URL* | URL or path literal to navigate to |
|`newTab` *: boolean* | Whether to open the path in a new tab |



### `.Freeze()`
Freezes the history state machine. This allows multiple updates without invoking a history state call each time.
|Parameter|Description|
|-|-|
|`path` *: string \| URL*| URL or path literal to navigate to |

> **NOTICE:** 
> Remember to `Unfreeze()` the engine again once you're done!



### `.Unfreeze(mode?)`
Unfreezes the history state machine and applys all intermediate updates.
|Parameter|Description|
|-|-|
|`mode`*? : [HistoryCallMode](#historycallmode)*| Defaults to `FlexPath.stateMode`<br>Override the current global state mode for this unfreeze action |



### `.UseExternalUrlMiddleware(middleware)`

Adds a custom middleware for any navigation events attempting to open an external URL.
|Parameter|Description|
|-|-|
|`middleware` *: [ExternalUrlMiddleware](#externalurlmiddleware)*| Middleware to validate the navigation process |









## Positional Stack Controller

### Indexing

Positional stack controllers support direct numeric indexing, just like arrays. This is equivalent to the use of `.Get` and `.Set`. The following example displays the analogy of indexing and method usage:
```ts
const value = FlexPath.args[0];
//          = FlexPath.args.Get(0);

FlexPath.args[0] = "value";
//      .args.Set(0, "value");
```

### `.GetAll()`
Fetches a complete array of all positional path arguments. <br>**Returns:** *string[]*.



### `.Get(index)` 🔤
Fetches the positional argument value at the given index, if existing. <br>This version is **case insensitive**, always returning lowercase. <br>**Returns:** *string*.
|Parameter|Description|
|-|-|
|`index` *: number*| Path position index |

> This method implements a *case sensitive* alternative:
>  `.GetCase(index)`



### `.Set(index, argument, keepKwargs?, keepSearch?)` 🔤
Updates the positional argument value at the given index. This is possible for any index from 0 to `length`, which allows updating the *"next empty argument"*.<br>This version is **case insensitive**, always updating to lowercase values.
|Parameter|Description|
|-|-|
|`index` *: number*| Path position index |
|`argument` *: string*| Value to insert into the path structure |
|`keepKwargs`*? : boolean*| Defaults to `false`.<br>Whether this call should keep the current `kwargs` values. |
|`keepSearch`*? : boolean*| Defaults to `false`.<br>Whether this call should keep the current search query. |

> This method implements a *case sensitive* alternative:
>  `.SetCase(index, argument, keepKwargs?, keepSearch?)`



### `.Clear(keepKwargs?, keepSearch?)`
Clears the current positional argument stack, essentially navigating to `/`.
|Parameter|Description|
|-|-|
|`keepKwargs`*? : boolean*| Defaults to `false`.<br>Whether this call should keep the current `kwargs` values. |
|`keepSearch`*? : boolean*| Defaults to `false`.<br>Whether this call should keep the current search query. |



### `.Pop()`
Pops and returns the rightmost argument value from the positional argument stack. <br>**Returns:** *string*.



### `.Pop(amount)`
Pops and returns the `amount` rightmost argument values. <br>**Returns:** *string[]*.
|Parameter|Description|
|-|-|
|`amount` *: number*| Amount of arguments to pop from the positional argument stack |



### `.Push(...arguments)` 🔤
Pushes (inserts) one or more values to the positional argument stack.
|Parameter|Description|
|-|-|
|...`arguments` *: string[]*| Argument values to push |

> This method implements a *case sensitive* alternative:
>  `.PushCase(...arguments)`



### `.Update(...arguments)` 🔤
Updates the entire positional argument stack as a whole, essentially *"navigating the path"*.
|Parameter|Description|
|-|-|
|...`arguments` *: string[]*| Argument values to store |

> This method implements a *case sensitive* alternative:
>  `.UpdateCase(...arguments)`



### 🔰 `.ValidateLength(expectedLength)`
Tests the current stack for the expected length.<br>**Throws** otherwise.
|Parameter|Description|
|-|-|
|`expectedLength` *: number*| Number of expected arguments in the stack |



### 🔰 `.ValidateIndex(index, targetValue)` 🔤
Tests the argument at the provided index.<br>**Throws** otherwise.
|Parameter|Description|
|-|-|
|`index` *: number*| Stack index to test |
|`targetValue` *: string*| Expected value *(case insensitive)* |

> This method implements a *case sensitive* alternative:
>  `.ValidateIndexCase(index, targetValue)`



### 🔰 `.ValidatePath(...args)` 🔤
Tests the current stack to match the test pattern.<br>**Throws** otherwise.
|Parameter|Description|
|-|-|
|...`arguments` *: (string\|false)[]*| Test pattern fields.<br>`false` will pass any value at the respective position *(except undefined)*. |

> This method implements a *case sensitive* alternative:
>  `.ValidatePathCase(index, targetValue)`



### ⚡ `.OnUpdate(handler)`
Unregisters a handler function for functional argument update at specified position. This will call for any argument update.
|Parameter|Description|
|-|-|
|`handler` *: [PathUpdateEventHandler](#pathupdateeventhandler)*| Event handler function |



### ⚡ `.OnUpdate(index, handler)`
Registers a handler function for functional argument path updates.<br>Event values will **always** be returned *case sensitive*
|Parameter|Description|
|-|-|
|`index` *: number*| Index to register the handler for |
|`handler` *: [ArgUpdateEventHandler](#argupdateeventhandler)*| Event handler function |


### ⚡ `.OffUpdate(handler)` / `.OffUpdate(index, handler)`
Unregisters provided handler function if registered. <br>Signatures are identical to `.OnUpdate`.


### ⚡ `.OnceUpdate(handler)` / `.OnceUpdate(index, handler)`
Similar to `.OnUpdate` equivalents, but registers the provided handler only **once**, being unregistered right after invocation. <br>Signatures are identical to `.OnUpdate`.


### ⚡ `.GetUpdateListener(handler)` / `.GetUpdateListener(index, handler)`
Similar to `.OnUpdate` equivalents, but creates and returns a new [CallbackEmitterListener](https://www.npmjs.com/package/lux-callback-emitter#callbackemitterlistener). <br>Signatures are identical to `.OnUpdate`.










## Keyword Stack Controller

### Indexing

Keyword stack controllers support direct string literal indexing, just like objects. This is equivalent to the use of `.Get` and `.Set`. The following example displays the analogy of indexing and method usage:
```ts
const value = FlexPath.args["sort"];
//          = FlexPath.args.Get("sort");

FlexPath.args["sort"] = "value";
//      .args.Set("sort", "value");
```



### `.Get(key)` 🔤
Fetches first value for the provided key, if existing. <br>This version is **case insensitive**, always returning lowercase. <br>**Returns:** *string | undefined*.
|Parameter|Description|
|-|-|
|`key` *: string*| Key literal |

> This method implements a *case sensitive* alternative:
>  `.GetCase(key)`



### `.GetAll(key)` 🔤
Fetches all values for the provided key. <br>This version is **case insensitive**, always returning lowercase. <br>**Returns:** *string[]*.
|Parameter|Description|
|-|-|
|`key` *: string*| Key literal |

> This method implements a *case sensitive* alternative:
>  `.GetAllCase(key)`



### `.Set(key, values)` 🔤
Sets the value(s) for a given key literal. This is overloaded for either working with one *string[]* argument or multiple *string* arguments, replacing `values` with `...values` in this case. <br>This version is **case insensitive**, always inserting lowercase values.
|Parameter|Description|
|-|-|
|`key` *: string*| Key literal |
|`values` *: string[]*| Value(s) to apply|

> This method implements a *case sensitive* alternative:
>  `.SetCase(key, values)`



### `.Add(key, ...values)` 🔤
Works similar to `.Set`, but *adds* the provided values to the key literal instead of replacing them. Duplicate values will be filtered.<br>This version is **case insensitive**, always adding lowercase values.
|Parameter|Description|
|-|-|
|`key` *: string*| Key literal |
|...`values` *: string[]*| Value(s) to add|

> This method implements a *case sensitive* alternative:
>  `.AddCase(key, ...values)`



### `.Delete(key, ...values)`
Inversion of `.Add`, thus removing provided value(s) from the key literal.<br>This call is **always case sensitive**
|Parameter|Description|
|-|-|
|`key` *: string*| Key literal |
|...`values` *: string[]*| Value(s) to remove |



### `.Delete(key)`
Radical edition of the above, removing the *entire* key literal and all of it's values from the controller.
|Parameter|Description|
|-|-|
|`key` *: string*| Key literal |



### `.Clear()`
Clears all fields of this container.






### 🔰 `.ValidateKey(key)`
Validates the existance of any values on the provided key literal.<br>**Throws** otherwise.
|Parameter|Description|
|-|-|
|`key` *: string*| Key literal to validate |



### 🔰 `.ValidateValues(key, ...values)` 🔤
Validates the existence of all provided values on the provided key literal.<br>This version is **case insensitive**, always comparing lowercase values.<br>**Throws** otherwise.
|Parameter|Description|
|-|-|
|`key` *: string*| Key literal to look up |
|...`values` *: string[]*| Values to validate |

> This method implements a *case sensitive* alternative:
>  `.ValidateValuesCase(key, ...values)`



### ⚡ `.OnUpdate(key, handler)`
Registers a handler function for value changes on the provided key.<br>Event values will **always** be returned *case sensitive*
|Parameter|Description|
|-|-|
|`key` *: string*| Key literal |
|`handler` *: [KwargUpdateEventHandler](#kwargupdateeventhandler)*| Event handler function |


### ⚡`.OffUpdate(key, handler)`
Unregisters provided handler function if registered. <br>Signatures are identical to `.OnUpdate`.


### ⚡ `.OnceUpdate(key, handler)`
Similar to `.OnUpdate` equivalents, but registers the provided handler only **once**, being unregistered right after invocation. <br>Signatures are identical to `.OnUpdate`.


### ⚡ `.GetUpdateListener(key, handler)`
Similar to `.OnUpdate` equivalents, but creates and returns a new [`CallbackEmitterListener`](https://www.npmjs.com/package/lux-callback-emitter#callbackemitterlistener). <br>Signatures are identical to `.OnUpdate`.





## Types

#### HistoryCallMode
|Literal|Description|
|-|-|
|`"push"`| Pushes a new state to the browser history<br>*(default)* |
|`"update"`| Updates the current browser state |

#### ExternalUrlMiddleware
A custom function receiving the following arguments:
|Argument|Description|
|-|-|
|`url` *: URL*| The external URL the state machine attempts to navigate to |
|`acceptNavigation` *: [EUM\$Resolver](#eumresolver)*| Updates the current browser state |



#### EUM$Resolver
A function provided to [`ExternalUrlMiddleware`](#externalurlmiddleware) with the following parameters
|Argument|Description|
|-|-|
|`accepted` *: boolean* | Whether the navigation event should be accepted |
|`options`*? : [EUM$ResolverOptions](#eumresolveroptions)*| Updates the current browser state |

(accepted: boolean, options?: ExternalUrlOptions) =>  void

#### EUM$ResolverOptions
A partial object that can be passed to [`EUM$Resolver`](#eumresolver) consisting of following fields:
|Field|Description|
|-|-|
|`newTab`*? : boolean* | Whether the navigation event should be done in a new tab |
|`target`*? : string*| The target to apply to the navigation event |


#### PathUpdateEventHandler
```ts
(newArg: string | undefined) =>  void;
```

#### ArgUpdateEventHandler
```ts
(...args: string[]) =>  void;
```


#### KwargUpdateEventHandler
```ts
(newValues: string[]) =>  void;
```

# Patch Notes
### V0.1.0
- Nothing changed yet, because this is the first version. Yayy!


# 🗒️ TODOs

- Implement logical **BACK** functionality to e.g. navigate *"back to the menu"* without the need of manually keeping track of anything
- Optimize quick access usage