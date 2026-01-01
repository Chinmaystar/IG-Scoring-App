import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CricketScorecard } from './components/Cricket/CricketScorecard';
import { FootballScorecard } from './components/Football/FootballScorecard';
import { BasketballScorecard } from './components/Basketball/BasketballScorecard'
import { TennisScorecard } from './components/Tennis/TennisScorecard'
import { TableTennisScorecard } from './components/TableTennis/TableTennisScorecard'
import { io, Socket } from "socket.io-client";

//API pulls for all matches and also score fpr this particular match

/*
Cricket=CK
Football=FB
Basketball=BB
Tennis=TN
TableTennis=TT
*/

type ApiMatch = {
  _id: string;
  event: "football" | "cricket" | "basketball" | "tennis" | "tabletennis";
  team1: { name: string; score: number };
  team2: { name: string; score: number };
  status: "scheduled" | "live" | "completed";
};

export default function MatchAdminPage() {
  const { matchId } = useParams();
  const [match, setMatch] = useState<ApiMatch | null>(null);
  const [loading, setLoading] = useState(true);

  // load match sport from api
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

  if (loading) {
    return <div className="p-6">Loading match...</div>;
  }

  if (!match) {
    return <div className="p-6">Match not found</div>;
  }

  // temporary
  const footballMatchData = {
    team1: match.team1.name,
    team2: match.team2.name,
    scorecard1: match.team1.score,
    scorecard2: match.team2.score,
    yellow1: 0,
    yellow2: 0,
    red1: 0,
    red2: 0,
    time: 0,
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Match Admin</h1>
      <p className="mt-2 text-muted-foreground">
        Current match ID: <span className="font-mono">{matchId}</span>
      </p>
      <br></br>
      {match.event==="cricket" && <CricketScorecard />}
      {match.event==="football" && <FootballScorecard match={footballMatchData}/>}
      {/*sportPrefix==="FB" && <FootballScorecard/>*/}
      {match.event==="basketball" && <BasketballScorecard />}
      {match.event==="tennis" && <TennisScorecard />}
      {match.event==="tabletennis" && <TableTennisScorecard />}
    </div>
  );
}