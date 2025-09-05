export const hexToRGB = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        red: parseInt(result[1], 16),
        green: parseInt(result[2], 16),
        blue: parseInt(result[3], 16),
      }
    : { red: -1, green: -1, blue: -1 };
};

export const computeTextColorForBackground = (background: string) => {
  const { red, green, blue } = hexToRGB(background);

  if (red * 0.299 + green * 0.587 + blue * 0.114 > 186) {
    return 'black';
  }
  return 'white';
};
