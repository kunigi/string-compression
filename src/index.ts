import Decoder from './decoder';
import Encoder from './encoder';

const container = (typeof window !== "undefined" 
  && window.encodeURI
  && window.decodeURI
  && window.encodeURIComponent
  && window.decodeURIComponent) ? window :
  (typeof global !== null 
    && global.encodeURI
    && global.decodeURI
    && global.encodeURIComponent
    && global.decodeURIComponent) ? global : null;

if (!container) throw Error("string-compression cannot be used because the expected encode and decode API's seem unavailable.");

const encoder = new Encoder({ maxSubstringLength: 50 });
const decoder = new Decoder();

export const encode = (input: string): string => encoder.execute(input);
export const decode = (input: string): string => decoder.execute(input);

export const encodeURI = (input: string) => container.encodeURI(encode(input));
export const decodeURI = (input: string) => decode(container.decodeURI(input));

export const encodeURIComponent = (input: string) => container.encodeURIComponent(encode(input));
export const decodeURIComponent = (input: string) => decode(container.decodeURIComponent(input));