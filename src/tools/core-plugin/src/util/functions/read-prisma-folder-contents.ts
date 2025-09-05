import { readdirSync, readFileSync } from 'fs';

export const readPrismaFolderContents = (prismaFolderLocation: string) => {
  const fileRegex = /.+?\.prisma/;
  const filesInFolder = readdirSync(prismaFolderLocation).filter((fileName) =>
    fileRegex.test(fileName)
  );
  let fileContents = '';

  for (const fileName of filesInFolder) {
    if (fileName.includes('schema.prisma')) continue;
    fileContents += readFileSync(`${prismaFolderLocation}/${fileName}`);
  }

  return fileContents;
};
