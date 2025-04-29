# InstaVote - Social Media Voting Platform

A MERN stack social media application that enables users to share posts and participate in community voting. The platform features real-time notifications, trending posts, and interactive commenting system.

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Directory Structure](#directory-structure)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### User Management
- 👤 User registration and JWT authentication
- 🔐 Secure password hashing
- 📝 Profile customization (bio, profile picture)
- 🔄 Profile updates and settings

### Posts
- 📸 Create posts with images
- 🏷️ Add multiple tags to posts
- ✏️ Edit post captions and tags
- 🗑️ Delete posts
- 🔍 Filter posts by tags

### Interaction
- ⬆️ Vote on posts
- 💬 Comment on posts
- 🔔 Real-time notifications for:
  - New posts from other users
  - Votes on your posts
  - Comments on your posts
  - Trending achievements

### Discovery
- 🔥 Trending posts section
- 🏆 Most voted posts by tag
- 🔍 Tag-based exploration
- 📊 Post engagement tracking

## 🛠️ Tech Stack

- **Frontend:**
  - React.js
  - Axios for API calls
  - React Router for navigation
  - Context API for state management
  - CSS Modules for styling

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - Multer for file uploads

## 📋 Prerequisites

- Node.js (v14.0.0 or higher)
- MongoDB (v4.0.0 or higher)
- npm or yarn
- Git

## 🚀 Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/instavote.git
cd MERN-SOCIAL-MEDIA-APP
```

2. **Backend Setup**
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create uploads directory
mkdir uploads

# Start the server
npm start
```

3. **Frontend Setup**
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the application
npm start
```

## 🔐 Environment Variables

### Backend (.env)
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000
```

## 📚 API Documentation

### Authentication
```http
POST /api/auth/signup
POST /api/auth/login
GET /api/auth/profile
PUT /api/auth/profile-setup
```

### Posts
```http
POST /api/posts/upload
GET /api/posts/feed
GET /api/posts/tag/:tag
PUT /api/posts/:id
DELETE /api/posts/:id
```

### Interactions
```http
POST /api/likes/like
POST /api/likes/unlike
GET /api/likes/user
POST /api/comments/add
GET /api/comments/:postId
```

### Notifications
```http
GET /api/notifications
POST /api/notifications/read/:id
POST /api/notifications/mark-all-read
```

## 📁 Directory Structure
MERN-SOCIAL-VOTE-APP/
├── backend/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── uploads/
│ └── server.js
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── components/
│ │ ├── context/
│ │ ├── pages/
│ │ └── App.js
│ └── package.json
└── README.md


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
```bash
git checkout -b feature/AmazingFeature
```
3. Commit your changes
```bash
git commit -m 'Add some AmazingFeature'
```
4. Push to the branch
```bash
git push origin feature/AmazingFeature
```
5. Open a Pull Request

## 🔧 Common Issues & Solutions

### Backend Issues
- **MongoDB Connection Failed**: Check your MongoDB URI and ensure MongoDB is running
- **JWT Malformed**: Ensure proper token format in Authorization header
- **File Upload Error**: Check uploads directory permissions

### Frontend Issues
- **CORS Error**: Verify backend URL and CORS configuration
- **Authentication Error**: Check if token is properly stored in localStorage
- **Image Loading Failed**: Confirm correct image path and backend URL


## 🙏 Acknowledgments

- MongoDB for database
- Express.js for backend framework
- React.js for frontend framework
- Node.js for runtime environment


Made with ❤️ by SATYAM TYAGI and AISHITA