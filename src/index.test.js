"use strict";

const { describe, it } = require("node:test");
const { fixLatin1ToUtf8, replacements } = require("./index");

describe("fixLatin1ToUtf8", () => {
	const entries = Object.entries(replacements);
	const entriesLength = entries.length;
	for (let i = 0; i < entriesLength; i += 1) {
		// Destructuring adds overhead, so use index access
		const actual = entries[i][0];
		const expected = entries[i][1];
		it(`Replaces ${actual} with ${expected}`, (t) => {
			t.plan(1);
			t.assert.strictEqual(fixLatin1ToUtf8(actual), expected);
		});
	}

	it("Replaces multiple characters", (t) => {
		t.plan(1);
		t.assert.strictEqual(fixLatin1ToUtf8("â€šÆ’â€žâ€¦â€\u00A0"), "‚ƒ„…†");
	});

	it("Does not alter a string without Latin-1 characters", (t) => {
		t.plan(1);
		const str = "Hello, world!";
		t.assert.strictEqual(fixLatin1ToUtf8(str), str);
	});

	it("Throws an error if the argument is not a string", (t) => {
		t.plan(1);
		t.assert.throws(() => fixLatin1ToUtf8(123), TypeError);
	});
});
