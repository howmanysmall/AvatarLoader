local PACKAGES = {
	"npm i @rbxts/t";
	"npm i @rbxts/services";
	"npm i @rbxts/roact";
	"npm i @rbxts/signal";
	"npm i @rbxts/flipper";
	"npm i @rbxts/http-queue";
	"snpm i @rbxts/rodux";
	"npm i @rbxts/roact-rodux";
}

for _, PackageCommand in ipairs(PACKAGES) do
	os.execute(PackageCommand)
end