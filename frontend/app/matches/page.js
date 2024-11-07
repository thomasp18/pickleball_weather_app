// Import statements
'use client';
import useRequest from '@/utils/useRequest';

// Main component
export default function Main() {
    const { response, error, loading } = useRequest('GET', '/api/matches');

    // Once there're no errors and is done loading, render the match data
    if (!error && !loading) {
        const players = getPlayers(response);
        return (
            <div>
                <h1 className='display-1 text-center p-auto m-auto pt-2'>Match History</h1>
                <br />
                <MatchData apiData={response} players={players} />
            </div>
        );
    } else {
        console.log(error);
    }
}

// Displays the match history in a table
function MatchData({ apiData, players }) {
    let newArr = condenseData(apiData);

    // Match history table
    return (
        <>
            <div className='container-lg'>
                <table className='table text-center'>
                    <thead>
                        <tr>
                            <td>Match</td>
                            <td>Date</td>
                            <td className='text-primary'>Team A</td>
                            <td className='text-primary'>Score</td>
                            <td className='text-danger'>Team B</td>
                            <td className='text-danger'>Score</td>
                        </tr>
                    </thead>
                    <tbody>
                        {newArr.map((value, index) => {
                            let apiDate = new Date(value.mdate);
                            if (value.match_id) {
                                return (
                                    <tr key={value.match_id}>
                                        <td>Game {value.match_id}</td>
                                        <td>{apiDate.toDateString()}</td>
                                        <td>{players[index].teamA.join(', ')}</td>
                                        <td>{value.ascore}</td>
                                        <td>{players[index].teamB.join(', ')}</td>
                                        <td>{value.bscore}</td>
                                    </tr>
                                );
                            }
                        })}
                    </tbody>
                </table>
            </div>
        </>
    );
}

// Condenses the API data by match ID to avoid duplicate rows
function condenseData(data) {
    let condensed = [];
    for (let i = 0; i < data.length; i++) {
        if (data[i - 1] === undefined) {
            condensed.push(data[i]);
        } else {
            if (data[i].match_id !== data[i - 1].match_id) {
                condensed.push(data[i]);
            }
        }
    };
    return condensed;
}

// Gets the players on either team per match
function getPlayers(apiData) {
    let newArr = condenseData(apiData);
    let players = {};
    for (let i = 0; i < newArr.length; i++) {
        players[i] = { teamA: [], teamB: [] };
        for (let j = 0; j < apiData.length; j++) {
            if (apiData[j].match_id === (i + 1)) {
                if (apiData[j].team === 'a') {
                    players[i].teamA.push(apiData[j].pname);
                } else if (apiData[j].team === 'b') {
                    players[i].teamB.push(apiData[j].pname);
                }
            }
        }
    }
    return players;
}