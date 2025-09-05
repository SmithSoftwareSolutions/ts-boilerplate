import { ResourceAttribute } from '../types/resource-attribute.type';

const prismaTypeToDTOTypeMappings: Record<string, string> = {
  Int: '@IsInt()',
  Float: '@IsNumber()',
  Decimal: '@IsNumber()',
  String: '@IsString()',
  DateTime: '@IsDate()',
  Boolean: '@IsBoolean()',
};

export const getCreateDTOStringFromResourceAttributes = (
  attributes: ResourceAttribute[]
) => {
  let attributesString = ``;
  for (const attribute of attributes) {
    if (['id', 'createdAt', 'updatedAt'].includes(attribute.name)) continue;
    const decorator = prismaTypeToDTOTypeMappings[attribute.type];
    if (decorator) {
      attributesString += `${decorator}
      ${attribute.isOptional ? '@IsOptional()' : ''}
      ${attribute.name + (attribute.isOptional ? '?' : '!')}: ${
        attribute.tsType
      }
      `;
    }
  }

  return attributesString;
};
