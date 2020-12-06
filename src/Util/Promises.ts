import { Players, HttpService, RunService } from "@rbxts/services";
import { wait as smartWait } from "@rbxts/delay-spawn-wait";
import { OpcallResult } from "../Typings/GlobalTypes";

const IS_SERVER: boolean = RunService.IsServer();

// Promises for `HttpService`.

/**
 * Decodes a JSON string into a Lua table.
 * @param {string} jsonString The JSON string being decoded.
 * @return {Promise<T>} Promise A promise that returns the decoded json string.
 */
export function promiseDecode<T>(jsonString: string): Promise<T> {
	return new Promise<T>((resolve, reject) => {
		const result: OpcallResult<T> = opcall(() => HttpService.JSONDecode(jsonString));
		if (result.success) resolve(result.value);
		else reject(result.error);
	});
}

/**
 * Returns a Promise that sends an HTTP GET request using `HttpService:GetAsync`.
 * @param {string} url The web address you are requesting data from.
 * @param {boolean=false} noCache Whether the request stores (caches) the response. Defaults to false.
 * @param {Record<string, string> | Map<string, string> | undefined} headers Used to specify some HTTP request headers.
 * @return {Promise<string>} A Promise that returns the result of the GET request.
 */
export function promiseGet(
	url: string,
	noCache = false,
	headers?: Record<string, string> | Map<string, string> | undefined,
): Promise<string> {
	if (!IS_SERVER) return Promise.reject("promiseGet cannot be called on the client!");
	return new Promise<string>((resolve, reject) =>
		Promise.spawn(() => {
			const result: OpcallResult<string> = opcall(() => HttpService.GetAsync(url, noCache, headers));
			if (result.success) resolve(result.value);
			else reject(result.error);
		}),
	);
}

/**
 * Returns a Promise that sends an HTTP POST request using `HttpService:PostAsync`.
 * @param {string} url The destination address for the data.
 * @param {string} data The data being sent.
 * @param {Enum.HttpContentType=Enum.HttpContentType.ApplicationJson} contentType Modifies the value in the Content-Type header sent with the request. Defaults to `Enum.HttpContentType.ApplicationJson`.
 * @param {boolean=false} compress Determines whether the data is compressed (gzipped) when sent. Defaults to `false`.
 * @param {Record<string, string> | Map<string, string> | undefined} headers Used to specify some HTTP request headers.
 * @return {Promise<string>} A Promise that returns the result of the POST.
 */
export function promisePost(
	url: string,
	data: string,
	contentType = Enum.HttpContentType.ApplicationJson,
	compress = false,
	headers?: Record<string, string> | Map<string, string> | undefined,
): Promise<string> {
	if (!IS_SERVER) return Promise.reject("promisePost cannot be called on the client!");
	return new Promise<string>((resolve, reject) =>
		Promise.spawn(() => {
			const result: OpcallResult<string> = opcall(() =>
				HttpService.PostAsync(url, data, contentType, compress, headers),
			);

			if (result.success) resolve(result.value);
			else reject(result.error);
		}),
	);
}

// Promises for `Players`.

/**
 * Returns a promise that gets the `UserId` of a player by their username.
 * @param {string} username The username of the player.
 * @return {Promise<number>} A promise that returns the player's `UserId`.
 */
export function promiseUserIdFromName(username: string): Promise<number> {
	return new Promise<number>((resolve, reject) =>
		Promise.spawn(() => {
			const result: OpcallResult<number> = opcall(() => Players.GetUserIdFromNameAsync(username));
			if (result.success) resolve(result.value);
			else reject(result.error);
		}),
	);
}

/**
 * Returns a promise that gets the player's currently applied `HumanoidDescription`.
 * @param {number} userId The `UserId` of the player.
 * @returns {Promise<HumanoidDescription>} A promise that returns the player's `HumanoidDescription`.
 */
export function promiseHumanoidDescriptionFromUserId(userId: number): Promise<HumanoidDescription> {
	return new Promise<HumanoidDescription>((resolve, reject) =>
		Promise.spawn(() => {
			const result: OpcallResult<HumanoidDescription> = opcall(() =>
				Players.GetHumanoidDescriptionFromUserId(userId),
			);

			if (result.success) resolve(result.value);
			else reject(result.error);
		}),
	);
}

