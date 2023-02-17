import './soft-deletable-handler.subscriber';

import {
  Filter,
  FilterQuery,
  Property,
  PropertyOptions,
} from '@mikro-orm/core';

import { SOFT_DELETABLE } from './soft-deletable.symbol';
import { SOFT_DELETABLE_FILTER } from './soft-deletable-filter.constant';
import { SoftDeletableMetadata } from './soft-deletable-metadata.interface';

/**
 * Mark a property as the delete date.
 * @param options
 * @constructor
 */
export const DeleteDateProperty = <T>(options?: PropertyOptions<T>) => {
  const property = Property<T>({ ...options, nullable: true });
  return (target: T, propertyKey: string) => {
    if (Reflect.hasMetadata(SOFT_DELETABLE, target.constructor)) {
      throw new Error(
        `DeleteDateProperty already defined on ${target.constructor.name}`,
      );
    }
    const metadata: SoftDeletableMetadata<T, keyof T> = {
      field: propertyKey as keyof T,
      value: () => new Date() as T[keyof T],
    };
    Reflect.defineMetadata(SOFT_DELETABLE, metadata, target.constructor);
    Filter<T>({
      name: SOFT_DELETABLE_FILTER,
      cond: { [metadata.field]: null } as FilterQuery<T>,
      default: true,
    })(target.constructor);
    return property(target, propertyKey);
  };
};
