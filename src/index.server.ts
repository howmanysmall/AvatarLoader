/// <reference types="@rbxts/types/plugin" />

import { StudioDialogFrame } from "@rbxts/roact-studio-components";
import PluginFrame from "./Components/PluginFrame";
import Maid from "@rbxts/maid";
import Roact from "@rbxts/roact";

const toolbar = plugin.CreateToolbar("AvatarLoader2");
const button = toolbar.CreateButton(
	"AvatarLoader",
	"Load avatars with ease.",
	"rbxassetid://134814423",
	"Load Avatars",
);

const pluginMaid = new Maid();

const dialogFrame = new StudioDialogFrame(plugin, "LoadOutfits", "Load Outfits", new Vector2(350, 120), "LoadOutfits");
pluginMaid.GiveTask(dialogFrame);
dialogFrame.SetContents(Roact.createElement(PluginFrame));

let isOpen = false;

// THIS CODE IS BUGGY AND DOESN'T LIKE ME
pluginMaid.GiveTask(
	button.Click.Connect(() => {
		isOpen = !isOpen;
		if (isOpen) dialogFrame.Open();
		else dialogFrame.Close();
	}),
);

pluginMaid.GiveTask(
	plugin.Unloading.Connect(() => {
		pluginMaid.Destroy();
	}),
);

export {};
