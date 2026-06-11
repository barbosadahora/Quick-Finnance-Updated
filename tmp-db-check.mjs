import postgres from 'postgres';

const sql = postgres('postgres://postgres:123456@localhost:5432/qfin');

try {
  const users = await sql`select id, email, name, "passwordHash" from users limit 5`;
  console.log('USERS', users);
  const goals = await sql`select id, "userId", name, "targetAmount", "currentAmount", deadline from goals limit 5`;
  console.log('GOALS', goals);
  const trans = await sql`select id, "userId", type, amount from transactions limit 5`;
  console.log('TRANSACTIONS', trans);
} catch (error) {
  console.error('DB QUERY ERROR', error);
} finally {
  await sql.end();
}
