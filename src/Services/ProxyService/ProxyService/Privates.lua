local HttpPromise = require(script.Parent.HttpPromise)
local Promise = require(script.Parent.Promise)

local Privates = {}

local function CatchFactory(FunctionName, DoReject)
	if DoReject then
		return function(Error)
			warn(string.format("Function %s failed to execute, got error %s.", FunctionName, Error))
			return false
		end
	else
		return function(Error)
			warn(string.format("Function %s failed to execute, got error %s.", FunctionName, Error))
		end
	end
end

--local function PrintTable(Table, TableName, IndentLevel)
--	print(string.format("%s%s = {", string.rep("\t", IndentLevel), TableName))
--	for Index, Value in next, Table do
--		local TypeValue = typeof(Value)
--		if TypeValue == "table" then
--			PrintTable(Value, tostring(Index), IndentLevel + 1)
--		else
--			print(string.format("%s[%s (%s)] = %s; (%s)", string.rep("\t", IndentLevel + 1), tostring(Index), typeof(Index), tostring(Value), TypeValue))
--		end
--	end
--	print(string.rep("\t", IndentLevel) .. "}")
--end

function Privates.HttpGetAsync(Url, NoCache, Headers)
	Headers = Headers or {}
	if NoCache then
		Headers["Cache-Control"] = "no-cache"
	end

	local RequestDictionary = {
		Url = Url;
		Method = "GET";
		Headers = Headers;
	}

	local CatchFunction = CatchFactory("HttpGetAsync", true)
	return HttpPromise.promiseRequest(RequestDictionary):andThen(function(ResponseData)
		if ResponseData.Success then
			local Body = ResponseData.Body
			local Position, _, Match = string.find(Body, "\"\"\"(.+)\"\"\"$")
			if Match then
				return HttpPromise.promiseDecode(Match):andThen(function(Data)
					return {
						Body = string.sub(Body, 1, Position - 1);
						Headers = ResponseData.Headers; -- Data.headers is slightly different but this shouldn't break, right?
						StatusCode = ResponseData.StatusCode;
						StatusMessage = ResponseData.StatusMessage;
					}
				end):catch(CatchFunction)
			end
		else
			return false
		end
	end):catch(CatchFunction)
end

function Privates.OldHttpGetAsync(...)
	local CatchFunction = CatchFactory("HttpGetAsync", true)

	return HttpPromise.promiseGet(...):andThen(function(Body)
		local Position, _, Match = string.find(Body, "\"\"\"(.+)\"\"\"$")
		if Match then
			return HttpPromise.promiseDecode(Match):andThen(function(Data)
				return {
					headers = Data.headers;
					status = Data.status;
					body = string.sub(Body, 1, Position - 1);
				}
			end):catch(CatchFunction)
		else
			return false
		end
	end):catch(CatchFunction)
end

function Privates.HttpPostAsync(...)
	local CatchFunction = CatchFactory("HttpPostAsync", true)

	return HttpPromise.promisePost(...):andThen(function(Body)
		local Position, _, Match = string.find(Body, "\"\"\"(.+)\"\"\"$")
		if Match then
			return HttpPromise.promiseDecode(Match):andThen(function(Data)
				return {
					headers = Data.headers;
					status = Data.status;
					body = string.sub(Body, 1, Position - 1);
				}
			end):catch(CatchFunction)
		else
			return false
		end
	end):catch(CatchFunction)
end

return Privates