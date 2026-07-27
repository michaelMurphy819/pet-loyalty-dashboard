import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

// Automatically parse .env.local if DATABASE_URL is not set in environment
if (!process.env.DATABASE_URL) {
  const envPath = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf8').split('\n');
    for (const line of lines) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^['"]|['"]$/g, '');
        process.env[key] = value;
      }
    }
  }
}

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/postgres';

async function runSetup() {
  console.log("🚀 Starting PostgreSQL Materialized View setup against target database...");
  const sql = postgres(connectionString, { max: 1 });

  try {
    const scriptPath = path.join(process.cwd(), 'create_materialized_view.sql');
    const queriesText = fs.readFileSync(scriptPath, 'utf8');

    // Strip SQL comments and split by semicolon
    const cleanSql = queriesText
      .split('\n')
      .map(line => line.trim().startsWith('--') ? '' : line)
      .join('\n');

    const statements = cleanSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const startTotal = Date.now();

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const preview = statement.split('\n').find(l => !l.trim().startsWith('--')) || statement.slice(0, 50);
      console.log(`\n⏳ Executing statement [${i + 1}/${statements.length}]: ${preview.slice(0, 75)}...`);
      const startStmt = Date.now();
      await sql.unsafe(statement);
      const elapsed = Date.now() - startStmt;
      console.log(`✅ Completed in ${elapsed}ms`);
    }

    const totalElapsed = Date.now() - startTotal;
    console.log(`\n🎉 Materialized View & indexing architecture setup completed successfully in ${totalElapsed}ms!`);

    // Benchmarking validation test
    console.log("\n🧪 Running quick sub-10ms benchmark test against analytics.mv_dashboard_summary...");
    const benchStart = Date.now();
    const testResult = await sql`SELECT COALESCE(SUM(adoption_count), 0)::int as total_adoptions FROM analytics.mv_dashboard_summary`;
    const benchTime = Date.now() - benchStart;
    console.log(`⚡ Benchmark Query execution time: ${benchTime}ms (Result: Total Adoptions = ${testResult[0]?.total_adoptions || 0})`);

  } catch (error) {
    console.error("❌ Setup script encountered an error:", error);
    process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

runSetup();
