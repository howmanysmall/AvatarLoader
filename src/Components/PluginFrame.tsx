import { promiseUserIdFromName } from "../Util/Promises";
import { StudioFrame, StudioTextBox, StudioTextButton, StudioTextLabel } from "@rbxts/roact-studio-components";
import catchFactory from "Util/catchFactory";
import CharacterService from "Services/CharacterService";
import PaddingFrame from "./PaddingFrame";
import PromiseTracker from "Classes/PromiseTracker";
import Roact from "@rbxts/roact";

interface PluginFrameState {
	currentUserId: number;
}

export default class PluginFrame extends Roact.Component<{}, PluginFrameState> {
	private characterService: CharacterService = new CharacterService();
	private promiseTracker: PromiseTracker = new PromiseTracker();
	private DEFAULT_CFRAME = new CFrame(0, 4.19999981, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1);

	constructor() {
		super({});
		this.setState({
			currentUserId: 156,
		});
	}

	public willUnmount() {
		for (const pendingPromise of this.promiseTracker.GetAll()) pendingPromise.cancel();
	}

	public render(): Roact.Element {
		return (
			<StudioFrame
				AnchorPoint={new Vector2(0.5, 0.5)}
				BorderSizePixel={0}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={UDim2.fromScale(1, 1)}
			>
				<uilistlayout
					Key="UIListLayout"
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					SortOrder={Enum.SortOrder.LayoutOrder}
					VerticalAlignment={Enum.VerticalAlignment.Center}
				/>

				<StudioTextLabel
					Key="FrameTitle"
					LayoutOrder={0}
					Text={"Outfit Loader"}
					TextXAlignment={Enum.TextXAlignment.Center}
					Width={new UDim(0.85, 0)}
				/>

				<PaddingFrame Key="FirstPadding" LayoutOrder={1} PaddingSize={new UDim(0, 10)} />
				<StudioTextBox
					Key="UserEntry"
					ClearTextOnFocus={true}
					LayoutOrder={2}
					PlaceholderText={"Player Name/Id"}
					Width={new UDim(0.85, 0)}
					Visible={true}
					Events={{
						ValueChanged: (_, newValue: string) => {
							const [userIdMatch] = newValue.match("^(%d+)$");
							if (userIdMatch !== undefined)
								this.setState({
									currentUserId: tonumber(userIdMatch) as number,
								});
							else {
								this.promiseTracker
									.Add<number>(promiseUserIdFromName(newValue))
									.then((userId: number) => this.setState({ currentUserId: userId }))
									.catch(catchFactory("promiseUserIdFromName"));
							}
						},
					}}
					InputValidationCallback={(newValue: string) => {
						if (newValue.size() > 20) return false;
						return true;
					}}
				/>

				<PaddingFrame Key="SecondPadding" LayoutOrder={3} PaddingSize={new UDim(0, 10)} />
				<StudioTextButton
					Key="LoadButton"
					BackgroundColorEnum={Enum.StudioStyleGuideColor.MainButton}
					BorderColorEnum={Enum.StudioStyleGuideColor.ButtonBorder}
					LayoutOrder={4}
					Text={"Load Avatars"}
					TextColorEnum={Enum.StudioStyleGuideColor.ButtonText}
					Width={new UDim(0.85, 0)}
					Events={{
						MouseButton1Click: () => {
							const currentUserId = this.state.currentUserId;
							this.promiseTracker
								.Add<Model>(this.characterService.LoadCharacters(currentUserId, this.DEFAULT_CFRAME))
								.catch(catchFactory("CharacterService:LoadCharacters"));
						},
					}}
				/>
			</StudioFrame>
		);
	}
}
