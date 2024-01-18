import { PropertyOptions } from '@mikro-orm/core';
import { CreateDateProperty } from './create-date-property.decorator';

export function UpdateDateProperty<T extends object>(
  options?: PropertyOptions<T>,
): PropertyDecorator {
  return CreateDateProperty<T>({ ...options, onUpdate: () => new Date() });
}
