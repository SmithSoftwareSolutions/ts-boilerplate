import { DateTime } from 'luxon';
import { getDateTimeFromOther } from './get-date-time-from-other';

export const formatDateTime = (date?: string | DateTime | Date | null) => {
  const asDateTime = getDateTimeFromOther(date);
  if (!asDateTime) return null;

  return asDateTime.toFormat('MM/dd/yyyy hh:mm a ZZZZ');
};
