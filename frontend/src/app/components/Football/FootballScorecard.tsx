import React from "react";
import { useEffect, useState } from "react";
import { Button } from '../ui/button';
import { Plus, Minus, RotateCcw, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
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
  const [time, setTime] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5001", {
      transports: ["polling", "websocket"],
    });
  
    newSocket.on("match-update", (data) => {
      if (data.matchId === matchId) {
        setMatch(data.match);
        setTime(data.match.time);
      }
    });

    newSocket.on("connect", () => {
      // 👇 ask admin/server for latest match state
      newSocket.emit("request-match", { matchId });
    });
  
    setSocket(newSocket);
  
    return () => {
      newSocket.disconnect();
    };
  }, [matchId]);

  if (!match) {
    return <div> Match Not Yet Started</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
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
          </CardContent>
        </Card>

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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" /> Match Time
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-4xl">
        {String(Math.floor(time / 60)).padStart(2, "0")}:
        {String(time % 60).padStart(2, "0")}
        </CardContent>
      </Card>
    </div>
  );
}
/*
  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/scores");
        const json = await res.json();
  
        const found = json.data.find((m: ApiMatch) => m._id === matchId);
        setMatch(found || null);
      } catch (err) {
        console.error("Failed to fetch match", err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchMatch();
  }, [matchId]);
  */