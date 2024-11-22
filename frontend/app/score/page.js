'use client';

import { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './page.css';

export default function Score() {
  const [gameType, setGameType] = useState('Doubles');
  const [playToScore, setPlayToScore] = useState(11);
  const [possession, setPossession] = useState('A');
  const [serveCounter, setServeCounter] = useState(2);
  const [aScore, setAScore] = useState(0);
  const [bScore, setBScore] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
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
      <div className='d-flex flex-column page justify-content-evenly align-items-center'>

        {/* Game info */}
        <div>
          <h3>Playing {gameType} to {!playToScore || playToScore <= 0 ? setPlayToScore(11) : playToScore} points</h3>
          <p className='text-center fst-italic'><b className={possession === 'A' ? 'text-primary' : 'text-danger'}>Team {possession}</b> is in posesssion of the ball{gameType === 'Doubles' && <> and <br /> is on serve <b>{serveCounter}</b></>}</p>
        </div>

        {/* Winner card */}
        {winner ? <div className='card w-75'>
          <div className='card-header'>
            Winner
          </div>
          <div className='card-body d-flex flex-column align-items-center'>
            <p className='card-text'>Team <b>{winner}</b> won! {randomEmoji()}</p>
            <button className='btn btn-danger btn-sm' onClick={() => {
              resetGame();
            }}>Reset game</button>
          </div>
        </div> : <div style={{ minHeight: '145px' }}></div>}

        {/* Score + buttons */}
        <div className='d-flex flex-row'>
          <div>
            <p className='display-3 text-center'>{aScore}</p>
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
            <p className='display-3 text-center'>{bScore}</p>
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

      </div>

      {/* Settings */}
      <div style={{ position: 'absolute', bottom: '70px', right: '20px' }}>
        <button type='button' className='btn btn-secondary' onClick={() => setShowSettings(true)}>Settings</button>
      </div>


      {/* Modals */}
      <SettingsModal showSettings={showSettings} setShowSettings={setShowSettings} setPlayToScore={setPlayToScore} disabled={disabled} setGameType={setGameType} gameType={gameType} />
      <WinnerModal winner={winner} resetGame={resetGame} />
    </div>
  );
}

function ScoreButton({ team, inPossession, setPossession, serveCounter, setServeCounter, gameType, score, setScore, disabled }) {
  return (
    <>
      <button className={`mx-2 btn btn-lg ${team === 'A' ? 'btn-primary' : 'btn-danger'} ${disabled && 'disabled'}`} onClick={() => {
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

function PlayerSelect({ team, disabled }) {
  return (
    <div className='input-group mb-2'>
      <label className='input-group-text'>Team {team}</label>
      <select className='form-select form-select-sm' multiple disabled={disabled}>
        <option value='1'>One</option>
        <option value='2'>Two</option>
        <option value='3'>Three</option>
      </select>
    </div>
  );
}

function SettingsModal({ showSettings, setShowSettings, setPlayToScore, disabled, setGameType, gameType }) {
  return (
    <>
      <Modal
        show={showSettings}
        onHide={() => setShowSettings(false)}
        centered>
        <Modal.Header closeButton>
          <Modal.Title>Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <label class='form-label'>Game Rules</label>
            <div className='input-group mb-2'>
              <input onChange={(event) => setPlayToScore(event.target.value)} type='number' className='form-control' placeholder='11' disabled={disabled && true} />
              <span className='input-group-text'>points</span>
            </div>
            <div className='btn-group btn-group-sm mb-2'>
              <input onChange={() => setGameType('Singles')} type='radio' className='btn-check' id='singles' autoComplete='off' name='gameType' />
              <label className={`btn btn-outline-primary ${disabled && 'disabled'}`} htmlFor='singles'>Play Singles</label>
              <input onChange={() => setGameType('Doubles')} type='radio' className='btn-check' id='doubles' autoComplete='off' name='gameType' defaultChecked={gameType} />
              <label className={`btn btn-outline-primary ${disabled && 'disabled'}`} htmlFor='doubles'>Play Doubles</label>
            </div>
            <div>
              <label class='form-label'>Players</label>
              <PlayerSelect team={'A'} disabled={disabled} />
              <PlayerSelect team={'B'} disabled={disabled} />
            </div>
          </div>
        </Modal.Body>
      </Modal>
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