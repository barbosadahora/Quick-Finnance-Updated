import postgres from 'postgres';
const sql = postgres('postgres://postgres:123456@localhost:5432/qfin');
try {
  await sql`DROP TYPE IF EXISTS "public"."transaction_type" CASCADE`;
  await sql`DROP TYPE IF EXISTS "public"."role" CASCADE`;
  console.log('Dropped stale enum types if they existed');
} catch (error) {
  console.error('DB CLEAN ERROR', error);
} finally {
  await sql.end();
}
