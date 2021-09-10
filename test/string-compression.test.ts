import {
  encode,
  encodeURI,
  decode,
  decodeURI,
  encodeURIComponent,
  decodeURIComponent,
} from '../src';

describe('string-compressor', () => {
  describe('simple string', () => {
    describe('encode()', () => {
      it('should be able to encode using encode()', () => {
        expect(encode(`hello world!`)).toEqual(`hello world':_`);
      });

      it('should be able to encode using encodeURI()', () => {
        expect(encodeURI(`hello world!`)).toEqual(`hello%20world':_`);
      });

      it('should be able to encode using encodeURIComponent()', () => {
        expect(encodeURIComponent('hello world!')).toEqual(
          `hello%20world'%3A_`
        );
      });
    });

    describe('decode()', () => {
      it('should be able to decode using decode()', () => {
        expect(decode(`hello world':_`)).toEqual(`hello world!`);
      });

      it('should be able to decode using decodeURI()', () => {
        expect(decodeURI(`hello%20world':_`)).toEqual(`hello world!`);
      });

      it('should be able to decode using decodeURIComponent()', () => {
        expect(decodeURIComponent(`hello%20world'%3A_`)).toEqual(
          `hello world!`
        );
      });
    });
  });

  describe('simple object', () => {
    const object = JSON.stringify({ x: 1, y: 2 });

    describe('encode & decode', () => {
      it('should be able to encode using encode() and decode using decode()', () => {
        const encodedOutput = encode(JSON.stringify(object));
        const decodedOutput = decode(encodedOutput);
        expect(JSON.parse(decodedOutput)).toEqual(object);
      });

      it('should be able to encode using encodeURI() and decode using decodeURI()', () => {
        const encodedOutput = encodeURI(JSON.stringify(object));
        const decodedOutput = decodeURI(encodedOutput);
        expect(JSON.parse(decodedOutput)).toEqual(object);
      });

      it('should be able to encode using encodeURIComponent() and decode using decodeURIComponent()', () => {
        const encodedOutput = encodeURIComponent(JSON.stringify(object));
        const decodedOutput = decodeURIComponent(encodedOutput);
        expect(JSON.parse(decodedOutput)).toEqual(object);
      });
    });
  });

  describe('more complex object', () => {
    const object = JSON.stringify({
      a: 2,
      b: 3,
      c: [{ x: 1, y: 2 }],
      d: 'abcd',
    });

    describe('encode & decode', () => {
      it('should be able to encode using encode() and decode using decode()', () => {
        const encodedOutput = encode(JSON.stringify(object));
        const decodedOutput = decode(encodedOutput);
        expect(JSON.parse(decodedOutput)).toEqual(object);
      });

      it('should be able to encode using encodeURI() and decode using decodeURI()', () => {
        const encodedOutput = encodeURI(JSON.stringify(object));
        const decodedOutput = decodeURI(encodedOutput);
        expect(JSON.parse(decodedOutput)).toEqual(object);
      });

      it('should be able to encode using encodeURIComponent() and decode using decodeURIComponent()', () => {
        const encodedOutput = encodeURIComponent(JSON.stringify(object));
        const decodedOutput = decodeURIComponent(encodedOutput);
        expect(JSON.parse(decodedOutput)).toEqual(object);
      });
    });
  });
});
