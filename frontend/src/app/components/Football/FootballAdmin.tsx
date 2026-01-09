import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Plus, Minus, RotateCcw, Clock, Play, Pause } from "lucide-react";
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

export function FootballScorecard({ matchId }: { matchId: string }) {
  const [match, setMatch] = useState<FootballMatchState | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [customMinutes, setCustomMinutes] = useState(40);
  const [customSeconds, setCustomSeconds] = useState(0);

  /* ===============================
     SAFE UPDATE
  =============================== */
  const updateMatch = (
    updater: (m: FootballMatchState) => FootballMatchState
  ) => {
    setMatch(m => (m ? updater(m) : m));
  };

  /* ===============================
     FETCH TEAM NAMES + STATUS
  =============================== */
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/scores");
        const json = await res.json();

        const found = json.data.find(
          (m: any) => m._id === matchId && m.event === "football"
        );

        if (!found) return;

        setIsLive(found.status === "live");
        setIsPaused(found.status !== "live");

        setMatch({
          team1: found.team1.name,
          team2: found.team2.name,
          scorecard1: 0,
          scorecard2: 0,
          yellow1: 0,
          yellow2: 0,
          red1: 0,
          red2: 0,
          time: 40 * 60,
        });
      } catch (err) {
        console.error("Failed to fetch match", err);
      }
    };

    fetchMatch();
  }, [matchId]);

  /* ===============================
     SOCKET SETUP
  =============================== */
  useEffect(() => {
    const s = io("http://localhost:5001", {
      transports: ["polling", "websocket"],
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);

  /* ===============================
     EMIT MATCH UPDATES
  =============================== */
  useEffect(() => {
    if (!socket || !socket.connected || !match) return;

    socket.emit("match-update", {
      matchId,
      match,
    });
  }, [
    match?.scorecard1,
    match?.scorecard2,
    match?.yellow1,
    match?.yellow2,
    match?.red1,
    match?.red2,
    match?.time,
    socket,
  ]);

  /* ===============================
     MATCH TIMER (LIVE ONLY)
  =============================== */
  useEffect(() => {
    if (!isLive || isPaused) return;

    const interval = setInterval(() => {
      updateMatch(m =>
        m.time <= 0 ? m : { ...m, time: m.time - 1 }
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isLive, isPaused]);

  /* ===============================
     CONTROLS
  =============================== */
  const startMatch = () => {
    if (!isLive) return;
    setIsPaused(false);
  };

  const pauseMatch = () => {
    setIsPaused(true);
  };

  const resetMatch = () => {
    setMatch(m =>
      m
        ? {
            ...m,
            scorecard1: 0,
            scorecard2: 0,
            yellow1: 0,
            yellow2: 0,
            red1: 0,
            red2: 0,
            time: 40 * 60,
          }
        : m
    );
    setIsPaused(true);
  };

  const saveMatchData = () => {
    console.log("Push updtaes")
  }

  const setCustomTime = () => {
    const totalSeconds = customMinutes * 60 + customSeconds;
    if (totalSeconds < 0) return;

    updateMatch(m => ({ ...m, time: totalSeconds }));
    setIsPaused(true);
  };

  /* ===============================
     LOADING
  =============================== */
  if (!match) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Loading match…
      </div>
    );
  }

  /* ===============================
     UI (UNCHANGED)
     =============================== */
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
                  updateMatch(m => ({ ...m, scorecard1: m.scorecard1 + 1 }))
                }
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" /> Goal
              </Button>

              <Button
                onClick={() =>
                  updateMatch(m => ({
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
                  onClick={() => updateMatch(m => ({ ...m, yellow1: m.yellow1 + 1 }))}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Yellow Card
                </Button>
                <Button
                  onClick={() =>
                    updateMatch(m => ({ ...m, yellow1: Math.max(0, m.yellow1 - 1) }))
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
                  onClick={() => updateMatch(m => ({ ...m, red1: m.red1 + 1 }))}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Red Card
                </Button>
                <Button
                  onClick={() =>
                    updateMatch(m => ({ ...m, red1: Math.max(0, m.red1 - 1) }))
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
                  updateMatch(m => ({ ...m, scorecard2: m.scorecard2 + 1 }))
                }
                className="flex-1"
              >
                <Plus className="h-4 w-4 mr-2" /> Goal
              </Button>

              <Button
                onClick={() =>
                  updateMatch(m => ({
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
                  onClick={() => updateMatch(m => ({ ...m, yellow2: m.yellow2 + 1 }))}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Yellow Card
                </Button>
                <Button
                  onClick={() =>
                    updateMatch(m => ({ ...m, yellow2: Math.max(0, m.yellow2 - 1) }))
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
                  onClick={() => updateMatch(m => ({ ...m, red2: m.red2 + 1 }))}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  Red Card
                </Button>
                <Button
                  onClick={() =>
                    updateMatch(m => ({ ...m, red2: Math.max(0, m.red2 - 1) }))
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
            <Button onClick={startMatch} disabled={!isLive || !isPaused}>
              <Play className="mr-2 h-4 w-4" /> Start
            </Button>
            <Button onClick={pauseMatch} disabled={isPaused}>
              <Pause className="mr-2 h-4 w-4" /> Pause
            </Button>
            {/* Custom Time Input */}
            <input
              type="number"
              value={customMinutes}
              onChange={e => setCustomMinutes(Number(e.target.value))}
              className="w-20 border rounded px-2 py-1"
              placeholder="Min"
            />
            :
            <input
              type="number"
              value={customSeconds}
              onChange={e => setCustomSeconds(Number(e.target.value))}
              className="w-20 border rounded px-2 py-1"
              placeholder="Sec"
            />
            <Button onClick={setCustomTime}>Set Time</Button>
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Match Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="pb-4">
          <Button onClick={resetMatch} variant="destructive" className="w-full">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Match
          </Button>
          </div>
          <Button onClick={saveMatchData} variant="secondary" className="w-full">
            Push Update
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}