/* eslint-disable @typescript-eslint/no-explicit-any */
export interface CompositeKeyConfig<T = any> {
  properties: (keyof T)[];
}
