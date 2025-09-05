import { titleize, underscore } from 'inflection';
import { formatDateTime } from '../date-time/format-date-time';

const defaultKeyMappings: Record<string, string> = {
  createdAt: 'Created At',
  updatedAt: 'Updated At',
};

export const getObjectAsHumanReadableString = (
  object: any,
  separator = '\n',
  precedingString = ''
) => {
  const strings: string[] = [];
  for (let [key, value] of Object.entries(object)) {
    if (value == null || value == undefined || JSON.stringify(value) == '{}') {
      continue;
    }

    if (Object.prototype.toString.call(value) === '[object Date]') {
      value = formatDateTime(value as Date);
    }

    if (typeof value === 'object') {
      strings.push(
        `${precedingString}${
          defaultKeyMappings[key] ?? titleize(underscore(key))
        }: <br>${getObjectAsHumanReadableString(
          value,
          separator,
          '&nbsp;&nbsp;&nbsp;&nbsp;' + precedingString
        )}`
      );
    } else if (value) {
      strings.push(
        `${precedingString}${
          defaultKeyMappings[key] ?? titleize(underscore(key))
        }: ${value}`
      );
    }
  }

  return strings.join(separator);
};
