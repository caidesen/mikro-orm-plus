import { Property, PropertyOptions } from '@mikro-orm/core';

export function CreateDateProperty<T extends object>(
  options?: PropertyOptions<T>,
): PropertyDecorator {
  return Property<T>({ ...options, onCreate: () => new Date() });
}
