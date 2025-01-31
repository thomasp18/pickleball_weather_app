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

  if (!pname || typeof pname !== 'string') {
    return NextResponse.json(
      { error: `${pname} must be a non-empty string value` },
      { status: 400 },
    );
  }

  const regex = /^[a-zA-Z]+$/;
  if (!regex.test(pname)) {
    return NextResponse.json(
      { error: `${pname} can only include lowercase and uppercase letters` },
      { status: 400 },
    );
  }

  const playerNames = await sql`
    SELECT LOWER(pname) FROM players
    WHERE LOWER(pname) = ${pname.toLowerCase()}`;
  if (playerNames.length !== 0) {
    return NextResponse.json({ error: `${pname} already exists` }, { status: 400 });
  }

  return NextResponse.json(
    await sql`
    INSERT INTO players (pname)
    VALUES (${pname});
  `,
  );
}
