import postgres from 'postgres';

const sql = postgres('postgres://postgres:123456@localhost:5432/qfin');

async function testTransactionCreation() {
  try {
    console.log('Testing transaction creation...');

    // First create a test user
    const testUser = {
      openId: 'test-user-transaction-' + Date.now(),
      name: 'Test User Transaction',
      email: 'test-transaction@example.com',
      loginMethod: 'test'
    };

    const userInserted = await sql`
      INSERT INTO users (openId, name, email, loginMethod)
      VALUES (${testUser.openId}, ${testUser.name}, ${testUser.email}, ${testUser.loginMethod})
      RETURNING id
    `;
    const userId = userInserted[0].id;
    console.log('✅ Test user created with ID:', userId);

    // Test transaction creation
    const testTransaction = {
      userId: userId,
      type: 'EXPENSE',
      amount: '150.50',
      category: 'Alimentação',
      description: 'Test transaction',
      date: '2024-01-15'
    };

    const transactionInserted = await sql`
      INSERT INTO transactions ("userId", type, amount, category, description, date)
      VALUES (${testTransaction.userId}, ${testTransaction.type}, ${testTransaction.amount}, ${testTransaction.category}, ${testTransaction.description}, ${testTransaction.date})
      RETURNING id, type, amount, category, description, date
    `;
    console.log('✅ Transaction created:', transactionInserted[0]);

    // Test transaction retrieval
    const transactions = await sql`
      SELECT id, type, amount, category, description, date
      FROM transactions
      WHERE "userId" = ${userId}
      ORDER BY date DESC
    `;
    console.log('✅ Transactions retrieved:', transactions);

    // Clean up
    await sql`DELETE FROM transactions WHERE "userId" = ${userId}`;
    await sql`DELETE FROM users WHERE id = ${userId}`;
    console.log('✅ Test data cleaned up');

    console.log('🎉 Transaction creation test passed!');

  } catch (error) {
    console.error('❌ Transaction creation test failed:', error);
  } finally {
    await sql.end();
  }
}

testTransactionCreation();