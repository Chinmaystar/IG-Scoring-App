import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { CricketScorecard } from './components/CricketScorecard';
import { TableTennisScorecard } from './components/TableTennisScorecard';
import { FootballScorecard } from './components/FootballScorecard';
import { BasketballScorecard } from './components/BasketballScorecard';
import { TennisScorecard } from './components/TennisScorecard';
import { Trophy } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Trophy className="h-10 w-10 text-blue-600" />
            <h1 className="text-4xl">Sports Scorecard</h1>
          </div>
          <p className="text-muted-foreground">
            Track scores for Cricket, Table Tennis, Football, Basketball, and Tennis
          </p>
        </div>

        {/* Tabs for different sports */}
        <Tabs defaultValue="cricket" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-6">
            <TabsTrigger value="cricket">Cricket</TabsTrigger>
            <TabsTrigger value="tabletennis">Table Tennis</TabsTrigger>
            <TabsTrigger value="football">Football</TabsTrigger>
            <TabsTrigger value="basketball">Basketball</TabsTrigger>
            <TabsTrigger value="tennis">Tennis</TabsTrigger>
          </TabsList>

          <TabsContent value="cricket">
            <CricketScorecard />
          </TabsContent>

          <TabsContent value="tabletennis">
            <TableTennisScorecard />
          </TabsContent>

          <TabsContent value="football">
            <FootballScorecard />
          </TabsContent>

          <TabsContent value="basketball">
            <BasketballScorecard />
          </TabsContent>

          <TabsContent value="tennis">
            <TennisScorecard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
