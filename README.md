# 🎵 MusicFlow - Full-Stack Music Streaming Application

A modern, responsive music streaming web application built with React, Node.js, and MongoDB. Features include user authentication, playlist management, song/album management, and a beautiful admin panel.

## 🌟 Features

### User Features
- **🎵 Music Streaming**: Play songs with a beautiful audio player
- **❤️ Liked Songs**: Like/unlike songs with persistent storage
- **📚 Playlist Management**: Create, manage, and share playlists
- **🔍 Advanced Search**: Search songs, albums, and playlists
- **📱 Responsive Design**: Works perfectly on desktop and mobile
- **🌙 Dark/Light Theme**: Toggle between themes
- **🎧 Recently Played**: Track your listening history
- **👤 User Authentication**: Secure login/signup system

### Admin Features
- **🎼 Song Management**: Add, edit, and delete songs
- **💿 Album Management**: Create and manage albums
- **📊 Dashboard**: Overview of all content
- **🔧 Content Management**: Full CRUD operations
- **📈 Analytics**: Track user engagement

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **React Toastify** for notifications
- **Context API** for state management

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **Cloudinary** for file storage
- **JWT** for authentication
- **Multer** for file uploads
- **CORS** for cross-origin requests

### Admin Panel
- **React 18** with Vite
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for file storage)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MusicWebApplication
   ```

2. **Install Backend Dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd "../Music Web Application"
   npm install
   ```

4. **Install Admin Panel Dependencies**
   ```bash
   cd "../admin"
   npm install
   ```

### Environment Setup

1. **Backend Environment Variables**
   Create a `.env` file in the `Backend` directory:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/musicflow
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   ```

2. **Frontend Environment Variables**
   Create a `.env` file in the `Music Web Application` directory:
   ```env
   VITE_API_URL=http://localhost:4000
   VITE_APP_NAME=MusicFlow
   VITE_APP_VERSION=1.0.0
   ```

3. **Admin Panel Environment Variables**
   Create a `.env` file in the `admin` directory:
   ```env
   VITE_API_URL=http://localhost:4000
   VITE_APP_NAME=MusicFlow Admin Panel
   VITE_APP_VERSION=1.0.0
   ```

### Running the Application

1. **Start the Backend Server**
   ```bash
   cd Backend
   npm start
   ```
   Server will run on `http://localhost:4000`

2. **Start the Frontend Application**
   ```bash
   cd "Music Web Application"
   npm run dev
   ```
   Application will run on `http://localhost:5173`

3. **Start the Admin Panel**
   ```bash
   cd admin
   npm run dev
   ```
   Admin panel will run on `http://localhost:5174`

## 📁 Project Structure

```
MusicWebApplication/
├── Backend/                    # Node.js backend
│   ├── src/
│   │   ├── config/             # Database and Cloudinary config
│   │   ├── controllers/        # API route handlers
│   │   ├── middleware/         # Authentication and file upload
│   │   ├── models/             # MongoDB schemas
│   │   └── routes/             # API routes
│   ├── server.js               # Main server file
│   └── package.json
├── Music Web Application/       # Main React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # React contexts
│   │   ├── pages/             # Page components
│   │   ├── assets/            # Static assets
│   │   └── utils/             # Utility functions
│   └── package.json
├── admin/                      # Admin panel React app
│   ├── src/
│   │   ├── components/        # Admin components
│   │   ├── pages/             # Admin pages
│   │   └── assets/            # Admin assets
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Songs
- `GET /api/song/list` - Get all songs
- `POST /api/song/add` - Add new song
- `POST /api/song/remove` - Remove song
- `POST /api/song/like` - Like a song
- `POST /api/song/unlike` - Unlike a song
- `GET /api/song/liked` - Get liked songs
- `POST /api/song/recently-played` - Add to recently played
- `GET /api/song/recently-played` - Get recently played songs

### Albums
- `GET /api/album/list` - Get all albums
- `POST /api/album/add` - Add new album
- `POST /api/album/remove` - Remove album

### Playlists
- `GET /api/playlist/list` - Get all playlists
- `POST /api/playlist/create` - Create playlist
- `GET /api/playlist/:id` - Get playlist by ID
- `POST /api/playlist/add-song` - Add song to playlist
- `POST /api/playlist/remove-song` - Remove song from playlist
- `DELETE /api/playlist/delete/:id` - Delete playlist

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd Backend
npm test

# Frontend tests
cd "../Music Web Application"
npm test

# Admin panel tests
cd "../admin"
npm test
```

### Test Coverage
- **Authentication Flow**: Login, signup, profile management
- **Playlist Management**: Create, add/remove songs, delete
- **Song Management**: Play, like/unlike, search
- **Admin Operations**: CRUD operations for songs and albums

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure Cloudinary for file storage
3. Set environment variables
4. Deploy to Heroku, Vercel, or AWS

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or AWS S3

### Admin Panel Deployment
1. Build the admin panel: `npm run build`
2. Deploy to Vercel, Netlify, or AWS S3

## 🔍 Troubleshooting

### Common Issues

#### Search Not Working
- Ensure backend is running on correct port
- Check API URL in environment variables
- Verify search query is being sent correctly

#### Z-Index Issues
- Check button overlays have proper z-index values
- Ensure dropdowns have higher z-index than other elements
- Verify modal overlays are properly positioned

#### Playlist Add/Remove Issues
- Check playlist state updates are immutable
- Verify API calls are returning correct responses
- Ensure optimistic updates are properly handled

#### Authentication Issues
- Verify JWT tokens are being stored correctly
- Check token expiration handling
- Ensure protected routes have proper middleware

### Debug Mode
Enable debug mode by setting `NODE_ENV=development` in your backend `.env` file.

## 📝 Changelog

### Version 1.0.0 (Latest)
- ✅ Fixed Recently Played functionality with backend persistence
- ✅ Fixed Liked Songs persistence across sessions
- ✅ Implemented optimistic UI updates for better UX
- ✅ Fixed duplicate toast notifications
- ✅ Improved Add to Playlist dropdown UI
- ✅ Fixed z-index issues with play buttons
- ✅ Removed all Spotify branding and references
- ✅ Added environment variable support for API URLs
- ✅ Enhanced search functionality
- ✅ Improved responsive design
- ✅ Added comprehensive error handling
- ✅ Fixed playlist re-rendering issues
- ✅ Enhanced admin panel functionality

### Previous Versions
- Initial release with basic music streaming
- User authentication system
- Playlist management
- Admin panel for content management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **Development Team** - MusicFlow Application

## 🙏 Acknowledgments

- React team for the amazing framework
- TailwindCSS for the utility-first CSS framework
- MongoDB for the database solution
- Cloudinary for file storage
- All contributors and testers

---

**Made with ❤️ by the MusicFlow Team**
