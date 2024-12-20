'use client';
import { default as ErrorComponent } from '@/components/loading-and-error/error';
import Loading from '@/components/loading-and-error/loading';
import useRequest from '@/utils/useRequest';
import { useState } from 'react';
import { Accordion, Button, Modal } from 'react-bootstrap';
import '../mobile.css';

export default function Main() {
  const {
    response: scheduleDB,
    error: scheduleError,
    loading: scheduleLoading,
    refetch,
  } = useRequest('GET', '/api/schedule');
  const {
    response: matchesDB,
    error: matchesError,
    loading: matchesLoading,
  } = useRequest('GET', '/api/matches');

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
    return <ErrorComponent />;
  }

  return (
    <div>
      <h1 className="display-1 text-center p-auto m-auto pt-2 title">Schedule</h1>
      <br />
      <ScheduleData schedule={scheduleDB} matches={matchesDB} unschedule={unschedule} />
      {/* <ConfirmationModal></ConfirmationModal> */}
    </div>
  );
}

function ScheduleData({ schedule, matches, unschedule }) {
  const reformat = reformatMatches(matches);
  const revSchedule = schedule.toReversed();

  if (revSchedule.length > 0) {
    return (
      <div className="container pb-5">
        <Accordion defaultActiveKey={revSchedule[0].id.toString()}>
          {revSchedule.map((schedule) => {
            const { id } = schedule;
            const scheddate = new Date(
              schedule.sdate.slice(0, 10) + 'T00:00:00.000-05:00',
            ).toDateString();

            return (
              <div key={id}>
                <Accordion.Item eventKey={id.toString()}>
                  <Accordion.Header>{scheddate}</Accordion.Header>
                  <Accordion.Body>
                    <div>{matchesTable(reformat, scheddate)}</div>
                    <div className="text-end">
                      <ConfirmationModal
                        unscheduleID={() => unschedule(id)}
                        unscheduledDate={scheddate}
                      />
                    </div>
                  </Accordion.Body>
                </Accordion.Item>
              </div>
            );
          })}
        </Accordion>
      </div>
    );
  } else {
    return (
      <div className="text-center">
        <p>No scheduled dates found</p>
      </div>
    );
  }
}

function reformatMatches(matches) {
  const reformat = matches.map((match) => {
    const { teamA, teamB, ...rest } = match;
    const a = match.teamA.map((a) => {
      return a.pname;
    });
    const b = match.teamB.map((b) => {
      return b.pname;
    });
    rest.teamA = a;
    rest.teamB = b;
    return rest;
  });
  return reformat;
}

function matchesTable(matchesArr, scheduleDate) {
  let matchesTable = [];
  for (let i = 0; i < matchesArr.length; i++) {
    if (matchesArr[i].mdate === scheduleDate) {
      matchesTable.push(matchesArr[i]);
    }
  }
  if (matchesTable.length > 0) {
    return (
      <table className="table text-center">
        <thead>
          <tr>
            <th>#</th>
            <th className="text-primary">Team A</th>
            <th>Score</th>
            <th className="text-danger">Team B</th>
          </tr>
        </thead>
        <tbody>
          {matchesTable.map((matches) => {
            const { match_id } = matches;
            return (
              <tr key={match_id}>
                <td>{match_id}</td>
                <td>{matches.teamA.join(', ')}</td>
                <td>
                  {matches.ascore} &ndash; {matches.bscore}
                </td>
                <td>{matches.teamB.join(', ')}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  } else {
    return <p>No match data found.</p>;
  }
}

function ConfirmationModal({ unscheduleID, unscheduledDate }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const handleClose = () => setShowDeleteModal(false);
  const handleShow = () => setShowDeleteModal(true);
  return (
    <>
      <Button variant="danger" onClick={handleShow}>
        <i className="bi bi-trash-fill"></i>
      </Button>

      <Modal show={showDeleteModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the date: <b>&quot;{unscheduledDate}&quot;</b>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              unscheduleID();
              handleClose();
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
