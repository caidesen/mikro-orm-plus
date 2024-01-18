import { defineConfig, MikroORM } from '@mikro-orm/sqlite';
import { SoftDeletableHandlerSubscriber } from '../../src';

const config = defineConfig({
  subscribers: [SoftDeletableHandlerSubscriber],
  dbName: 'db/test.db',
  debug: true,
});

export async function getOrm(
  entities: typeof config.entities,
): Promise<MikroORM> {
  const orm = await MikroORM.init(Object.assign({ entities }, config));
  await orm.getSchemaGenerator().dropSchema();
  await orm.getSchemaGenerator().createSchema();
  return orm;
}
