import React from "react";
import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export function CricketScorecard() {
  const [team1, setTeam1] = useState({ name: 'Team A', runs: 0, wickets: 0, overs: 0, balls: 0 });
  const [team2, setTeam2] = useState({ name: 'Team B', runs: 0, wickets: 0, overs: 0, balls: 0 });
  const [currentInnings, setCurrentInnings] = useState<1 | 2>(1);
  const [recentBalls, setRecentBalls] = useState<(number | string)[]>([]);

  const currentTeam = currentInnings === 1 ? team1 : team2;
  const setCurrentTeam = currentInnings === 1 ? setTeam1 : setTeam2;

  const addRuns = (runs: number) => {
    setCurrentTeam(prev => {
      const newBalls = prev.balls + 1;
      const newOvers = prev.overs + Math.floor(newBalls / 6);
      const remainingBalls = newBalls % 6;

      return {
        ...prev,
        runs: prev.runs + runs,
        balls: remainingBalls,
        overs: newOvers
      };
    });
    setRecentBalls(prev => [...prev.slice(-5), runs]);
  };

  const addWicket = () => {
    setCurrentTeam(prev => {
      if (prev.wickets >= 10) return prev;
      
      const newBalls = prev.balls + 1;
      const newOvers = prev.overs + Math.floor(newBalls / 6);
      const remainingBalls = newBalls % 6;

      return {
        ...prev,
        wickets: prev.wickets + 1,
        balls: remainingBalls,
        overs: newOvers
      };
    });
    setRecentBalls(prev => [...prev.slice(-5), 'W']);
  };

  const addExtra = (type: 'wide' | 'noBall') => {
    setCurrentTeam(prev => ({
      ...prev,
      runs: prev.runs + 1
    }));
    setRecentBalls(prev => [...prev.slice(-5), type === 'wide' ? 'Wd' : 'Nb']);
  };

  const resetMatch = () => {
    setTeam1({ name: 'Team A', runs: 0, wickets: 0, overs: 0, balls: 0 });
    setTeam2({ name: 'Team B', runs: 0, wickets: 0, overs: 0, balls: 0 });
    setCurrentInnings(1);
    setRecentBalls([]);
  };

  const switchInnings = () => {
    setCurrentInnings(prev => prev === 1 ? 2 : 1);
    setRecentBalls([]);
  };

  return (
    <div className="space-y-6">
      {/* Scoreboard */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className={currentInnings === 1 ? 'ring-2 ring-blue-500' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{team1.name}</span>
              {currentInnings === 1 && <span className="text-sm text-blue-500">Batting</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl">
              {team1.runs}/{team1.wickets}
            </div>
            <div className="text-muted-foreground mt-2">
              Overs: {team1.overs}.{team1.balls}
            </div>
          </CardContent>
        </Card>

        <Card className={currentInnings === 2 ? 'ring-2 ring-blue-500' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{team2.name}</span>
              {currentInnings === 2 && <span className="text-sm text-blue-500">Batting</span>}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl">
              {team2.runs}/{team2.wickets}
            </div>
            <div className="text-muted-foreground mt-2">
              Overs: {team2.overs}.{team2.balls}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Balls */}
      <Card>
        <CardHeader>
          <CardTitle>This Over</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {recentBalls.length === 0 ? (
              <span className="text-muted-foreground">No balls bowled yet</span>
            ) : (
              recentBalls.map((ball, idx) => (
                <div
                  key={idx}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    ball === 'W'
                      ? 'bg-red-500 text-white'
                      : ball === 4 || ball === 6
                      ? 'bg-green-500 text-white'
                      : ball === 'Wd' || ball === 'Nb'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200'
                  }`}
                >
                  {ball}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Scoring Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground mb-2">Runs</div>
            <div className="grid grid-cols-4 gap-2">
              <Button onClick={() => addRuns(0)}>0</Button>
              <Button onClick={() => addRuns(1)}>1</Button>
              <Button onClick={() => addRuns(2)}>2</Button>
              <Button onClick={() => addRuns(3)}>3</Button>
              <Button onClick={() => addRuns(4)} className="bg-green-600 hover:bg-green-700">4</Button>
              <Button onClick={() => addRuns(5)}>5</Button>
              <Button onClick={() => addRuns(6)} className="bg-green-600 hover:bg-green-700">6</Button>
              <Button onClick={addWicket} className="bg-red-600 hover:bg-red-700">Wicket</Button>
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground mb-2">Extras</div>
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={() => addExtra('wide')} variant="outline">Wide</Button>
              <Button onClick={() => addExtra('noBall')} variant="outline">No Ball</Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t">
            <Button onClick={switchInnings} variant="secondary">
              Switch Innings
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
