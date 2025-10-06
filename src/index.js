"use strict";

/**
 * @description Latin-1 characters and their corresponding UTF-8 characters.
 * @type {Readonly<Record<string, string>>}
 */
const REPLACEMENTS = Object.freeze({
	// Actual: Expected
	"â‚¬": "€",
	"â€š": "‚",
	"Æ’": "ƒ",
	"â€ž": "„",
	"â€¦": "…",
	"â€\u00A0": "†",
	"â€¡": "‡",
	"Ë†": "ˆ",
	"â€°": "‰",
	"Å\u00A0": "Š",
	"â€¹": "‹",
	"Å’": "Œ",
	"Å½": "Ž",
	"â€˜": "‘",
	"â€™": "’",
	"â€œ": "“",
	"â€\u009D": "”",
	"â€¢": "•",
	"â€“": "–",
	"â€”": "—",
	Ëœ: "˜",
	"â„¢": "™",
	"Å¡": "š",
	"â€º": "›",
	"Å“": "œ",
	"Å¾": "ž",
	"Å¸": "Ÿ",
	"Â ": " ",
	"Â¡": "¡",
	"Â¢": "¢",
	"Â£": "£",
	"Â¤": "¤",
	"Â¥": "¥",
	"Â¦": "¦",
	"Â§": "§",
	"Â¨": "¨",
	"Â©": "©",
	Âª: "ª",
	"Â«": "«",
	"Â¬": "¬",
	"Â­": "­",
	"Â®": "®",
	"Â¯": "¯",
	"Â°": "°",
	"Â±": "±",
	"Â²": "²",
	"Â³": "³",
	"Â´": "´",
	Âµ: "µ",
	"Â¶": "¶",
	"Â·": "·",
	"Â¸": "¸",
	"Â¹": "¹",
	Âº: "º",
	"Â»": "»",
	"Â¼": "¼",
	"Â½": "½",
	"Â¾": "¾",
	"Â¿": "¿",
	"Ã€": "À",
	"Ã‚": "Â",
	Ãƒ: "Ã",
	"Ã„": "Ä",
	"Ã…": "Å",
	"Ã†": "Æ",
	"Ã‡": "Ç",
	Ãˆ: "È",
	"Ã‰": "É",
	ÃŠ: "Ê",
	"Ã‹": "Ë",
	ÃŒ: "Ì",
	"Ã\u008D": "Í",
	ÃŽ: "Î",
	"Ã\u008F": "Ï",
	"Ã\u0090": "Ð",
	"Ã‘": "Ñ",
	"Ã’": "Ò",
	"Ã“": "Ó",
	"Ã”": "Ô",
	"Ã•": "Õ",
	"Ã–": "Ö",
	"Ã—": "×",
	"Ã˜": "Ø",
	"Ã™": "Ù",
	Ãš: "Ú",
	"Ã›": "Û",
	Ãœ: "Ü",
	"Ã\u009D": "Ý",
	Ãž: "Þ",
	ÃŸ: "ß",
	"Ã\u00A0": "à",
	"Ã¡": "á",
	"Ã¢": "â",
	"Ã£": "ã",
	"Ã¤": "ä",
	"Ã¥": "å",
	"Ã¦": "æ",
	"Ã§": "ç",
	"Ã¨": "è",
	"Ã©": "é",
	Ãª: "ê",
	"Ã«": "ë",
	"Ã¬": "ì",
	"Ã\u00AD": "í",
	"Ã®": "î",
	"Ã¯": "ï",
	"Ã°": "ð",
	"Ã±": "ñ",
	"Ã²": "ò",
	"Ã³": "ó",
	"Ã´": "ô",
	Ãµ: "õ",
	"Ã¶": "ö",
	"Ã·": "÷",
	"Ã¸": "ø",
	"Ã¹": "ù",
	Ãº: "ú",
	"Ã»": "û",
	"Ã¼": "ü",
	"Ã½": "ý",
	"Ã¾": "þ",
	"Ã¿": "ÿ",
});

// Cache immutable regex as they are expensive to create and garbage collect
const LATIN1_PATTERN = /[ãâåæë]/iu;
// eslint-disable-next-line security/detect-non-literal-regexp -- Static regex, no user input
const MATCH_REG = new RegExp(Object.keys(REPLACEMENTS).join("|"), "gu");

/**
 * @author Frazer Smith
 * @description Fixes common encoding errors when converting from Latin-1 (and Windows-1252) to UTF-8.
 * @see {@link http://www.i18nqa.com/debug/utf8-debug.html | UTF-8 Encoding Debugging Chart}
 * @param {string} str - The string to be converted.
 * @returns {string} The converted string.
 * @throws If the argument is not a string.
 */
function fixLatin1ToUtf8(str) {
	if (typeof str !== "string") {
		throw new TypeError("Expected a string");
	}

	// Early return if no matches
	if (!LATIN1_PATTERN.test(str)) {
		return str;
	}

	return str.replace(MATCH_REG, (match) => REPLACEMENTS[match]);
}

module.exports = fixLatin1ToUtf8; // CommonJS export
module.exports.default = fixLatin1ToUtf8; // ESM default export
module.exports.fixLatin1ToUtf8 = fixLatin1ToUtf8; // TypeScript and named export
module.exports.REPLACEMENTS = REPLACEMENTS;
