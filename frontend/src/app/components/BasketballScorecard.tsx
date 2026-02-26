import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Minus, RotateCcw } from 'lucide-react';

export function BasketballScorecard() {
  const [team1, setTeam1] = useState({ name: 'Team A', score: 0, fouls: 0, timeouts: 3 });
  const [team2, setTeam2] = useState({ name: 'Team B', score: 0, fouls: 0, timeouts: 3 });
  const [quarter, setQuarter] = useState(1);
  const [quarterScores, setQuarterScores] = useState<{ team1: number[]; team2: number[] }>({
    team1: [0, 0, 0, 0],
    team2: [0, 0, 0, 0]
  });

  const addPoints = (team: 1 | 2, points: 1 | 2 | 3) => {
    if (team === 1) {
      setTeam1(prev => ({ ...prev, score: prev.score + points }));
      setQuarterScores(prev => ({
        ...prev,
        team1: prev.team1.map((score, idx) => idx === quarter - 1 ? score + points : score)
      }));
    } else {
      setTeam2(prev => ({ ...prev, score: prev.score + points }));
      setQuarterScores(prev => ({
        ...prev,
        team2: prev.team2.map((score, idx) => idx === quarter - 1 ? score + points : score)
      }));
    }
  };

  const removePoints = (team: 1 | 2, points: 1 | 2 | 3) => {
    if (team === 1 && team1.score >= points) {
      setTeam1(prev => ({ ...prev, score: prev.score - points }));
      setQuarterScores(prev => ({
        ...prev,
        team1: prev.team1.map((score, idx) => idx === quarter - 1 ? Math.max(0, score - points) : score)
      }));
    } else if (team === 2 && team2.score >= points) {
      setTeam2(prev => ({ ...prev, score: prev.score - points }));
      setQuarterScores(prev => ({
        ...prev,
        team2: prev.team2.map((score, idx) => idx === quarter - 1 ? Math.max(0, score - points) : score)
      }));
    }
  };

  const addFoul = (team: 1 | 2) => {
    if (team === 1) {
      setTeam1(prev => ({ ...prev, fouls: prev.fouls + 1 }));
    } else {
      setTeam2(prev => ({ ...prev, fouls: prev.fouls + 1 }));
    }
  };

  const useTimeout = (team: 1 | 2) => {
    if (team === 1 && team1.timeouts > 0) {
      setTeam1(prev => ({ ...prev, timeouts: prev.timeouts - 1 }));
    } else if (team === 2 && team2.timeouts > 0) {
      setTeam2(prev => ({ ...prev, timeouts: prev.timeouts - 1 }));
    }
  };

  const nextQuarter = () => {
    if (quarter < 4) {
      setQuarter(prev => prev + 1);
    }
  };

  const resetMatch = () => {
    setTeam1({ name: 'Team A', score: 0, fouls: 0, timeouts: 3 });
    setTeam2({ name: 'Team B', score: 0, fouls: 0, timeouts: 3 });
    setQuarter(1);
    setQuarterScores({ team1: [0, 0, 0, 0], team2: [0, 0, 0, 0] });
  };

  return (
    <div className="space-y-6">
      {/* Scoreboard */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>{team1.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl">{team1.score}</div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
              <div>
                <div className="text-muted-foreground">Fouls</div>
                <div className="text-xl">{team1.fouls}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Timeouts</div>
                <div className="text-xl">{team1.timeouts}</div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => addPoints(1, 1)}>+1</Button>
                <Button onClick={() => addPoints(1, 2)}>+2</Button>
                <Button onClick={() => addPoints(1, 3)}>+3</Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => addFoul(1)} variant="outline" size="sm">
                  Add Foul
                </Button>
                <Button onClick={() => useTimeout(1)} variant="outline" size="sm">
                  Timeout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{team2.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl">{team2.score}</div>
            <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
              <div>
                <div className="text-muted-foreground">Fouls</div>
                <div className="text-xl">{team2.fouls}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Timeouts</div>
                <div className="text-xl">{team2.timeouts}</div>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <div className="grid grid-cols-3 gap-2">
                <Button onClick={() => addPoints(2, 1)}>+1</Button>
                <Button onClick={() => addPoints(2, 2)}>+2</Button>
                <Button onClick={() => addPoints(2, 3)}>+3</Button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => addFoul(2)} variant="outline" size="sm">
                  Add Foul
                </Button>
                <Button onClick={() => useTimeout(2)} variant="outline" size="sm">
                  Timeout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quarter Info */}
      <Card>
        <CardHeader>
          <CardTitle>Quarter {quarter}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr>
                  <th className="p-2">Team</th>
                  <th className="p-2">Q1</th>
                  <th className="p-2">Q2</th>
                  <th className="p-2">Q3</th>
                  <th className="p-2">Q4</th>
                  <th className="p-2">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="p-2">{team1.name}</td>
                  {quarterScores.team1.map((score, idx) => (
                    <td key={idx} className="p-2">{score}</td>
                  ))}
                  <td className="p-2">{team1.score}</td>
                </tr>
                <tr className="border-t">
                  <td className="p-2">{team2.name}</td>
                  {quarterScores.team2.map((score, idx) => (
                    <td key={idx} className="p-2">{score}</td>
                  ))}
                  <td className="p-2">{team2.score}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {quarter < 4 && (
            <Button onClick={nextQuarter} className="w-full mt-4">
              Next Quarter
            </Button>
          )}
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
