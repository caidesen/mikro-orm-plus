import { getOrm } from './utils/mikro-orm.helper';
import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { CreateDateProperty, UpdateDateProperty } from '../src';

test('create date and update date test', async () => {
  @Entity()
  class Book {
    @PrimaryKey()
    id: number;
    @Property()
    title: string;
    @CreateDateProperty()
    createAt: Date;
    @UpdateDateProperty()
    updateAt: Date;
  }
  const orm = await getOrm([Book]);
  const em = orm.em.fork();
  const book = em.create(Book, { title: 'test' });
  await em.persist(book);
  const persistedBook = await em.findOneOrFail(Book, { id: book.id });
  expect(persistedBook.createAt).not.toBeNull();
  expect(persistedBook.updateAt).toEqual(book.createAt);
  await orm.close(true);
});
