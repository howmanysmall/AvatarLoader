interface Debug {
	/**
	 * Gets the string of the directory of an object, properly formatted.
	 * @param {Instance} object The object you are converting to a string.
	 * @returns {string} The proper directory path to the object.
	 */
	DirectoryToString: (object: Instance) => string;

	/**
	 * An improved `error` function. Prefixing `errorMessage` with '!' makes it expect the `[error origin script].Name` as first parameter in `{...}`. Past the initial Error string, subsequent arguments get unpacked in a `string.format` of the error string. Assert falls back on Error. Error blames the latest item on the traceback as the cause of the error. Error makes it clear which Library and function are being misused.
	 * @param {string} errorMessage The error message.
	 * @param {unknown[] | undefined[]} argumentsToFormatIn The optional arguments to format with.
	 */
	Error: (errorMessage: string, ...argumentsToFormatIn: unknown[] | undefined[]) => void;

	/**
	 * An improved `assert` function that calls `Debug.Error` internally.
	 * @param {T} condition The condition to check against.
	 * @param {string | undefined} errorMessage The error message.
	 * @param {unknown[] | undefined[]} argumentsToFormatIn The optional arguments to format with.
	 * @returns {T | void} Returns the condition if it passes, otherwise will return nothing and errors instead.
	 */
	Assert: <T>(
		condition: T,
		errorMessage?: string | undefined,
		...argumentsToFormatIn: unknown[] | undefined[]
	) => T | void;

	/**
	 * Functions the same as `Debug.Error`, but internally calls `warn` instead of `error`.
	 * @param {string} errorMessage The error message.
	 * @param {unknown[] | undefined[]} argumentsToFormatIn The optional arguments to format with.
	 */
	Warn: (errorMessage: string, ...argumentsToFormatIn: unknown[] | undefined[]) => void;

	// /**
	//  * Iteration function that iterates over a dictionary in alphabetical order. Dictionary is that which will be iterated over in alphabetical order. Not case-sensitive.
	//  */
	// AlphabeticalOrder: (dictionary: Map<unknown, unknown> | Set<unknown>) => void;
	// UnionIteratorFunctions: (...functions)

	/**
	 * Converts a table to a string.
	 * @param {Map<unknown, unknown> | Set<unknown> | unknown[]} tableToConvert The table that you are converting to a string.
	 * @param {boolean=false} multiline Whether or not the table string will be on multiple lines.
	 * @param {string | undefined} tableName The name of the table. Prepends `local tableName = ` to the final string.
	 * @returns {string} The human-readable table string.
	 */
	TableToString: (
		tableToConvert: Map<unknown, unknown> | Set<unknown> | unknown[],
		multiline?: boolean | undefined,
		tableName?: string | undefined,
	) => string;

	/**
	 * Turns strings into Lua-readable format. Returns Objects location in proper Lua format. Useful for when you are doing string-intensive coding. Those minus signs are so tricky!
	 * @param {string} stringToEscape The string you want to escape.
	 * @returns {string} The escaped string.
	 */
	EscapeString: (stringToEscape: string) => string;

	/**
	 * Returns a string representation of anything. Inspects the passed objects and returns a string that contains them all, separated by commas.
	 * @param {unknown[]} objects The objects that you want to inspect.
	 * @returns {string} The stringified objects, separated by commas.
	 */
	Inspect: (...objects: unknown[]) => string;
}

declare const Debug: Debug;
export = Debug;
