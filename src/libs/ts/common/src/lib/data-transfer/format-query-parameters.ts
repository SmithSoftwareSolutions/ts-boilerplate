export const formatQueryParameters = (
  query: any,
  keysToRemoveNull: string[] = []
) => {
  for (const keyToRemoveNull of keysToRemoveNull)
    if (
      query &&
      (!query?.[keyToRemoveNull] ||
        (typeof query?.[keyToRemoveNull] == 'object' &&
          Object.keys(query?.[keyToRemoveNull]).length < 1))
    )
      delete query[keyToRemoveNull];

  for (const key of Object.keys(query)) {
    if (query?.[key] && typeof query?.[key] == 'object') {
      query[key] = JSON.stringify(query[key]) as any;
    }
  }

  const params: Record<string, any> = { ...query };

  if (params)
    for (const key of Object.keys(params)) {
      if (Array.isArray(params[key as keyof typeof params])) {
        params[key as keyof typeof params] = (
          params[key as keyof typeof params] as any[]
        )?.join(',') as any;
      }
    }

  return params;
};
