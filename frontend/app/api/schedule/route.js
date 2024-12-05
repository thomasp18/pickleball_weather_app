import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres(
  'postgresql://piko:pikopw@localhost:5432/piko-db?ssl=false',
  {
    idle_timeout: 20,
    max_lifetime: 60 * 30,
  }
);

export async function GET() {
  return NextResponse.json(await sql`
        select * from schedule 
        order by sdate
    `);
}

export async function POST(request) {
  const { sdate } = await request.json();
  sanitize(sdate);
  return NextResponse.json(await sql`
      INSERT INTO schedule (sdate)
      VALUES (${sdate});
    `);
}

function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        '\'': '&#x27;',
        '/': '&#x2F;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
  }