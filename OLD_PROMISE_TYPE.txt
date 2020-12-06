/// <reference no-default-lib="true"/>

type PromiseResolveArguments<T> = T extends void ? [] : T extends LuaTuple<infer U> ? U : [T];

interface PromiseLike<T> {
	/**
	 * Attaches callbacks for the resolution and/or rejection of the Promise.
	 * @param onResolved The callback to execute when the Promise is resolved.
	 * @param onRejected The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of which ever callback is executed.
	 */
	then<TResult1 = T, TResult2 = never>(
		this: PromiseLike<T>,
		onResolved?: ((...values: PromiseResolveArguments<T>) => TResult1 | PromiseLike<TResult1>) | void,
		onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | void,
	): PromiseLike<TResult1 | TResult2>;
}

/**
 * Represents the completion of an asynchronous operation
 */
interface Promise<T> {
	/**
	 * Attaches callbacks for the resolution and/or rejection of the Promise.
	 * @param onResolved The callback to execute when the Promise is resolved.
	 * @param onRejected The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of which ever callback is executed.
	 */
	then<TResult1 = T, TResult2 = never>(
		this: Promise<T>,
		onResolved?: ((...values: PromiseResolveArguments<T>) => TResult1 | PromiseLike<TResult1>) | void,
		onRejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | void,
	): Promise<TResult1 | TResult2>;

	/**
	 * Attaches a callback for only the rejection of the Promise.
	 * @param onRejected The callback to execute when the Promise is rejected.
	 * @returns A Promise for the completion of the callback.
	 */
	catch<TResult = never>(
		this: Promise<T>,
		onRejected?: ((reason: any) => TResult | PromiseLike<TResult>) | void,
	): Promise<T | TResult>;

	/**
	 * Attaches a callback to always run when this Promise settles, regardless of its fate.
	 * The callback runs when the Promise is resolved, rejected, or cancelled.
	 * @param onSettled The callback to execute when the Promise settles or is cancelled.
	 * @returns A Promise for the completion of the callback.
	 */
	finally<TResult = never>(
		this: Promise<T>,
		onSettled?: (() => TResult | PromiseLike<TResult>) | void,
	): Promise<T | TResult>;

	/**
	 * Cancels this promise, preventing this Promise from ever resolving or rejecting.
	 * Does not do anything if the promise is already settled.
	 * Calls the Promise's cancellation hook if it is set.
	 */
	cancel(this: Promise<T>): void;

	/**
	 * Awaits the promise synchronously utilizing the Roblox thread scheduler.
	 * Functionally equivalent to `await promise`, but can be used in cases where the function cannot be async,
	 * such as in `MarketplaceService.ProcessReceipt`.
	 * @returns A tuple with the success of the promise along with the result it provided.
	 */
	await<TResult = unknown>(this: Promise<T>): LuaTuple<[true, T] | [false, TResult]>;

	/**
	 * Returns true if this Promise has been rejected.
	 */
	isRejected(this: Promise<T>): boolean;

	/**
	 * Returns true if this Promise has been resolved.
	 */
	isResolved(this: Promise<T>): boolean;

	/**
	 * Returns true if this Promise is still pending.
	 */
	isPending(this: Promise<T>): boolean;

	/**
	 * Returns true if this Promise has been cancelled.
	 */
	isCancelled(this: Promise<T>): boolean;
}

interface PromiseConstructor {
	/**
	 * Creates an immediately rejected Promise with the given value.
	 * @param value The value to reject with.
	 */
	reject: <T = undefined>(value?: T) => Promise<T>;

	/**
	 * Creates an immediately resolved Promise with the given value.
	 * @param value The value to resolve with.
	 */
	resolve: <T = undefined>(value?: T) => Promise<T>;

	/**
	 * Accepts an array of Promises and returns a new Promise that is resolved when all input Promises resolve,
	 * or rejects if any of the input Promises reject.
	 * @param promises An array of Promises.
	 */
	all: <T>(promises: Array<Promise<T>>) => Promise<Array<T>>;

	/**
	 * Spawns a function on a new thread, but begins running it immediately
	 * instead of being deferred. This is sometimes known as a "fast spawn".
	 * Should be preferred over `spawn` in Promises for more predictable timing.
	 * @param callback The function to call. Any further arguments are passed as parameters.
	 */
	spawn: <T extends Array<any>>(callback: (...args: T) => void, ...args: T) => void;

	/**
	 * Returns a boolean indicating whether or not the given `value` is a Promise.
	 * You can use the generic argument to assert a specific type of Promise.
	 *
	 * i.e. `Promise.is<number>(x)` => `x is Promise<number>`
	 * @param value The value to verify
	 */
	is: <T = unknown>(value: unknown) => value is Promise<T>;

	/**
	 * Creates a new Promise.
	 * @param executor A callback used to initialize the promise. This callback is passed a resolve
	 * callback used resolve the promise with a value or the result of another promise,
	 * a reject callback used to reject the promise with a provided reason or error,
	 * and an onCancel function which may be used to register a cancellation hook by calling it with
	 * a function which will be called if the Promise is cancelled, allowing you to implement abort semantics.
	 */
	new <T>(
		executor: (
			resolve: (...values: PromiseResolveArguments<T> | [T] | [PromiseLike<T>]) => void,
			reject: (reason?: any) => void,
			onCancel: (cancellationHook: () => void) => void,
		) => void,
	): Promise<T>;
}

declare const Promise: PromiseConstructor;
