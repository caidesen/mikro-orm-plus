import { DeleteDateProperty } from '../src';
import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Cascade,
} from '@mikro-orm/core';
import { getOrm } from './utils/mikro-orm.helper';
abstract class DeletableEntity {
  @DeleteDateProperty()
  deletedAt: Date;
}

@Entity()
class Book extends DeletableEntity {
  @PrimaryKey()
  id: number;
  @Property()
  title: string;
}
test('soft delete test', async () => {
  const orm = await getOrm([Book]);
  const em = orm.em.fork();
  const book = em.create(Book, { title: 'test' });
  await em.persistAndFlush(book);
  await em.removeAndFlush(book);
  expect(await em.findOne(Book, { id: book.id })).toBeNull();
  const removedBook = await em.findOne(
    Book,
    { id: book.id },
    { filters: false },
  );
  expect(removedBook.id).toEqual(book.id);
  expect(removedBook.deletedAt).not.toBeNull();
  removedBook.deletedAt = null;
  await em.flush();
  await em.nativeDelete(Book, { id: book.id });
  expect(await em.findOne(Book, { id: book.id })).toBeNull();
  expect(
    await em.findOne(Book, { id: book.id }, { filters: false }),
  ).toBeNull();
  await orm.close(true);
});

@Entity()
class Author extends DeletableEntity {
  @PrimaryKey()
  id: number;
  @Property()
  name: string;
  @OneToMany(() => Post, (post) => post.author, { cascade: [Cascade.REMOVE] })
  posts = new Collection<Post>(this);
}

@Entity()
class Post extends DeletableEntity {
  @PrimaryKey()
  id: number;
  @Property()
  title: string;
  @ManyToOne(() => Author)
  author: Author;
}
test('cascade soft delete test', async () => {
  const orm = await getOrm([Author, Post]);
  const em = orm.em.fork();
  const author = em.create(Author, { name: 'jack' });
  const post1 = em.create(Post, { title: 'how to use MikroOrm' });
  const post2 = em.create(Post, { title: 'how to use MikroOrmPlus' });
  author.posts.add(post1, post2);
  await em.persistAndFlush(author);
  await em.removeAndFlush(author);
  expect(await em.findOne(Author, { id: author.id })).toBeNull();
  expect(await em.findOne(Post, { id: post1.id })).toBeNull();
  expect(await em.findOne(Post, { id: post2.id })).toBeNull();
  await orm.close();
});
