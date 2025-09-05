import { readPrismaFolderContents } from './read-prisma-folder-contents';
import { ResourceAttribute } from '../types/resource-attribute.type';

const prismaTypeToTSTypeMappings: Record<string, string> = {
  Int: 'number',
  Float: 'number',
  Decimal: 'number',
  String: 'string',
  DateTime: 'Date',
  Boolean: 'boolean',
};

export const getResourceDetailsFromPrismaSchemaFolder = (
  prismaFolderLocation: string,
  resourceName: string
) => {
  const fileContents = readPrismaFolderContents(prismaFolderLocation);

  const modelDefinitionStrings = fileContents.split('model ');
  const resourceDefinitionString = modelDefinitionStrings.find((defString) =>
    defString.startsWith(`${resourceName} {`)
  );
  const resourceAttributeStrings =
    resourceDefinitionString.replaceAll('\r', '')?.split('\n') ?? '';

  const attributes: ResourceAttribute[] = [];
  for (const line of resourceAttributeStrings) {
    if (
      line.includes('{') ||
      line.includes('}') ||
      line.includes('@@') ||
      line.length < 3
    )
      continue;

    const lineSplit = line.split(' ').filter((c) => c.length > 0);
    attributes.push({
      name: lineSplit[0],
      type: lineSplit[1]?.replace('?', ''),
      tsType: prismaTypeToTSTypeMappings[lineSplit[1]?.replace('?', '')] ?? '',
      isOptional:
        lineSplit[1]?.includes('?') ||
        !!lineSplit.find((str) => str.includes('@default')) ||
        !!lineSplit.find((str) => str.includes('@updatedAt')),
      isSingleRelation: !!lineSplit.find((str) => str.includes('@relation')),
      isMultiRelation: lineSplit[1]?.includes('[]'),
    });
  }
  return {
    name: resourceName,
    attributes,
  };
};
