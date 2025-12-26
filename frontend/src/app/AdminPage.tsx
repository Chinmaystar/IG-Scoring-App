import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Trophy } from 'lucide-react';
import { Card, CardContent } from "./components/ui/card";
import { Badge } from "./components/ui/badge";

type Sport = {
  _id: string;
  name: string;
  code: string;
  displayName: string;
  description?: string;
  maxPlayersPerTeam: number;
  isActive: boolean;
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sports');
        setSports(response.data.data || []);
      } catch (error) {
        console.error('Error fetching sports:', error);
        setSports([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchSports();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center items-center gap-3 mb-2">
            <Trophy className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Admin – Sports</h1>
          </div>
          <p className="text-muted-foreground">
            Manage sports and create matches
          </p>
        </div>

        {/* Sports list */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">Loading sports...</div>
          ) : sports.length === 0 ? (
            <div className="text-center py-8">No sports found. Backend may not be running.</div>
          ) : (
            sports.map((sport) => (
              <Card
                key={sport._id}
                className="cursor-pointer hover:shadow-md transition"
                onClick={() => {
                  // Navigate to the match admin page for this sport
                  // Map sport codes to match prefixes
                  const sportCodeMap: { [key: string]: string } = {
                    'football': 'FB',
                    'cricket': 'CK',
                    'basketball': 'BB',
                    'tennis': 'TN',
                    'table-tennis': 'TT'
                  };
                  const matchPrefix = sportCodeMap[sport.code] || sport.code.toUpperCase().slice(0, 2);
                  const matchId = `${matchPrefix}-1`;
                  navigate(`/admin/match/${matchId}`);
                }}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <div className="font-semibold">
                      {sport.displayName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Code: {sport.code.toUpperCase()} | Max players: {sport.maxPlayersPerTeam}
                    </div>
                    {sport.description && (
                      <div className="text-sm text-muted-foreground mt-1">
                        {sport.description}
                      </div>
                    )}
                  </div>

                  <Badge variant="secondary">
                    Active
                  </Badge>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}