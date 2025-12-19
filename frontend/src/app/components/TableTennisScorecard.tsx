import React from "react";
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export function TableTennisScorecard() {
  const [player1, setPlayer1] = useState({ name: 'Player 1', score: 0, sets: 0 });
  const [player2, setPlayer2] = useState({ name: 'Player 2', score: 0, sets: 0 });
  const [currentSet, setCurrentSet] = useState(1);
  const [server, setServer] = useState<1 | 2>(1);
  const [pointsPlayed, setPointsPlayed] = useState(0);

  const addPoint = (player: 1 | 2) => {
    const winningScore = 11;
    const minLead = 2;

    if (player === 1) {
      const newScore = player1.score + 1;
      setPlayer1(prev => ({ ...prev, score: newScore }));

      // Check if player 1 wins the set
      if (newScore >= winningScore && newScore - player2.score >= minLead) {
        setPlayer1(prev => ({ ...prev, sets: prev.sets + 1, score: 0 }));
        setPlayer2(prev => ({ ...prev, score: 0 }));
        setCurrentSet(prev => prev + 1);
        setPointsPlayed(0);
        return;
      }
    } else {
      const newScore = player2.score + 1;
      setPlayer2(prev => ({ ...prev, score: newScore }));

      // Check if player 2 wins the set
      if (newScore >= winningScore && newScore - player1.score >= minLead) {
        setPlayer2(prev => ({ ...prev, sets: prev.sets + 1, score: 0 }));
        setPlayer1(prev => ({ ...prev, score: 0 }));
        setCurrentSet(prev => prev + 1);
        setPointsPlayed(0);
        return;
      }
    }

    // Switch server every 2 points (or every point after 10-10)
    const newPointsPlayed = pointsPlayed + 1;
    setPointsPlayed(newPointsPlayed);
    
    const isDeuce = player1.score >= 10 && player2.score >= 10;
    const switchInterval = isDeuce ? 1 : 2;
    
    if (newPointsPlayed % switchInterval === 0) {
      setServer(prev => prev === 1 ? 2 : 1);
    }
  };

  const removePoint = (player: 1 | 2) => {
    if (player === 1 && player1.score > 0) {
      setPlayer1(prev => ({ ...prev, score: prev.score - 1 }));
      setPointsPlayed(prev => Math.max(0, prev - 1));
    } else if (player === 2 && player2.score > 0) {
      setPlayer2(prev => ({ ...prev, score: prev.score - 1 }));
      setPointsPlayed(prev => Math.max(0, prev - 1));
    }
  };

  const resetMatch = () => {
    setPlayer1({ name: 'Player 1', score: 0, sets: 0 });
    setPlayer2({ name: 'Player 2', score: 0, sets: 0 });
    setCurrentSet(1);
    setServer(1);
    setPointsPlayed(0);
  };

  const resetCurrentSet = () => {
    setPlayer1(prev => ({ ...prev, score: 0 }));
    setPlayer2(prev => ({ ...prev, score: 0 }));
    setPointsPlayed(0);
  };

  return (
    <div className="space-y-6">
      {/* Current Set Score */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className={server === 1 ? 'ring-2 ring-green-500' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{player1.name}</span>
              {server === 1 && <span className="text-sm text-green-500">Serving</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl">{player1.score}</div>
            <div className="text-muted-foreground mt-2">
              Sets Won: {player1.sets}
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => addPoint(1)} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Point
              </Button>
              <Button onClick={() => removePoint(1)} variant="outline" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
            </div>
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
            <div className="text-6xl">{player2.score}</div>
            <div className="text-muted-foreground mt-2">
              Sets Won: {player2.sets}
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => addPoint(2)} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Point
              </Button>
              <Button onClick={() => removePoint(2)} variant="outline" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Match Info */}
      <Card>
        <CardHeader>
          <CardTitle>Match Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl">{currentSet}</div>
              <div className="text-sm text-muted-foreground">Current Set</div>
            </div>
            <div>
              <div className="text-2xl">{player1.sets} - {player2.sets}</div>
              <div className="text-sm text-muted-foreground">Sets Score</div>
            </div>
            <div>
              <div className="text-2xl">{pointsPlayed}</div>
              <div className="text-sm text-muted-foreground">Points in Set</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Match Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={resetCurrentSet} variant="outline">
              Reset Current Set
            </Button>
            <Button onClick={resetMatch} variant="destructive">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Match
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
