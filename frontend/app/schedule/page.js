'use client';
import Error from '@/components/loading-and-error/error';
import Loading from '@/components/loading-and-error/loading';
import useRequest from '@/utils/useRequest';
import { Accordion, Button } from 'react-bootstrap';
import '../mobile.css';

export default function Main() {
    const { response: scheduleDB, error: scheduleError, loading: scheduleLoading, refetch } = useRequest('GET', '/api/schedule');
    const { response: matchesDB, error: matchesError, loading: matchesLoading } = useRequest('GET', '/api/matches');

    async function unschedule(id) {
        const url = '/api/schedule';

        try {
            const response = await fetch(url, {
                method: 'DELETE',
                body: JSON.stringify({ id }),
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            refetch();
        } catch (error) {
            console.error(error.message);
        }
    }

    if (scheduleLoading || matchesLoading) {
        return <Loading />;
    }

    if (scheduleError || matchesError) {
        return <Error />;
    }

    return (
        <div>
            <h1 className='display-1 text-center p-auto m-auto pt-2 title'>Schedule</h1>
            <br />
            <ScheduleData schedule={scheduleDB} matches={matchesDB} unschedule={unschedule} />
        </div>
    );
}

function ScheduleData({ schedule, matches, unschedule }) {
    const reformat = reformatMatches(matches);

    return (
        <div className='container pb-5'>
            <Accordion >
                {schedule.map((sval) => {
                    const unscheduleID = () => { unschedule(sval.id); };
                    const scheddate = new Date(sval.sdate.slice(0, 10) + 'T00:00:00.000-05:00').toDateString();
                    return (
                        <Accordion.Item key={sval.id} eventKey={sval.id - 1}>
                            <Accordion.Header>{scheddate}</Accordion.Header>
                            <Accordion.Body>
                                <table className='table text-center'>
                                    <thead>
                                        <tr>
                                            <th>Match</th>
                                            <th className='text-primary'>Team A</th>
                                            <th className='text-primary'>Score</th>
                                            <th className='text-danger'>Score</th>
                                            <th className='text-danger'>Team B</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reformat.map((mval) => {
                                            if (mval.mdate === scheddate) {
                                                return (
                                                    <tr key={mval.match_id}>
                                                        <td>Game {mval.match_id}</td>
                                                        <td>{mval.teamA.join(', ')}</td>
                                                        <td>{mval.ascore}</td>
                                                        <td>{mval.bscore}</td>
                                                        <td>{mval.teamB.join(', ')}</td>
                                                    </tr>
                                                );
                                            }
                                        })}
                                    </tbody>
                                </table>
                                <div className='text-end'>
                                    <Button variant='danger' size="lg" onClick={unscheduleID}><i className='bi bi-trash-fill'></i></Button>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
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