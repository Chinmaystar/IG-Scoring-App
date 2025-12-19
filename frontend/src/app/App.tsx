import React from "react";
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { CricketScorecard } from './components/CricketScorecard';
import { TableTennisScorecard } from './components/TableTennisScorecard';
import { FootballScorecard } from './components/FootballScorecard';
import { BasketballScorecard } from './components/BasketballScorecard';
import { TennisScorecard } from './components/TennisScorecard';
import { Trophy } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./components/ui/select";

export default function App() {
  const [sport, setSport] = useState("cricket");

  return (
    <div className="overflow-x-hidden min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Trophy className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl">Sports Scorecard</h1>
          </div>
          <p className="text-muted-foreground">
            Track scores for Cricket, Table Tennis, Football, Basketball, and Tennis
          </p>
        </div>

        {/* Mobile selector (pill style) */}
        <div className="block md:hidden mb-6">
          <Select value={sport} onValueChange={setSport}>
            <SelectTrigger
              className="
                w-full
                rounded-full
                bg-white/70
                backdrop-blur
                border-0
                shadow-sm
                px-5
                py-3
                text-sm
                font-medium
                justify-center
              "
            >
              <SelectValue placeholder="Select Sport" />
            </SelectTrigger>

            <SelectContent className="rounded-xl">
              <SelectItem value="cricket">Cricket</SelectItem>
              <SelectItem value="tabletennis">Table Tennis</SelectItem>
              <SelectItem value="football">Football</SelectItem>
              <SelectItem value="basketball">Basketball</SelectItem>
              <SelectItem value="tennis">Tennis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Desktop tabs (hidden on mobile) */}
        <div className="hidden md:block mb-6">
          <Tabs value={sport} onValueChange={setSport}>
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="cricket">Cricket</TabsTrigger>
              <TabsTrigger value="tabletennis">Table Tennis</TabsTrigger>
              <TabsTrigger value="football">Football</TabsTrigger>
              <TabsTrigger value="basketball">Basketball</TabsTrigger>
              <TabsTrigger value="tennis">Tennis</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {sport === "cricket" && <CricketScorecard />}
        {sport === "tabletennis" && <TableTennisScorecard />}
        {sport === "football" && <FootballScorecard />}
        {sport === "basketball" && <BasketballScorecard />}
        {sport === "tennis" && <TennisScorecard />}
      </div>
    </div>
  );
}
