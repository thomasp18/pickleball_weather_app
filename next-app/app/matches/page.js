// Import statements
'use client';
import Error from '@/components/loading-and-error/error';
import Loading from '@/components/loading-and-error/loading';
import useRequest from '@/utils/useRequest';
import '../mobile.css';

// Main component
export default function Main() {
    const { response: matchesDB, error: matchesError, loading: matchesLoading } = useRequest('GET', '/api/matches');

    if (matchesLoading) {
        return <Loading />;
    }

    if (matchesError) {
        return <Error />;
    }

    // Once there're no errors and is done loading, render the match data
    return (
        <div>
            <h1 className='display-1 text-center p-auto m-auto pt-2 title'>Match History</h1>
            <br />
            <MatchData matches={matchesDB} />
        </div>
    );
}

// Displays the match history in a table
function MatchData({ matches }) {
    const reformatted = reformatMatches(matches);

    // Match history table
    return (
        <div className='container' style={{ overflow: 'auto' }}>
            <table className='table text-center'>
                <thead>
                    <tr>
                        <th>Match</th>
                        <th>Date</th>
                        <th className='text-primary'>Team A</th>
                        <th className='text-primary'>Score</th>
                        <th className='text-danger'>Score</th>
                        <th className='text-danger'>Team B</th>
                    </tr>
                </thead>
                <tbody>
                    {reformatted.map((value) => {
                        if (value.match_id) {
                            return (
                                <tr key={value.match_id}>
                                    <td>Game {value.match_id}</td>
                                    <td>{value.mdate}</td>
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

function reformatMatches(matches) {
    const reformat = matches.map((value) => {
        const { teamA, teamB, ...rest } = value;
        const a = value.teamA.map((a) => {
            return a.pname;
        });
        const b = value.teamB.map((b) => {
            return b.pname;
        });
        rest.teamA = a;
        rest.teamB = b;
        return rest;
    });
    return reformat;
}