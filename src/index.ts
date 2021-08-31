import Decoder from './decoder';
import Encoder from './encoder';

const encoder = new Encoder({ maxSubstringLength: 50 });
const decoder = new Decoder();

export const encode = (input: string): string => encoder.execute(input);
export const decode = (input: string): string => decoder.execute(input);

export const encodeURI = (input: string) => encode(window.encodeURI(input));
export const decodeURI = (input: string) => {
  const d = decode(input);
  return window.decodeURI(d);
};
