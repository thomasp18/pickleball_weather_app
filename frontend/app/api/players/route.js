import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres("postgresql://piko:pikopw@localhost:5432/piko-db?ssl=false");

export async function GET() {
  return NextResponse.json(await sql`
    SELECT * FROM players;
  `);
}
