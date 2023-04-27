// Tahitiensis - niue vanilla
// hacked version of niue without react dep

let counter: number = 0;

const PREFIX = "_t";

export const createEvent = <T>(): [
    // addEventListener
    (callback: (data: T) => void) => void,
    // removeEventListener
    (callback: (data: T) => void) => void,
    // Emitter
    (data: T) => void
] => {
    const eventName = PREFIX + counter;
    counter++;

    // use weakmap to keep track of handlers
    const handlers = new WeakMap<(data: T) => void, (e: Event) => void>();

    return [
        (callback) => {
            const wrappedHandler = (e: Event) => {
                callback((e as CustomEvent<T>).detail);
            };
            handlers.set(callback, wrappedHandler);
            document.addEventListener(eventName, wrappedHandler);
        },
        (callback) => {
            const wrappedHandler = handlers.get(callback);
            if (wrappedHandler) {
                document.removeEventListener(eventName, wrappedHandler);
            }
        },
        (data) => {
            const e = new CustomEvent(eventName, {
                detail: data
            });
            document.dispatchEvent(e);
        }
    ]
};

export const createState = <T extends object>(initialValue: T): [
    // addStateListener
    (callback: (data: T) => void, keys?: (keyof T)[] | null) => void,
    // removeStateListener
    (callback: (data: T) => void) => void,
    // Patcher
    (patch?: Partial<T> | (keyof T)[], changed?: (keyof T)[]) => void,
    // Get state (not hook)
    () => T
] => {
    let db = initialValue;
    let trackStore = {...initialValue};

    const [addListener, removeListener, emitter] = createEvent<(keyof T)[]>();

    const handlers = new WeakMap<(data: T) => void, (changed: (keyof T)[]) => void>();

    return [
        (callback, keys) => {
            const wrappedHandler = (changed: (keyof T)[]) => {
                if(!keys || changed.some(k => keys.includes(k))) {
                    callback(db);
                }
            };
            handlers.set(callback, wrappedHandler);
            addListener(wrappedHandler);
        },
        (callback) => {
            const wrappedHandler = handlers.get(callback);
            if (wrappedHandler) {
                removeListener(wrappedHandler);
            }
        },
        (patch, changed) => {
            if(Array.isArray(patch)) {
                changed = patch;
                patch = undefined;
            }

            if(patch) {
                // apply patch to db
                for(const prop in patch) {
                    db[prop] = patch[prop]!;
                }
            }

            changed ??= (
                Object.entries(db)
                    .filter(([key, val]) => val !== trackStore[key as keyof T])
                    .map(([key]) => key)
            ) as (keyof T)[];

            // update the trackStore so we can track future changes
            // (notably, this won't add any imperative changes that weren't in user-provided
            //  `changed` to the trackStore, so they can still be dispatched later)
            for(const prop of changed) {
                trackStore[prop] = db[prop];
            }

            emitter(changed);
        },
        () => db
    ];
};