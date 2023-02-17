import { Property, PropertyOptions } from '@mikro-orm/core';

export function CreateDateProperty<T>(
  options?: PropertyOptions<T>,
): PropertyDecorator {
  return Property<T>({ ...options, onCreate: () => new Date() });
}
