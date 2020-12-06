import { Workspace } from "@rbxts/services";
import AvatarService from "./AvatarService";
import { R6, R15 } from "../Util/LoadCharacter";
import Ready from "../Classes/Ready";
import { promiseHumanoidDescriptionFromOutfitId, promiseApplyDescription } from "Util/Promises";
import Signal from "@rbxts/signal";
import { wait as smartWait } from "@rbxts/delay-spawn-wait";
import catchFactory from "Util/catchFactory";

const HALF_PI_ANGLES = CFrame.Angles(0, math.pi / 2, 0);

export default class CharacterService {
	public AvatarsLoaded = new Signal<(model: Model) => void>();
	public LoadFailed = new Signal<(errorMessage: string) => void>();
	private avatarService: AvatarService = new AvatarService();

	/**
	 * Loads the given `UserId`'s outfits at the given location. This function yields.
	 * @param {number} userId The `UserId` of the player whose avatars you want to load.
	 * @param {CFrame} outfitLocation The `CFrame` location of where the outfits will be placed.
	 * @returns {Model | undefined} This function returns a `Model` if the outfits were loaded successfully, but will return undefined if it fails.
	 */
	public LoadCharactersAsync(userId: number, outfitLocation: CFrame): Model | undefined {
		const outfits = this.avatarService.GetOutfitsAsync(userId, 1);
		if (!typeIs(outfits, "string")) {
			const total = outfits.size();
			const totalCFrame = new CFrame(total, 0, 0);
			const totalRadians = math.rad(360 / total);

			const model = new Instance("Model");
			model.Name = tostring(userId);
			model.Parent = Workspace;

			const modelYield = new Ready(model, 1);
			for (const [index, outfit] of ipairs(outfits)) {
				const thread = coroutine.create(() => {
					this.GenerateCharacter(
						model,
						outfit.OutfitId,
						outfit.Name,
						outfitLocation.mul(CFrame.Angles(0, totalRadians * index, 0)).mul(totalCFrame),
					);
				});

				coroutine.resume(thread);
			}

			modelYield.Wait();
			modelYield.Destroy();

			for (const [index, child] of ipairs(<Array<Model>>model.GetChildren()))
				child.SetPrimaryPartCFrame(outfitLocation.sub(new Vector3(index * 4, 0, 0)));

			for (const descendant of model.GetDescendants()) if (descendant.IsA("BasePart")) descendant.Locked = false;
			this.AvatarsLoaded.Fire(model);
			return model;
		} else this.LoadFailed.Fire(outfits);
	}

	/**
	 * Loads the given `UserId`'s outfits at the given location. This function does not yield the current thread.
	 * @param {number} userId The `UserId` of the player whose avatars you want to load.
	 * @param {CFrame} outfitLocation The `CFrame` location of where the outfits will be placed.
	 * @return {Promise<Model>} This function returns a promise that returns the character models if the outfits were loaded successfully.
	 */
	public LoadCharacters(userId: number, outfitLocation: CFrame): Promise<Model> {
		return Promise.defer((resolve, reject) => {
			const outfits = this.avatarService.GetOutfitsAsync(userId, 1);
			if (!typeIs(outfits, "string")) {
				const total = outfits.size();
				const totalCFrame = new CFrame(total, 0, 0);
				const totalRadians = math.rad(360 / total);

				const model = new Instance("Model");
				model.Name = tostring(userId);
				model.Parent = Workspace;

				const modelYield = new Ready(model, 1);
				for (const [index, outfit] of ipairs(outfits)) {
					const thread = coroutine.create(() => {
						this.GenerateCharacter(
							model,
							outfit.OutfitId,
							outfit.Name,
							outfitLocation.mul(CFrame.Angles(0, totalRadians * index, 0)).mul(totalCFrame),
						);
					});

					coroutine.resume(thread);
				}

				modelYield.Wait();
				modelYield.Destroy();

				for (const [index, child] of ipairs(<Array<Model>>model.GetChildren()))
					child.SetPrimaryPartCFrame(outfitLocation.sub(new Vector3(index * 4, 0, 0)));

				for (const descendant of model.GetDescendants())
					if (descendant.IsA("BasePart")) descendant.Locked = false;

				this.AvatarsLoaded.Fire(model);
				resolve(model);
			} else {
				this.LoadFailed.Fire(outfits);
				reject(outfits);
			}
		});
	}

	/**
	 * This function generates the given outfit, based on the given parameters.
	 * @param {Instance} parent The parent of the character model.
	 * @param {number} outfitId The id of the outfit.
	 * @param {string} outfitName The name of the outfit.
	 * @param {CFrame} outfitLocation The location of the outfit.
	 * @returns {Model} The character model.
	 */
	public GenerateCharacter(parent: Instance, outfitId: number, outfitName: string, outfitLocation: CFrame) {
		if (this.avatarService.GetAvatarRigType(outfitId) === Enum.HumanoidRigType.R15) {
			const character = R15(parent, outfitLocation.mul(HALF_PI_ANGLES));
			const humanoid = <Humanoid>character.WaitForChild("Humanoid");
			promiseHumanoidDescriptionFromOutfitId(outfitId)
				.then((humanoidDescription) => {
					humanoidDescription.Parent = humanoid;
					const thread = coroutine.create(() =>
						this.repeatApplyDescription(humanoid, humanoidDescription, 5),
					);

					coroutine.resume(thread);
					character.Name = outfitName;
				})
				.catch(catchFactory("promiseHumanoidDescriptionFromOutfitId"));

			return character;
		} else {
			const character = R6(parent, outfitLocation.mul(HALF_PI_ANGLES));
			const humanoid = <Humanoid>character.WaitForChild("Humanoid");
			promiseHumanoidDescriptionFromOutfitId(outfitId)
				.then((humanoidDescription) => {
					humanoidDescription.Parent = humanoid;
					const thread = coroutine.create(() =>
						this.repeatApplyDescription(humanoid, humanoidDescription, 5),
					);

					coroutine.resume(thread);
					character.Name = outfitName;
				})
				.catch(catchFactory("promiseHumanoidDescriptionFromOutfitId"));

			return character;
		}
	}

	private repeatApplyDescription(
		humanoid: Humanoid,
		humanoidDescription: HumanoidDescription,
		maxAttempts = 5,
	): void {
		let attempts = 0;
		let [success] = promiseApplyDescription(humanoid, humanoidDescription).await();

		if (!success) {
			do {
				[success] = promiseApplyDescription(humanoid, humanoidDescription).await();
				attempts++;
				smartWait(0.03);
			} while (!(success || attempts >= maxAttempts));

			if (attempts > maxAttempts) warn(`Failed to apply in ${maxAttempts} attempts.`);
		}
	}
}
