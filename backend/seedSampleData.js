const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Department = require("./models/Department");
const Sport = require("./models/Sport");
const Score = require("./models/Score");
const connectDB = require("./config/database");

// Load environment variables
dotenv.config();

const seedSampleData = async () => {
    try {
        console.log("🔄 Connecting to MongoDB...");
        await connectDB();

        // Create sample users
        console.log("\n👤 Creating sample users...");
        await User.deleteMany({});
        
        const hashedPassword = await bcrypt.hash("password123", 10);
        
        const users = await User.insertMany([
            {
                name: "Admin User",
                email: "admin@vnit.ac.in",
                password: hashedPassword,
                phone: "9876543210",
                role: "admin",
            },
            {
                name: "Scorer John",
                email: "scorer@vnit.ac.in",
                password: hashedPassword,
                phone: "9876543211",
                role: "scorer",
            },
            {
                name: "Organizer Sarah",
                email: "organizer@vnit.ac.in",
                password: hashedPassword,
                phone: "9876543212",
                role: "organizer",
            },
        ]);
        console.log(`✅ Created ${users.length} users`);

        // Get departments (should already exist)
        console.log("\n🏢 Fetching departments...");
        const departments = await Department.find({});
        if (departments.length === 0) {
            console.log("⚠️  No departments found. Please run: npm run seed:departments");
            process.exit(1);
        }
        console.log(`✅ Found ${departments.length} departments`);

        // Get sports (should already exist)
        console.log("\n⚽ Fetching sports...");
        const sports = await Sport.find({});
        if (sports.length === 0) {
            console.log("⚠️  No sports found. Please run: npm run seed:sports");
            process.exit(1);
        }
        console.log(`✅ Found ${sports.length} sports`);

        // Create sample football matches
        console.log("\n⚽ Creating sample football matches...");
        await Score.deleteMany({});

        const footballMatches = [
            {
                event: "football",
                team1: {
                    name: departments[0].shortName, // CSE
                    score: 2,
                },
                team2: {
                    name: departments[1].shortName, // EE
                    score: 1,
                },
                winner: "team1",
                status: "completed",
                scoredBy: users[1]._id,
                matchDate: new Date("2025-12-20"),
                venue: "VNIT Football Ground",
                remarks: "CSE wins opening match",
            },
            {
                event: "football",
                team1: {
                    name: departments[2].shortName, // ECE
                    score: 3,
                },
                team2: {
                    name: departments[3].shortName, // MECH
                    score: 3,
                },
                winner: "tie",
                status: "completed",
                scoredBy: users[1]._id,
                matchDate: new Date("2025-12-21"),
                venue: "VNIT Football Ground",
                remarks: "Exciting draw",
            },
            {
                event: "football",
                team1: {
                    name: departments[4].shortName, // CIVIL
                    score: 1,
                },
                team2: {
                    name: departments[5].shortName, // MME
                    score: 0,
                },
                winner: "team1",
                status: "live",
                scoredBy: users[1]._id,
                matchDate: new Date("2025-12-24"),
                venue: "VNIT Football Ground",
                remarks: "Match in progress",
            },
            {
                event: "football",
                team1: {
                    name: departments[6].shortName, // CHEM
                    score: 0,
                },
                team2: {
                    name: departments[7].shortName, // MINING
                    score: 0,
                },
                winner: null,
                status: "scheduled",
                scoredBy: users[1]._id,
                matchDate: new Date("2025-12-25"),
                venue: "VNIT Football Ground",
                remarks: "Upcoming match",
            },
        ];

        const scores = await Score.insertMany(footballMatches);
        console.log(`✅ Created ${scores.length} football matches`);

        // Create sample matches for other sports
        console.log("\n🏀 Creating sample matches for other sports...");
        
        const otherMatches = [
            {
                event: "cricket",
                team1: { name: departments[0].shortName, score: 175 },
                team2: { name: departments[1].shortName, score: 168 },
                winner: "team1",
                status: "completed",
                scoredBy: users[1]._id,
                matchDate: new Date("2025-12-22"),
                venue: "VNIT Cricket Ground",
            },
            {
                event: "basketball",
                team1: { name: departments[2].shortName, score: 78 },
                team2: { name: departments[3].shortName, score: 82 },
                winner: "team2",
                status: "completed",
                scoredBy: users[1]._id,
                matchDate: new Date("2025-12-23"),
                venue: "VNIT Basketball Court",
            },
        ];

        const otherScores = await Score.insertMany(otherMatches);
        console.log(`✅ Created ${otherScores.length} other sport matches`);

        console.log("\n" + "=".repeat(60));
        console.log("✨ SAMPLE DATA SEEDING COMPLETED!");
        console.log("=".repeat(60));
        console.log(`\n📊 Summary:`);
        console.log(`   Users: ${users.length}`);
        console.log(`   Departments: ${departments.length}`);
        console.log(`   Sports: ${sports.length}`);
        console.log(`   Football Matches: ${scores.length}`);
        console.log(`   Other Matches: ${otherScores.length}`);
        console.log(`\n🔐 Login Credentials (all users):`);
        console.log(`   Password: password123`);
        console.log(`   Emails: admin@vnit.ac.in, scorer@vnit.ac.in, organizer@vnit.ac.in`);
        console.log("\n");

        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding sample data:", error.message);
        process.exit(1);
    }
};

seedSampleData();
