import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Plus, Minus, RotateCcw, Clock } from "lucide-react";
import { io, Socket } from "socket.io-client";

type FootballMatchState = {
  team1: string;
  team2: string;
  scorecard1: number;
  scorecard2: number;
  yellow1: number;
  yellow2: number;
  red1: number;
  red2: number;
  time: number;
};

export function FootballScorecard() {
  const [match, setMatch] = useState<FootballMatchState>(() => {
    // Load from localStorage if available
    const saved = localStorage.getItem('football-match-FB-1');
    return saved ? JSON.parse(saved) : {
      team1: "Real Madrid",
      team2: "Barcelona",
      scorecard1: 0,
      scorecard2: 0,
      yellow1: 0,
      yellow2: 0,
      red1: 0,
      red2: 0,
      time: 5,
    };
  });

  const [socket, setSocket] = useState<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    console.log('🔌 Attempting to connect to socket server...');
    try {
      const newSocket = io('http://localhost:5000', {
        transports: ['polling', 'websocket'], // Try polling first
        timeout: 20000,
        forceNew: true,
        reconnection: true,
        reconnectionAttempts: 5
      });
      
      newSocket.on('connect', () => {
        console.log('✅ Connected to socket server with ID:', newSocket.id);
      });
      
      newSocket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error.message, error);
      });
      
      newSocket.on('disconnect', (reason) => {
        console.log('❌ Disconnected from socket server:', reason);
      });
      
      // Test event
      newSocket.on('test', (data) => {
        console.log('🧪 Received test event:', data);
      });
      
      setSocket(newSocket);

      // Listen for match updates from other clients
      newSocket.on('match-update', (data) => {
        console.log('📡 Received match update:', data);
        if (data.matchId === 'FB-1') {
          setMatch(data.match);
        }
      });

      // Send a test message
      setTimeout(() => {
        if (newSocket.connected) {
          console.log('🧪 Sending test message');
          newSocket.emit('test', { message: 'Hello from frontend' });
        }
      }, 1000);

      return () => {
        console.log('🔌 Cleaning up socket connection');
        newSocket.disconnect();
      };
    } catch (error) {
      console.error('❌ Failed to create socket connection:', error);
    }
  }, []);

  // Emit match updates to socket when state changes (but not for timer)
  useEffect(() => {
    if (socket && socket.connected && match) {
      console.log('📤 Emitting match update:', match);
      socket.emit('match-update', {
        matchId: 'FB-1',
        match: match
      });
    }
  }, [match.scorecard1, match.scorecard2, match.yellow1, match.yellow2, match.red1, match.red2, socket]); // Only emit on score/card changes, not timer

  // Save to localStorage whenever match state changes
  useEffect(() => {
    localStorage.setItem('football-match-FB-1', JSON.stringify(match));
  }, [match]);

  const resetMatch = () => {
    setMatch({
      team1: "Team A",
      team2: "Team B",
      scorecard1: 0,
      scorecard2: 0,
      yellow1: 0,
      yellow2: 0,
      red1: 0,
      red2: 0,
      time: 0,
    });
  };

  useEffect(() => {
    if (match.time <= 0) return;
  
    const interval = setInterval(() => {
      setMatch((m) => {
        if (m.time <= 1) {
          return { ...m, time: 0 };
        }
        return { ...m, time: m.time - 1 };
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, [match.time]);

  return (
    <div className="space-y-6">
      {/* Scoreboard */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Team 1 */}
        <Card>
          <CardHeader>
            <CardTitle>{match.team1}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl">{match.scorecard1}</div>

            <div className="flex gap-4 mt-4 text-sm">
              <div><span className="text-yellow-500">●</span> {match.yellow1}</div>
              <div><span className="text-red-500">●</span> {match.red1}</div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={() =>
                  setMatch(m => ({ ...m, scorecard1: m.scorecard1 + 1 }))
                }
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" /> Goal
              </Button>

              <Button
                onClick={() =>
                  setMatch(m => ({
                    ...m,
                    scorecard1: Math.max(0, m.scorecard1 - 1),
                  }))
                }
                variant="outline"
                size="icon"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {/* Yellow */}
              <div className="flex gap-1">
                <Button
                  onClick={() => setMatch(m => ({ ...m, yellow1: m.yellow1 + 1 }))}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Yellow Card
                </Button>
                <Button
                  onClick={() =>
                    setMatch(m => ({ ...m, yellow1: Math.max(0, m.yellow1 - 1) }))
                  }
                  variant="outline"
                  size="sm"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>

              {/* Red */}
              <div className="flex gap-1">
                <Button
                  onClick={() => setMatch(m => ({ ...m, red1: m.red1 + 1 }))}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Red Card
                </Button>
                <Button
                  onClick={() =>
                    setMatch(m => ({ ...m, red1: Math.max(0, m.red1 - 1) }))
                  }
                  variant="outline"
                  size="sm"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
          </div>
          </CardContent>
        </Card>

        {/* Team 2 */}
        <Card>
          <CardHeader>
            <CardTitle>{match.team2}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-6xl">{match.scorecard2}</div>

            <div className="flex gap-4 mt-4 text-sm">
              <div><span className="text-yellow-500">●</span> {match.yellow2}</div>
              <div><span className="text-red-500">●</span> {match.red2}</div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={() =>
                  setMatch(m => ({ ...m, scorecard2: m.scorecard2 + 1 }))
                }
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" /> Goal
              </Button>

              <Button
                onClick={() =>
                  setMatch(m => ({
                    ...m,
                    scorecard2: Math.max(0, m.scorecard2 - 1),
                  }))
                }
                variant="outline"
                size="icon"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {/* Yellow */}
              <div className="flex gap-1">
                <Button
                  onClick={() => setMatch(m => ({ ...m, yellow2: m.yellow2 + 1 }))}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Yellow Card
                </Button>
                <Button
                  onClick={() =>
                    setMatch(m => ({ ...m, yellow2: Math.max(0, m.yellow2 - 1) }))
                  }
                  variant="outline"
                  size="sm"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>

              {/* Red */}
              <div className="flex gap-1">
                <Button
                  onClick={() => setMatch(m => ({ ...m, red2: m.red2 + 1 }))}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Red Card
                </Button>
                <Button
                  onClick={() =>
                    setMatch(m => ({ ...m, red2: Math.max(0, m.red2 - 1) }))
                  }
                  variant="outline"
                  size="sm"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Match Time */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Match Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl text-center mb-4">
            {Math.floor(match.time / 60)}:
            {String(match.time % 60).padStart(2, "0")}
          </div>

          <div className="flex gap-2">
            <Button onClick={() => setMatch(m => ({ ...m, time: m.time + 60 }))}>
              +1 Min
            </Button>
            <Button onClick={() => setMatch(m => ({ ...m, time: m.time + 300 }))}>
              +5 Min
            </Button>
            <Button onClick={() => setMatch(m => ({ ...m, time: 0 }))}>
              Reset Time
            </Button>
          </div>
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