# VNIT IG Scoring App - Complete Setup Guide

## 📋 Overview

This document provides step-by-step instructions for your teammate to set up and run the VNIT IG Scoring App backend.

## ✅ What's Included

### Backend Structure
```
backend/
├── config/
│   └── database.js              ✅ MongoDB connection with error handling
├── controllers/
│   ├── contactController.js     ✅ Contact CRUD operations
│   ├── userController.js        ✅ User management
│   └── scoreController.js       ✅ Score management with logic
├── middleware/
│   ├── asyncHandler.js          ✅ Async error handling wrapper
│   ├── errorHandler.js          ✅ Global error middleware
│   └── auth.js                  ✅ JWT authentication & authorization
├── models/
│   ├── Contact.js               ✅ Contact schema with validations
│   ├── User.js                  ✅ User schema with role-based access
│   └── Score.js                 ✅ Score schema with event types
├── routes/
│   ├── contactRoutes.js         ✅ Full CRUD routes for contacts
│   ├── userRoutes.js            ✅ User management routes
│   └── scoreRoutes.js           ✅ Score management routes
├── server.js                    ✅ Main Express app with Socket.io
├── start.js                     ✅ Entry point with startup checks
├── package.json                 ✅ All dependencies included
├── .env.example                 ✅ Environment variables template
├── .env                         ✅ Your local environment variables
└── README.md                    ✅ Detailed API documentation
```

## 🚀 Quick Start for Your Teammate

### Step 1: Clone/Pull the Project
```bash
cd "/home/anshul-jain/Desktop/acm vnit ig/IG-Scoring-App-copy"
```

### Step 2: Install Dependencies
```bash
cd backend
npm install
```

This will install all required packages:
- ✅ express - Web framework
- ✅ mongoose - MongoDB ODM
- ✅ socket.io - Real-time updates
- ✅ jsonwebtoken - JWT authentication
- ✅ bcryptjs - Password hashing
- ✅ helmet - Security headers
- ✅ cors - Cross-origin requests
- ✅ morgan - HTTP logging
- ✅ dotenv - Environment variables

### Step 3: Configure Environment Variables

Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env` and update these critical values:

```
# Required: MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ig_scoring_app?retryWrites=true&w=majority

# Required: JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_32_character_string_here_1234567890

# Optional but recommended
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
NODE_ENV=development
PORT=5000
```

**To get MongoDB URI:**
1. Go to MongoDB Atlas (https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create a database user
4. Get connection string
5. Replace `username`, `password`, and `database-name`

### Step 4: Start the Server

**For Development (with auto-reload):**
```bash
npm run server
```

**For Production:**
```bash
npm start
```

### Expected Output:
```
🔄 Starting VNIT IG App...
✅ Environment loaded
🔄 Attempting MongoDB connection...
✅ MongoDB Connected: your-cluster.mongodb.net
✓ Server running on port 5000
📍 Base URL: http://localhost:5000
🔌 Socket.io ready for connections
```

## 📊 Database Models

### 1. User Model
**Purpose:** Manage users (admins, organizers, scorers, participants)

**Fields:**
- name (required) - User's full name
- email (required, unique) - Email address
- password (required) - Hashed password
- phone - Contact number
- role - "admin", "organizer", "scorer", or "participant"
- isActive - Account status
- profileImage - Profile picture URL
- createdAt, updatedAt - Timestamps

**Example:**
```javascript
{
  "name": "John Scorer",
  "email": "john@vnit.ac.in",
  "password": "hashed_password",
  "phone": "9876543210",
  "role": "scorer",
  "isActive": true
}
```

### 2. Score Model
**Purpose:** Record match scores for various sports

**Fields:**
- event - Sport type (cricket, football, basketball, tennis, table-tennis)
- team1.name, team1.score - First team details
- team2.name, team2.score - Second team details
- winner - Which team won (team1, team2, or tie)
- status - Match status (scheduled, live, completed)
- scoredBy - Reference to User who recorded the score
- matchDate - When the match happened
- venue - Match location
- remarks - Additional notes
- createdAt, updatedAt - Timestamps

**Example:**
```javascript
{
  "event": "cricket",
  "team1": {
    "name": "CSE Department",
    "score": 175
  },
  "team2": {
    "name": "EE Department",
    "score": 168
  },
  "winner": "team1",
  "status": "completed",
  "scoredBy": "user_id_here",
  "matchDate": "2025-12-24",
  "venue": "VNIT Sports Ground"
}
```

### 3. Contact Model
**Purpose:** Store contact form submissions

**Fields:**
- name (required) - Sender's name
- email (required, unique) - Email address
- phone - Contact number
- message (required) - Message content
- subject - Message subject
- status - Request status (new, in-progress, resolved)
- createdAt, updatedAt - Timestamps

## 🔌 API Endpoints Summary

### Health Check
- `GET /api/health` - Check if server is running

### Contacts API
```
GET    /api/contacts        - Get all contacts
POST   /api/contacts        - Create new contact
GET    /api/contacts/:id    - Get specific contact
PUT    /api/contacts/:id    - Update contact
DELETE /api/contacts/:id    - Delete contact
```

### Users API
```
GET    /api/users           - Get all users
POST   /api/users           - Create new user
GET    /api/users/:id       - Get specific user
PUT    /api/users/:id       - Update user
DELETE /api/users/:id       - Delete user
```

### Scores API
```
GET    /api/scores          - Get all scores (filterable)
POST   /api/scores          - Create new score
GET    /api/scores/:id      - Get specific score
PUT    /api/scores/:id      - Update score
DELETE /api/scores/:id      - Delete score
```

**Filters for Scores:**
- `?event=cricket` - Filter by sport
- `?status=completed` - Filter by status
- `?limit=50&page=1` - Pagination

## 🧪 Testing the API

### Using cURL:

**Create a User:**
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Scorer",
    "email": "test@vnit.ac.in",
    "password": "Test@123",
    "role": "scorer"
  }'
```

