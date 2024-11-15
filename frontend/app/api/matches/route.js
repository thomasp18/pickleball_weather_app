import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres('postgresql://piko:pikopw@localhost:5432/piko-db?ssl=false', {
    idle_timeout: 20,
    max_lifetime: 60 * 30
});

export async function GET() {
    return NextResponse.json(await sql`
        select match_id, mdate, ascore, bscore, player_id, team, pname
        from matches m
        join matches_players_rel mpr on m.id = mpr.match_id
        join players p on mpr.player_id = p.id;
    `);
}
