import { HttpService } from "@rbxts/services";
import catchFactory from "Util/catchFactory";
import { promiseGet, promisePost } from "Util/HttpPromise";
import { DataInterface, ResponseInterface } from "../src/Typings/GlobalTypes";

function httpGet(
	url: string,
	noCache = false,
	headers?: Record<string, string> | Map<string, string> | undefined,
): ResponseInterface | false {
	const [success, body] = promiseGet(url, noCache, headers).await();
	if (success && typeIs(body, "string")) {
		const [position, _, match] = body.find(`"""(.+)"""$`);
		if (typeIs(match, "string") && typeIs(position, "number")) {
			const data: DataInterface = HttpService.JSONDecode<DataInterface>(match);
			return <ResponseInterface>{
				headers: data.headers,
				status: data.status,
				body: body.sub(1, position - 1),
			};
		} else {
			warn("Couldn't find data correctly.");
			return false;
		}
	} else {
		catchFactory("promiseGet")(tostring(body));
		return false;
	}
}

function httpPost(
	url: string,
	data: string,
	contentType = Enum.HttpContentType.ApplicationJson,
	compress = false,
	headers?: Record<string, string> | Map<string, string> | undefined,
): ResponseInterface | false {
	const [success, body] = promisePost(url, data, contentType, compress, headers).await();
	if (success && typeIs(body, "string")) {
		const [position, _, match] = body.find(`"""(.+)"""$`);
		if (typeIs(match, "string") && typeIs(position, "number")) {
			const data: DataInterface = HttpService.JSONDecode<DataInterface>(match);
			return <ResponseInterface>{
				headers: data.headers,
				status: data.status,
				body: body.sub(1, position - 1),
			};
		} else {
			warn("Couldn't find data correctly.");
			return false;
		}
	} else {
		catchFactory("httpPost")(tostring(body));
		return false;
	}
}

export class ProxyService {
	public readonly root: string;
	public readonly accessKey: string;

	constructor(root: string, accessKey: string) {
		const size: number = root.size();
		if (root.sub(size - 1, size - 1) === "/") root = root.sub(0, size - 2);
		if (root.find("^http[s]?://")[0] === undefined) error("Root must include http:// or https:// at the beginning");

		this.root = root;
		this.accessKey = accessKey;
	}

	public Get(
		url: string,
		noCache = false,
		headers?: Map<string, string> | undefined,
		overrideProto?: string | undefined,
	) {
		const endPosition: number | undefined = url.find("://")[1];
		const nextPosition = endPosition !== undefined ? url.find("/", endPosition)[0] : url.size() + 1;
		const sendHeaders: Map<string, string> =
			headers === undefined ? new Map<string, string>() : <Map<string, string>>headers;

		sendHeaders
			.set("proxy-access-key", this.accessKey)
			.set("proxy-target", url.sub(<number>endPosition, <number>nextPosition - 2));

		if (overrideProto !== undefined) sendHeaders.set("proxy-target-override-proto", overrideProto);

		if (headers !== undefined)
			for (const [header, value] of headers.entries())
				if (header.lower() === "user-agent") {
					sendHeaders.delete("user-agent");
					sendHeaders.set("proxy-override-user-agent", value);
				}

		return httpGet(this.root + url.sub(<number>nextPosition - 1), noCache, sendHeaders);
	}

	public Delete(
		url: string,
		noCache = false,
		headers?: Map<string, string> | undefined,
		overrideProto?: string | undefined,
	) {
		const endPosition: number | undefined = url.find("://")[1];
		const nextPosition = endPosition !== undefined ? url.find("/", endPosition)[0] : url.size() + 1;
		const sendHeaders: Map<string, string> =
			headers === undefined ? new Map<string, string>() : <Map<string, string>>headers;

		sendHeaders
			.set("proxy-access-key", this.accessKey)
			.set("proxy-target", url.sub(<number>endPosition, <number>nextPosition - 2))
			.set("proxy-target-override-method", "DELETE");

		if (overrideProto !== undefined) sendHeaders.set("proxy-target-override-proto", overrideProto);

		if (headers !== undefined)
			for (const [header, value] of headers.entries())
				if (header.lower() === "user-agent") {
					sendHeaders.delete("user-agent");
					sendHeaders.set("proxy-override-user-agent", value);
				}

		return httpGet(this.root + url.sub(<number>nextPosition - 1), noCache, sendHeaders);
	}

