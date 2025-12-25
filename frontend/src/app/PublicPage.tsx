import React from "react";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { useNavigate } from "react-router-dom";

type Sport = "cricket" | "tabletennis" | "football" | "basketball" | "tennis";

type Match = {
  id: string;
  sport: Sport;
  teamA: string;
  teamB: string;
  status: "upcoming" | "live" | "finished";
};

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

export default function PublicPage() {
    const navigate = useNavigate();
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
              {MATCHES.map((match) => (
                <Card
                  key={match.id}
                  className="cursor-pointer hover:shadow-md transition"
                  onClick={() => {
                    // later → navigate(`/admin/match/${match.id}`)
                    navigate(`/match/${match.id}`)
                  }}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div>
                      <div className="font-semibold">
                        {match.teamA} vs {match.teamB}
                      </div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {match.sport}
                      </div>
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