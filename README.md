# mikro-orm-plus
Some useful features for MikroORM

## @CreateDateProperty
Special property that is automatically set to the entity's insertion time. You don't need to write a value into this property - it will be automatically set. 
```typescript
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { CreateDateProperty } from '@mikro-orm-plus';

@Entity()
export class User {

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @CreateDateProperty()
  createdAt: Date;

}
```

## @UpdateDateProperty
Special property that is automatically set to the entity's update time. You don't need to write a value into this property - it will be automatically set. 
```typescript
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { UpdateDateProperty } from '@mikro-orm-plus';

@Entity()
export class User {

  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @UpdateDateProperty()
  updatedAt: Date;

}
```

## @DeleteDateProperty
Special property that is automatically set to the entity's delete time. You don't need to write a value into this property - it will be automatically set. 

This feature is base on [mikro-orm-soft-delete](https://github.com/TheNightmareX/mikro-orm-soft-delete), modified as a property decorator implementation.

### Soft deletable entity define: 
```typescript
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { DeleteDateProperty } from '@mikro-orm-plus';

@Entity()
export class User {

  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @DeleteDateProperty()
  deletedAt: Date;

}
```

### how to softly delete?
Consistent with mikroOrm's api, just use `em.remove()` or `em.removeAndFlush()` to delete entity.

```typescript
await em.removeAndFlush(user);
```
### How to find soft deleted entity?
You need disabled soft delete filter, and then you can find soft deleted entity.

```typescript
em.find(User, {...}, { filters: { [SOFT_DELETABLE_FILTER]: false } });
em.find(User, {...}, { filters: false }); // if you are sure that there are no other filters enabled
```
### How to hard delete entity?
You can use `em.nativeDelete()` to hard delete entity.

## License

[MIT licensed](LICENSE).
