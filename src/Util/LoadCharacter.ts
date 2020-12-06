import { R6, R15 } from "../Typings/GlobalTypes";
import { promiseGetObject } from "./Promises";

export function loadR6(parent: Instance, position?: CFrame): Promise<R6 | void> {
	return promiseGetObject<R6>(5936600227).then((r6) => {
		if (position !== undefined) r6.SetPrimaryPartCFrame(position);
		r6.Parent = parent;
		return r6;
	});
}

export function loadR15(parent: Instance, position?: CFrame): Promise<R15 | void> {
	return promiseGetObject<R15>(5936598099).then((r15) => {
		if (position !== undefined) r15.SetPrimaryPartCFrame(position);
		r15.Parent = parent;
		return r15;
	});
}

export function R6(parent: Instance, position?: CFrame): R6 {
	const [success, r6] = loadR6(parent, position).await();
	if (success) return <R6>r6;
	else error(`Failed to get R6 model: ${tostring(r6)}`);
}

export function R15(parent: Instance, position?: CFrame): R15 {
	const [success, r15] = loadR15(parent, position).await();
	if (success) return <R15>r15;
	else error(`Failed to get R15 model: ${tostring(r15)}`);
}

export async function loadR6Async(parent: Instance, position?: CFrame): Promise<R6 | void> {
	const r6 = await promiseGetObject<R6>(5936600227);
	if (position !== undefined) r6.SetPrimaryPartCFrame(position);
	r6.Parent = parent;
	return r6;
}

export async function loadR15Async(parent: Instance, position?: CFrame): Promise<R15 | void> {
	const r15 = await promiseGetObject<R15>(5936598099);
	if (position !== undefined) r15.SetPrimaryPartCFrame(position);
	r15.Parent = parent;
	return r15;
}
