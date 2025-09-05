export const getResourceNamesFromPrismaContents = (fileContents: string) => {
  const regex = /model (.+?) {/g;

  const matches = [...fileContents.matchAll(regex)].map((match) => match[1]);

  return matches;
};
