import React from "react";
import { useEffect, useState } from "react";
import { Button } from '../ui/button';
import { Plus, Minus, RotateCcw, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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

  useEffect(() => {
    const footballMatchData: FootballMatchState = {
      team1: "A",
      team2: "B",
      scorecard1: 1,
      scorecard2: 1,
      yellow1: 0,
      yellow2: 0,
      red1: 0,
      red2: 0,
      time: 0,
    };

    setMatch(footballMatchData);
    setTime(footballMatchData.time);
  }, [matchId]);

  useEffect(() => {
    if (time <= 0) return;

    const interval = setInterval(() => {
      setTime((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  if (!match) {
    return <div>Loading match...</div>;
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