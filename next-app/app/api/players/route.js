import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres({
  database: process.env.POSTGRES_DB,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  ssl: process.env.POSTGRES_SSL_ENABLED === 'true',
  idle_timeout: 20,
  max_lifetime: 60 * 30,
});

export async function GET() {
  return NextResponse.json(
    await sql`
    SELECT * FROM players;
  `,
  );
}

export async function POST(request) {
  const { pname } = await request.json();
  return NextResponse.json(
    await sql`
    INSERT INTO players (pname)
    VALUES (${pname});
  `,
  );
}
