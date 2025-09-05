export const formatAddress = <
  T extends {
    line1: string;
    line2?: string | null;
    city: string;
    state: string;
    zip?: string | null;
    country: string;
  }
>(
  { line1, line2, city, state, zip, country }: T,
  withNonBreakingHTMLCodes = false
) => {
  if (withNonBreakingHTMLCodes) {
    return `${line1.replaceAll(' ', '&nbsp;')}${
      line2 ? `, ${line2.replaceAll(' ', '&nbsp;')},` : ''
    } ${city},&nbsp;${state}&nbsp;${zip ?? '-----'}, ${country}`;
  }
  return `${line1}${line2 ? `, ${line2},` : ''} ${city}, ${state} ${
    zip ?? '-----'
  }, ${country}`;
};
