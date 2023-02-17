import { defineConfig, MikroORM } from '@mikro-orm/sqlite';

const config = defineConfig({
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
