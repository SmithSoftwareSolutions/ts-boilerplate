export interface ResourceAttribute {
  name: string;
  type: string;
  tsType?: string;
  isOptional?: boolean;
  isSingleRelation?: boolean;
  isMultiRelation?: boolean;
}

export interface ResourceAttributeWithDTO extends ResourceAttribute {
  formFieldType: string;
  isSingleRelationKey?: boolean;
  decorators: string[];
}
