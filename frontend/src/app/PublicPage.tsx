import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Card, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { useNavigate } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./components/ui/select";
import axios from "axios";

//NO score displayed here, design choice

type Match = {
  id: string;
  sport: string;
  teamA: string;
  teamB: string;
  status: "upcoming" | "live" | "finished";
  score1?: number;
  score2?: number;
};

export default function PublicPage() {
    const navigate = useNavigate();
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState<Socket | null>(null);
    const [tab, setTab] = useState<
  "scores" | "leaderboard" | "council" | "admin"
>("scores");

    // Initialize socket connection
    useEffect(() => {
      const newSocket = io('http://localhost:5001');
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

    useEffect(() => {
      const fetchMatches = async () => {
        try {
          const res = await axios.get("http://localhost:5001/api/scores");
    
          const mappedMatches: Match[] = res.data.data.map((m: any) => ({
            id: m._id,
            sport: m.event,
            teamA: m.team1.name,
            teamB: m.team2.name,
            score1: m.team1.score,
            score2: m.team2.score,
            status:
              m.status === "live"
                ? "live"
                : m.status === "completed"
                ? "finished"
                : "upcoming",
          }));
    
          setMatches(mappedMatches);
        } catch (err) {
          console.error("Failed to fetch matches", err);
        } finally {
          setLoading(false);
        }
      };
    
      fetchMatches();
    }, []);

  return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="text-center">
              <div className="flex justify-center items-center gap-3 mb-2">
                <Trophy className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-bold">Institute Gathering</h1>
              </div>
              <p className="text-muted-foreground">
                Visvesvaraya National Institute of Technology
              </p>
              <br></br>
              {/* Tabs wrapper MUST always exist */}
              <Tabs
                value={tab}
                onValueChange={(value) =>
                  setTab(value as "scores" | "leaderboard" | "council" | "admin")
                }
                className="space-y-6"
              >

                {/* Mobile selector */}
                <div className="block md:hidden">
                  <Select
                    value={tab}
                    onValueChange={(value) =>
                      setTab(value as "scores" | "leaderboard" | "council" | "admin")
                    }
                  >
                    <SelectTrigger className="w-full rounded-full bg-white">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scores">Scores</SelectItem>
                      <SelectItem value="leaderboard">Leaderboard</SelectItem>
                      <SelectItem value="council">Student Council</SelectItem>
                      <SelectItem value="admin">Scorer Login</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Desktop tabs */}
                <div className="hidden md:block">
                  <TabsList className="grid grid-cols-4">
                    <TabsTrigger value="scores">Scores</TabsTrigger>
                    <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                    <TabsTrigger value="council">Student Council</TabsTrigger>
                    <TabsTrigger value="admin">Scorer Login</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="scores">
                {loading ? (
                    <div className="text-center text-muted-foreground py-10">
                      Loading matches...
                    </div>
                  ) : matches.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">
                      No matches found
                    </div>
                  ) : (
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <Card
                        key={match.id}
                        className="cursor-pointer hover:shadow-md transition"
                        onClick={() => navigate(`/match/${match.id}`)}
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
                  )}
                </TabsContent>

                <TabsContent value="leaderboard">
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      Leaderboard coming soon
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="council">
                  <Card>
                    <CardContent className="p-6 text-center text-muted-foreground">
                      Student Council information coming soon
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="admin">
                  <div className="flex justify-center">
                    <Link
                      to="/login"
                      className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                    >
                      Go to Scorer Login
                    </Link>
                  </div>
                </TabsContent>

              </Tabs>
            </div>
          </div>
        </div>
    );
}