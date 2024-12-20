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
    SELECT match_id, mdate, ascore, bscore, player_id, team, pname
    FROM matches m
    JOIN matches_players_rel mpr on m.id = mpr.match_id
    JOIN players p on mpr.player_id = p.id;
  `,
  );
}

export async function POST(request) {
  const { date, aScore, bScore, aPlayers, bPlayers } = await request.json();
  const match = await sql`
    INSERT INTO matches (mdate, ascore, bscore)
    VALUES (${date}, ${aScore}, ${bScore})
    RETURNING id;
  `;
  const matchId = match[0].id;
  const players = [];

  aPlayers.forEach((p) => players.push({ match_id: matchId, player_id: p, team: 'a' }));
  bPlayers.forEach((p) => players.push({ match_id: matchId, player_id: p, team: 'b' }));

  await sql`INSERT INTO matches_players_rel ${sql(players, 'match_id', 'player_id', 'team')}`;

  return NextResponse.json(match);
}
