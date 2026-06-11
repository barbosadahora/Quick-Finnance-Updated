import postgres from 'postgres';

const sql = postgres('postgres://postgres:123456@localhost:5432/qfin');
await sql`DROP TYPE IF EXISTS "transaction_type" CASCADE`;
await sql`DROP TYPE IF EXISTS "role" CASCADE`;
console.log('Types dropped');
sql.end();