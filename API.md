## Constants

<dl>
<dt><a href="#replacements">replacements</a> : <code>Record.&lt;string, string&gt;</code></dt>
<dd><p>Object containing Latin-1 characters and their corresponding UTF-8 characters.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#fixLatin1ToUtf8">fixLatin1ToUtf8(str)</a> ⇒ <code>string</code></dt>
<dd><p>Fixes common encoding errors when converting from Latin-1 (and Windows-1252) to UTF-8.</p>
</dd>
</dl>

<a name="replacements"></a>

## replacements : <code>Record.&lt;string, string&gt;</code>
Object containing Latin-1 characters and their corresponding UTF-8 characters.

**Kind**: global constant  
<a name="fixLatin1ToUtf8"></a>

## fixLatin1ToUtf8(str) ⇒ <code>string</code>
Fixes common encoding errors when converting from Latin-1 (and Windows-1252) to UTF-8.

**Kind**: global function  
**Returns**: <code>string</code> - The converted string.  
**See**: [ UTF-8 Encoding Debugging Chart](http://www.i18nqa.com/debug/utf8-debug.html)  
**Author**: Frazer Smith  

| Param | Type | Description |
| --- | --- | --- |
| str | <code>string</code> | The string to be converted. |

