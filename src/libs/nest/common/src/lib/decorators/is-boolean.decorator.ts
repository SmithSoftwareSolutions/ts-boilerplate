import { IsBoolean as CVIsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export function IsBoolean() {
  const isBooleanFn = CVIsBoolean();
  const transformFn = Transform(({ key, obj }) => {
    const value = obj[key];

    return value === null
      ? null
      : value === undefined
      ? value
      : value === ''
      ? undefined
      : `${value}` == 'true';
  });

  return function (target: any, key: string) {
    isBooleanFn(target, key);
    transformFn(target, key);
  };
}
