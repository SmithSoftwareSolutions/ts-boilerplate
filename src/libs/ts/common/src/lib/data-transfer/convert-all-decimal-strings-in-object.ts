export const convertAllDecimalStringsInObject = (
  obj: any,
  ignoreKeys: string[] = []
) => {
  if (typeof obj !== 'object' || obj == undefined || obj == null) return obj;

  const copyOfObj = structuredClone(obj);
  for (const [key, value] of Object.entries(copyOfObj)) {
    if (key.includes('Id') || ignoreKeys.includes(key)) continue;
    if (
      typeof value == 'string' &&
      value != '' &&
      value.match(/^-?[0-9]*\.?[0-9]*$/g)
    ) {
      copyOfObj[key] = parseFloat(value);
    } else if (Array.isArray(value)) {
      for (const index in value) {
        const relevantIgnoreKeys = ignoreKeys
          .filter((k) => k.startsWith(`${key}.`))
          .map((k) => k.replace(`${key}.`, ''));

        copyOfObj[key][index] = convertAllDecimalStringsInObject(
          value[index],
          relevantIgnoreKeys
        );
      }
    } else if (typeof value == 'object' && value !== null) {
      const relevantIgnoreKeys = ignoreKeys
        .filter((k) => k.startsWith(`${key}.`))
        .map((k) => k.replace(`${key}.`, ''));

      copyOfObj[key] = convertAllDecimalStringsInObject(
        value,
        relevantIgnoreKeys
      );
    }
  }
  return copyOfObj;
};
