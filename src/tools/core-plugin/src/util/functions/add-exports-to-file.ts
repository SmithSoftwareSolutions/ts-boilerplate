import { readFileSync, writeFileSync } from 'fs';

export const addExportsToFile = (
  filePath: string,
  exports: string[],
  comment?: string,
  addBeforeComment?: string
) => {
  let exportsString = comment ? `\n/* ${comment} */\n` : '\n';
  let lines = 0;
  const currentFileContents = readFileSync(filePath).toString();
  for (const path of exports) {
    const exportString = `export * from '${path.replace('.ts', '')}';\n`;
    if (currentFileContents.includes(exportString)) continue;
    exportsString += exportString;
    lines++;
  }

  if (lines > 0) {
    const indexOfAddBeforeComment = currentFileContents.indexOf(
      `// ${addBeforeComment}`
    );
    if (indexOfAddBeforeComment > -1) {
      const contentBefore = currentFileContents.substring(
        0,
        indexOfAddBeforeComment
      );
      const contentAfter = currentFileContents.substring(
        indexOfAddBeforeComment
      );
      writeFileSync(filePath, contentBefore + exportsString + contentAfter);
    } else {
      writeFileSync(filePath, currentFileContents + exportsString);
    }
  }
};
