import { NestFactory } from '@nestjs/core';
import { createInterface } from 'readline';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';
import { logGreenMessage, question } from '@org/ts/common';

interface Tasks {
  [name: string]: () => unknown;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.init();

  const appService = app.get(AppService);
  const cli = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const tasks: Tasks = {
    seed: () => appService.seed(),
    gnrms: () => appService.generateNestResourceModules(),
    gac: () => appService.generateAngularConnections(),
    galv: () => appService.generateAngularListViews(),
    ga: () => appService.generateAll(),
  };

  logGreenMessage('Management Program Started Successfully');

  let running = true;
  while (running) {
    console.log('Possible Tasks');
    console.log(
      Object.keys(tasks)
        .map((i) => `- ${i}`)
        .join('\n')
    );
    const command = (await question(cli, 'Task Name: ')).trim();
    if (command == 'quit') {
      running = false;
      break;
    }

    if (tasks[command]) {
      await tasks[command]();
      logGreenMessage(`Task Completed`);
    } else {
      console.log(`No task with name: ${command}`);
    }
  }

  await app.close();
}

bootstrap();
