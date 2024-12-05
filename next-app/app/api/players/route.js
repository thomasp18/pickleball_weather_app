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
  return NextResponse.json(
    await sql`
    INSERT INTO players (pname)
    VALUES (${pname});
  `,
  );
}
