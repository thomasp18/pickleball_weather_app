import { NextResponse } from 'next/server';
import postgres from 'postgres';

const sql = postgres('postgresql://piko:pikopw@localhost:5432/piko-db?ssl=false', {
    idle_timeout: 20,
    max_lifetime: 60 * 30
});

export async function GET() {
    const matchesData = await sql`select match_id, mdate, ascore, bscore, player_id, team, pname
        from matches m
        join matches_players_rel mpr on m.id = mpr.match_id
        join players p on mpr.player_id = p.id;`;
    const formattedMatchesData = formatMatches(matchesData);
    return NextResponse.json(formattedMatchesData);
}

// Formats the data by condensing each match to 1 line, adding the players and their respective teams, and removing unnecessary information (pname, team, player_id).
function formatMatches(matchData) {
    let formatted = [];
    let players = { teamA: [], teamB: [] };
    for (let i = 0; i < matchData.length; i++) {
        const { pname, team, player_id, ...rest } = matchData[i];
        if (team === 'a') {
            players.teamA.push(pname);
        } else {
            players.teamB.push(pname);
        }

        // run this right before match cutover (on the last item in data for a match)
        if (i === matchData.length - 1 || matchData[i].match_id !== matchData[i + 1].match_id) {
            Object.assign(rest, players);
            rest.mdate = new Date(rest.mdate).toDateString();
            formatted.push(rest);
            players = { teamA: [], teamB: [] };
        }
    }
    return formatted;
}