import { CompositeKeyProperty } from '../types/composite-key-property.type';

export const getCompositeKeyTypeStringFromProperties = (
  properties: CompositeKeyProperty[]
) => {
  return `{
    ${properties.map((p) => `${p.property}: ${p.type};`).join('\n')}
  }`;
};
