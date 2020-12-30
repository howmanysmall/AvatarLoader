import Maid from "@rbxts/maid";
type DescendantAdded = (descendant: Instance) => void;

// Original: https://github.com/EmeraldSlash/RbxReady/

export default class Ready {
	private parent: Instance;
	public timeout: number; // Should it be `Timeout` or `timeout`?
	private maid: Maid = new Maid();

	constructor(parent: Instance, timeout = 1) {
		this.parent = parent;
		this.timeout = timeout;
	}

	/**
	 * Repeatedly calls `smartWait` until the timeout has been reached and no descendants of the parent were added in that time.
	 * @returns {Instance | undefined} The last descendant added if it exists.
	 */
	public Wait(): Instance | undefined {
		let timestamp = os.clock();
		let lastDescendant: Instance | undefined = undefined;

		const id = this.maid.GiveTask(
			this.parent.DescendantAdded.Connect((descendant) => {
				timestamp = os.clock();
				lastDescendant = descendant;
			}),
		);

		while (os.clock() - timestamp <= this.timeout) Promise.delay(0.03).await();
		this.maid[id] = undefined;
		return lastDescendant;
	}

	/**
	 * Connects a descendant added function to the object's maid.
	 * @param {(descendant: Instance) => void} descendantAdded A function that will be called when a descendant is added.
	 * @returns {() => void} A function that when called will disconnect the connection from the maid.
	 */
	public Connect(descendantAdded: DescendantAdded): () => void {
		let timestamp: number = os.clock();
		// eslint-disable-next-line prefer-const
		let id: number;

		const logDescendant = (descendant: Instance) => {
			const localTimestamp = os.clock();
			timestamp = localTimestamp;
			Promise.delay(this.timeout).await();

			if (timestamp === localTimestamp && (<RBXScriptConnection>this.maid[id]).Connected) {
				this.maid[id] = undefined;
				descendantAdded(descendant);
			}
		};

		const thread = coroutine.create(logDescendant);
		coroutine.resume(thread);
		id = this.maid.GiveTask(this.parent.DescendantAdded.Connect(logDescendant));
		return () => (this.maid[id] = undefined);
	}

	/**
	 * Destroys the object and cleans up any connections.
	 */
	public Destroy() {
		this.maid.Destroy();
	}
}
