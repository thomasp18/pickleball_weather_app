// Import statements
'use client';
import Error from '@/components/loading-and-error/error';
import Loading from '@/components/loading-and-error/loading';
import useRequest from '@/utils/useRequest';

// Main component
export default function Main() {
  const {
    response: matchesDB,
    error: matchesError,
    loading: matchesLoading,
  } = useRequest('GET', '/api/matches');

  if (matchesLoading) {
    return <Loading />;
  }

  if (matchesError) {
    return <Error />;
  }

  // Once there're no errors and is done loading, render the match data
  return (
    <div>
      <h1 className="display-1 text-center p-auto m-auto pt-2">Match History</h1>
      <br />
      <MatchData matches={matchesDB} />
    </div>
  );
}

// Displays the match history in a table
function MatchData({ matches }) {
  const formattedMatches = formatData(matches);
  // Match history table
  return (
    <div className="container" style={{ overflow: 'auto' }}>
      <table className="table text-center">
        <thead>
          <tr>
            <th>Match</th>
            <th>Date</th>
            <th className="text-primary">Team A</th>
            <th className="text-primary">Score</th>
            <th className="text-danger">Score</th>
            <th className="text-danger">Team B</th>
          </tr>
        </thead>
        <tbody>
          {formattedMatches.map((value) => {
            if (value.match_id) {
              return (
                <tr key={value.match_id}>
                  <td>Game {value.match_id}</td>
                  <td>{value.mdate.toDateString()}</td>
                  <td>{value.teamA.join(', ')}</td>
                  <td>{value.ascore}</td>
                  <td>{value.bscore}</td>
                  <td>{value.teamB.join(', ')}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </div>
  );
}

// Formats the data by condensing each match to 1 line, adding the players and their respective teams, and removing unnecessary information (pname and team).
function formatData(data) {
  let formatted = [];
  let players = { teamA: [], teamB: [] };
  for (let i = 0; i < data.length; i++) {
    const { pname, team, ...rest } = data[i];
    if (team === 'a') {
      players.teamA.push(pname);
    } else {
      players.teamB.push(pname);
    }

    // run this right before match cutover (on the last item in data for a match)
    if (i === data.length - 1 || data[i].match_id !== data[i + 1].match_id) {
      Object.assign(rest, players);
      rest.mdate = new Date(rest.mdate);
      formatted.push(rest);
      players = { teamA: [], teamB: [] };
    }
  }
  return formatted;
}
