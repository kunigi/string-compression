import { encode, encodeURI, decode, decodeURI } from '../src';

describe('Compressor tests', () => {
  describe('encode', () => {
    it('should provide expected compressed result', () => {
      expect(encode(`hello world!`)).toEqual(`hello world':_`);
    });
  });

  describe('decode', () => {
    it('should be able to restore to initial value', () => {
      const json = JSON.stringify({
        a: 2,
        b: 3,
        c: [{ x: 1, y: 2 }],
        d: 'abcd',
      });

      const output = encode(json);
      expect(output).toEqual(`('a!2~b!3~c![('x!1~y!2)]~d!'abcd')_`);
      const jsonOuput = decode(output);
      expect(jsonOuput).toEqual(json);
    });
  });

  describe('decode', () => {
    it('should be able to restore to initial value', () => {
      const json = JSON.stringify({
        a: 2,
        b: 3,
        c: [{ x: 1, y: 2 }],
        d: 'abcd',
      });

      const output = encode(json);
      expect(output).toEqual(`('a!2~b!3~c![('x!1~y!2)]~d!'abcd')_`);
      const jsonOuput = decode(output);
      expect(jsonOuput).toEqual(json);
    });
  });

  describe('encodeUri', () => {
    it('should', () => {
      expect(encodeURI('hello world!')).toEqual(`hello%20world':_`);
    });
  });

  describe('decodeUri', () => {
    it('should', () => {
      const json = JSON.stringify({
        d: 'шеллы',
      });
      const output = encodeURI(json);
      const jsonOutput = decodeURI(output);
      expect(JSON.parse(jsonOutput)).toEqual(JSON.parse(json));
    });
  });
});
