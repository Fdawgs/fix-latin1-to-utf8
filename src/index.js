"use strict";

/**
 * @description Mojibake sequences and their original Unicode characters.
 * Includes sequences produced when UTF-8 bytes are incorrectly
 * decoded as ISO-8859-1 (Latin-1) or Windows-1252 (CP1252).
 * @see {@link https://www.i18nqa.com/debug/utf8-debug.html | UTF-8 Encoding Debugging Chart}
 * @see {@link https://www.unicode.org/Public/MAPPINGS/VENDORS/MICSFT/WINDOWS/CP1252.TXT | cp1252 to Unicode table}
 * @see {@link https://www.unicode.org/Public/MAPPINGS/ISO8859/8859-1.TXT | ISO/IEC 8859-1:1998 to Unicode}
 * @type {Readonly<Record<string, string>>}
 */
// @ts-expect-error -- TS cannot infer that __proto__ is a special property and not part of the record type
const REPLACEMENTS = Object.freeze({
	__proto__: null,
	// Mojibake: original
	// Windows-1252 mojibake
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
	"Â\u00A0": "\u00A0",
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
	"Â\u00AD": "\u00AD",
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
	"Ã\u0081": "Á",
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
	// ISO-8859-1 mojibake
	"â\u0082¬": "€",
	"â\u0080\u009A": "‚",
	"Æ\u0092": "ƒ",
	"â\u0080\u009E": "„",
	"â\u0080¦": "…",
	"â\u0080\u00A0": "†",
	"â\u0080¡": "‡",
	"Ë\u0086": "ˆ",
	"â\u0080°": "‰",
	"â\u0080¹": "‹",
	"Å\u0092": "Œ",
	"â\u0080\u0098": "‘",
	"â\u0080\u0099": "’",
	"â\u0080\u009C": "“",
	"â\u0080\u009D": "”",
	"â\u0080¢": "•",
	"â\u0080\u0093": "–",
	"â\u0080\u0094": "—",
	"Ë\u009C": "˜",
	"â\u0084¢": "™",
	"â\u0080º": "›",
	"Å\u0093": "œ",
	"Ã\u0080": "À",
	"Ã\u0082": "Â",
	"Ã\u0083": "Ã",
	"Ã\u0084": "Ä",
	"Ã\u0085": "Å",
	"Ã\u0086": "Æ",
	"Ã\u0087": "Ç",
	"Ã\u0088": "È",
	"Ã\u0089": "É",
	"Ã\u008A": "Ê",
	"Ã\u008B": "Ë",
	"Ã\u008C": "Ì",
	"Ã\u008E": "Î",
	"Ã\u0091": "Ñ",
	"Ã\u0092": "Ò",
	"Ã\u0093": "Ó",
	"Ã\u0094": "Ô",
	"Ã\u0095": "Õ",
	"Ã\u0096": "Ö",
	"Ã\u0097": "×",
	"Ã\u0098": "Ø",
	"Ã\u0099": "Ù",
	"Ã\u009A": "Ú",
	"Ã\u009B": "Û",
	"Ã\u009C": "Ü",
	"Ã\u009E": "Þ",
	"Ã\u009F": "ß",
});

// Cache immutable regex as they are expensive to create and garbage collect
const MOJIBAKE_LEAD_REG = /[âÂÃÅÆË]/u;
// Sort longest-first to prevent a shorter alternative from matching first
// eslint-disable-next-line security/detect-non-literal-regexp -- Static regex, no user input
const MATCH_REG = new RegExp(
	Object.keys(REPLACEMENTS)
		.sort((a, b) => b.length - a.length)
		.join("|"),
	"gu"
);

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

	// Repeat until no known mojibake remains
	let result = str;
	let previous;
	do {
		previous = result;
		result = previous.replace(MATCH_REG, (match) => REPLACEMENTS[match]);
	} while (result !== previous && MOJIBAKE_LEAD_REG.test(result));

	return result;
}

module.exports = fixLatin1ToUtf8; // CommonJS export
module.exports.default = fixLatin1ToUtf8; // ESM default export
module.exports.fixLatin1ToUtf8 = fixLatin1ToUtf8; // TypeScript and named export
module.exports.REPLACEMENTS = REPLACEMENTS;
