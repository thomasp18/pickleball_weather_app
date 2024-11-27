'use client';

import Error from '@/components/loading-and-error/error';
import Loading from '@/components/loading-and-error/loading';
import useRequest from '@/utils/useRequest';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

export default function Players() {
  const { response: players, error: playersError, loading: playersLoading, refetch } = useRequest('GET', '/api/players');
  const { response: matches, error: matchesError, loading: matchesLoading } = useRequest('GET', '/api/matches');
  const [playerName, setPlayerName] = useState('');
  const [playerRequested, setPlayerRequested] = useState(null);
  const playerStats = (!playersLoading && !matchesLoading) && calculatePlayerStats(players, matches);

  async function AddPlayer(playerName) {
    if (playerName === '') {
      return;
    }

    const url = '/api/players';
    let duplicate = false;

    players.forEach((player) => {
      const { pname } = player;
      if (pname.toLowerCase() === playerName.toLowerCase()) {
        duplicate = true;
      }
    });

    if (duplicate) {
      setPlayerRequested('error');
      return;
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ 'pname': playerName }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      refetch();
      setPlayerRequested('success');
    } catch (error) {
      console.error(error.message);
    };
  }

  if (playersLoading || matchesLoading) {
    return <Loading />;
  }

  if (playersError || matchesError) {
    return <Error />;
  }

  return <div className='container-sm d-flex flex-column'>
    <h1 className='display-3'>Players</h1>

    {/* Settings */}
    <div>
      <label htmlFor='playerName' className='form-label'>Settings</label>
      <div className='input-group'>
        <input onChange={(event) => {
          let value = event.target.value;
          value = value.replace(/[^A-Za-z]/ig, '');
          setPlayerName(value);
        }} type='text' className='form-control' placeholder='Name' id='playerName' value={playerName} />
        <button className='btn btn-outline-secondary' type='button' onClick={() => AddPlayer(playerName)}>Add player</button>
      </div>
      <div className='form-text mb-2'>Add a new player?</div>
    </div>

    {/* Table */}
    <div>
      <table className='table'>
        <thead>
          <tr>
            <th scope='col'>Name</th>
            <th scope='col'>Win Rate</th>
          </tr>
        </thead>
        <tbody>
          <PlayerData players={players} playerStats={playerStats} />
        </tbody>
      </table>
    </div>

    {/* Modal */}
    <PlayerModal playerName={playerName} setPlayerName={setPlayerName} playerRequested={playerRequested} setPlayerRequested={setPlayerRequested} />

  </div>;
}

function calculatePlayerStats(players, matches) {
  const playerStats = {};

  players.forEach(({ id, pname }) => {
    if (!playerStats[id]) {
      playerStats[id] = { name: pname, wins: 0, matches: 0, winrate: 0, titles: [] };
    }
  });

  function calculateWinRate(id, winner, loser) {
    const player = playerStats[id];
    player.matches += 1;
    if (winner > loser) {
      player.wins += 1;
    }
  }

  matches.forEach(({ teamA, teamB, ascore, bscore }) => {
    teamA.forEach(({ player_id }) => {
      calculateWinRate(player_id, ascore, bscore);
    });
    teamB.forEach(({ player_id }) => {
      calculateWinRate(player_id, bscore, ascore);
    });
  });

  for (const p in playerStats) {
    const player = playerStats[p];
    player.winrate = player.wins / player.matches;
    if (isNaN(player.winrate)) player.winrate = 'N/A';
    if (player.matches < 5) player.titles.push('Sprout');
    if (player.matches > 30) player.titles.push('Veteran');
    if (player.matches > 100) player.titles.push('Legend');
    if (player.winrate >= 0.75) player.titles.push('Farmer');
  }

  return playerStats;
}


function PlayerData({ players, playerStats }) {
  const titleColors = {
    Sprout: 'text-bg-success',
    Veteran: 'text-bg-secondary',
    Legend: 'text-bg-primary',
    Farmer: 'text-bg-danger'
  };

  const titleTooltips = {
    Sprout: 'New (matches < 5)',
    Veteran: 'Seasoned (matches > 30)',
    Legend: 'Master (matches > 100)',
    Farmer: 'Bully (win rate > 75%)'
  };

  return (
    players.map(({ id, pname }) => (
      <tr key={id}>
        <td>
          {pname}
          {playerStats[id].titles.map((title, index) => (
            <OverlayTrigger
              key={index}
              overlay={<Tooltip id={`tooltip-${title}`} style={{ fontSize: '12px' }}>{titleTooltips[title]}</Tooltip>}
            >
              <span className={`badge rounded-pill ${titleColors[title]} ms-2`}>{title}</span>
            </OverlayTrigger>
          ))}
        </td>
        <td>
          {playerStats[id].winrate.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2 })}
          <span style={{ fontSize: '12px' }}> ({playerStats[id].wins}/{playerStats[id].matches})
          </span>
        </td>
      </tr>
    ))
  );
}


function PlayerModal({ playerName, setPlayerName, playerRequested, setPlayerRequested }) {
  return (
    <Modal
      show={playerRequested}
      onHide={() => {
        setPlayerRequested(null);
        setPlayerName('');
      }}
      keyboard={true}
      centered>
      <Modal.Header closeButton>
        <Modal.Title id='contained-modal-title-vcenter'>
          {playerRequested === 'success' ? 'Success' : 'Error'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {playerRequested === 'success' ? <p><b>{playerName}</b> was added to the player list!</p> : <p><b>{playerName}</b> is non-unique! Use a different name.</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => {
          setPlayerRequested(null);
          setPlayerName('');
        }}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}