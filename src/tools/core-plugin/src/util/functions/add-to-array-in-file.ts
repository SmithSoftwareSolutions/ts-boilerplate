import { readFileSync, writeFileSync } from 'fs';

export const addToArrayInFile = (
  filePath: string,
  arrayName: string,
  itemToAdd: string
) => {
  const fileContents = readFileSync(filePath).toString();
  // eslint-disable-next-line no-useless-escape
  const regex = new RegExp(
    `${arrayName}\\s*=\\s*\\[\\s*(?:.+?,\\s*)*(.+?\\s*,*)\\]`,
    'g'
  );

  const match = [...fileContents.matchAll(regex)][0];

  const lastItem = match[1];
  const endIndex =
    fileContents.indexOf(lastItem, match.index) + lastItem.length;
  const newLastItem = [
    lastItem.replaceAll(',', '').replaceAll('\n', ''),
    itemToAdd,
  ].join(',\n');

  const existingChunk = fileContents.substring(match.index, endIndex);
  if (!existingChunk.includes(itemToAdd)) {
    const newChunk = existingChunk.replace(lastItem, newLastItem);

    const newFileContents = fileContents.replace(existingChunk, newChunk);
    writeFileSync(filePath, newFileContents);
  }
};
