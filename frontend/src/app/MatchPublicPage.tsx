import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CricketScorecard } from './components/Cricket/CricketScorecard';
import { FootballScorecard } from './components/Football/FootballScorecard';
import { io, Socket } from "socket.io-client";

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
  const [refreshKey, setRefreshKey] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [liveMatchData, setLiveMatchData] = useState<any>(null);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    
    newSocket.on('connect', () => {
      console.log('🔌 Public page connected to socket server');
    });
    
    newSocket.on('disconnect', () => {
      console.log('❌ Public page disconnected from socket server');
    });
    
    setSocket(newSocket);

    // Listen for match updates
    newSocket.on('match-update', (data) => {
      console.log('📡 Public page received match update:', data);
      if (data.matchId === matchId) {
        setLiveMatchData(data.match);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [matchId]);

  useEffect(() => {
    // Refresh data every 2 seconds (fallback for localStorage)
    const interval = setInterval(() => {
      setRefreshKey(prev => prev + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  if (!match) {
    return <div className="p-6">Match not found</div>;
  }

  // Load live score data from socket or localStorage
  const getFootballMatchData = () => {
    // Use socket data if available, otherwise fall back to localStorage
    if (liveMatchData) {
      return {
        team1: liveMatchData.team1 || match.teamA,
        team2: liveMatchData.team2 || match.teamB,
        scorecard1: liveMatchData.scorecard1 || 0,
        scorecard2: liveMatchData.scorecard2 || 0,
        yellow1: liveMatchData.yellow1 || 0,
        yellow2: liveMatchData.yellow2 || 0,
        red1: liveMatchData.red1 || 0,
        red2: liveMatchData.red2 || 0,
        time: liveMatchData.time || 0,
      };
    }

    // Fallback to localStorage
    const saved = localStorage.getItem('football-match-FB-1');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        team1: parsed.team1 || match.teamA,
        team2: parsed.team2 || match.teamB,
        scorecard1: parsed.scorecard1 || 0,
        scorecard2: parsed.scorecard2 || 0,
        yellow1: parsed.yellow1 || 0,
        yellow2: parsed.yellow2 || 0,
        red1: parsed.red1 || 0,
        red2: parsed.red2 || 0,
        time: parsed.time || 0,
      };
    }
    return {
      team1: match.teamA,
      team2: match.teamB,
      scorecard1: 0,
      scorecard2: 0,
      yellow1: 0,
      yellow2: 0,
      red1: 0,
      red2: 0,
      time: 0,
    };
  };

  const footballMatchData = getFootballMatchData();

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold">Match Admin</h1>
      <p className="mt-2 text-muted-foreground">
        Current match ID: <span className="font-mono">{matchId}</span>
      </p>
      <br></br>
      {sportPrefix==="CK" && <CricketScorecard />}
      {sportPrefix==="FB" && <FootballScorecard match={footballMatchData}/>}
      {/*sportPrefix==="FB" && <FootballScorecard/>*/}

    </div>
  );
}