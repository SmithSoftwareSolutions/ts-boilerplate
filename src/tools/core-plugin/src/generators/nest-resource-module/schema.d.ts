export interface NestResourceModuleGeneratorSchema {
  name: string;
  lowerName?: string;
  lowerHyphenName?: string;
  destinationPath?: string;
  indexPath?: string;
  modulesIndexPath?: string;
  dry?: boolean;
}
