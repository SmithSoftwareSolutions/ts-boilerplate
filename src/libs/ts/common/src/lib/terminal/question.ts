import { ReadLine } from 'readline';

export const question = (cli: ReadLine, question: string): Promise<string> => {
  return new Promise((res, rej) => {
    try {
      console.log(`\n${question}`);
      cli.question('', res);
    } catch (e) {
      rej(e);
    }
  });
};
