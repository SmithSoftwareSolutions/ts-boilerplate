import { AuthService } from '@org/nest/auth';
import {
  getResourceNamesFromPrismaContents,
  readPrismaFolderContents,
} from '@org/core-plugin';
import { Injectable } from '@nestjs/common';
import {
  logGreenMessage,
  logRedMessage,
  logYellowMessage,
} from '@org/ts/common';
import { spawnSync } from 'child_process';

@Injectable()
export class AppService {
  constructor(private readonly authService: AuthService) {}

  async seed() {
    logYellowMessage('Seeding Database');
    const servicesToSeed = [this.authService];
    for (const service of servicesToSeed) {
      try {
        await service.seed();
        logGreenMessage(`Seeded ${service.constructor.name}`);
      } catch (e) {
        logRedMessage(`Failed to seed ${service.constructor.name}`);
      }
    }

    logGreenMessage(`Done Seeding`);
  }

  async generateNestResourceModules() {
    logYellowMessage('Generate Nest Resource Modules');
    const prismaSchemaLocation = `src/databases/main/schema`;
    // read prisma schema
    const fileContents = readPrismaFolderContents(prismaSchemaLocation);
    const resourceNames = getResourceNamesFromPrismaContents(fileContents);
    for (const resourceName of resourceNames) {
      if (['User'].includes(resourceName)) continue;
      for (const cmd of ['gnrm']) {
        const res = spawnSync(
          `npx.cmd`,
          ['nx', cmd, `--name=${resourceName}`],
          {
            shell: true,
          }
        );
        console.log(res?.output?.toString() ?? 'No Output - Check for Error?');
      }
    }

    logGreenMessage('Done Generating Nest Resource Modules.');
  }

  async generateAngularConnections() {
    logYellowMessage('Generate Angular Connections');
    const prismaSchemaLocation = `src/databases/main/schema`;
    // read prisma schema
    const fileContents = readPrismaFolderContents(prismaSchemaLocation);
    const resourceNames = getResourceNamesFromPrismaContents(fileContents);
    for (const resourceName of resourceNames) {
      if (resourceName in ['User']) continue;
      for (const cmd of ['gars', 'garst', 'garfm']) {
        const res = spawnSync(
          `npx.cmd`,
          ['nx', cmd, `--name=${resourceName}`],
          {
            shell: true,
          }
        );
        console.log(res?.output?.toString() ?? 'No Output - Check for Error?');
      }
    }

    logGreenMessage('Done Generating Angular Connections.');
  }

  async generateAngularListViews() {
    logYellowMessage('Generate Angular List Views');
    for (const resourceName of ['UserNote']) {
      for (const cmd of ['garlv']) {
        const res = spawnSync(
          `npx.cmd`,
          ['nx', cmd, `--name=${resourceName}`],
          {
            shell: true,
          }
        );
        console.log(res?.output?.toString() ?? 'No Output - Check for Error?');
      }
    }

    logGreenMessage('Done Generating Angular List Views.');
  }

  async generateAll() {
    await this.generateNestResourceModules();
    await this.generateAngularConnections();
    await this.generateAngularListViews();
  }
}
