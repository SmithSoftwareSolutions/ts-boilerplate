import { DateTime } from 'luxon';

export const convertAllDatesInObject = (obj: any) => {
  if (typeof obj !== 'object' || obj == null || obj == undefined) return obj;

  const copyOfObj = structuredClone(obj);
  for (const [key, value] of Object.entries(copyOfObj)) {
    if (
      typeof value == 'string' &&
      value.match(/.+[-:/,].+/g) &&
      DateTime.fromISO(value).isValid
    ) {
      copyOfObj[key] = DateTime.fromISO(value).toJSDate();
    } else if (
      typeof value == 'string' &&
      value.match(/.+[-:/,].+/g) &&
      DateTime.fromHTTP(value).isValid
    ) {
      copyOfObj[key] = DateTime.fromHTTP(value).toJSDate();
    } else if (Array.isArray(value)) {
      for (const i in value) {
        copyOfObj[key][i] = convertAllDatesInObject(value[i]);
      }
    } else if (typeof value == 'object' && value !== null) {
      copyOfObj[key] = convertAllDatesInObject(value);
    }
  }
  return copyOfObj;
};
