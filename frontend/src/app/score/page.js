'use client'

import { useState } from 'react';

export default function Score() {
  const [gameType, setGameType] = useState('Doubles');
  const [playToScore, setPlayToScore] = useState(11);
  const [possession, setPossession] = useState('A');
  const [serveCounter, setServeCounter] = useState(1);
  const [aScore, setAScore] = useState(0);
  const [bScore, setBScore] = useState(0);
  const winner = determineWinner(aScore, bScore, playToScore);

  return (
    <div>
      <label>Play to: </label>
      <input onChange={(event) => setPlayToScore(event.target.value)} type='number' />
      <br />
      <button onClick={() => setGameType('Singles')}>Play Singles</button>
      <br />
      <button onClick={() => setGameType('Doubles')}>Play Doubles</button>
      <br /><br />
      <h1>Playing {gameType} to {!playToScore || playToScore <= 0 ? setPlayToScore(11) : playToScore} points</h1>
      <br />
      {winner && <p>Winner: {winner}</p>}
      {winner && <button onClick={() => {
        setAScore(0);
        setBScore(0);
        setPossession('A');
        setServeCounter(1);
      }}>Reset game</button>}
      <br />
      <br />
      <p>Team {possession} is in posesssion of the ball{gameType === 'Doubles' && ` and has ${serveCounter} serve(s)`}</p>
      <ScoreButton
        team={'A'}
        inPossession={possession === 'A'}
        setPossession={winner ? () => { } : setPossession}
        serveCounter={serveCounter}
        setServeCounter={winner ? () => { } : setServeCounter}
        gameType={gameType}
        score={aScore}
        setScore={winner ? () => { } : setAScore}
      />
      <ScoreButton
        team={'B'}
        inPossession={possession === 'B'}
        setPossession={winner ? () => { } : setPossession}
        serveCounter={serveCounter}
        setServeCounter={winner ? () => { } : setServeCounter}
        gameType={gameType}
        score={bScore}
        setScore={winner ? () => { } : setBScore}
      />
    </div>
  );
}

function ScoreButton({ team, inPossession, setPossession, serveCounter, setServeCounter, gameType, score, setScore }) {

  return (
    <>
      <p>{score}</p>
      <button onClick={() => {
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
      }}>Team {team} button</button>
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