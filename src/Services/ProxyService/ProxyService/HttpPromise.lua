local HttpService = game:GetService("HttpService")
local Promise = require(script.Parent.Promise)

local HttpPromise = {}

--[[**
	Generates a UUID/GUID random string, optionally with curly braces.

	@param [t:optional<t:boolean>] wrapInCurlyBraces Whether the returned string should be wrapped in {curly braces}. Defaults to true.
	@returns [tPlus:promise] A promise which calls HttpService:GenerateGUID.
**--]]
function HttpPromise.promiseGuid(wrapInCurlyBraces)
	return Promise.new(function(resolve, reject)
		local success, value = pcall(HttpService.GenerateGUID, HttpService, wrapInCurlyBraces);
		(success and resolve or reject)(value)
	end)
end

--[[**
	Decodes a JSON string into a Lua table.

	@param [t:string] input The JSON object being decoded.
	@returns [tPlus:promise] A promise which calls HttpService:JSONDecode.
**--]]
function HttpPromise.promiseDecode(input)
	return Promise.new(function(resolve, reject)
		local success, value = pcall(HttpService.JSONDecode, HttpService, input);
		(success and resolve or reject)(value)
	end)
end

--[[**
	Generate a JSON string from a Lua table.

	@param [t:table] input The input Lua table.
	@returns [tPlus:promise] A promise which calls HttpService:JSONEncode.
**--]]
function HttpPromise.promiseEncode(input)
	return Promise.new(function(resolve, reject)
		local success, value = pcall(HttpService.JSONEncode, HttpService, input);
		(success and resolve or reject)(value)
	end)
end

--[[**
	Replaces URL-unsafe characters with ‘%’ and two hexadecimal characters.

	@param [t:string] input The string (URL) to encode.
	@returns [tPlus:promise] A promise which calls HttpService:UrlEncode.
**--]]
function HttpPromise.promiseUrlEncode(input)
	return Promise.new(function(resolve, reject)
		local success, value = pcall(HttpService.UrlEncode, HttpService, input);
		(success and resolve or reject)(value)
	end)
end

--[[**
	Sends an HTTP request using any HTTP method given a dictionary of information.

	@param [t:requestInterface] requestDictionary A dictionary containing information to be requested from the server specified.
	@returns [tPlus:promise] A promise which calls HttpService:RequestAsync.
**--]]
function HttpPromise.promiseRequest(requestOptions)
	return Promise.defer(function(resolve, reject)
		local success, value = pcall(HttpService.RequestAsync, HttpService, requestOptions);
		(success and resolve or reject)(value)
	end)
end

--[[**
	Sends an HTTP GET request.

	@param [t:string] url The web address you are requesting data from.
	@param [t:optional<t:boolean>] noCache Whether the request stores (caches) the response. Defaults to false.
	@param [t:optional<t:any>] headers Used to specify some HTTP request headers.
	@returns [tPlus:promise] A promise which calls HttpService:GetAsync.
**--]]
function HttpPromise.promiseGet(url, noCache, headers)
	return Promise.defer(function(resolve, reject)
		local success, value = pcall(HttpService.GetAsync, HttpService, url, noCache ~= nil and noCache or false, headers);
		(success and resolve or reject)(value)
	end)
end

--[[**
	Sends an HTTP POST request.

	@param [t:string] url The destination address for the data.
	@param [t:string] data The data being sent.
	@param [t:optional<t:enum<Enum.HttpContentType>>] contentType Modifies the value in the Content-Type header sent with the request. Defaults to Enum.HttpContentType.ApplicationJson.
	@param [t:optional<t:boolean>] compress Determines whether the data is compressed (gzipped) when sent. Defaults to false.
	@param [t:optional<t:any>] headers Used to specify some HTTP request headers.
	@returns [tPlus:promise] A promise which calls HttpService:PostAsync.
**--]]
function HttpPromise.promisePost(url, data, contentType, compress, headers)
	contentType = contentType or Enum.HttpContentType.ApplicationJson
	compress = compress ~= nil and compress or compress

	return Promise.defer(function(resolve, reject)
		local success, value = pcall(HttpService.PostAsync, HttpService, url, data, contentType, compress, headers);
		(success and resolve or reject)(value)
	end)
end

return HttpPromise