# Tahitiensis

### A tiny shared state and event library for ~~React~~ vanilla JS!

Tahitiensis is a version of [niue](https://github.com/Merlin04/niue), a small shared state and event library, that works with vanilla JS. Get the same reactive state/event paradigm you know and love in projects where loading in React doesn't make sense.

Tahitiensis is a small library (less than **800 bytes** before compression) that provides a simple way to manage your webapp's shared state and send events between components. I find it simplifies the architecture of webapps significantly.

## Why Niue/Tahitiensis?

### State
- Easily create state that's shared across components without any hierarchy
- Listen for changes to state and react accordingly
- Storing application state in a single place makes it very easy to save and restore it
- Simple API supports state patching and imperative state updates
- Components only subscribe to the state they need

### Events
- You don't need to remember the names of events - just import the event's functions and use them

## What is this name

Tahitiensis is the variety of vanilla grown in Niue.

## Installation

```bash
yarn add tahitiensis
```

## Managing shared state

To create a store (a thing to hold an object of state), use the `createState` function outside of a component:

```ts
import { createState } from 'tahitiensis';

const [addListener, removeListener, patchStore, getStore] = createState(
    // Initial value
    { count: 0, name: "foo" }
);
```

The resulting `add`/`removeListener` functions can be called in your component to run updates when the state changes:

```tsx
addListener(({ name, count }) => {
    counter.innerText = count;
    nameDisplay.innerText = name;
});
```

`addListener` also accepts an optional parameter to specify which properties of the state object to "subscribe" to. Changes of these properties will trigger your listener. If you don't specify anything, the entire state object will be watched.

```ts
// Subscribe to only the `count` property
addListener({ count } => {
    counter.innerText = count;
    alert("count changed!"); // this won't run when `name` changes
}, ["count"]);
```

The `getStore` function can be used to access the store outside a state listener:

```ts
const state = getStore();
console.log(state.name);
```

The `patchStore` function can be called to update the state. `getStore` is especially useful in combination with `patchStore`:

```tsx
btn.addEventListener("click", () => {
    patchStore({ count: getState().count + 1 });
});
```

As you can see in the example, the value passed to `patchStore` does not need to contain all of the properties in the state object. If you leave one out, it will not be modified.

You can also call `patchStore` with no parameters to use mutations to the existing state object:

```ts
const state = getStore();
state.name = "Test";
patchStore();
```

In addition, you can provide an array of changed keys to override Niue's default shallow comparison for detecting changes:

```ts
state.things[1].name = "Test";
patchStore(["things"]);
```

## Events

Events work similarly to state stores. You can create an event with the createEvent function:

```ts
import { createEvent } from 'tahitiensis';

const [addListener, removeListener, emit] = createEvent<string>();
```

The `createEvent` function doesn't accept any parameters, however it does have a type parameter for the message data type.

The `add`/`removeListener` functions can be used in a component to subscribe to the event, and the `emit` function can be used to send the event:

```tsx
btn.addEventListener("click", () => {
    emit("button clicked!");
});

addListener((message) => {
    alert(message);
});
```