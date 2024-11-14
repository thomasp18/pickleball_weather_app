// Import statements
'use client';
import useRequest from '@/utils/useRequest';

// Main component
export default function Main() {
    const { response, error, loading } = useRequest('GET', '/api/matches');

    // Once there're no errors and is done loading, render the match data
    if (!error && !loading) {
        return (
            <div>
                <h1 className='display-1 text-center p-auto m-auto pt-2'>Match History</h1>
                <br />
                <MatchData apiData={response} />
            </div>
        );
    } else {
        console.log(error);
    }
}

// Displays the match history in a table
function MatchData({ apiData }) {
    const newArr = formattedData(apiData);
    // Match history table
    return (
        <div className='container' id='MatchTable'>
            <table className='table text-center'>
                <thead>
                    <tr>
                        <th>Match</th>
                        <th>Date</th>
                        <th className='text-primary'>Team A</th>
                        <th className='text-primary'>Score</th>
                        <th className='text-danger'>Team B</th>
                        <th className='text-danger'>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {newArr.map((value) => {
                        if (value.match_id) {
                            return (
                                <tr key={value.match_id}>
                                    <td>Game {value.match_id}</td>
                                    <td>{value.mdate.toDateString()}</td>
                                    <td>{value.teamA.join(', ')}</td>
                                    <td>{value.ascore}</td>
                                    <td>{value.teamB.join(', ')}</td>
                                    <td>{value.bscore}</td>
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
function formattedData(data) {
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