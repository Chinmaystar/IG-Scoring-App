# Installation Checklist ✅

This is a quick checklist for your teammate to follow.

## Pre-Installation

- [ ] Node.js v14+ installed (`node --version`)
- [ ] npm v6+ installed (`npm --version`)
- [ ] MongoDB Atlas account created
- [ ] MongoDB cluster created
- [ ] Database user created in MongoDB
- [ ] IP whitelisted in MongoDB Atlas

## Installation Steps

- [ ] Navigate to backend folder: `cd backend`
- [ ] Install dependencies: `npm install`
- [ ] Copy .env template: `cp .env.example .env`
- [ ] Edit .env with MongoDB URI and JWT secret
- [ ] Verify .env is configured correctly

## Configuration Checklist

`.env` file must contain:
- [ ] `NODE_ENV=development`
- [ ] `PORT=5000`
- [ ] `MONGODB_URI=mongodb+srv://...` (valid connection string)
- [ ] `JWT_SECRET=your_secret_here` (strong string)
- [ ] `CORS_ORIGIN=http://localhost:5173` (or your frontend port)

## Startup Steps

- [ ] Start server: `npm run server` (development) or `npm start` (production)
- [ ] Check console for ✅ MongoDB Connected message
- [ ] Check console for ✓ Server running on port 5000
- [ ] Verify Socket.io is ready

## Verification Steps

After server starts:
- [ ] Open browser: http://localhost:5000/api/health
- [ ] Should see: `{"message":"Server is running"...}`
- [ ] Check MongoDB connection: ✅ shown in console
- [ ] No errors in console

## Testing API

- [ ] Test GET /api/health - should return 200
- [ ] Test POST /api/users - should create user
- [ ] Test GET /api/users - should list users
- [ ] Test POST /api/scores - should create score
- [ ] Test GET /api/scores - should list scores

## Frontend Connection

- [ ] Frontend is running on http://localhost:5173
- [ ] Frontend .env has `VITE_API_URL=http://localhost:5000`
- [ ] Frontend can make API calls to backend
- [ ] Socket.io connection works

## Troubleshooting Checklist

If something fails:
- [ ] Check MongoDB connection string
- [ ] Verify .env file exists and has correct values
- [ ] Delete node_modules and run `npm install` again
- [ ] Check if port 5000 is available
- [ ] Check MongoDB Atlas IP whitelist
- [ ] Review error messages in console
- [ ] Check network connectivity

## Success Indicators ✅

When everything is set up correctly, you should see:
```
�� Starting VNIT IG App...
✅ Environment loaded
🔄 Attempting MongoDB connection...
✅ MongoDB Connected: your-cluster.mongodb.net
✓ Server running on port 5000
📍 Base URL: http://localhost:5000
🔌 Socket.io ready for connections
```

## Files to Check

- [ ] backend/package.json - has all dependencies
- [ ] backend/.env - has all required variables
- [ ] backend/server.js - main server file
- [ ] backend/models/ - has Contact.js, User.js, Score.js
- [ ] backend/controllers/ - has all controllers
- [ ] backend/routes/ - has all routes
- [ ] backend/config/database.js - has DB connection

## Quick Reference

**Start server (development):**
```bash
cd backend
npm run server
```

**Test health endpoint:**
```bash
curl http://localhost:5000/api/health
```

**View logs:**
Check the terminal where server is running

**Stop server:**
Press `Ctrl + C` in terminal

---

**Status:** Ready for Installation
**Date:** December 24, 2025
