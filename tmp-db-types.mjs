import postgres from 'postgres';
const sql = postgres('postgres://postgres:123456@localhost:5432/qfin');
try {
  const types = await sql`select typname from pg_type where typname in ('transaction_type','role')`;
  console.log('TYPES', types);
} catch (error) {
  console.error('DB TYPES ERROR', error);
} finally {
  await sql.end();
}
