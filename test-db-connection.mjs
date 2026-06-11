import postgres from 'postgres';

const sql = postgres('postgres://postgres:123456@localhost:5432/qfin');

async function testDatabase() {
  try {
    console.log('Testing database connection...');

    // Test basic connection
    const result = await sql`SELECT 1 as test`;
    console.log('✅ Connection successful:', result);

    // Test table existence
    const tables = await sql`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`;
    console.log('✅ Tables found:', tables.map(t => t.table_name));

    // Test enum types
    const types = await sql`SELECT typname FROM pg_type WHERE typname IN ('transaction_type', 'role')`;
    console.log('✅ Enum types found:', types.map(t => t.typname));

    // Test inserting a user
    console.log('Testing user insertion...');
    const testUser = {
      openId: 'test-user-' + Date.now(),
      name: 'Test User',
      email: 'test@example.com',
      loginMethod: 'test'
    };

    const inserted = await sql`
      INSERT INTO users (openId, name, email, loginMethod)
      VALUES (${testUser.openId}, ${testUser.name}, ${testUser.email}, ${testUser.loginMethod})
      RETURNING id, openId, name, email
    `;
    console.log('✅ User inserted:', inserted[0]);

    // Test inserting a goal
    console.log('Testing goal insertion...');
    const testGoal = {
      userId: inserted[0].id,
      name: 'Test Goal',
      targetAmount: '1000.00',
      currentAmount: '100.00',
      deadline: '2025-12-31'
    };

    const goalInserted = await sql`
      INSERT INTO goals (userId, name, targetAmount, currentAmount, deadline)
      VALUES (${testGoal.userId}, ${testGoal.name}, ${testGoal.targetAmount}, ${testGoal.currentAmount}, ${testGoal.deadline})
      RETURNING id, name, targetAmount, currentAmount
    `;
    console.log('✅ Goal inserted:', goalInserted[0]);

    // Clean up test data
    console.log('Cleaning up test data...');
    await sql`DELETE FROM goals WHERE "userId" = ${inserted[0].id}`;
    await sql`DELETE FROM users WHERE id = ${inserted[0].id}`;
    console.log('✅ Test data cleaned up');

    console.log('🎉 All database tests passed!');

  } catch (error) {
    console.error('❌ Database test failed:', error);
  } finally {
    await sql.end();
  }
}

testDatabase();