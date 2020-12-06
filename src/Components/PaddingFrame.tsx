import Roact from "@rbxts/roact";
import { PaddingStyle } from "../Typings/Enums";

interface PaddingFrameProps {
	PaddingStyle?: PaddingStyle;
	LayoutOrder?: number;
	PaddingSize: UDim;
	Visible?: boolean;
}

export default class PaddingFrame extends Roact.Component<PaddingFrameProps> {
	static defaultProps: PaddingFrameProps = {
		PaddingStyle: PaddingStyle.Vertical,
		LayoutOrder: 0,
		PaddingSize: new UDim(0, 10),
		Visible: true,
	};

	public render(): Roact.Element {
		let paddingSize: UDim2;
		if (this.props.PaddingStyle === PaddingStyle.Vertical)
			paddingSize = new UDim2(new UDim(1, 0), this.props.PaddingSize);
		else paddingSize = new UDim2(this.props.PaddingSize, new UDim(1, 0));

		return (
			<frame
				BackgroundTransparency={1}
				LayoutOrder={this.props.LayoutOrder}
				Size={paddingSize}
				Visible={this.props.Visible}
			/>
		);
	}
}
