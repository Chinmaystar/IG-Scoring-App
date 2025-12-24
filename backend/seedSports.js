const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Sport = require("./models/Sport");
const connectDB = require("./config/database");

// Load environment variables
dotenv.config();

// Sports data
const sports = [
    {
        name: "Football",
        code: "football",
        displayName: "Football",
        description: "11-a-side football/soccer match",
        maxPlayersPerTeam: 11,
        scoringUnit: "goals",
    },
    {
        name: "Cricket",
        code: "cricket",
        displayName: "Cricket",
        description: "Cricket match - ODI/T20 format",
        maxPlayersPerTeam: 11,
        scoringUnit: "runs",
    },
    {
        name: "Basketball",
        code: "basketball",
        displayName: "Basketball",
        description: "5-a-side basketball match",
        maxPlayersPerTeam: 5,
        scoringUnit: "points",
    },
    {
        name: "Tennis",
        code: "tennis",
        displayName: "Tennis",
        description: "Singles or doubles tennis match",
        maxPlayersPerTeam: 2,
        scoringUnit: "sets",
    },
    {
        name: "Table Tennis",
        code: "table-tennis",
        displayName: "Table Tennis",
        description: "Table tennis match",
        maxPlayersPerTeam: 2,
        scoringUnit: "sets",
    },
];

const seedSports = async () => {
    try {
        console.log("🔄 Connecting to MongoDB...");
        await connectDB();

        console.log("🗑️  Clearing existing sports...");
        await Sport.deleteMany({});

        console.log("📝 Creating sports...");
        const createdSports = await Sport.insertMany(sports);

        console.log("✅ Successfully created sports:");
        createdSports.forEach((sport) => {
            console.log(`   - ${sport.code}: ${sport.displayName}`);
        });

        console.log(`\n✨ Total: ${createdSports.length} sports created`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding sports:", error.message);
        process.exit(1);
    }
};

seedSports();
