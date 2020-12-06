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
 * Sends an http request using `HttpService:RequestAsync`.
 * @param {RequestAsyncRequest} requestDictionary The request options you are sending with.
 * @return {Promise<RequestAsyncResponse>} A promise that returns the response dictionary.
 */
export function promiseRequest(requestDictionary: RequestAsyncRequest): Promise<RequestAsyncResponse> {
	return Promise.defer((resolve, reject) => {
		const result: OpcallResult<RequestAsyncResponse> = opcall(() => HttpService.RequestAsync(requestDictionary));
		if (result.success)
			if (result.value.Success) resolve(result.value);
			else reject("HTTP %d: %s".format(result.value.StatusCode, result.value.StatusMessage));
		else reject(result.error);
	});
}

/**
 * Returns a Promise that sends an HTTP GET request using `HttpService:RequestAsync`.
 * @param {string} url The web address you are requesting data from.
 * @param {boolean=false} noCache Whether the request stores (caches) the response. Defaults to false.
 * @param {Map<string, string>?} headers Used to specify some HTTP request headers.
 * @return {Promise<string>} A Promise that returns the result of the GET request.
 */
export function promiseGet(url: string, noCache = false, headers = new Map<string, string>()): Promise<string> {
	if (noCache) headers.set("Cache-Control", "no-cache");
	const requestDictionary: RequestAsyncRequest = {
		Url: url,
		Method: "GET",
		Headers: headers,
	};

	return promiseRequest(requestDictionary).then((responseDictionary) => responseDictionary.Body);
	// return Promise.defer((resolve, reject) => {
	// 	const result: OpcallResult<string> = opcall(() => HttpService.GetAsync(url, noCache, headers));
	// 	if (result.success) resolve(result.value);
	// 	else reject(result.error);
	// });
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
	contentType: Enum.HttpContentType = Enum.HttpContentType.ApplicationJson,
	compress = false,
	headers = new Map<string, string>(),
): Promise<string> {
	if (compress)
		return Promise.defer((resolve, reject) => {
			const result: OpcallResult<string> = opcall(() =>
				HttpService.PostAsync(url, data, contentType, compress, headers),
			);

			if (result.success) resolve(result.value);
			else reject(result.error);
		});
	else {
		if (contentType === Enum.HttpContentType.ApplicationJson) headers.set("content-type", "application/json");
		else if (contentType === Enum.HttpContentType.ApplicationUrlEncoded)
			headers.set("content-type", "x-www-form-urlencoded");
		else if (contentType === Enum.HttpContentType.ApplicationXml) headers.set("content-type", "application/xml");
		else if (contentType === Enum.HttpContentType.TextPlain) headers.set("content-type", "text/plain");
		else if (contentType === Enum.HttpContentType.TextXml) headers.set("content-type", "text/xml");

		const requestDictionary: RequestAsyncRequest = {
			Body: data,
			Headers: headers,
			Method: "POST",
			Url: url,
		};

		return promiseRequest(requestDictionary).then((responseDictionary) => responseDictionary.Body);
	}
}

// Promises for `Players`.

/**
 * Returns a promise that gets the `UserId` of a player by their username.
 * @param {string} username The username of the player.
 * @return {Promise<number>} A promise that returns the player's `UserId`.
 */
export function promiseUserIdFromName(username: string): Promise<number> {
	return Promise.defer((resolve, reject) => {
		const result: OpcallResult<number> = opcall(() => Players.GetUserIdFromNameAsync(username));
		if (result.success) resolve(result.value);
		else reject(result.error);
	});
}

/**
 * Returns a promise that gets the player's currently applied `HumanoidDescription`.
 * @param {number} userId The `UserId` of the player.
 * @returns {Promise<HumanoidDescription>} A promise that returns the player's `HumanoidDescription`.
 */
export function promiseHumanoidDescriptionFromUserId(userId: number): Promise<HumanoidDescription> {
	return Promise.defer((resolve, reject) => {
		const result: OpcallResult<HumanoidDescription> = opcall(() =>
			Players.GetHumanoidDescriptionFromUserId(userId),
		);

		if (result.success) resolve(result.value);
		else reject(result.error);
	});
}

/**
 * Returns a promise that gets the `HumanoidDescription` of a given outfit id.
 * @param {number} outfitId The numerical id of the outfit.
 * @returns {Promise<HumanoidDescription>} A promise that returns the outfit's `HumanoidDescription`.
 */
export function promiseHumanoidDescriptionFromOutfitId(outfitId: number): Promise<HumanoidDescription> {
	return Promise.defer((resolve, reject) => {
		const result: OpcallResult<HumanoidDescription> = opcall(() =>
			Players.GetHumanoidDescriptionFromOutfitId(outfitId),
		);

		if (result.success) resolve(result.value);
		else reject(result.error);
	});
}

const MAX_TRIES = 5;

export function promiseUserThumbnail(
	userId: number,
	thumbnailType = Enum.ThumbnailType.AvatarBust,
	thumbnailSize = Enum.ThumbnailSize.Size352x352,
): Promise<string> {
	let promise: Promise<string>;
	// eslint-disable-next-line prefer-const
	promise = Promise.defer((resolve, reject, onCancel) => {
		let tries = 0;
		let shouldBreak = false;
		onCancel(() => (shouldBreak = true));

		do {
			if (shouldBreak) break;
			tries += 1;
			let content = "";
			let isReady = false;

			const result: OpcallResult<void> = opcall(() => {
				[content, isReady] = Players.GetUserThumbnailAsync(userId, thumbnailType, thumbnailSize);
			});

			if (!result.success) reject(result.error);
			else {
				if (shouldBreak) break;
				if (isReady) resolve(content);
				else Promise.delay(0.05).await();
			}
		} while (!(tries >= MAX_TRIES || promise.getStatus() !== Promise.Status.Started || !shouldBreak));
		reject();
	});

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
	return Promise.defer((resolve, reject) => {
		const result: OpcallResult<void> = opcall(() => humanoid.ApplyDescription(humanoidDescription));
		if (result.success) resolve();
		else reject(result.error);
	});
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

	return Promise.defer((resolve, reject) => {
		const result: OpcallResult<Instance[]> = opcall(() => game.GetObjects(`rbxassetid://${assetId}`));
		if (result.success) {
			object = <T>result.value[0];
			objectsArray[assetId] = object;
			resolve((<T>object).Clone());
		} else reject(result.error);
	});
}
