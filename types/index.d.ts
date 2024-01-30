export = fixLatin1ToUtf8;
/**
 * @author Frazer Smith
 * @description Fixes common encoding errors when converting from Latin-1 (and Windows-1252) to UTF-8.
 * @see {@link http://www.i18nqa.com/debug/utf8-debug.html | UTF-8 Encoding Debugging Chart}
 * @param {string} str - The string to be converted.
 * @returns {string} The converted string.
 */
declare function fixLatin1ToUtf8(str: string): string;
declare namespace fixLatin1ToUtf8 {
    export { fixLatin1ToUtf8 as default, fixLatin1ToUtf8, replacements };
}
/**
 * @description Object containing Latin-1 characters and their corresponding UTF-8 characters.
 * @type {Record<string, string>}
 */
declare const replacements: Record<string, string>;
