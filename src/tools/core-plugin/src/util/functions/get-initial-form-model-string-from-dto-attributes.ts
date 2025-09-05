import { ResourceAttributeWithDTO } from '../types/resource-attribute.type';

const defaultValueMapper = {
  number: 0,
  text: `''`,
  checkbox: 'false',
};

export const getInitialFormModelStringFromDTOAttributes = (
  fieldAttributes: ResourceAttributeWithDTO[]
) => {
  let initialFormModelString = '';
  for (const field of fieldAttributes) {
    if (!field.isOptional && field.formFieldType)
      initialFormModelString += `${field.name}: ${
        defaultValueMapper[field.formFieldType] ?? `''`
      },\n`;
  }

  return initialFormModelString;
};
