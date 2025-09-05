import * as inflection from 'inflection';
import { ResourceAttributeWithDTO as DTOAttribute } from '../types/resource-attribute.type';

export const getFormFieldsStringFromDTOAttributes = (
  fieldAttributes: DTOAttribute[]
) => {
  let formFieldsString = '';
  for (const field of fieldAttributes) {
    if (field.isSingleRelationKey) {
      formFieldsString += `{
        key: '${field.name}',
        type: 'select',
        props: {
          label: '${inflection.titleize(
            inflection.singularize(inflection.tableize(field.name))
          )}',
          required: ${!field.isOptional},
          options: [],
        }
      },\n`;
    } else {
      formFieldsString += `{
        key: '${field.name}',
        type: '${field.tsType == 'Date' ? 'date-time' : 'input'}',
        props: {
          label: '${inflection.titleize(
            inflection.singularize(inflection.tableize(field.name))
          )}',
          type: '${field.tsType == 'Date' ? 'datetime' : field.formFieldType}',
          required: ${!field.isOptional}
        }
      },\n`;
    }
  }

  return formFieldsString;
};
