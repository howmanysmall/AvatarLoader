interface ResponseData {
	body: string;
	headers: Map<string, string>;
	status: { code: number; message: string };
}

interface NewResponseData {
	Body: string;
	Headers: Map<string, string>;
	StatusCode: number;
	StatusMessage: string;
}

interface ProxyService {
	/**
	 * Sends a `GET` request to the proxy server.
	 * @param {string} url The url of the request.
	 * @param {boolean | undefined} noCache Whether the request stores (caches) the response.
	 * @param {Map<string, string> | undefined} headers Used to specify some HTTP request headers.
	 * @param {string | undefined} overrideProto Whether or not the prototype is overridden. Not 100% sure what this does.
	 */
	Get(
		this: ProxyService,
		url: string,
		noCache?: boolean | undefined,
		headers?: Map<string, string> | undefined,
		overrideProto?: string | undefined,
	): NewResponseData;

	Delete(
		this: ProxyService,
		url: string,
		noCache?: boolean | undefined,
		headers?: Map<string, string> | undefined,
		overrideProto?: string | undefined,
	): ResponseData;

	Post(
		url: string,
		data: string,
		contentType?: Enum.HttpContentType | undefined,
		compress?: boolean | undefined,
		headers?: Map<string, string> | undefined,
		overrideProto?: string | undefined,
	): ResponseData;

	Put(
		url: string,
		data: string,
		contentType?: Enum.HttpContentType | undefined,
		compress?: boolean | undefined,
		headers?: Map<string, string> | undefined,
		overrideProto?: string | undefined,
	): ResponseData;

	Patch(
		url: string,
		data: string,
		contentType?: Enum.HttpContentType | undefined,
		compress?: boolean | undefined,
		headers?: Map<string, string> | undefined,
		overrideProto?: string | undefined,
	): ResponseData;
}

declare const ProxyService: ProxyService;
export = ProxyService;
