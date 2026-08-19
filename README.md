# fix-latin1-to-utf8

[![GitHub release](https://img.shields.io/github/v/release/Fdawgs/fix-latin1-to-utf8)](https://github.com/Fdawgs/fix-latin1-to-utf8/releases/latest)
[![npm version](https://img.shields.io/npm/v/fix-latin1-to-utf8)](https://www.npmjs.com/package/fix-latin1-to-utf8)
[![CI](https://github.com/Fdawgs/fix-latin1-to-utf8/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Fdawgs/fix-latin1-to-utf8/actions/workflows/ci.yml)
[![Coverage status](https://coveralls.io/repos/github/Fdawgs/fix-latin1-to-utf8/badge.svg?branch=main)](https://coveralls.io/github/Fdawgs/fix-latin1-to-utf8?branch=main)
[![code style: Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4?style=flat)](https://github.com/prettier/prettier)
[![OSSF Scorecard](https://api.scorecard.dev/projects/github.com/Fdawgs/fix-latin1-to-utf8/badge)](https://scorecard.dev/viewer/?uri=github.com/Fdawgs/fix-latin1-to-utf8)

> Node.js module to fix ISO-8859-1 (Latin-1) and Windows-1252 (CP1252) mojibake in UTF-8 strings

# Overview

Decoding UTF-8 bytes as ISO-8859-1 (Latin-1) or Windows-1252 (CP1252) leaves ASCII intact but turns every non-ASCII character into mojibake.

This module restores the original characters for both character encodings.

## Installation

Install using `npm`:

```sh
npm i fix-latin1-to-utf8
```

## Example usage

Please refer to the [JSDoc comments in the source code](./src/index.js) or the [generated type definitions](https://www.npmjs.com/package/fix-latin1-to-utf8?activeTab=code) for information on the available options.

```js
"use strict";

const fixLatin1ToUtf8 = require("fix-latin1-to-utf8");

const mojibakeString = "The cafÃ©â€™s sign was garbled.";
const fixedString = fixLatin1ToUtf8(mojibakeString);

console.log(fixedString);
// The café’s sign was garbled.
```

## Contributing

Contributions are welcome, and any help is greatly appreciated!

See [the contributing guide](https://github.com/Fdawgs/.github/blob/main/CONTRIBUTING.md) for details on how to get started.
Please adhere to this project's [Code of Conduct](https://github.com/Fdawgs/.github/blob/main/CODE_OF_CONDUCT.md) when contributing.

## Acknowledgements

- **Tex Texin** - Creator of the [UTF-8 Encoding Debugging Chart](https://www.i18nqa.com/debug/utf8-debug.html)

## License

`fix-latin1-to-utf8` is licensed under the [MIT](./LICENSE) license.
