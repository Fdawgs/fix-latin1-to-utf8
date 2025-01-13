"use strict";

const { describe, it } = require("node:test");
const { fixLatin1ToUtf8, replacements } = require("./index");

describe("fixLatin1ToUtf8", () => {
	for (const [actual, expected] of Object.entries(replacements)) {
		it(`Replaces ${actual} with ${expected}`, (t) => {
			t.plan(1);
			t.assert.strictEqual(fixLatin1ToUtf8(actual), expected);
		});
	}

	it("Replaces multiple characters", (t) => {
		t.plan(1);
		t.assert.strictEqual(fixLatin1ToUtf8("â€šÆ’â€žâ€¦â€\u00A0"), "‚ƒ„…†");
	});

	it("Does not mutate a string without Latin-1 characters", (t) => {
		t.plan(1);
		const str = "Hello, world!";
		t.assert.strictEqual(fixLatin1ToUtf8(str), str);
	});

	it("Throws an error if the argument is not a string", (t) => {
		t.plan(1);
		t.assert.throws(() => fixLatin1ToUtf8(123), TypeError);
	});
});
