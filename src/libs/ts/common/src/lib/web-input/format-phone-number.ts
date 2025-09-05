export const formatPhoneNumber = (phoneNumber: string) => {
  let formatted = phoneNumber.slice();
  // strip non digits
  formatted = formatted.replace(/\D/g, '');
  // ensure proper length
  formatted = formatted.substring(0, 13);

  const size = formatted.length;

  if (size == 0) {
    return formatted;
  } else if (size < 4) return `(${formatted}`;
  else if (size < 7)
    return `(${formatted.substring(0, 3)}) ${formatted.substring(3)}`;
  else if (size < 11) {
    return `(${formatted.substring(0, 3)}) ${formatted.substring(
      3,
      6
    )}-${formatted.substring(6)}`;
  } else {
    const extraCount = formatted.length - 10;
    return `+${formatted.substring(0, extraCount)} (${formatted.substring(
      extraCount,
      extraCount + 3
    )}) ${formatted.substring(
      extraCount + 3,
      extraCount + 6
    )}-${formatted.substring(extraCount + 6)}`;
  }
};
