import { readFileSync } from 'fs';
import { ResourceAttributeWithDTO } from '../types/resource-attribute.type';

const dtoTypeToFormFieldType: Record<string, string> = {
  number: 'number',
  boolean: 'checkbox',
  string: 'text',
  Date: 'date',
};

const attributeRegex = /(.+?)([!|?]): (.+?);/g;

export const getDTOAttributesFromDTOFile = (filePath: string) => {
  const fileContents = readFileSync(filePath).toString();
  const lines = fileContents?.split('\n') ?? '';

  const attributes: ResourceAttributeWithDTO[] = [];
  let currentAttribute: ResourceAttributeWithDTO | null = null;
  let decorators: string[] = [];
  for (const line of lines) {
    const regexMatches = [...line.matchAll(attributeRegex)]?.[0];
    if (regexMatches && regexMatches.length > 0) {
      currentAttribute = {
        name: regexMatches[1]?.replaceAll(' ', ''),
        type: regexMatches[3],
        formFieldType: dtoTypeToFormFieldType[regexMatches[3]],
        isOptional: regexMatches[2] == '?',
        isSingleRelationKey: regexMatches[1]?.includes('Id'),
        decorators: decorators,
      };
    } else if (line.includes('@')) {
      // decorator
      if (currentAttribute) {
        attributes.push(currentAttribute);
        currentAttribute = null;
        decorators = [];
      }

      decorators.push(line.replaceAll(' ', ''));
    }
  }

  if (currentAttribute) {
    attributes.push(currentAttribute);
    currentAttribute = null;
    decorators = [];
  }

  return attributes.filter(
    (a) => !['createdAt', 'updatedAt', 'id'].includes(a.name)
  );
};