**Create a Score:**
```bash
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "event": "cricket",
    "team1": {"name": "Team A", "score": 150},
    "team2": {"name": "Team B", "score": 145},
    "scoredBy": "REPLACE_WITH_USER_ID",
    "matchDate": "2025-12-24",
    "venue": "Sports Ground"
  }'
```

**Get All Scores:**
```bash
curl http://localhost:5000/api/scores
```

### Using Postman:
1. Open Postman
2. Create new collection "VNIT IG"
3. Add requests for each endpoint
4. Set Body type to JSON
5. Test and save responses

## 🔐 Authentication Notes

- JWT tokens are implemented but not enforced on public endpoints
- To add authentication to routes, use middleware from `middleware/auth.js`
- Example: `router.post("/", verifyToken, createUser)`

## 📁 File Locations

| File | Purpose | Location |
|------|---------|----------|
| Server | Main Express app | `backend/server.js` |
| Entry | Startup script | `backend/start.js` |
| Models | Database schemas | `backend/models/` |
| Controllers | Business logic | `backend/controllers/` |
| Routes | API endpoints | `backend/routes/` |
| Middleware | Custom functions | `backend/middleware/` |
| Config | Database connection | `backend/config/` |
| Uploads | File storage | `backend/uploads/` |

## ⚠️ Troubleshooting

### Issue: MongoDB Connection Error
```
❌ MongoDB Connection Error: ENOTFOUND cluster.mongodb.net
```
**Solution:**
- Check MONGODB_URI in .env
- Ensure IP is whitelisted on MongoDB Atlas
- Verify credentials are correct

### Issue: Port 5000 Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
```bash
# Change port in .env
PORT=5001
```

### Issue: Module Not Found
```
Error: Cannot find module 'mongoose'
```
**Solution:**
```bash
# Reinstall dependencies
npm install
```

### Issue: .env Not Loading
```bash
# Ensure .env file exists in backend directory
ls -la backend/.env

# Check NODE_ENV
echo $NODE_ENV
```

## 🎯 Next Steps for Your Teammate

1. **Install dependencies** - `npm install`
2. **Configure .env** - Copy from .env.example and add MongoDB URI
3. **Start server** - `npm run server`
4. **Test endpoints** - Use cURL or Postman
5. **Check frontend** - Ensure frontend is configured to use `http://localhost:5000`
6. **Create sample data** - Add test users and scores
7. **Review code** - Understand the controller and model structure

## 📚 Important Files to Review

1. **backend/start.js** - Startup checks and initialization
2. **backend/server.js** - Express app setup and middleware
3. **backend/models/User.js** - User data structure
4. **backend/models/Score.js** - Score data structure
5. **backend/controllers/scoreController.js** - Score business logic
6. **backend/middleware/errorHandler.js** - Error handling strategy

## 🤝 Communication with Teammate

Share this with your teammate:
- ✅ All source code is ready to use
- ✅ Models are properly structured
- ✅ Middleware is implemented
- ✅ Error handling is in place
- ✅ Database configuration is prepared
- ✅ Routes are complete and tested
- ✅ Just need to configure .env and run `npm install`

## 📞 Support

If your teammate encounters issues:
1. Check the troubleshooting section
2. Review the README.md in backend folder
3. Check server console for error messages
4. Verify MongoDB connection
5. Ensure all dependencies are installed

---

**Created on:** December 24, 2025
**Status:** ✅ Ready for Use
**Backend Version:** 1.0.0
