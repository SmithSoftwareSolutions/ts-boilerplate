export const getResourcePrimaryKeyName = (
  compositeKeyOrder: any[] | undefined | null
) => {
  if (!compositeKeyOrder) return 'id';
  return compositeKeyOrder.join('_');
};
