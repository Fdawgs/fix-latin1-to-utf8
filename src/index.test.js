"use strict";

const { fixLatin1ToUtf8, replacements } = require("./index");

describe("fixLatin1ToUtf8", () => {
	it.each(Object.entries(replacements))(
		"Replaces %s with %s",
		(actual, expected) => {
			expect(fixLatin1ToUtf8(actual)).toBe(expected);
		}
	);

	it("Replaces multiple characters", () => {
		expect(fixLatin1ToUtf8("â€šÆ’â€žâ€¦â€\u00A0")).toBe("‚ƒ„…†");
	});

	it("Does not mutate a string without Latin-1 characters", () => {
		const str = "Hello, world!";
		expect(fixLatin1ToUtf8(str)).toBe(str);
	});

	it("Throws an error if the argument is not a string", () => {
		expect(() => fixLatin1ToUtf8(123)).toThrow(TypeError);
	});
});
