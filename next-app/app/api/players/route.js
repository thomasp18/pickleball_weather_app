import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres('postgresql://piko:pikopw@localhost:5432/piko-db?ssl=false', {
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

  const query = await sql`
    SELECT LOWER(pname) FROM players
    WHERE LOWER(pname) = ${pname.toLowerCase()}`;
  if (query.length !== 0) {
    return NextResponse.json({ error: `${pname} already exists` }, { status: 400 });
  }

  return NextResponse.json(
    await sql`
    INSERT INTO players (pname)
    VALUES (${pname});
  `,
  );
}
