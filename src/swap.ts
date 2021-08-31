const swapInternal = (input: string, groups: string[]): string => {
  let regex = new RegExp(
    `${(groups[2] ? groups[2] : '') + groups[0]}|${(groups[3]
      ? groups[3]
      : '') + groups[1]}`,
    'g'
  );
  return input.replace(regex, $1 => ($1 === groups[0] ? groups[1] : groups[0]));
};

export const swapJsonCharacters = (input: string, forward = 1): string => {
  // swap out characters for lesser used ones that wont get escaped
  const swapGroups = [
    [`"`, `'`],
    [`':`, `!`],
    [`,'`, `~`],
    [`}`, `)`, `\\`, `\\`],
    [`{`, `(`, `\\`, `\\`],
  ];

  // need to be able to swap characters in reverse directon for uncrush
  if (forward) {
    for (let idx = 0; idx < swapGroups.length; idx++) {
      input = swapInternal(input, swapGroups[idx]);
    }
  } else {
    for (let idx = swapGroups.length; idx--; ) {
      input = swapInternal(input, swapGroups[idx]);
    }
  }

  return input;
};
