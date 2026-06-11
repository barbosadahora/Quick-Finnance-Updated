import postgres from 'postgres';

const sql = postgres('postgres://postgres:123456@localhost:5432/qfin');

async function checkSchema() {
  try {
    console.log('Checking users table schema...');
    const columns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `;
    console.log('Users table columns:');
    columns.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : ''}`);
    });

    console.log('\nChecking transactions table schema...');
    const txColumns = await sql`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'transactions'
      ORDER BY ordinal_position
    `;
    console.log('Transactions table columns:');
    txColumns.forEach(col => {
      console.log(`  ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : ''}`);
    });

  } catch (error) {
    console.error('Schema check failed:', error);
  } finally {
    await sql.end();
  }
}

checkSchema();