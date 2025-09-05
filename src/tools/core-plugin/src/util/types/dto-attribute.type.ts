export interface FormFieldAttribute {
  name: string;
  type: string;
  formFieldType: string;
  isOptional?: boolean;
  isSingleRelationKey?: boolean;
  decorators: string[];
}
