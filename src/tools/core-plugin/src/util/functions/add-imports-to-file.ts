import { readFileSync, writeFileSync } from 'fs';

export const addImportsToFile = (
  filePath: string,
  imports: Record<string, string>
) => {
  let importsString = '';
  const currentFileContents = readFileSync(filePath).toString();
  for (const [item, path] of Object.entries(imports)) {
    const alreadyImportedRegex = new RegExp(`import {.*\\s*${item}.*\\s*}`);
    if (currentFileContents.match(alreadyImportedRegex)?.length > 0) continue;

    const importString = `import {${item}} from '${path.replace(
      '.ts',
      ''
    )}';\n`;
    importsString += importString;
  }

  if (importsString.length > 0) {
    writeFileSync(filePath, importsString + currentFileContents);
  }
};
