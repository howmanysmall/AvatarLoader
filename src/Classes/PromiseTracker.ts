// Original: https://github.com/Quenty/NevermoreEngine/blob/version2/Modules/Shared/Promise/PendingPromiseTracker.lua

export default class PromiseTracker {
	private pendingPromises: Set<Promise<unknown>> = new Set<Promise<unknown>>();

	/**
	 * Adds a promise to the tracker that will be removed when it is no longer pending.
	 * @param {Promise<T>} promise A promise to track.
	 * @returns {Promise<T>} The same promise that was passed.
	 */
	public Add<T>(promise: Promise<T>): Promise<T> {
		if (promise.getStatus() === Promise.Status.Started) {
			this.pendingPromises.add(promise);
			promise.finally(() => this.pendingPromises.delete(promise));
		}

		return promise;
	}

	/**
	 * Gets all the pending promises currently in the list.
	 * @returns {Array<Promise<unknown>>} All the pending promises.
	 */
	public GetAll(): Array<Promise<unknown>> {
		const promises: Array<Promise<unknown>> = new Array<Promise<unknown>>();
		for (const promise of this.pendingPromises) promises.push(promise);
		return promises;
	}

	/**
	 * Destroys the PromiseTracker and cancels all pending promises. Should this be the behavior?
	 */
	public Destroy() {
		// this is faster than for (const promise of this.pendingPromises.keys())
		for (const promise of this.pendingPromises) promise.cancel();
		this.pendingPromises.clear();
	}
}
