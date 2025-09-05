import * as inflection from 'inflection';
import { ResourceAttribute } from '../types/resource-attribute.type';

export const getListViewTableColumnsStringFromResourceAttributes = (
  attributes: ResourceAttribute[]
) => {
  let columnDefs = ``;
  for (const attribute of attributes) {
    if (
      attribute.isSingleRelation ||
      attribute.isMultiRelation ||
      attribute.name.includes('Id')
    )
      continue;

    let label = inflection.titleize(
      inflection.singularize(inflection.tableize(attribute.name))
    );
    let extra = '';
    if (attribute.name == 'id') {
      label = 'ID';
      extra = `minWidth: '3rem',`;
    }
    if (attribute.name == 'updatedAt') {
      label = 'Updated At';
      extra = `accessor: (row) => formatDateTime(row.updatedAt),\nminWidth: '15rem',`;
    }
    if (attribute.name == 'createdAt') {
      label = 'Created At';
      extra = `accessor: (row) => formatDateTime(row.createdAt),\nminWidth: '15rem',`;
    }

    columnDefs += `{
      key: '${attribute.name}',
      label: '${label}',
      ${extra}
    },\n `;
  }

  return columnDefs;
};
