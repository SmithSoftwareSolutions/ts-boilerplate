import { CompositeKeyProperty } from '../types/composite-key-property.type';
import { readPrismaFolderContents } from './read-prisma-folder-contents';
import { ResourceAttribute } from '../types/resource-attribute.type';

export const getResourceCompositePrimaryKeyPropertiesFromPrismaSchema = (
  prismaFolderLocation: string,
  resourceName: string,
  attributes: ResourceAttribute[] = []
) => {
  const fileContents = readPrismaFolderContents(prismaFolderLocation);

  const modelDefinitionStrings = fileContents.split('model ');
  const resourceDefinitionString = modelDefinitionStrings.find((defString) =>
    defString.startsWith(`${resourceName} {`)
  );
  const resourceAttributeStrings =
    resourceDefinitionString.replaceAll('\r', '')?.split('\n') ?? '';

  const keyProperties: CompositeKeyProperty[] = [];
  for (const line of resourceAttributeStrings) {
    if (line.includes('@@id')) {
      console.log('LINE', line);
      const matches = [...line.matchAll(/([a-zA-Z]+)[,\]]/g)].map(
        (match) => match[1]
      );
      for (const match of matches) {
        keyProperties.push({
          property: match,
          type: attributes.find((a) => a.name == match)?.tsType ?? 'number',
        });
      }
      break;
    }
  }
  return keyProperties;
};
