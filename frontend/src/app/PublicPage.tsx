import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";

type Sport = "cricket" | "tabletennis" | "football" | "basketball" | "tennis";

type Match = {
  id: string;
  sport: Sport;
  teamA: string;
  teamB: string;
  status: "upcoming" | "live" | "finished";
  score1?: number;
  score2?: number;
};

const BASE_MATCHES: Match[] = [
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

export default function PublicPage() {
    const navigate = useNavigate();
    const [matches, setMatches] = useState<Match[]>(BASE_MATCHES);
    const [socket, setSocket] = useState<Socket | null>(null);

    // Initialize socket connection
    useEffect(() => {
      const newSocket = io('http://localhost:5000');
      setSocket(newSocket);

      // Listen for match updates
      newSocket.on('match-update', (data) => {
        // Update the specific match with live data
        setMatches(prevMatches =>
          prevMatches.map(match =>
            match.id === data.matchId
              ? { ...match, score1: data.match.scorecard1, score2: data.match.scorecard2 }
              : match
          )
        );
      });

      return () => {
        newSocket.disconnect();
      };
    }, []);

    // Load live scores from localStorage
    useEffect(() => {
      const updateMatchesWithScores = () => {
        const updatedMatches = BASE_MATCHES.map(match => {
          let score1 = undefined;
          let score2 = undefined;

          // Load scores based on sport
          if (match.id === "FB-1") {
            const footballData = localStorage.getItem('football-match-FB-1');
            if (footballData) {
              const parsed = JSON.parse(footballData);
              score1 = parsed.scorecard1;
              score2 = parsed.scorecard2;
            }
          }
          // Add other sports here as needed

          return { ...match, score1, score2 };
        });
        setMatches(updatedMatches);
      };

      // Update immediately
      updateMatchesWithScores();

      // Set up interval to check for updates every 2 seconds
      const interval = setInterval(updateMatchesWithScores, 2000);

      return () => clearInterval(interval);
    }, []);
  return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center items-center gap-3 mb-2">
                <Trophy className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold">Matches</h1>
              </div>
              <p className="text-muted-foreground">
                Select a match to view scores
              </p>
            </div>

            <div className="flex justify-center mt-4">
                <Link
                    to="/login"
                    className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    Admin Panel
                </Link>
            </div>
            
            {/* Match list */}
            <div className="space-y-4">
              {matches.map((match) => (
                <Card
                  key={match.id}
                  className="cursor-pointer hover:shadow-md transition"
                  onClick={() => {
                    // later → navigate(`/admin/match/${match.id}`)
                    navigate(`/match/${match.id}`)
                  }}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-semibold">
                          {match.teamA} vs {match.teamB}
                        </div>
                        <div className="text-sm text-muted-foreground capitalize">
                          {match.sport}
                        </div>
                      </div>
                      {match.score1 !== undefined && match.score2 !== undefined && (
                        <div className="flex items-center gap-2 text-lg font-bold">
                          <span className={match.score1 > match.score2 ? "text-green-600" : ""}>
                            {match.score1}
                          </span>
                          <span className="text-muted-foreground">-</span>
                          <span className={match.score2 > match.score1 ? "text-green-600" : ""}>
                            {match.score2}
                          </span>
                        </div>
                      )}
                    </div>
    
                    <Badge
                      variant={
                        match.status === "live"
                          ? "destructive"
                          : match.status === "upcoming"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {match.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
    );
}