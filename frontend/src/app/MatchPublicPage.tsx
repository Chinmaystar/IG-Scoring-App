import React from "react";
import { useParams } from "react-router-dom";
import { CricketScorecard } from './components/Cricket/CricketScorecard';
import { FootballScorecard } from './components/Football/FootballScorecard';

//API pulls for all matches and also score fpr this particular match

/*
Cricket=CK
Football=FB
Basketball=BB
Tennis=TN
TableTennis=TT
*/
type Sport = "cricket" | "tabletennis" | "football" | "basketball" | "tennis";

type Match = {
  id: string;
  sport: Sport;
  teamA: string;
  teamB: string;
  status: "upcoming" | "live" | "finished";
};

//useEffect(() => fetch("/api/matches")) later
const MATCHES: Match[] = [
    {
      id: "CK-1",
      sport: "cricket",
      teamA: "India",
      teamB: "Australia",
      status: "live",
    },
    {
      id: "FB-1",
      sport: "football",
      teamA: "Real Madrid",
      teamB: "Barcelona",
      status: "upcoming",
    },
    {
      id: "BB-1",
      sport: "basketball",
      teamA: "Lakers",
      teamB: "Warriors",
      status: "finished",
    },
    {
      id: "TN-1",
      sport: "tennis",
      teamA: "Djokovic",
      teamB: "Alcaraz",
      status: "live",
    },
    {
      id: "TT-1",
      sport: "tabletennis",
      teamA: "Team A",
      teamB: "Team B",
      status: "upcoming",
    },
  ];

export default function MatchAdminPage() {
  const { matchId } = useParams();
  const match = MATCHES.find(m => m.id === matchId);
  const sportPrefix = matchId ? matchId.slice(0, 2) : null;

  if (!match) {
    return <div className="p-6">Match not found</div>;
  }

  // MOCK score data (later → API)
  const footballMatchData = {
    team1: match.teamA,
    team2: match.teamB,
    scorecard1: 0,
    scorecard2: 0,
    yellow1: 0,
    yellow2: 0,
    red1: 0,
    red2: 0,
    time: 10,
  };

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Match Admin</h1>
      <p className="mt-2 text-muted-foreground">
        Current match ID: <span className="font-mono">{matchId}</span>
      </p>
      <br></br>
      {sportPrefix==="CK" && <CricketScorecard />}
      {sportPrefix==="FB" && <FootballScorecard match={footballMatchData}/>}

    </div>
  );
}