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
function win1252MojibakeOf(char) {
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

	it("REPLACEMENTS contains all expected Latin-1 and Windows-1252 mojibake mappings", (/** @type {TestContext} */ t) => {
		const expectedReplacements = new Map();
		const unassignedBytes = new Set([0x81, 0x8d, 0x8f, 0x90, 0x9d]);

		// Only bytes 0x80-0xFF can turn into mojibake. Below that is plain ASCII
		for (let byte = 0x80; byte <= 0xff; byte += 1) {
			/**
			 * Skip bytes 0x81, 0x8D, 0x8F, 0x90 and 0x9D: Windows-1252 leaves them
			 * unassigned, so there is no character for REPLACEMENTS to recover.
			 * @see {@link https://encoding.spec.whatwg.org/index-windows-1252.txt | windows-1252 index}
			 */
			if (unassignedBytes.has(byte)) {
				continue;
			}

			const originalChar = windows1252.decode(Buffer.from([byte]));

			// Add the mojibake produced by reading the UTF-8 bytes as Windows-1252 and ISO-8859-1
			expectedReplacements.set(
				win1252MojibakeOf(originalChar),
				originalChar
			);
			expectedReplacements.set(isoMojibakeOf(originalChar), originalChar);
		}

		t.plan(1);
		t.assert.deepStrictEqual(
			new Map(Object.entries(REPLACEMENTS)),
			expectedReplacements
		);
	});

	it("Replaces multiple characters", (/** @type {TestContext} */ t) => {
		t.plan(1);
		t.assert.strictEqual(fixLatin1ToUtf8("â€šÆ’â€žâ€¦â€\u00A0"), "‚ƒ„…†");
	});

	it("Is idempotent for adjacent mojibake sequences", (/** @type {TestContext} */ t) => {
		// Adjacent replacements can combine into new mojibake, so test every pair
		const notIdempotent = [];
		for (let i = 0; i < entriesLength; i += 1) {
			for (let j = 0; j < entriesLength; j += 1) {
				const fixed = fixLatin1ToUtf8(entries[i][0] + entries[j][0]);
				if (fixLatin1ToUtf8(fixed) !== fixed) {
					notIdempotent.push(fixed);
				}
			}
		}

		t.plan(1);
		t.assert.deepStrictEqual(notIdempotent, []);
	});

	it("Fixes double-encoded mojibake in a single call", (/** @type {TestContext} */ t) => {
		const isoDouble = isoMojibakeOf(isoMojibakeOf("é"));
		const windows1252Double = win1252MojibakeOf(win1252MojibakeOf("é"));

		t.plan(4);
		t.assert.strictEqual(isoDouble, "Ã\u0083Â©");
		t.assert.strictEqual(fixLatin1ToUtf8(isoDouble), "é");
		t.assert.strictEqual(windows1252Double, "ÃƒÂ©");
		t.assert.strictEqual(fixLatin1ToUtf8(windows1252Double), "é");
	});

	it("Fixes triple-encoded mojibake in a single call", (/** @type {TestContext} */ t) => {
		const windows1252Triple = win1252MojibakeOf(
			win1252MojibakeOf(win1252MojibakeOf("é"))
		);

		t.plan(2);
		t.assert.strictEqual(windows1252Triple, "ÃƒÆ’Ã‚Â©");
		t.assert.strictEqual(fixLatin1ToUtf8(windows1252Triple), "é");
	});

	it("Fixes deeply encoded mojibake in a single call", (/** @type {TestContext} */ t) => {
		const deeplyEncoded = `Ã${"\u0083".repeat(10_000)}©`;
		let deeplyEncodedEuro = "€";
		for (let depth = 0; depth < 7; depth += 1) {
			deeplyEncodedEuro = win1252MojibakeOf(deeplyEncodedEuro);
		}

		t.plan(2);
		t.assert.strictEqual(fixLatin1ToUtf8(deeplyEncoded), "é");
		t.assert.strictEqual(fixLatin1ToUtf8(deeplyEncodedEuro), "€");
	});

	it("Fixes text after a prefix that outlasts the regex passes", (/** @type {TestContext} */ t) => {
		// Four continuation bytes need four reductions, so the whole string reaches reduceMojibake
		const prefix = `Ã${"\u0083".repeat(4)}`;
		const body =
			"cafÃ© crÃ¨me bâtiment São Paulo Ångström Æsir Ëlan ".repeat(50);

		t.plan(2);
		t.assert.strictEqual(fixLatin1ToUtf8(prefix), "Ã");
		t.assert.strictEqual(
			fixLatin1ToUtf8(prefix + body),
			`Ã${fixLatin1ToUtf8(body)}`
		);
	});

	it("Does not alter a string without mojibake", (/** @type {TestContext} */ t) => {
		const str = "Hello, world!";

		t.plan(1);
		t.assert.strictEqual(fixLatin1ToUtf8(str), str);
	});

	it("Throws an error if the argument is not a string", (/** @type {TestContext} */ t) => {
		t.plan(1);
		// @ts-expect-error Testing invalid argument
		t.assert.throws(() => fixLatin1ToUtf8(123), TypeError);
	});
});
