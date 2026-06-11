import postgres from 'postgres';
const sql = postgres('postgres://postgres:123456@localhost:5432/qfin');
try {
  const tables = await sql`select table_name from information_schema.tables where table_schema='public' order by table_name`;
  console.log('TABLES', tables);
} catch (error) {
  console.error('DB TABLES ERROR', error);
} finally {
  await sql.end();
}
