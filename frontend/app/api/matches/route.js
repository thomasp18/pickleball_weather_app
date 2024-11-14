import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres('postgresql://piko:pikopw@localhost:5432/piko-db?ssl=false', {
  idle_timeout: 20,
  max_lifetime: 60 * 30
});

export async function GET() {
  return NextResponse.json(await sql`
    SELECT * FROM players
    JOIN matches_players_rel
    ON players.id = matches_players_rel.player_id
    JOIN matches
    ON matches_players_rel.match_id = matches.id;
  `);
}
