"use strict";

/**
 * @description Windows-1252 (CP1252) characters for bytes 0x80-0x9F, in byte order.
 * Windows-1252 leaves bytes 0x81, 0x8D, 0x8F, 0x90 and 0x9D undefined,
 * so these decode to C1 control characters, the same as ISO-8859-1 (Latin-1).
 * @see {@link https://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP1252.TXT | cp1252 to Unicode table}
 */
const CP1252_80_9F =
	"\u20AC\u0081\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\u008D\u017D\u008F" +
	"\u0090\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\u009D\u017E\u0178";

/**
 * @description Mis-decoded characters and their original byte values.
 * @see {@link https://www.unicode.org/Public/MAPPINGS/ISO8859/8859-1.TXT | ISO/IEC 8859-1:1998 to Unicode}
 * @type {Map<string, number>}
 */
const BYTES = new Map();
// ISO-8859-1
for (let byte = 0x80; byte <= 0xff; byte += 1) {
	BYTES.set(String.fromCharCode(byte), byte);
}
// Windows-1252
const cp1252Length = CP1252_80_9F.length;
for (let i = 0; i < cp1252Length; i += 1) {
	BYTES.set(CP1252_80_9F[i], 0x80 + i);
}

// Cache immutable regex as they are expensive to create and garbage collect
// UTF-8 lead bytes (0xC2-0xF4), as decoded by either encoding, which all mojibake starts with
const MOJIBAKE_LEAD_REG = /[\u00C2-\u00F4]/u;
// UTF-8 continuation bytes (0x80-0xBF), as decoded by either encoding
const TRAIL = String.raw`[\u0080-\u00BF\u0152\u0153\u0160\u0161\u0178\u017D\u017E\u0192\u02C6\u02DC\u2013\u2014\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2026\u2030\u2039\u203A\u20AC\u2122]`;
// Mojibake of one UTF-8 character: a lead byte (0xC2-0xF4) followed by the number of continuation bytes it expects
const SEQUENCE = String.raw`[\u00C2-\u00DF]${TRAIL}|[\u00E0-\u00EF]${TRAIL}{2}|[\u00F0-\u00F4]${TRAIL}{3}`;
// Finds every sequence in a string for the fast path
// eslint-disable-next-line security/detect-non-literal-regexp -- Static regex, no user input
const MATCH_REG = new RegExp(SEQUENCE, "gu");
// Checks a candidate in the fallback path is exactly one sequence
// eslint-disable-next-line security/detect-non-literal-regexp -- Static regex, no user input
const SEQUENCE_REG = new RegExp(`^(?:${SEQUENCE})$`, "u");
// C1 control characters do not appear in real text, so sequences containing them are always mojibake
const C1_REG = /[\u0080-\u009F]/u;
// Sequences without a C1 control character could be real text, such as "JOSÉ’S", so are only decoded to characters mojibake commonly stands for
const LIKELY_REG =
	// eslint-disable-next-line security/detect-unsafe-regex -- False positive, safe-regex does not support the u flag
	/[\u0080-\u017F\u0192\u02C6\u02DC\u0370-\u03FF\u1E00-\u1EFF\u2000-\u2BFF\uE000-\uF8FF\uFB00-\uFFFF\u{10000}-\u{10FFFF}]/u;

// Longest UTF-8 sequence is a lead byte and three continuation bytes
const MAX_MATCH_LENGTH = 4;

const DECODER = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });

/**
 * @author Frazer Smith
 * @description Decodes a mojibake sequence back to the character it stands for.
 * @param {string} match - A lead character followed by its continuation characters.
 * @returns {string} The decoded character, or the original sequence if it is not mojibake.
 */
function decode(match) {
	let char;
	try {
		char = DECODER.decode(
			Uint8Array.from(match, (c) => /** @type {number} */ (BYTES.get(c)))
		);
	} catch {
		// Not valid UTF-8, such as an overlong or surrogate sequence
		return match;
	}

	return C1_REG.test(match) || LIKELY_REG.test(char) ? char : match;
}

/**
 * @author Frazer Smith
 * @description Reduces deeply nested mojibake in one left-to-right pass,
 * avoiding repeated full-string scans after the regex fast path.
 * @param {string} str - The string to reduce.
 * @returns {string} The reduced string.
 */
function reduceMojibake(str) {
	/** @type {string[]} */
	const output = [];

	const strLength = str.length;
	for (let index = 0; index < strLength; index += 1) {
		output.push(str[index]);

		let matchLength = Math.min(MAX_MATCH_LENGTH, output.length);
		while (matchLength > 1) {
			// Skip the slice and join allocation for candidates that cannot be a sequence
			if (!MOJIBAKE_LEAD_REG.test(output[output.length - matchLength])) {
				matchLength -= 1;
				continue;
			}

			const candidate = output.slice(-matchLength).join("");
			const replacement = SEQUENCE_REG.test(candidate)
				? decode(candidate)
				: candidate;
			if (replacement === candidate) {
				matchLength -= 1;
				continue;
			}

			output.length -= matchLength;
			output.push(replacement);
			matchLength = Math.min(MAX_MATCH_LENGTH, output.length);
		}
	}

	return output.join("");
}

/**
 * @author Frazer Smith
 * @description Fixes mojibake caused by decoding UTF-8 bytes
 * as ISO-8859-1 (Latin-1) or Windows-1252 (CP1252), including
 * multiply encoded text.
 * @param {string} str - The string to fix.
 * @returns {string} The fixed string or the original string
 * if no known mojibake was found.
 * @throws {TypeError} If `str` is not a string.
 */
function fixLatin1ToUtf8(str) {
	if (typeof str !== "string") {
		throw new TypeError("Expected a string");
	}

	// Early return if no matches
	if (!MOJIBAKE_LEAD_REG.test(str)) {
		return str;
	}

	// Fast path for common single, double and triple encoding
	let result = str;
	for (let pass = 0; pass < 3; pass += 1) {
		const previous = result;
		result = previous.replace(MATCH_REG, decode);
		if (result === previous || !MOJIBAKE_LEAD_REG.test(result)) {
			return result;
		}
	}

	return reduceMojibake(result);
}

module.exports = fixLatin1ToUtf8; // CommonJS export
module.exports.default = fixLatin1ToUtf8; // ESM default export
module.exports.fixLatin1ToUtf8 = fixLatin1ToUtf8; // TypeScript and named export
