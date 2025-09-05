export const isJSON = (json: string) => {
  try {
    JSON.parse(json);
  } catch (e) {
    return false;
  }
  return true;
};
