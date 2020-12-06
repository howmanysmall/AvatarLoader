import { HttpService } from "@rbxts/services";
import ProxyService from "./ProxyService";
import { OpcallResult } from "../Typings/GlobalTypes";

interface AvatarUrls {
	GetOutfits: string;
	GetOutfitDetails: string;
}

const AVATAR_URLS: AvatarUrls = {
	GetOutfits: "https://avatar.roblox.com/v1/users/%d/outfits?itemsPerPage=10000&page=%d",
	GetOutfitDetails: "https://avatar.roblox.com/v1/outfits/%d/details",
};

export interface Outfit {
	Name: string;
	OutfitId: number;
}

interface OutfitData {
	name: string;
	id: number;
}

interface OutfitBody {
	total: number;
	data: Array<OutfitData>;
}

interface AvatarType {
	playerAvatarType: "R15" | "R6";
}

export default class AvatarService {
	/**
	 * Gets the outfits of the given `UserId`. This function yields the current thread.
	 * @param {number} userId The `UserId` of the player whose outfits you want to get.
	 * @param {number=1} pageNumber The page number of the returned values. Useless, but defaults to `1`.
	 * @return {Array<Outfit> | string} An array of outfits if the outfits were properly loaded, otherwise returns an error string.
	 */
	public GetOutfitsAsync(userId: number, pageNumber = 1): Array<Outfit> | string {
		const outfitResponse = ProxyService.Get(AVATAR_URLS.GetOutfits.format(userId, pageNumber), true);
		if (outfitResponse.StatusMessage === "OK") {
			const result: OpcallResult<OutfitBody> = opcall(() => HttpService.JSONDecode(outfitResponse.Body));
			if (result.success) {
				const playerOutfits: Array<Outfit> = new Array<Outfit>(result.value.total);
				for (const outfitData of result.value.data)
					playerOutfits.push({
						Name: outfitData.name,
						OutfitId: outfitData.id,
					});

				return playerOutfits;
			} else return `Failed to decode data: ${result.error}`;
		} else return `Failed to get outfits: ${outfitResponse.StatusMessage}`;
	}

	/**
	 * Gets the outfits of the given `UserId` wrapped in a Promise. This function does not yield the current thread.
	 * @param {number} userId The `UserId` of the player whose outfits you want to get.
	 * @param {number=1} pageNumber The page number of the returned values. Useless, but defaults to `1`.
	 * @return {Promise<Array<Outfit>>} A promise that returns an array of outfits.
	 */
	public GetOutfits(userId: number, pageNumber = 1): Promise<Array<Outfit>> {
		return new Promise<Array<Outfit>>((resolve, reject) =>
			Promise.spawn(() => {
				const outfitResponse = ProxyService.Get(AVATAR_URLS.GetOutfits.format(userId, pageNumber), true);
				if (outfitResponse.StatusMessage === "OK") {
					const result: OpcallResult<OutfitBody> = opcall(() => HttpService.JSONDecode(outfitResponse.Body));
					if (result.success) {
						const playerOutfits: Array<Outfit> = new Array<Outfit>(result.value.total);
						for (const outfitData of result.value.data)
							playerOutfits.push({
								Name: outfitData.name,
								OutfitId: outfitData.id,
							});

						resolve(playerOutfits);
					} else reject(`Failed to decode data: ${result.error}`);
				} else reject(`Failed to get outfits: ${outfitResponse.StatusMessage}`);
			}),
		);
	}

	/**
	 * Gets the avatar rig type of the given outfit.
	 * @param {number} outfitId The id of the outfit whose rig type you want to get.
	 * @return {Enum.HumanoidRigType} The outfit's `HumanoidRigType`. If not found, this function returns `Enum.HumanoidRigType.R15` by default.
	 */
	public GetAvatarRigType(outfitId: number): Enum.HumanoidRigType {
		const outfitResponse = ProxyService.Get(AVATAR_URLS.GetOutfitDetails.format(outfitId), true);
		if (outfitResponse.StatusMessage === "OK") {
			const result: OpcallResult<AvatarType> = opcall(() => HttpService.JSONDecode(outfitResponse.Body));
			if (result.success) return Enum.HumanoidRigType[result.value.playerAvatarType];
			else {
				warn(`Failed to decode data: ${result.error}`);
				return Enum.HumanoidRigType.R15;
			}
		} else {
			warn(`Failed to get outfit data: ${outfitResponse.StatusMessage}`);
			return Enum.HumanoidRigType.R15;
		}
	}

	// /**
	//  * Gets the avatar rig type of the given outfit wrapped in a Promise.
	//  * @param outfitId The id of the outfit whose rig type you want to get.
	//  * @return A promise that returns the Enum.HumanoidRigType.
	//  */
	// public GetAvatarRigTypeAsync(outfitId: number): Promise<Enum.HumanoidRigType> {
	// 	const outfitResponse = ProxyService.Get(AVATAR_URLS.GetOutfitDetails.format(outfitId), true);
	// 	if (outfitResponse.status.message === "OK") {
	// 		const result: OpcallResult<AvatarType> = opcall(() => HttpService.JSONDecode(outfitResponse.body));
	// 		if (result.success) {
	// 			return Enum.HumanoidRigType[result.value.playerAvatarType];
	// 		} else {
	// 			warn(`Failed to decode data: ${result.error}`);
	// 			return Enum.HumanoidRigType.R15;
	// 		}
	// 	} else {
	// 		warn(`Failed to get outfit data: ${outfitResponse.status.message}`);
	// 		return Enum.HumanoidRigType.R15;
	// 	}
	// }
}
