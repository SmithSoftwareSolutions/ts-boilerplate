export const removePropertiesFromObject = <T = any>(
  obj: T,
  properties: (keyof T)[]
) => {
  const copy = structuredClone(obj);
  for (const prop of properties) {
    delete copy[prop];
  }

  return copy;
};
