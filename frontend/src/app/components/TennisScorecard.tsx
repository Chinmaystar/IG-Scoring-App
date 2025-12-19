import React from "react";
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, RotateCcw } from 'lucide-react';

type TennisScore = 0 | 15 | 30 | 40 | 'AD';

export function TennisScorecard() {
  const [player1, setPlayer1] = useState({ 
    name: 'Player 1', 
    points: 0 as TennisScore, 
    games: 0, 
    sets: 0 
  });
  const [player2, setPlayer2] = useState({ 
    name: 'Player 2', 
    points: 0 as TennisScore, 
    games: 0, 
    sets: 0 
  });
  const [server, setServer] = useState<1 | 2>(1);
  const [isDeuce, setIsDeuce] = useState(false);
  const [setHistory, setSetHistory] = useState<{ player1: number; player2: number }[]>([]);

  const getNextScore = (current: TennisScore): TennisScore => {
    if (current === 0) return 15;
    if (current === 15) return 30;
    if (current === 30) return 40;
    return 40;
  };

  const addPoint = (player: 1 | 2) => {
    const currentPlayer = player === 1 ? player1 : player2;
    const otherPlayer = player === 1 ? player2 : player1;

    // Handle deuce and advantage
    if (currentPlayer.points === 40 && otherPlayer.points === 40) {
      setIsDeuce(true);
      if (player === 1) {
        setPlayer1(prev => ({ ...prev, points: 'AD' }));
      } else {
        setPlayer2(prev => ({ ...prev, points: 'AD' }));
      }
      return;
    }

    if (isDeuce) {
      if (currentPlayer.points === 'AD') {
        // Win the game
        winGame(player);
        return;
      } else if (otherPlayer.points === 'AD') {
        // Back to deuce
        setPlayer1(prev => ({ ...prev, points: 40 }));
        setPlayer2(prev => ({ ...prev, points: 40 }));
        return;
      }
    }

    // Regular scoring
    if (currentPlayer.points === 40 && otherPlayer.points !== 40) {
      // Win the game
      winGame(player);
      return;
    }

    // Add point
    if (player === 1) {
      setPlayer1(prev => ({ ...prev, points: getNextScore(prev.points) }));
    } else {
      setPlayer2(prev => ({ ...prev, points: getNextScore(prev.points) }));
    }
  };

  const winGame = (player: 1 | 2) => {
    const newGames1 = player === 1 ? player1.games + 1 : player1.games;
    const newGames2 = player === 2 ? player2.games + 1 : player2.games;

    // Reset points
    setPlayer1(prev => ({ ...prev, points: 0, games: newGames1 }));
    setPlayer2(prev => ({ ...prev, points: 0, games: newGames2 }));
    setIsDeuce(false);
    setServer(prev => prev === 1 ? 2 : 1);

    // Check if set is won (need 6 games with 2 game lead, or win tiebreak at 7-6)
    if (newGames1 >= 6 && newGames1 - newGames2 >= 2) {
      winSet(1);
    } else if (newGames2 >= 6 && newGames2 - newGames1 >= 2) {
      winSet(2);
    }
  };

  const winSet = (player: 1 | 2) => {
    setSetHistory(prev => [...prev, { player1: player1.games, player2: player2.games }]);
    
    if (player === 1) {
      setPlayer1(prev => ({ ...prev, sets: prev.sets + 1, games: 0 }));
      setPlayer2(prev => ({ ...prev, games: 0 }));
    } else {
      setPlayer2(prev => ({ ...prev, sets: prev.sets + 1, games: 0 }));
      setPlayer1(prev => ({ ...prev, games: 0 }));
    }
  };

  const resetMatch = () => {
    setPlayer1({ name: 'Player 1', points: 0, games: 0, sets: 0 });
    setPlayer2({ name: 'Player 2', points: 0, games: 0, sets: 0 });
    setServer(1);
    setIsDeuce(false);
    setSetHistory([]);
  };

  const displayScore = (points: TennisScore) => {
    if (points === 'AD') return 'AD';
    return points;
  };

  return (
    <div className="space-y-6">
      {/* Current Game Score */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className={server === 1 ? 'ring-2 ring-green-500' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{player1.name}</span>
              {server === 1 && <span className="text-sm text-green-500">Serving</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl">{displayScore(player1.points)}</div>
            <div className="text-muted-foreground mt-2">
              Games: {player1.games} | Sets: {player1.sets}
            </div>
            <Button onClick={() => addPoint(1)} className="w-full mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Point Won
            </Button>
          </CardContent>
        </Card>

        <Card className={server === 2 ? 'ring-2 ring-green-500' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{player2.name}</span>
              {server === 2 && <span className="text-sm text-green-500">Serving</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl">{displayScore(player2.points)}</div>
            <div className="text-muted-foreground mt-2">
              Games: {player2.games} | Sets: {player2.sets}
            </div>
            <Button onClick={() => addPoint(2)} className="w-full mt-4">
              <Plus className="h-4 w-4 mr-2" />
              Point Won
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Set */}
      <Card>
        <CardHeader>
          <CardTitle>Current Set</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-8 text-center">
            <div>
              <div className="text-muted-foreground">{player1.name}</div>
              <div className="text-4xl mt-2">{player1.games}</div>
            </div>
            <div>
              <div className="text-muted-foreground">{player2.name}</div>
              <div className="text-4xl mt-2">{player2.games}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Set History */}
      {setHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Set History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {setHistory.map((set, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span>Set {idx + 1}</span>
                  <span className="text-xl">
                    {set.player1} - {set.player2}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Match Info */}
      <Card>
        <CardHeader>
          <CardTitle>Match Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-4xl">
            {player1.sets} - {player2.sets}
          </div>
          <div className="text-center text-muted-foreground mt-2">Sets</div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Match Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={resetMatch} variant="destructive" className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Match
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
