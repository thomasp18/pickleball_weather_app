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
  const dates = await sql`
  select * from schedule
  order by sdate
`;

  const formattedDates = dates.map((d) => ({
    id: d.id,
    sdate: d.sdate.toISOString().split('T')[0],
  }));

  return NextResponse.json(formattedDates);
}

export async function POST(request) {
  const { sdate } = await request.json();

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!sdate || typeof sdate !== 'string' || !regex.test(sdate)) {
    return NextResponse.json(
      { error: `${sdate} must be a non-empty string in format yyyy-mm-dd` },
      { status: 400 },
    );
  }

  return NextResponse.json(
    await sql`
      INSERT INTO schedule (sdate)
      VALUES (${sdate});
    `,
  );
}

export async function DELETE(request) {
  const { id } = await request.json();

  if (!id || !Number.isInteger(id) || id < 0) {
    return NextResponse.json({ error: `${id} must be a positive integer` }, { status: 400 });
  }

  const requestedId = await sql`
    SELECT 1
    FROM schedule
    WHERE id = ${id}
  `;

  if (requestedId.length == 0) {
    return NextResponse.json({ error: `${id} does not exist` }, { status: 400 });
  }

  return NextResponse.json(
    await sql`
      DELETE FROM schedule
      WHERE id = ${id};
    `,
  );
}
