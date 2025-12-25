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

export function FootballScorecard({ match }: { match: FootballMatchState }) {
  console.log("Rendering public v");

  const [time, setTime] = useState(match.time);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  
    return () => clearInterval(interval);
  }, []);

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