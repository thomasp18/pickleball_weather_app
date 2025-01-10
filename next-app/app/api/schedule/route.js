import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres('postgresql://piko:pikopw@localhost:5432/piko-db?ssl=false', {
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
  return NextResponse.json(
    await sql`
      DELETE FROM schedule
      WHERE id = ${id};
    `,
  );
}
