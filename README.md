# string-compression 
Reduces the size of strings. Made possible by the very efficient JSCrush algorithm.

## Install
```
npm install @kunigi/string-compression
```

## Usage
Here's an example with a simple string

```ts
import {encode, encodeURI, decode, decodeURI } from '@kunigi/string-compression'

encode('hello world!') // hello world':_
encodeURI('hello world!') // hello%20world':_

decode(`hello world':_`) // hello world!
decodeURI(`hello%20world':_`) // hello world!
```

Here's an example with an JSON object.
```ts
import {encode, encodeURI, decode, decodeURI } from '@kunigi/string-compression'

const simpleObject = { x: 1, y: 2 }

const encodedJSON = encode(JSON.stringify(simpleObject)) // ('x!1~y!2)_
const encodedURLSafeJSON = encodeURI(JSON.stringify(simpleObject)) // %7B!x(1,!y(2%7D!%22(!:(!_

JSON.parse(decode(encodedJSON)) // 
JSON.parse(decodeURI(encodedURLSafeJSON)) //
```


## Credits
This project involved work of others. All referred source code and including this project are licensed under MIT.

A special shoutout to

- JSONCrush by Frank Force (KilledByAPixel)
- JSCrush by aivopaas