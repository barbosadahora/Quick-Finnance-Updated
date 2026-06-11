import postgres from 'postgres';
import fs from 'fs';

const sql = postgres('postgres://postgres:123456@localhost:5432/qfin');

async function runMigration() {
  try {
    console.log('Running database migration...');

    // Read the migration SQL file
    const migrationSQL = fs.readFileSync('drizzle/migrate-new-columns.sql', 'utf8');

    // Split by semicolon and execute each statement
    const statements = migrationSQL.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      const trimmed = statement.trim();
      if (trimmed && !trimmed.startsWith('--')) {
        console.log('Executing:', trimmed.substring(0, 50) + '...');
        await sql.unsafe(trimmed);
      }
    }

    console.log('✅ Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await sql.end();
  }
}

runMigration();