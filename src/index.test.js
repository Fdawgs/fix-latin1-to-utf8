"use strict";

// eslint-disable-next-line n/no-unsupported-features/node-builtins -- Tests, not in distributed code
const { describe, it } = require("node:test");
const { fixLatin1ToUtf8, REPLACEMENTS } = require("./index");

/** @typedef {import('node:test').TestContext} TestContext */

describe("fixLatin1ToUtf8 function", () => {
	const entries = Object.entries(REPLACEMENTS);
	const entriesLength = entries.length;
	for (let i = 0; i < entriesLength; i += 1) {
		// Destructuring adds overhead, so use index access
		const actual = entries[i][0];
		const expected = entries[i][1];
		it(`Replaces ${actual} with ${expected}`, (/** @type {TestContext} */ t) => {
			t.plan(1);
			t.assert.strictEqual(fixLatin1ToUtf8(actual), expected);
		});
	}

	it("Replaces multiple characters", (/** @type {TestContext} */ t) => {
		t.plan(1);
		t.assert.strictEqual(fixLatin1ToUtf8("â€šÆ’â€žâ€¦â€\u00A0"), "‚ƒ„…†");
	});

	it("Does not alter a string without Latin-1 characters", (/** @type {TestContext} */ t) => {
		t.plan(1);
		const str = "Hello, world!";
		t.assert.strictEqual(fixLatin1ToUtf8(str), str);
	});

	it("Throws an error if the argument is not a string", (/** @type {TestContext} */ t) => {
		t.plan(1);
		// @ts-expect-error
		t.assert.throws(() => fixLatin1ToUtf8(123), TypeError);
	});
});
