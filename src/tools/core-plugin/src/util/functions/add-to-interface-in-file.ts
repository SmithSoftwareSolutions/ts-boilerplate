import { readFileSync, writeFileSync } from 'fs';

export const addToInterfaceInFile = (
  filePath: string,
  interfaceName: string,
  itemsToAdd: Record<string, string>
) => {
  const fileContents = readFileSync(filePath).toString();
  // eslint-disable-next-line no-useless-escape
  const regex = new RegExp(
    `interface ${interfaceName}\\s*\\{\\s*(?:.+?;\\s*)*(.+?\\s*;*)\\}`,
    'g'
  );

  const match = [...fileContents.matchAll(regex)][0];

  const lastItem = match[1];
  const endIndex =
    fileContents.indexOf(lastItem, match.index) + lastItem.length;
  const existingChunk = fileContents.substring(match.index, endIndex);

  const additionalLines = [];
  for (const [key, value] of Object.entries(itemsToAdd)) {
    const newLine = `${key}: ${value};`;
    if (!existingChunk.includes(newLine)) additionalLines.push(newLine);
  }

  const newLastItem = [lastItem.replaceAll('\n', ''), ...additionalLines].join(
    '\n'
  );

  const newChunk = existingChunk.replace(lastItem, newLastItem);

  const newFileContents = fileContents.replace(existingChunk, newChunk);
  writeFileSync(filePath, newFileContents);
};
