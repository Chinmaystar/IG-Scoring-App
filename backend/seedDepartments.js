const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Department = require("./models/Department");
const connectDB = require("./config/database");

// Load environment variables
dotenv.config();

// 8 Departments at VNIT
const departments = [
    { name: "Computer Science and Engineering", shortName: "CSE" },
    { name: "Electrical Engineering", shortName: "EE" },
    { name: "Electronics and Communication Engineering", shortName: "ECE" },
    { name: "Mechanical Engineering", shortName: "MECH" },
    { name: "Civil Engineering", shortName: "CIVIL" },
    { name: "Metallurgical and Materials Engineering", shortName: "MME" },
    { name: "Chemical Engineering", shortName: "CHEM" },
    { name: "Mining Engineering", shortName: "MINING" },
];

const seedDepartments = async () => {
    try {
        console.log("🔄 Connecting to MongoDB...");
        await connectDB();

        console.log("🗑️  Clearing existing departments...");
        await Department.deleteMany({});

        console.log("📝 Creating 8 departments...");
        const createdDepartments = await Department.insertMany(departments);

        console.log("✅ Successfully created departments:");
        createdDepartments.forEach((dept) => {
            console.log(`   - ${dept.shortName}: ${dept.name}`);
        });

        console.log(`\n✨ Total: ${createdDepartments.length} departments created`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error seeding departments:", error.message);
        process.exit(1);
    }
};

seedDepartments();
