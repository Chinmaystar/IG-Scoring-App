import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Plus, Minus, RotateCcw, Clock } from 'lucide-react';

interface Goal {
  team: 1 | 2;
  minute: number;
  type: 'goal' | 'penalty' | 'own-goal';
}

export function FootballScorecard() {
  const [team1, setTeam1] = useState({ name: 'Team A', score: 0, yellowCards: 0, redCards: 0 });
  const [team2, setTeam2] = useState({ name: 'Team B', score: 0, yellowCards: 0, redCards: 0 });
  const [matchTime, setMatchTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);

  const addGoal = (team: 1 | 2, type: 'goal' | 'penalty' | 'own-goal' = 'goal') => {
    if (team === 1) {
      setTeam1(prev => ({ ...prev, score: prev.score + 1 }));
    } else {
      setTeam2(prev => ({ ...prev, score: prev.score + 1 }));
    }
    setGoals(prev => [...prev, { team, minute: matchTime, type }]);
  };

  const removeGoal = (team: 1 | 2) => {
    if (team === 1 && team1.score > 0) {
      setTeam1(prev => ({ ...prev, score: prev.score - 1 }));
      // Remove last goal by this team
      const lastGoalIndex = goals.map((g, i) => g.team === team ? i : -1).filter(i => i !== -1).pop();
      if (lastGoalIndex !== undefined) {
        setGoals(prev => prev.filter((_, i) => i !== lastGoalIndex));
      }
    } else if (team === 2 && team2.score > 0) {
      setTeam2(prev => ({ ...prev, score: prev.score - 1 }));
      const lastGoalIndex = goals.map((g, i) => g.team === team ? i : -1).filter(i => i !== -1).pop();
      if (lastGoalIndex !== undefined) {
        setGoals(prev => prev.filter((_, i) => i !== lastGoalIndex));
      }
    }
  };

  const addCard = (team: 1 | 2, type: 'yellow' | 'red') => {
    if (team === 1) {
      setTeam1(prev => ({
        ...prev,
        yellowCards: type === 'yellow' ? prev.yellowCards + 1 : prev.yellowCards,
        redCards: type === 'red' ? prev.redCards + 1 : prev.redCards
      }));
    } else {
      setTeam2(prev => ({
        ...prev,
        yellowCards: type === 'yellow' ? prev.yellowCards + 1 : prev.yellowCards,
        redCards: type === 'red' ? prev.redCards + 1 : prev.redCards
      }));
    }
  };

  const resetMatch = () => {
    setTeam1({ name: 'Team A', score: 0, yellowCards: 0, redCards: 0 });
    setTeam2({ name: 'Team B', score: 0, yellowCards: 0, redCards: 0 });
    setMatchTime(0);
    setIsRunning(false);
    setGoals([]);
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
            <div className="flex gap-4 mt-4 text-sm">
              <div>
                <span className="text-yellow-500">●</span> {team1.yellowCards}
              </div>
              <div>
                <span className="text-red-500">●</span> {team1.redCards}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => addGoal(1)} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Goal
              </Button>
              <Button onClick={() => removeGoal(1)} variant="outline" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button onClick={() => addCard(1, 'yellow')} variant="outline" size="sm">
                Yellow Card
              </Button>
              <Button onClick={() => addCard(1, 'red')} variant="outline" size="sm">
                Red Card
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{team2.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl">{team2.score}</div>
            <div className="flex gap-4 mt-4 text-sm">
              <div>
                <span className="text-yellow-500">●</span> {team2.yellowCards}
              </div>
              <div>
                <span className="text-red-500">●</span> {team2.redCards}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => addGoal(2)} className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Goal
              </Button>
              <Button onClick={() => removeGoal(2)} variant="outline" size="icon">
                <Minus className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button onClick={() => addCard(2, 'yellow')} variant="outline" size="sm">
                Yellow Card
              </Button>
              <Button onClick={() => addCard(2, 'red')} variant="outline" size="sm">
                Red Card
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Match Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Match Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl text-center mb-4">
            {Math.floor(matchTime / 60)}:{(matchTime % 60).toString().padStart(2, '0')}
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setMatchTime(prev => prev + 1)} 
              variant="outline" 
              className="flex-1"
            >
              +1 Min
            </Button>
            <Button 
              onClick={() => setMatchTime(prev => prev + 5)} 
              variant="outline" 
              className="flex-1"
            >
              +5 Min
            </Button>
            <Button 
              onClick={() => setMatchTime(0)} 
              variant="outline"
            >
              Reset Time
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Goal Timeline */}
      {goals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Goal Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {goals.map((goal, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-muted rounded">
                  <span>{goal.team === 1 ? team1.name : team2.name}</span>
                  <span className="text-sm text-muted-foreground">{goal.minute}'</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
