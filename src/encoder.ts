import { swapJsonCharacters } from './swap';

interface ISubstringHashCount {
  [details: string]: number;
}

interface ICompressorConfiguration {
  maxSubstringLength: number;
}

const timesIterate = (nr: number, cb: any) => {
  for (let x = 0; x < nr; x++) {
    cb(x);
  }
}

export default class Encoder implements IEncoding {
  constructor(config: ICompressorConfiguration) {
    this.maxSubstringLength = config?.maxSubstringLength || 50;
  }

  maxSubstringLength: number;

  delimiterPattern: string = '\u0001'; // used to split parts of crushed string

  /**
   * Compresses the provided input and outputs the compressed output string.
   * @param input
   * @returns compressed
   */
  execute(input: string): string {
    // create a string of replacement characters
    let characters = this.seedCharacters();
    input = input.replace(/\n/, '__');

    // remove delimiter if it is found in the string
    input = input.replace(new RegExp(this.delimiterPattern, 'g'), '');

    // swap out common json characters
    input = swapJsonCharacters(input);
    characters = this.pickFromExtendedSetLast(characters);

    const crushed = this.loop(input, characters, this.countSubstrings(input));

    // insert delimiter between crushed parts
    let crushedString = crushed.a;
    if (crushed.b.length) {
      crushedString += this.delimiterPattern + crushed.b;
    }

    // fix issue with some links nog beign recognized properly
    crushedString += '_';

    return crushedString;
  }

  timesToIterate = 127;
  // prefer replacing with characters that will not be escaped by encodeURIComponent
  unescapedCharacters = '-_.!~*()';

  seedCharacters(): string[] {
    let characters: string[] = [];

    timesIterate(this.timesToIterate, (nr: number) => {
      if (
        (nr >= 48 && nr <= 57) ||
        (nr >= 65 && nr <= 90) ||
        (nr >= 97 && nr <= 122) ||
        this.unescapedCharacters.includes(String.fromCharCode(nr))
      ) {
        characters.push(String.fromCharCode(nr));
      }
    });

    return characters;
  }

  pickFromExtendedSetLast(characters: string[]): string[] {
    // pick from extended set last
    for (let nr = 32; nr < 255; ++nr) {
      const c = String.fromCharCode(nr);
      if (c !== '\\' && !characters.includes(c)) {
        characters.unshift(c);
      }
    }

    return characters;
  }

  /**
   * Get length of encoded version of input
   * @param input
   * @returns
   */
  getByteLength(input: string): number {
    return encodeURI(encodeURIComponent(input)).replace(/%../g, 'i').length;
  }

  hasUnmatchedSurrogate(input: string): boolean {
    const c1 = input.charCodeAt(0);
    const c2 = input.charCodeAt(input.length - 1);
    return (c1 >= 0xdc00 && c1 <= 0xdfff) || (c2 >= 0xd800 && c2 <= 0xdbff);
  }

  /**
   * Count substrings and return the count hash.
   * @param input
   * @returns hash with counts
   */
  countSubstrings(input: string): ISubstringHashCount {
    let hash: ISubstringHashCount = {};

    for (
      let substringLength = 2;
      substringLength < this.maxSubstringLength;
      substringLength++
    ) {
      for (let idx = 0; idx < input.length - substringLength; ++idx) {
        let substring = input.substr(idx, substringLength);

        // don't recount if already in list and prevent breaking up unmatched surrogates
        if (hash[substring] || this.hasUnmatchedSurrogate(substring)) {
          continue;
        }

        // count how many times the substring appears
        let count = 1;
        for (
          let substringPos = input.indexOf(substring, idx + substringLength);
          substringPos >= 0;
          ++count
        ) {
          substringPos = input.indexOf(
            substring,
            substringPos + substringLength
          );
        }

        // add to the list if it appears multiple times
        if (count > 1) {
          hash[substring] = count;
        }
      }
    }

    return hash;
  }

  loop(
    input: string,
    replaceCharacters: string[],
    substringHashCount: ISubstringHashCount
  ) {
    let replaceCharacterPos = replaceCharacters.length;
    let splitString = '';

    const delimiterLength = this.getByteLength(this.delimiterPattern);
    // loop as long as we can minimize the string
    while (true) {
      // get the next character that is not in the string
      for (
        ;
        replaceCharacterPos-- &&
        input.includes(replaceCharacters[replaceCharacterPos]);

      ) {}
      if (replaceCharacterPos < 0) {
        break;
      }

      let replaceCharacter = replaceCharacters[replaceCharacterPos];

      // find the longest substring to replace
      let bestSubstring;
      let bestLengthDelta = 0;
      let replaceByteLength = this.getByteLength(replaceCharacter);

      for (let substring in substringHashCount) {
        // calculate change in length of string if it substring was replaced
        let count = substringHashCount[substring];
        let lengthDelta =
          (count - 1) * this.getByteLength(substring) -
          (count + 1) * replaceByteLength;

        if (!splitString.length) {
          lengthDelta -= delimiterLength; // include the delimiter length
        }
        if (lengthDelta <= 0) {
          delete substringHashCount[substring];
        } else if (lengthDelta > bestLengthDelta) {
          bestSubstring = substring;
          bestLengthDelta = lengthDelta;
        }
      }

      if (!bestSubstring) {
        // string cannot get compressed further
        break;
      }

      // create new string with the split character
      input =
        input.split(bestSubstring).join(replaceCharacter) +
        replaceCharacter +
        bestSubstring;
      splitString = replaceCharacter + splitString;

      // update substring count list after the replacement
      let newSubstringCount: ISubstringHashCount = {};
      for (let substring in substringHashCount) {
        // make a new substring with the replacement
        let newSubstring = substring
          .split(bestSubstring)
          .join(replaceCharacter);

        // count how many times the new substring appears
        let count = 0;
        for (let idx = input.indexOf(newSubstring); idx >= 0; ++count) {
          idx = input.indexOf(newSubstring, idx + newSubstring.length);
        }

        if (count > 1) {
          newSubstringCount[newSubstring] = count;
        }

        // add to list if it appears multiple times
      }

      substringHashCount = newSubstringCount;
    }

    return { a: input, b: splitString };
  }
}
