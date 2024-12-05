# fix-latin1-to-utf8

[![GitHub release](https://img.shields.io/github/release/Fdawgs/fix-latin1-to-utf8.svg)](https://github.com/Fdawgs/fix-latin1-to-utf8/releases/latest/)
[![npm version](https://img.shields.io/npm/v/fix-latin1-to-utf8)](https://npmjs.com/package/fix-latin1-to-utf8)
[![CI](https://github.com/Fdawgs/fix-latin1-to-utf8/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Fdawgs/fix-latin1-to-utf8/actions/workflows/ci.yml)
[![Coverage status](https://coveralls.io/repos/github/Fdawgs/fix-latin1-to-utf8/badge.svg?branch=main)](https://coveralls.io/github/Fdawgs/fix-latin1-to-utf8?branch=main)
[![code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat)](https://github.com/prettier/prettier)

> Node.js module to fix errors when converting Latin-1 encoded text to UTF-8

# Overview

When converting Latin-1 (or Windows-1252) encoded text to UTF-8, some characters may be incorrectly converted. This module fixes those errors.

## Installation

Install using `npm`:

```bash
npm i fix-latin1-to-utf8
```

## Example usage

Please refer to the [JSDoc comments in the source code](./src/index.js) or the [generated type definitions](https://www.npmjs.com/package/fix-latin1-to-utf8?activeTab=code) for information on the available options.

```js
const fixLatin1ToUtf8 = require("fix-latin1-to-utf8");

const latin1String =
	"This is a UTF-8 string that was converted from Latin-1â€š but the conversion was not great.";
const utf8String = fixLatin1ToUtf8(latin1String);

console.log(utf8String);
// This is a UTF-8 string that was converted from Latin-1, but the conversion was not great.
```

## Contributing

Contributions are welcome, and any help is greatly appreciated!

See [the contributing guide](https://github.com/Fdawgs/.github/blob/main/CONTRIBUTING.md) for details on how to get started.
Please adhere to this project's [Code of Conduct](https://github.com/Fdawgs/.github/blob/main/CODE_OF_CONDUCT.md) when contributing.

## Acknowledgements

-   **Tex Texin** - Creator of the [UTF-8 Encoding Debugging Chart](http://www.i18nqa.com/debug/utf8-debug.html)

## License

`fix-latin1-to-utf8` is licensed under the [MIT](./LICENSE) license.