	public Post(
		url: string,
		data: string,
		contentType = Enum.HttpContentType.ApplicationJson,
		compress = false,
		headers?: Map<string, string> | undefined,
		overrideProto?: string | undefined,
	) {
		const endPosition = url.find("://")[1];
		const nextPosition = endPosition !== undefined ? url.find("/", endPosition)[0] : url.size() + 1;
		const sendHeaders: Map<string, string> =
			headers === undefined ? new Map<string, string>() : <Map<string, string>>headers;

		sendHeaders
			.set("proxy-access-key", this.accessKey)
			.set("proxy-target", url.sub(<number>endPosition, <number>nextPosition - 2));

		if (overrideProto !== undefined) sendHeaders.set("proxy-target-override-proto", overrideProto);

		if (headers !== undefined)
			for (const [header, value] of headers.entries())
				if (header.lower() === "user-agent") {
					sendHeaders.delete("user-agent");
					sendHeaders.set("proxy-override-user-agent", value);
				}

		return httpPost(this.root + url.sub(<number>nextPosition - 1), data, contentType, compress, sendHeaders);
	}

	public Put(
		url: string,
		data: string,
		contentType = Enum.HttpContentType.ApplicationJson,
		compress = false,
		headers?: Map<string, string> | undefined,
		overrideProto?: string | undefined,
	) {
		const endPosition = url.find("://")[1];
		const nextPosition = endPosition !== undefined ? url.find("/", endPosition)[0] : url.size() + 1;
		const sendHeaders: Map<string, string> =
			headers === undefined ? new Map<string, string>() : <Map<string, string>>headers;

		sendHeaders
			.set("proxy-access-key", this.accessKey)
			.set("proxy-target", url.sub(<number>endPosition, <number>nextPosition - 2))
			.set("proxy-target-override-method", "PUT");

		if (overrideProto !== undefined) sendHeaders.set("proxy-target-override-proto", overrideProto);

		if (headers !== undefined)
			for (const [header, value] of headers.entries())
				if (header.lower() === "user-agent") {
					sendHeaders.delete("user-agent");
					sendHeaders.set("proxy-override-user-agent", value);
				}

		return httpPost(this.root + url.sub(<number>nextPosition - 1), data, contentType, compress, sendHeaders);
	}

	public Patch(
		url: string,
		data: string,
		contentType = Enum.HttpContentType.ApplicationJson,
		compress = false,
		headers?: Map<string, string> | undefined,
		overrideProto?: string | undefined,
	) {
		const endPosition = url.find("://")[1];
		const nextPosition = endPosition !== undefined ? url.find("/", endPosition)[0] : url.size() + 1;
		const sendHeaders: Map<string, string> =
			headers === undefined ? new Map<string, string>() : <Map<string, string>>headers;

		sendHeaders
			.set("proxy-access-key", this.accessKey)
			.set("proxy-target", url.sub(<number>endPosition, <number>nextPosition - 2))
			.set("proxy-target-override-method", "PATCH");

		if (overrideProto !== undefined) sendHeaders.set("proxy-target-override-proto", overrideProto);

		if (headers !== undefined)
			for (const [header, value] of headers.entries())
				if (header.lower() === "user-agent") {
					sendHeaders.delete("user-agent");
					sendHeaders.set("proxy-override-user-agent", value);
				}

		return httpPost(this.root + url.sub(<number>nextPosition - 1), data, contentType, compress, sendHeaders);
	}

	// constructor(readonly root: string, readonly accessKey: string) {}
}
