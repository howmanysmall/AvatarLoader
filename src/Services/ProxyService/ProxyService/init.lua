local HttpPromise = require(script.HttpPromise)
local Privates = require(script.Privates)

local POST_METHODS = {"POST", "PUT", "PATCH"}
local GET_METHODS = {"GET", "DELETE"}

local ProxyService = {}
ProxyService.__index = ProxyService

function ProxyService.new(Root, AccessKey)
	if string.sub(Root, #Root, #Root) == "/" then
		Root = string.sub(Root, 1, #Root - 1)
	end

	if not string.find(Root, "^http[s]?://") then
		error("Root must include http:// or https:// at the beginning")
	end

	return setmetatable({
		AccessKey = AccessKey;
		Root = Root;
	}, ProxyService)
end

-- To-Do: Convert these to use RequestAsync.
local function HttpGet(...)
	local Success, Data = Privates.HttpGetAsync(...):await()
	return Success and Data or false
end

local function HttpPost(...)
	local Success, Data = Privates.HttpPostAsync(...):await()
	return Success and Data or false
end

local function GetHeaders(self, Method, Target, Headers, OverrideProto)
	local SendHeaders = Headers or {}
	SendHeaders["proxy-access-key"] = self.AccessKey
	SendHeaders["proxy-target"] = Target

	if OverrideProto then
		SendHeaders["proxy-target-override-proto"] = OverrideProto
	end

	if Method ~= "GET" and Method ~= "POST" then
		SendHeaders["proxy-target-override-method"] = Method
	end

	if Headers then
		for Header, Value in next, Headers do
			if string.lower(Header) == "user-agent" then
				SendHeaders["user-agent"] = nil
				SendHeaders["proxy-override-user-agent"] = Value
			end
		end
	end

	return SendHeaders
end

local function GeneratePostHandler(Method)
	return function(self, Target, Path, Data, ContentType, Compress, Headers, OverrideProto)
		local SendHeaders = GetHeaders(self, Method, Target, Headers, OverrideProto)
		return HttpPost(self.Root .. Path, Data, ContentType, Compress, SendHeaders)
	end
end

local function GenerateGetHandler(Method)
	return function(self, Target, Path, NoCache, Headers, OverrideProto)
		local SendHeaders = GetHeaders(self, Method, Target, Headers, OverrideProto)
		return HttpGet(self.Root .. Path, NoCache, SendHeaders)
	end
end

local function UrlProcessor(Function)
	return function(self, Url, ...)
		local _, EndPosition = string.find(Url, "://")
		local NextPosition = string.find(Url, "/", EndPosition + 1) or #Url + 1
		return Function(self, string.sub(Url, EndPosition + 1, NextPosition - 1), string.sub(Url, NextPosition), ...)
	end
end

local function GenerateWithHandler(Handler, Method, HandlerMethod)
	ProxyService[string.upper(string.sub(Method, 1, 1)) .. string.lower(string.sub(Method, 2))] = UrlProcessor(Handler(Method))
end

for _, Method in ipairs(POST_METHODS) do
	GenerateWithHandler(GeneratePostHandler, Method)
end

for _, Method in ipairs(GET_METHODS) do
	GenerateWithHandler(GenerateGetHandler, Method)
end

return ProxyService