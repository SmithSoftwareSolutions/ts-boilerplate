export const clearMessage = () => {
  process.stdout.write('\u001b[0m');
};

export const logRedMessage = (message: string) => {
  process.stdout.write('\u001b[31m');
  console.log(message);
  clearMessage();
};
export const logGreenMessage = (message: string) => {
  process.stdout.write('\u001b[32m');
  console.log(message);
  clearMessage();
};
export const logYellowMessage = (message: string) => {
  process.stdout.write('\u001b[33m');
  console.log(message);
  clearMessage();
};
