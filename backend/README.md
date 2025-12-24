# VNIT IG Scoring App - Backend

Backend API for the VNIT Inter-Gymkhana Scoring Application.

## 📋 Prerequisites

- **Node.js** v14.0 or higher
- **npm** v6.0 or higher
- **MongoDB** (Local or Atlas Cloud)
- **.env file** configured

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update with your values:

```bash
cp .env.example .env
```

**Key environment variables to update:**

```
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ig_scoring_app?retryWrites=true&w=majority

# JWT Secret (Generate a strong secret)
JWT_SECRET=your_super_secret_32_character_string_here_1234567890

# CORS Origins
CORS_ORIGIN=http://localhost:5173,http://localhost:5174
```

### 3. Start the Server

**Development mode (with auto-reload):**
```bash
npm run server
```

**Production mode:**
```bash
npm start
```

The server will start at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── contactController.js # Contact endpoints
│   ├── userController.js    # User management
│   └── scoreController.js   # Score management
├── middleware/
│   ├── asyncHandler.js      # Async error handler
│   ├── errorHandler.js      # Global error middleware
│   └── auth.js              # Authentication & authorization
├── models/
│   ├── Contact.js           # Contact schema
│   ├── User.js              # User schema
│   └── Score.js             # Score schema
├── routes/
│   ├── contactRoutes.js     # Contact routes
│   ├── userRoutes.js        # User routes
│   └── scoreRoutes.js       # Score routes
├── uploads/                 # File uploads directory
├── server.js                # Express app setup
├── start.js                 # Entry point
├── package.json
└── .env                     # Environment variables
```

## 🔌 API Endpoints

### Health Check
- `GET /api/health` - Server health status

### Contacts
- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/:id` - Get contact by ID
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/:id` - Update contact
- `DELETE /api/contacts/:id` - Delete contact

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Scores
- `GET /api/scores` - Get all scores (with filters)
- `GET /api/scores/:id` - Get score by ID
- `POST /api/scores` - Create new score
- `PUT /api/scores/:id` - Update score
- `DELETE /api/scores/:id` - Delete score

## 🗄️ Database Schema

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required),
  phone: String,
  role: String (admin, organizer, scorer, participant),
  isActive: Boolean,
  profileImage: String,
  timestamps: true
}
```

### Score Schema
```javascript
{
  event: String (cricket, football, basketball, tennis, table-tennis),
  team1: {
    name: String,
    score: Number
  },
  team2: {
    name: String,
    score: Number
  },
  winner: String (team1, team2, tie),
  status: String (scheduled, live, completed),
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
  status: String (new, in-progress, resolved),
  timestamps: true
}
```

## 🔐 Real-time Features (Socket.io)

The server uses Socket.io for real-time score updates:

**Available Events:**
- `score-update` - Broadcast when a score is updated
- `match-start` - Broadcast when a match starts
- `match-end` - Broadcast when a match ends

## 🛠️ Technology Stack

- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - Database ODM
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **Morgan** - HTTP logging
- **CORS** - Cross-origin requests

## 📝 API Usage Examples

### Create a User
```bash
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Scorer",
    "email": "john@example.com",
    "password": "secure123",
    "phone": "9876543210",
    "role": "scorer"
  }'
```

### Create a Score
```bash
curl -X POST http://localhost:5000/api/scores \
  -H "Content-Type: application/json" \
  -d '{
    "event": "cricket",
    "team1": {
      "name": "Team A",
      "score": 150
    },
    "team2": {
      "name": "Team B",
      "score": 145
    },
    "scoredBy": "user_id_here",
    "matchDate": "2025-12-24",
    "venue": "Sports Ground",
    "remarks": "Great match!"
  }'
```

## 🧪 Testing

To test the API, you can use:
- **Postman** - API testing tool
- **cURL** - Command-line tool
- **Thunder Client** - VS Code extension
- **REST Client** - VS Code extension

## ⚠️ Common Issues

### MongoDB Connection Error
- Check your `MONGODB_URI` in `.env`
- Ensure your IP is whitelisted on MongoDB Atlas
- Verify database credentials

### Port Already in Use
```bash
# Change PORT in .env or use a different port
PORT=5001
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🚢 Deployment

### Deploy on Railway (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Railway dashboard
3. Railway will automatically run `npm start`

### Deploy on Heroku
```bash
heroku login
heroku create your-app-name
git push heroku main
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Socket.io Documentation](https://socket.io/)

## 👥 Team

- Backend Lead: [Your Name]
- Contributors: Team VNIT IG

## 📄 License

MIT License - See LICENSE file for details
