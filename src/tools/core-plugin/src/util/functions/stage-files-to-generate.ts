import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
} from 'fs';
import { directoryExists } from 'nx/src/utils/fileutils';
import path = require('path');

export const stageFilesToGenerate = (
  templatesPath: string,
  destinationPath: string,
  substitutions: Record<string, string>
) => {
  const fileNames = readdirSync(templatesPath, {
    recursive: true,
  } as any);

  if (!directoryExists(path.resolve(templatesPath, `staged`))) {
    mkdirSync(path.resolve(templatesPath, `staged`));
  }

  const stagedFiles = [];
  const destinationFileNames = [];
  for (const fileName of fileNames) {
    if (fileName.includes('staged')) continue;
    if (fileName.endsWith('.template')) {
      let destinationFileName = fileName
        .replaceAll('\\', '/')
        .replace('.template', '');
      for (const [substitutionName, replacement] of Object.entries(
        substitutions
      )) {
        destinationFileName = destinationFileName.replaceAll(
          `__${substitutionName}__`,
          replacement
        );
      }

      const destinationFilePath = `${destinationPath}/${destinationFileName}`;

      if (
        !existsSync(destinationFilePath) ||
        !readFileSync(destinationFilePath)
          .toString()
          .includes('// @org:gen-ignore')
      ) {
        copyFileSync(
          path.resolve(templatesPath, fileName),
          path.resolve(templatesPath, `staged/${fileName}`)
        );
        destinationFileNames.push(destinationFileName);
        stagedFiles.push(fileName);
      }
    } else if (
      directoryExists(path.resolve(templatesPath, `${fileName}`)) &&
      !directoryExists(path.resolve(templatesPath, `staged/${fileName}`))
    ) {
      mkdirSync(path.resolve(templatesPath, `staged/${fileName}`));
    }
  }
  return { stagedFiles, destinationFileNames };
};
