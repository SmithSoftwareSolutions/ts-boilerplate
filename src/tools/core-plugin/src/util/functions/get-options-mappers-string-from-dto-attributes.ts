import * as inflection from 'inflection';
import { ResourceAttributeWithDTO } from '../types/resource-attribute.type';

export const getOptionsMappersStringFromDTOAttributes = (
  fieldAttributes: ResourceAttributeWithDTO[]
) => {
  let initialMapperString = '';
  for (const field of fieldAttributes) {
    if (field.isSingleRelationKey) {
      const name = field.name.replace('Id', '');
      initialMapperString += `${name}Id: { loadAction: ${name}Actions.loadItems({}), stateSelector: select${inflection.camelize(
        name
      )}State, },\n`;
    }
  }

  return initialMapperString;
};
