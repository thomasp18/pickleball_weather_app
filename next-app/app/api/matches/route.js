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
  const matchesData = await sql`
    SELECT match_id, mdate, ascore, bscore, player_id, team, pname
    FROM matches m
    JOIN matches_players_rel mpr on m.id = mpr.match_id
    JOIN players p on mpr.player_id = p.id;
  `;
  const formattedMatchesData = formatMatches(matchesData);
  return NextResponse.json(formattedMatchesData);
}

export async function POST(request) {
  const { date, aScore, bScore, aPlayers, bPlayers } = await request.json();

  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!date || typeof date !== 'string' || !regex.test(date)) {
    return NextResponse.json(
      { error: `${date} must be a non-empty string in format yyyy-mm-dd` },
      { status: 400 },
    );
  }

  if (
    aScore == null ||
    bScore == null ||
    !Number.isInteger(aScore) ||
    !Number.isInteger(bScore) ||
    aScore < 0 ||
    bScore < 0
  ) {
    return NextResponse.json(
      { error: `${aScore} and ${bScore} must be positive integers` },
      { status: 400 },
    );
  }

  if (Math.abs(aScore - bScore) < 2) {
    return NextResponse.json(
      { error: `Difference of ${aScore} and ${bScore} must be greater than or equal to 2` },
      { status: 400 },
    );
  }

  if (
    !aPlayers ||
    !bPlayers ||
    !Array.isArray(aPlayers) ||
    !Array.isArray(bPlayers) ||
    aPlayers.length === 0 ||
    bPlayers.length === 0
  ) {
    return NextResponse.json(
      { error: 'aPlayers and bPlayers must be non-empty arrays' },
      { status: 400 },
    );
  }

  const allPlayers = aPlayers.concat(bPlayers);
  const existingPlayers = await sql`
      SELECT id FROM players
      WHERE id in ${sql(allPlayers)}
    `;
  const allExist = allPlayers.length === existingPlayers.length;

  if (!allExist) {
    return NextResponse.json(
      { error: 'aPlayers and bPlayers must only include existing players' },
      { status: 400 },
    );
  }

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

// Formats the data by condensing each match to 1 line, adding the players and their respective teams, and removing unnecessary information (pname, team, player_id).
function formatMatches(matchData) {
  let formatted = [];
  let players = { teamA: [], teamB: [] };
  for (let i = 0; i < matchData.length; i++) {
    const { pname, team, player_id, ...rest } = matchData[i];
    if (team === 'a') {
      players.teamA.push({ player_id, pname });
    } else {
      players.teamB.push({ player_id, pname });
    }

    if (i === matchData.length - 1 || matchData[i].match_id !== matchData[i + 1].match_id) {
      Object.assign(rest, players);
      rest.mdate = new Date(
        rest.mdate.toISOString().slice(0, 10) + 'T00:00:00.000-05:00',
      ).toDateString();
      formatted.push(rest);
      players = { teamA: [], teamB: [] };
    }
  }
  return formatted;
}
