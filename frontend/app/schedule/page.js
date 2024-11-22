'use client';
import Error from '@/components/loading-and-error/error';
import Loading from '@/components/loading-and-error/loading';
import useRequest from '@/utils/useRequest';
import { Accordion } from 'react-bootstrap';

export default function Main() {
    const { response: scheduleDB, error: scheduleError, loading: scheduleLoading } = useRequest('GET', '/api/schedule');
    const { response: matchesDB, error: matchesError, loading: matchesLoading } = useRequest('GET', '/api/matches');

    if (scheduleLoading || matchesLoading) {
        return <Loading />;
    }

    if (scheduleError || matchesError) {
        return <Error />;
    }

    return (
        <div>
            <h1 className='display-1 text-center p-auto m-auto pt-2'>Schedule</h1>
            <br />
            <ScheduleData schedule={scheduleDB} matches={matchesDB} />
        </div>
    );
}

function ScheduleData({ schedule, matches }) {
    return (
        <div className='container'>
            <Accordion >
                {schedule.map((value) => {
                    let scheddate = new Date(value.sdate);
                    return (
                        <Accordion.Item key={value.id} eventKey={value.id - 1}>
                            <Accordion.Header>{scheddate.toDateString()}</Accordion.Header>
                            <Accordion.Body>
                                {/* TODO */}
                            </Accordion.Body>
                        </Accordion.Item>
                    );
                })}
            </Accordion>
        </div>
    );
}

