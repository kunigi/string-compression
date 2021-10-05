# string-compression 
Reduces the size of strings. Has zero dependencies. Works in browser and NodeJS. Made possible by the very efficient JSCrush algorithm.

## Install
```
npm install @kunigi/string-compression
```

## Usage
Here's an example with a simple string

```ts
import {encode, encodeURI, encodeURIComponent, 
decode, decodeURI, decodeURIComponent } from '@kunigi/string-compression'

encode('hello world!') // hello world':_
encodeURI('hello world!') // hello%20world':_
encodeURIComponent('hello world!') // hello%20world'%3A_

decode(`hello world':_`) // hello world!
decodeURI(`hello%20world':_`) // hello world!
decodeURIComponent(`hello%20world'%3A_`) // hello world!
```

Here's an example with an JSON object.
```ts
import {encode, encodeURI, decode, decodeURI } from '@kunigi/string-compression'

const simpleObject = { x: 1, y: 2 }

encode(JSON.stringify(simpleObject)) // '(\\'x\\!1,\\'y\\!2)'_
encodeURI(JSON.stringify(simpleObject)) // '(%5C'x%5C!1,%5C'y%5C!2)'_
encodeURIComponent(JSON.stringify(simpleObject)) // '(%5C'x%5C!1%2C%5C'y%5C!2)'_

decode(`'(\\'x\\!1,\\'y\\!2)'_`) // { x: 1, y: 2 }
decodeURI(`'(%5C'x%5C!1,%5C'y%5C!2)'_`) // { x: 1, y: 2}
decodeURIComponent(`'(%5C'x%5C!1%2C%5C'y%5C!2)'_`) // { x: 1, y: 2 }
```

## Credits
This project involved work of others. All referred source code and including this project are licensed under MIT.

A special shoutout to

- JSONCrush by Frank Force (KilledByAPixel)
- JSCrush by aivopaas