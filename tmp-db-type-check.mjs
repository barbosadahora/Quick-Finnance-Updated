import postgres from 'postgres';
const sql = postgres('postgres://postgres:123456@localhost:5432/qfin');
try {
  const result = await sql`select n.nspname, t.typname from pg_type t join pg_namespace n on t.typnamespace = n.oid where t.typname in ('transaction_type', 'role')`;
  console.log('TYPE CHECK', result);
} catch (error) {
  console.error('TYPE CHECK ERROR', error);
} finally {
  await sql.end();
}
