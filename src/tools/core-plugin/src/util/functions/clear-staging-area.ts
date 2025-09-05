import { rmSync } from 'fs';
import path = require('path');

export const clearStagingArea = (stagingAreaPath: string) => {
  rmSync(path.resolve(stagingAreaPath, 'staged'), {
    force: true,
    recursive: true,
  } as any);
};
