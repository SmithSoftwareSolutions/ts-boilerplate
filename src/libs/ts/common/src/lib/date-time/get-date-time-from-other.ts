import { DateTime } from 'luxon';

export const getDateTimeFromOther = (
  date?: string | DateTime | Date | null
) => {
  if (!date) return null;
  let d: DateTime | null = null;
  if (typeof date == 'string') {
    const dateConversionFunctions = [
      DateTime.fromISO,
      DateTime.fromHTTP,
      DateTime.fromSQL,
    ];
    for (const dateConversionFunc of dateConversionFunctions) {
      const dateConversion = dateConversionFunc(date);
      if (dateConversion.isValid) {
        d = dateConversion;
        break;
      }
    }
    if (d == undefined) return null;
  } else if (typeof date == 'object' && (date as any).toJSDate) {
    d = date as DateTime;
  } else if (typeof date == 'object' && (date as any).getDate) {
    d = DateTime.fromJSDate(date as Date);
  } else {
    return null;
  }

  return d;
};
