import { swapJsonCharacters } from './swap';

export default class Decoder {
  constructor(postfix = '_') {
    this.postfix = postfix;
  }

  postfix: string;

  /**
   * Translates the compressed string to a decompressed version.
   */
  execute(input: string): string {
    const stringParts = this.splitStartHeading(this.trimPostfix(input));

    // uncrush algorithm
    let inflatedString = stringParts[0];
    if (stringParts.length > 1) {
      let splitString = stringParts[1];

      for (let char of splitString.split('')) {
        // split the string using the current splitCharacter
        let splitArray = inflatedString.split(char);

        // rejoin the string with the last element
        inflatedString = splitArray.join(splitArray.pop());
      }
    }

    return swapJsonCharacters(inflatedString, 0);
  }

  trimPostfix(input: string): string {
    input.endsWith(this.postfix);
    return input.substring(0, input.length - this.postfix.length);
  }

  /**
   * Splits the input based start of heading character.
   */
  splitStartHeading(input: string): string[] {
    return input.split('\u0001');
  }
}
