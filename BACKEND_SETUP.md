# VNIT IG Scoring App - Backend Setup Guide

## ✅ What's Ready

Your backend is fully configured with:
- ✅ MongoDB Atlas connection (IGSCORE database)
- ✅ Express.js server with Socket.io support
- ✅ Complete API structure (Contacts, Users, Scores)
- ✅ Database models with Mongoose
- ✅ Middleware (auth, error handling, async handlers)
- ✅ All dependencies installed

---

## 📦 Project Structure

```
backend/
├── config/
│   └── database.js              # MongoDB connection
├── middleware/
│   ├── asyncHandler.js          # Async error wrapper
│   ├── auth.js                  # JWT & role-based auth
│   └── errorHandler.js          # Error handling middleware
├── models/
│   ├── Contact.js               # Contact schema
│   ├── User.js                  # User schema
│   └── Score.js                 # Score schema
├── controllers/
│   ├── contactController.js     # Contact logic
│   ├── userController.js        # User logic
│   └── scoreController.js       # Score logic
├── routes/
│   ├── contactRoutes.js         # Contact endpoints
│   ├── userRoutes.js            # User endpoints
│   └── scoreRoutes.js           # Score endpoints
├── uploads/                      # File upload directory
├── .env                         # Environment variables (configured)
├── .env.example                 # Template for .env
├── package.json                 # Dependencies
├── start.js                     # Entry point
└── server.js                    # Main server file
```

---

## 🚀 Getting Started

### 1. Start the Server

```bash
cd backend
npm start
```

Or for development with auto-reload:
```bash
npm run server
```

Expected output:
```
✅ Environment loaded
🔄 Connecting to MongoDB...
✅ MongoDB Connected: ac-0yfn5tb-shard-00-01.bro996a.mongodb.net
✓ Server running on port 5000
🔌 Socket.io ready for connections
```

### 2. Test the Server

```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "message": "Server is running",
  "timestamp": "2025-12-24T...",
  "environment": "development"
}
```

---

## 📚 API Endpoints

### Contacts
- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get single contact
- `POST /api/contacts` - Create contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get single user
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Scores
- `GET /api/scores` - Get all scores
- `GET /api/scores/:id` - Get single score
- `POST /api/scores` - Create score
- `PUT /api/scores/:id` - Update score
- `DELETE /api/scores/:id` - Delete score

---

## 🔐 Environment Variables

All configured in `.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://...@igscore...
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

**Note**: Keep `.env` secure, don't commit to Git (already in .gitignore)

---

## 📊 Database Models

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  phone: String,
  role: 'admin' | 'organizer' | 'scorer' | 'participant',
  isActive: Boolean,
  profileImage: String,
  timestamps: true
}
```

### Score Schema
```javascript
{
  event: 'cricket' | 'football' | 'basketball' | 'tennis' | 'table-tennis',
  team1: { name: String, score: Number },
  team2: { name: String, score: Number },
  winner: 'team1' | 'team2' | 'tie',
  status: 'scheduled' | 'live' | 'completed',
  scoredBy: ObjectId (ref: User),
  matchDate: Date,
  venue: String,
  remarks: String,
  timestamps: true
}
```

### Contact Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String,
  message: String (required),
  subject: String,
  status: 'new' | 'in-progress' | 'resolved',
  timestamps: true
}
```

---

## 🔧 Next Steps for Teammates

1. **Frontend Connection**: Update frontend to call `http://localhost:5000/api/...`
2. **Authentication**: Implement JWT login in auth routes
3. **Testing**: Use Postman/Thunder Client to test endpoints
4. **Database**: Create sample data using POST requests

---

## 📝 Example Requests

### Create a User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "scorer"
  }'
```

### Create a Score
```bash
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "event": "cricket",
    "team1": { "name": "Team A", "score": 45 },
    "team2": { "name": "Team B", "score": 38 },
    "scoredBy": "<user_id>",
    "matchDate": "2025-12-24"
  }'
```

---

## 🐛 Troubleshooting

**MongoDB Connection Failed?**
- Check MONGODB_URI in .env is correct
- Verify your IP is whitelisted in MongoDB Atlas
- Check internet connection

**Port 5000 Already in Use?**
- Change PORT in .env
- Or kill the process: `lsof -ti:5000 | xargs kill -9`

**Dependencies Missing?**
- Run: `npm install`

---

## 📞 Support

All code is documented with JSDoc comments. Check controller files for detailed function descriptions.

Happy coding! 🎉
