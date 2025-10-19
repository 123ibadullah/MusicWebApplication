# 🎵 MusicFlow - Modern Music Web Application

A beautiful, responsive, and fully functional music streaming web application built with React, Node.js, and modern web technologies.

## ✨ Features

### 🎧 **Advanced Music Player**
- **Full Playback Controls**: Play, pause, next, previous, shuffle, repeat
- **Progress Tracking**: Real-time progress bar with seek functionality
- **Volume Control**: Interactive volume slider with visual feedback
- **Like System**: Heart songs and manage your favorites
- **Recently Played**: Automatic tracking of listening history

### 🎨 **Modern UI/UX**
- **Glassmorphism Design**: Beautiful glass-like effects and blur backgrounds
- **Dark/Light Mode**: Seamless theme switching with system preference detection
- **Responsive Design**: Perfect experience on desktop, tablet, and mobile
- **Smooth Animations**: Micro-interactions and fluid transitions
- **Gradient Backgrounds**: Eye-catching color schemes

### 📱 **Responsive Layout**
- **Mobile-First**: Optimized for all screen sizes
- **Collapsible Sidebar**: Space-efficient navigation
- **Touch-Friendly**: Gesture support for mobile devices
- **Adaptive Grid**: Smart layout adjustments

### 🔍 **Smart Search**
- **Real-time Search**: Instant results as you type
- **Multi-category Search**: Songs, albums, and playlists with tabbed interface
- **Parallel Search**: Simultaneous search across all content types
- **Advanced Filtering**: Filter results by content type (All, Songs, Albums, Playlists)

### 📚 **Library Management**
- **Playlists**: Create, manage, and organize your music with instant UI updates
- **Add to Playlist**: Modal-based playlist selection with real-time updates
- **Albums**: Browse and explore album collections
- **Liked Songs**: Quick access to your favorites
- **Recently Played**: Never lose track of what you've heard
- **Sequential Playback**: Automatic playlist progression with next song logic
- **Instant Song Removal**: Songs disappear immediately when removed from playlists

### 🔐 **User Authentication**
- **MongoDB Database**: Secure user management with MongoDB
- **JWT Tokens**: Industry-standard authentication with JSON Web Tokens
- **Password Hashing**: bcrypt encryption for secure password storage
- **Session Persistence**: Stay logged in across browser sessions
- **User Registration**: Create accounts with name, email, and password
- **Login System**: Secure authentication with credential validation
- **Profile Management**: Update user profile and change password
- **Cross-Device Sync**: Login from any device with same credentials

## 🚀 Technology Stack

### Frontend
- **React 19** - Latest React with concurrent features
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Context API** - State management
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing
- **Cloudinary** - Cloud media storage
- **Multer** - File upload handling

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- Cloudinary account (for media storage)

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the Backend directory:
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/musicflow
   JWT_SECRET=your-super-secret-jwt-key-here
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start the server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd "Music Web Application"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
Music Web Application/
├── src/
│   ├── components/          # React components
│   │   ├── Player.jsx       # Music player component
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── Navbar.jsx       # Top navigation
│   │   ├── AlbumItem.jsx    # Album display component
│   │   ├── SongItem.jsx     # Song display component
│   │   └── ...
│   ├── context/             # React context providers
│   │   ├── PlayerContext.jsx
│   │   └── ThemeContext.jsx
│   ├── pages/               # Page components
│   └── assets/              # Static assets
├── public/                  # Public assets
└── package.json

Backend/
├── src/
│   ├── controllers/         # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   └── config/            # Configuration files
├── server.js              # Main server file
└── package.json
```

## 🎯 Key Features Implementation

### Music Player System
- **Audio Context Management**: Centralized audio state with React Context
- **Progress Tracking**: Real-time audio progress with visual feedback
- **Playlist Management**: Queue management and playlist controls
- **Keyboard Shortcuts**: Space for play/pause, arrow keys for navigation

### Responsive Design
- **Mobile-First Approach**: Designed for mobile, enhanced for desktop
- **Flexible Grid System**: Adaptive layouts for different screen sizes
- **Touch Gestures**: Swipe navigation and touch-friendly controls
- **Performance Optimized**: Lazy loading and efficient rendering

### Modern UI Components
- **Glassmorphism Effects**: Backdrop blur and transparency
- **Gradient Backgrounds**: Dynamic color schemes
- **Micro-animations**: Smooth transitions and hover effects
- **Loading States**: Skeleton loaders and progress indicators

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `PUT /api/auth/change-password` - Change password (protected)
- `DELETE /api/auth/account` - Delete user account (protected)

### Songs
- `GET /api/song/list` - Get all songs
- `POST /api/song/add` - Add new song
- `DELETE /api/song/remove` - Remove song
- `POST /api/song/like` - Like a song
- `POST /api/song/unlike` - Unlike a song

### Albums
- `GET /api/album/list` - Get all albums
- `POST /api/album/add` - Add new album
- `DELETE /api/album/remove` - Remove album

### Playlists
- `GET /api/playlist/list` - Get all playlists
- `POST /api/playlist/create` - Create playlist
- `DELETE /api/playlist/delete/:id` - Delete playlist
- `POST /api/playlist/add-song` - Add song to playlist
- `POST /api/playlist/remove-song` - Remove song from playlist

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3B82F6)
- **Secondary**: Purple (#8B5CF6)
- **Accent**: Pink (#EC4899)
- **Success**: Green (#10B981)
- **Warning**: Yellow (#F59E0B)
- **Error**: Red (#EF4444)

### Typography
- **Font Family**: Inter (primary), Poppins (accent)
- **Weights**: 300, 400, 500, 600, 700, 800
- **Responsive**: Fluid typography scaling

### Spacing System
- **Base Unit**: 4px (0.25rem)
- **Scale**: 1, 2, 3, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

## 🚀 Performance Optimizations

### Frontend
- **Code Splitting**: Lazy loading of components
- **Memoization**: React.memo and useMemo for expensive operations
- **Virtual Scrolling**: Efficient rendering of large lists
- **Image Optimization**: Lazy loading and responsive images
- **Bundle Optimization**: Tree shaking and dead code elimination

### Backend
- **Database Indexing**: Optimized MongoDB queries
- **Caching**: Redis for frequently accessed data
- **File Compression**: Gzip compression for API responses
- **Rate Limiting**: Protection against abuse

## 🧪 Testing

### Frontend Testing
```bash
npm run test
```

### Backend Testing
```bash
npm test
```

## 📱 Browser Support

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS
- **Vite Team** - For the fast build tool
- **MongoDB** - For the flexible database
- **Cloudinary** - For cloud media storage

---

**Built with ❤️ for music lovers everywhere**