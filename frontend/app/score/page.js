'use client';

import { useState } from 'react';

export default function Score() {
  const [gameType, setGameType] = useState('Doubles');
  const [playToScore, setPlayToScore] = useState(11);
  const [possession, setPossession] = useState('A');
  const [serveCounter, setServeCounter] = useState(1);
  const [aScore, setAScore] = useState(0);
  const [bScore, setBScore] = useState(0);
  const winner = determineWinner(aScore, bScore, playToScore);
  const disabled = winner ? true : false;

  return (
    <div className='container-sm d-flex flex-column mt-1'>
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
      </div>

      {/* Game info */}
      <div className='d-flex flex-column align-items-center'>
        <h3>Playing {gameType} to {!playToScore || playToScore <= 0 ? setPlayToScore(11) : playToScore} points</h3>
        <p style={{ textAlign: 'center', maxWidth: '80%', fontStyle: 'italic' }}>Team <b>{possession}</b> is in posesssion of the ball{gameType === 'Doubles' && <> and has <b>{serveCounter}</b> serve(s)</>}</p>
        <div style={{ minHeight: 100, textAlign: 'center' }}>
          {winner && <p>Team <b>{winner}</b> won! {randomEmoji()}</p>}
          {winner && <button className='btn btn-danger' onClick={() => {
            setAScore(0);
            setBScore(0);
            setPossession('A');
            setServeCounter(1);
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

    </div>
  );
}

function ScoreButton({ team, inPossession, setPossession, serveCounter, setServeCounter, gameType, score, setScore, disabled }) {

  return (
    <>
      <button className={`btn btn-primary btn-lg ${disabled && 'disabled'}`} onClick={() => {
        if (inPossession) {
          setScore(score + 1);
        } else if (gameType === 'Doubles') {
          if (serveCounter === 1) {
            setServeCounter(2);
            setPossession(team);
          } else {
            setServeCounter(serveCounter - 1);
          }
        } else {
          setPossession(team);
        }
      }}>Team {team} score</button>
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