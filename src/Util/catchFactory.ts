const catchFunctions: Map<string, (reason: unknown) => void> = new Map<string, (reason: unknown) => void>();

/**
 * Creates a catch function that is cached for reusing purposes. The function calls `warn` with the name of the function as well as the error message.
 * @param {string} functionName The name of the function that is being called.
 * @return {(reason: unknown) => void} A catch function that warns with the name of the function and the error message.
 */
export default function catchFactory(functionName: string): (reason: unknown) => void {
	let catchFunction: ((reason: unknown) => void) | undefined = catchFunctions.get(functionName);
	if (catchFunction === undefined) {
		catchFunction = (errorMessage: unknown) => warn(`Error in function ${functionName}: ${errorMessage}`);
		catchFunctions.set(functionName, catchFunction);
	}

	return catchFunction;
}