/**
 * Returns a promise that gets the `HumanoidDescription` of a given outfit id.
 * @param {number} outfitId The numerical id of the outfit.
 * @returns {Promise<HumanoidDescription>} A promise that returns the outfit's `HumanoidDescription`.
 */
export function promiseHumanoidDescriptionFromOutfitId(outfitId: number): Promise<HumanoidDescription> {
	return new Promise<HumanoidDescription>((resolve, reject) =>
		Promise.spawn(() => {
			const result: OpcallResult<HumanoidDescription> = opcall(() =>
				Players.GetHumanoidDescriptionFromOutfitId(outfitId),
			);

			if (result.success) resolve(result.value);
			else reject(result.error);
		}),
	);
}

const MAX_TRIES = 5;

export function promiseUserThumbnail(
	userId: number,
	thumbnailType = Enum.ThumbnailType.AvatarBust,
	thumbnailSize = Enum.ThumbnailSize.Size352x352,
): Promise<string> {
	let promise: Promise<string>;
	// eslint-disable-next-line prefer-const
	promise = new Promise<string>((resolve, reject, onCancel) =>
		Promise.spawn(() => {
			let tries = 0;
			let shouldBreak = false;
			onCancel(() => (shouldBreak = true));

			do {
				if (shouldBreak) break;
				tries++;
				let content = "";
				let isReady = false;

				const result: OpcallResult<void> = opcall(() => {
					[content, isReady] = Players.GetUserThumbnailAsync(userId, thumbnailType, thumbnailSize);
				});

				if (!result.success) reject(result.error);
				else {
					if (shouldBreak) break;
					if (isReady) resolve(content);
					else smartWait(0.05);
				}
			} while (!(tries >= MAX_TRIES || !promise.isPending() || !shouldBreak));
			reject();
		}),
	);

	return promise;
}

// Promises for `HumanoidDescription`s.

/**
 * Returns a promise that applies the given `HumanoidDescription` to the given `Humanoid`.
 * @param {Humanoid} humanoid The `Humanoid` you are applying the `HumanoidDescription` to.
 * @param {HumanoidDescription} humanoidDescription The `HumanoidDescription` you are applying.
 * @return {Promise<void>} A promise that calls `Humanoid:ApplyDescription`.
 */
export function promiseApplyDescription(humanoid: Humanoid, humanoidDescription: HumanoidDescription): Promise<void> {
	return new Promise<void>((resolve, reject) =>
		Promise.spawn(() => {
			const result: OpcallResult<void> = opcall(() => humanoid.ApplyDescription(humanoidDescription));
			if (result.success) resolve();
			else reject(result.error);
		}),
	);
}

/**
 * Returns a promise that gets the currently applied `HumanoidDescription` of the given `Humanoid`.
 * @param {Humanoid} humanoid The `Humanoid` you are wanting to retrieve the `HumanoidDescription` of.
 * @return {Promise<HumanoidDescription>} A promise that returns the applied `HumanoidDescription`.
 */
export function promiseAppliedDescription(humanoid: Humanoid): Promise<HumanoidDescription> {
	return new Promise<HumanoidDescription>((resolve, reject) => {
		const result: OpcallResult<HumanoidDescription> = opcall(() => humanoid.GetAppliedDescription());
		if (result.success) resolve(result.value);
		else reject(result.error);
	});
}

// Promises for inserting

// caches the results of `game:GetObjects`.
const objectsArray: Array<Instance> = new Array<Instance>();

/**
 * Inserts an object using `game:GetObjects` wrapped in a promise.
 * @param {number} assetId The asset id of the object you're inserting.
 * @returns {Promise<T extends Instance>} A promise that returns the inserted object.
 */
export function promiseGetObject<T extends Instance>(assetId: number): Promise<T> {
	let object = objectsArray[assetId];
	if (object !== undefined) return Promise.resolve((<T>object).Clone());

	return new Promise<T>((resolve, reject) =>
		Promise.spawn(() => {
			const result: OpcallResult<Instance[]> = opcall(() => game.GetObjects(`rbxassetid://${assetId}`));
			if (result.success) {
				object = <T>result.value[0];
				objectsArray[assetId] = object;
				resolve((<T>object).Clone());
			} else reject(result.error);
		}),
	);
}
