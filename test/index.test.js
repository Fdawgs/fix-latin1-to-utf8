"use strict";

const { describe, it } = require("node:test");
const { fixLatin1ToUtf8, REPLACEMENTS } = require("../src/index");

/** @typedef {import('node:test').TestContext} TestContext */

const windows1252 = new TextDecoder("windows-1252");

/**
 * @author Frazer Smith
 * @description Reproduces mojibake by writing the character
 * out as UTF-8, then reading those bytes back as Windows-1252.
 * @param {string} char - Single character to corrupt.
 * @returns {string} The mojibake sequence.
 */
function mojibakeOf(char) {
	return windows1252.decode(Buffer.from(char, "utf8"));
}

/**
 * @author Frazer Smith
 * @description Reproduces mojibake by writing the character
 * out as UTF-8, then reading those bytes back as ISO-8859-1.
 * @param {string} char - Single character to corrupt.
 * @returns {string} The mojibake sequence.
 */
function isoMojibakeOf(char) {
	return Buffer.from(char, "utf8").toString("latin1");
}

describe("fixLatin1ToUtf8 function", () => {
	const entries = Object.entries(REPLACEMENTS);
	const entriesLength = entries.length;
	for (let i = 0; i < entriesLength; i += 1) {
		// Destructuring adds overhead, so use index access
		const actual = entries[i][0];
		const expected = entries[i][1];
		it(`Replaces ${actual} with ${expected}`, (/** @type {TestContext} */ t) => {
			t.plan(2);
			t.assert.strictEqual(fixLatin1ToUtf8(actual), expected);
			t.assert.strictEqual(expected.length, 1);
		});
	}

	it("REPLACEMENTS covers every Windows-1252 character above ASCII under both decoders, and nothing else", (/** @type {TestContext} */ t) => {
		t.plan(1);
		const expectedTable = new Map();
		// Only bytes 0x80-0xFF can turn into mojibake. Below that is plain ASCII
		for (let byte = 0x80; byte <= 0xff; byte += 1) {
			const char = windows1252.decode(Buffer.from([byte]));
			/**
			 * Skip bytes 0x81, 0x8D, 0x8F, 0x90 and 0x9D: Windows-1252 leaves them
			 * unassigned, so there is no character for REPLACEMENTS to recover. Node
			 * decodes each to the C1 control of its own value (0x81 to U+0081).
			 * Bytes 0xA0-0xFF also decode to their own value, but as printable
			 * characters, so those are kept.
			 * @see {@link https://encoding.spec.whatwg.org/index-windows-1252.txt | windows-1252 index}
			 */
			if (byte < 0xa0 && char.charCodeAt(0) === byte) {
				continue;
			}
			/**
			 * The two decoders only disagree for bytes 0x80-0x9F, so for 74 of the
			 * 123 characters both calls write the same key with the same value and
			 * the map settles on 172 entries rather than 246.
			 */
			expectedTable.set(mojibakeOf(char), char);
			expectedTable.set(isoMojibakeOf(char), char);
		}
		t.assert.deepStrictEqual(
			new Map(Object.entries(REPLACEMENTS)),
			expectedTable
		);
	});

	it("Replaces multiple characters", (/** @type {TestContext} */ t) => {
		t.plan(1);
		t.assert.strictEqual(fixLatin1ToUtf8("â€šÆ’â€žâ€¦â€\u00A0"), "‚ƒ„…†");
	});

	it("Does not alter a string without mojibake", (/** @type {TestContext} */ t) => {
		t.plan(1);
		const str = "Hello, world!";
		t.assert.strictEqual(fixLatin1ToUtf8(str), str);
	});

	it("Throws an error if the argument is not a string", (/** @type {TestContext} */ t) => {
		t.plan(1);
		// @ts-expect-error Testing invalid argument
		t.assert.throws(() => fixLatin1ToUtf8(123), TypeError);
	});
});
