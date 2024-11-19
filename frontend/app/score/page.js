'use client';

import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

export default function Score() {
  const [gameType, setGameType] = useState('Doubles');
  const [playToScore, setPlayToScore] = useState(11);
  const [possession, setPossession] = useState('A');
  const [serveCounter, setServeCounter] = useState(2);
  const [aScore, setAScore] = useState(0);
  const [bScore, setBScore] = useState(0);
  const winner = determineWinner(aScore, bScore, playToScore);
  const disabled = winner ? true : false;

  function resetGame() {
    setAScore(0);
    setBScore(0);
    setPossession('A');
    setServeCounter(2);
  }

  return (
    <div className='container-sm d-flex flex-column'>
      <h1 className='display-3'>Scorekeeper</h1>

      {/* Settings */}
      <div className='mb-5'>
        <label htmlFor='playToScore' className='form-label'>Settings</label>
        <div className='input-group'>
          <input onChange={(event) => setPlayToScore(event.target.value)} type='number' className='form-control' id='playToScore' placeholder='11' disabled={disabled && true} />
          <span className='input-group-text'>points</span>
        </div>
        <div className='form-text mb-2' id='basic-addon4'>How many points would you like to play to?</div>
        <div className='btn-group btn-group-sm' role='group'>
          <input onChange={() => setGameType('Singles')} type='radio' className='btn-check' id='singles' autoComplete='off' name='gameType' />
          <label className={`btn btn-outline-primary ${disabled && 'disabled'}`} htmlFor='singles'>Play Singles</label>
          <input onChange={() => setGameType('Doubles')} type='radio' className='btn-check' id='doubles' autoComplete='off' name='gameType' defaultChecked={gameType} />
          <label className={`btn btn-outline-primary ${disabled && 'disabled'}`} htmlFor='doubles'>Play Doubles</label>
        </div>
        <select className='form-select' multiple defaultValue={['default']}>
          <option value='default' disabled>Open this select menu</option>
          <option value='1'>One</option>
          <option value='2'>Two</option>
          <option value='3'>Three</option>
        </select>
      </div>

      {/* Game info */}
      <div className='d-flex flex-column align-items-center'>
        <h3>Playing {gameType} to {!playToScore || playToScore <= 0 ? setPlayToScore(11) : playToScore} points</h3>
        <div style={{ minHeight: 150, textAlign: 'center' }}>
          <p style={{ textAlign: 'center', fontStyle: 'italic' }}><b className={possession === 'A' ? 'text-primary' : 'text-danger'}>Team {possession}</b> is in posesssion of the ball{gameType === 'Doubles' && <> and <br /> is on serve <b>{serveCounter}</b></>}</p>
          {winner && <p>Team <b>{winner}</b> won! {randomEmoji()}</p>}
          {winner && <button className='btn btn-danger' onClick={() => {
            resetGame();
          }}>Reset game</button>}
        </div>
      </div>

      {/* Score + buttons */}
      <div className='d-flex flex-row justify-content-evenly'>
        <div>
          <p style={{ textAlign: 'center' }} className='display-3'>{aScore}</p>
          <ScoreButton
            team={'A'}
            inPossession={possession === 'A'}
            setPossession={setPossession}
            serveCounter={serveCounter}
            setServeCounter={setServeCounter}
            gameType={gameType}
            score={aScore}
            setScore={setAScore}
            disabled={disabled}
          />
        </div>
        <div>
          <p style={{ textAlign: 'center' }} className='display-3'>{bScore}</p>
          <ScoreButton
            team={'B'}
            inPossession={possession === 'B'}
            setPossession={setPossession}
            serveCounter={serveCounter}
            setServeCounter={setServeCounter}
            gameType={gameType}
            score={bScore}
            setScore={setBScore}
            disabled={disabled}
          />
        </div>
      </div>

      {/* Modal */}
      <WinnerModal winner={winner} resetGame={resetGame} />

    </div>
  );
}

function ScoreButton({ team, inPossession, setPossession, serveCounter, setServeCounter, gameType, score, setScore, disabled }) {
  return (
    <>
      <button className={`btn btn-lg ${team === 'A' ? 'btn-primary' : 'btn-danger'} ${disabled && 'disabled'}`} onClick={() => {
        if (inPossession) {
          setScore(score + 1);
        } else if (gameType === 'Doubles') {
          if (serveCounter === 2) {
            setServeCounter(1);
            setPossession(team);
          } else {
            setServeCounter(serveCounter + 1);
          }
        } else {
          setPossession(team);
        }
      }}>Team {team} score</button>
    </>
  );
}

function WinnerModal({ winner, resetGame }) {
  const [overrideShow, setOverrideShow] = useState(true);

  useEffect(() => {
    setOverrideShow(true);
  }, [winner]);

  return (
    <>
      <Modal
        show={winner && overrideShow}
        onHide={() => setOverrideShow(false)}
        backdrop='static'
        keyboard={false}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Winner</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <b>Team {winner}</b> won! {randomEmoji()}
        </Modal.Body>
        <Modal.Footer>
          <Button variant='danger' onClick={resetGame}>Reset game</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function determineWinner(aScore, bScore, playToScore) {
  if (aScore >= playToScore && aScore > bScore + 1) {
    return 'A';
  } else if (bScore >= playToScore && bScore > aScore + 1) {
    return 'B';
  } else {
    return null;
  }
}

function randomEmoji() {
  const emojis = ['✨', '🎉', '🎊', '👏'];
  return emojis[Math.floor(Math.random() * emojis.length)];
}