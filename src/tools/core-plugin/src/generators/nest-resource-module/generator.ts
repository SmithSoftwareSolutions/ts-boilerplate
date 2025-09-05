import { formatFiles, generateFiles, Tree } from '@nx/devkit';
import { spawnSync } from 'child_process';
import { addExportsToFile } from '../../util/functions/add-exports-to-file';
import { addImportsToFile } from '../../util/functions/add-imports-to-file';
import { addToArrayInFile } from '../../util/functions/add-to-array-in-file';
import { clearStagingArea } from '../../util/functions/clear-staging-area';
import { getCompositeKeyTypeStringFromProperties } from '../../util/functions/get-composite-key-type-string-from-properties';
import { getCreateDTOStringFromResourceAttributes } from '../../util/functions/get-create-dto-string-from-resource-attributes';
import { getResourceCompositePrimaryKeyPropertiesFromPrismaSchema } from '../../util/functions/get-resource-composite-primary-key-properties-from-prisma-schema';
import { getResourceDetailsFromPrismaSchemaFolder } from '../../util/functions/get-resource-details-from-prisma-folder';
import { getSubstitutionsFromOptions } from '../../util/functions/get-substitutions-from-options';
import { stageFilesToGenerate } from '../../util/functions/stage-files-to-generate';
import { NestResourceModuleGeneratorSchema } from './schema';
import path = require('path');

export default async function (
  tree: Tree,
  options: NestResourceModuleGeneratorSchema
) {
  // file locations
  const destination =
    options.destinationPath ?? `src/libs/nest/resource/src/lib`;
  const libraryIndexLocation =
    options.indexPath ?? `src/libs/nest/resource/src/index.ts`;
  const libraryObjectsIndexLocation =
    options.indexPath ?? `src/libs/nest/resource/src/index.objects.ts`;
  const modulesLocation =
    options.modulesIndexPath ??
    `src/libs/nest/resource/src/lib/index.modules.ts`;
  const prismaSchemaLocation = `src/databases/main/schema`;

  // get resource details
  const { attributes } = getResourceDetailsFromPrismaSchemaFolder(
    prismaSchemaLocation,
    options.name
  );
  const dtoString = getCreateDTOStringFromResourceAttributes(attributes);
  const compositePrimaryKeyProperties =
    getResourceCompositePrimaryKeyPropertiesFromPrismaSchema(
      prismaSchemaLocation,
      options.name,
      attributes
    );
  const compositePrimaryKeyTypeString =
    compositePrimaryKeyProperties.length > 0
      ? getCompositeKeyTypeStringFromProperties(compositePrimaryKeyProperties)
      : 'number';
  const compositeKeyOrderString =
    compositePrimaryKeyProperties?.length > 1
      ? `[${compositePrimaryKeyProperties
          .map((p) => `'${p.property}'`)
          .join(', ')}]`
      : `['id']`;

  const substitutions = getSubstitutionsFromOptions(options);
  substitutions.dtoString = dtoString;
  substitutions.compositePrimaryKeyType = compositePrimaryKeyTypeString;
  substitutions.showCompositeKeyOrder =
    compositePrimaryKeyProperties?.length > 1;
  substitutions.compositeKeyOrder = compositeKeyOrderString;

  clearStagingArea(path.join(__dirname, 'files'));
  const stagedFiles = stageFilesToGenerate(
    path.join(__dirname, 'files'),
    destination,
    substitutions
  );

  console.log(`Staged:\n${stagedFiles.destinationFileNames.join('\n')}`);
  if (!options.dry) {
    generateFiles(
      tree,
      path.join(__dirname, 'files/staged'),
      destination,
      substitutions
    );

    // add to modules array
    addToArrayInFile(
      modulesLocation,
      'resourceModules',
      `${options.name}Module`
    );
    addImportsToFile(modulesLocation, {
      [`${options.name}Module`]: `./${stagedFiles.destinationFileNames.find(
        (fn) => fn.endsWith('.module.ts')
      )}`,
    });

    // add to exports
    addExportsToFile(
      libraryIndexLocation,
      stagedFiles.destinationFileNames.map((fn) => `./lib/${fn}`),
      substitutions.lowerHyphenName
    );

    addExportsToFile(
      libraryObjectsIndexLocation,
      stagedFiles.destinationFileNames
        .filter((fn) => fn.includes('type-mapping'))
        .map((fn) => `./lib/${fn}`),
      substitutions.lowerHyphenName
    );

    await formatFiles(tree);
    clearStagingArea(path.join(__dirname, 'files'));
  }

  const res = spawnSync('npx.cmd', ['nx', 'pretty'], {
    shell: true,
  });
  if (res.status == 0) console.log('Formatted Codebase');
  else console.log('Failed to Format Codebase');
}
