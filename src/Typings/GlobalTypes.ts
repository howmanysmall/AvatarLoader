export type OpcallResult<T> =
	| {
			success: true;
			value: T;
	  }
	| {
			success: false;
			error: string;
	  };

export type CatchFunction = (ErrorMessage: string) => void;

export interface DataInterface {
	status: {
		message: string;
		code: number;
	};

	headers: Record<string, string> | Map<string, string>;
}

export interface ResponseInterface {
	status: {
		message: string;
		code: number;
	};

	body: string;
	headers: Record<string, string> | Map<string, string>;
}

export interface ResponseData {
	Body: string;
	Headers: Map<string, string> | Record<string, string>;
	StatusCode: number;
	StatusMessage: string;
}

export type R15 = Model & {
	LeftLowerArm: MeshPart & {
		LeftElbowRigAttachment: Attachment;
		LeftElbow: Motor6D;
		LeftWristRigAttachment: Attachment;
	};

	LeftFoot: MeshPart & {
		LeftAnkleRigAttachment: Attachment;
		LeftAnkle: Motor6D;
	};

	RightHand: MeshPart & {
		RightWristRigAttachment: Attachment;
		RightWrist: Motor6D;
		RightGripAttachment: Attachment;
	};

	HumanoidRootPart: Part & {
		RootRigAttachment: Attachment;
	};

	RightLowerLeg: MeshPart & {
		RightKneeRigAttachment: Attachment;
		RightAnkleRigAttachment: Attachment;
		RightKnee: Motor6D;
	};

	LeftUpperLeg: MeshPart & {
		LeftHip: Motor6D;
		LeftHipRigAttachment: Attachment;
		LeftKneeRigAttachment: Attachment;
	};

	LeftLowerLeg: MeshPart & {
		LeftKnee: Motor6D;
		LeftAnkleRigAttachment: Attachment;
		LeftKneeRigAttachment: Attachment;
	};

	LowerTorso: MeshPart & {
		WaistBackAttachment: Attachment;
		WaistCenterAttachment: Attachment;
		RootRigAttachment: Attachment;
		RightHipRigAttachment: Attachment;
		Root: Motor6D;
		WaistRigAttachment: Attachment;
		LeftHipRigAttachment: Attachment;
		WaistFrontAttachment: Attachment;
	};

	Head: Part & {
		FaceFrontAttachment: Attachment;
		HatAttachment: Attachment;
		Neck: Motor6D;
		NeckRigAttachment: Attachment;
		HairAttachment: Attachment;
		face: Decal;
		Mesh: SpecialMesh;
		FaceCenterAttachment: Attachment;
	};

	UpperTorso: MeshPart & {
		RightCollarAttachment: Attachment;
		BodyBackAttachment: Attachment;
		NeckRigAttachment: Attachment;
		LeftCollarAttachment: Attachment;
		Waist: Motor6D;
		RightShoulderRigAttachment: Attachment;
		BodyFrontAttachment: Attachment;
		WaistRigAttachment: Attachment;
		LeftShoulderRigAttachment: Attachment;
		NeckAttachment: Attachment;
	};

	LeftUpperArm: MeshPart & {
		LeftElbowRigAttachment: Attachment;
		LeftShoulderRigAttachment: Attachment;
		LeftShoulder: Motor6D;
		LeftShoulderAttachment: Attachment;
	};

	RightLowerArm: MeshPart & {
		RightWristRigAttachment: Attachment;
		RightElbow: Motor6D;
		RightElbowRigAttachment: Attachment;
	};

	LeftHand: MeshPart & {
		LeftWrist: Motor6D;
		LeftGripAttachment: Attachment;
		LeftWristRigAttachment: Attachment;
	};

	Humanoid: Humanoid & {
		HumanoidDescription: HumanoidDescription;
	};

	RightUpperArm: MeshPart & {
		RightShoulder: Motor6D;
		RightShoulderRigAttachment: Attachment;
		RightShoulderAttachment: Attachment;
		RightElbowRigAttachment: Attachment;
	};

	RightUpperLeg: MeshPart & {
		RightKneeRigAttachment: Attachment;
		RightHip: Motor6D;
		RightHipRigAttachment: Attachment;
	};

	RightFoot: MeshPart & {
		RightAnkle: Motor6D;
		RightAnkleRigAttachment: Attachment;
	};
};

export type R6 = Model & {
	["Left Leg"]: Part;
	Humanoid: Humanoid & {
		HumanoidDescription: HumanoidDescription;
	};

	["Right Arm"]: Part & {
		RightShoulderAttachment: Attachment;
	};

	Head: Part & {
		HatAttachment: Attachment;
		HairAttachment: Attachment;
		FaceFrontAttachment: Attachment;
		face: Decal;
		Mesh: SpecialMesh;
		FaceCenterAttachment: Attachment;
	};

	["Right Leg"]: Part;
	Torso: Part & {
		["Left Shoulder"]: Motor6D;
		WaistCenterAttachment: Attachment;
		BodyBackAttachment: Attachment;
		Neck: Motor6D;
		["Right Hip"]: Motor6D;
		WaistBackAttachment: Attachment;
		roblox: Decal;
		LeftCollarAttachment: Attachment;
		NeckAttachment: Attachment;
		RightCollarAttachment: Attachment;
		BodyFrontAttachment: Attachment;
		["Left Hip"]: Motor6D;
		["Right Shoulder"]: Motor6D;
		WaistFrontAttachment: Attachment;
	};

	HumanoidRootPart: Part & {
		RootJoint: Motor6D;
	};

	["Left Arm"]: Part & {
		LeftShoulderAttachment: Attachment;
	};
};

export {};
