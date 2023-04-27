/**
 * @jest-environment jsdom
 */
//@ts-nocheck

import { createEvent, createState } from '../src/index';

describe('state', () => {
  let addListener, removeListener, patchState, getState;
  it("can create state", () => {
    [addListener, removeListener, patchState, getState] = createState({ a: 1, b: 2 });
  });

  it("can add listener", () => {
    let count = 0;
    addListener(() => {
      count++;
    });
    expect(count).toBe(0);
  });

  it("can patch state", () => {
    patchState({ a: 2 });
  });

  it("can get state", () => {
    expect(getState()).toEqual({ a: 2, b: 2 });
  });

  it("can remove listener", () => {
    let count = 0;
    const callback = () => {
      count++;
    };
    addListener(callback);
    removeListener(callback);
    patchState({ a: 3 });
    expect(count).toBe(0);
  });

  it("can add listener with keys", () => {
    let count = 0;
    addListener(() => {
      count++;
    }, ["a"]);
    patchState({ b: 4 });
    expect(count).toBe(0);
  });

  it("can add listener with keys", () => {
    let count = 0;
    addListener(() => {
      count++;
    }, ["a"]);
    patchState({ a: 4 });
    expect(count).toBe(1);
  });
});

describe('event', () => {
  let addListener, removeListener, emitter;
  it("can create event", () => {
    [addListener, removeListener, emitter] = createEvent();
  });

  it("can add listener", () => {
    let count = 0;
    addListener(() => {
      count++;
    });
    expect(count).toBe(0);
  });

  it("can emit event", () => {
    let data;
    const listener = (d) => {
      data = d;
    };
    addListener(listener);
    emitter(1);
    expect(data).toBe(1);
  });

  it("can remove listener", () => {
    let count = 0;
    const callback = () => {
      count++;
    };
    addListener(callback);
    removeListener(callback);
    emitter();
    expect(count).toBe(0);
  });
});