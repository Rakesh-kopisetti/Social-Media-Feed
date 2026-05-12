# Social Media Feed - High-Performance React Application

A modern, responsive social media feed application built with React, featuring UI virtualization, infinite scrolling, optimistic updates, and client-side image compression.

## Features Implemented

- **UI Virtualization**: Using `react-window` for efficient rendering of large lists
- **Infinite Scrolling**: Automatically loads more posts as users scroll to the bottom
- **Skeleton Loaders**: Displays loading placeholders while fetching data
- **Optimistic Updates**: Like button updates UI immediately, reverts on error
- **Image Upload & Compression**: Client-side compression with preview before upload
- **Post Creation Modal**: User-friendly interface for creating new posts
- **Error Boundaries**: Graceful error handling for individual post failures
- **Dynamic Routing**: User profile pages at `/profile/:userId`
- **Mock API Server**: JSON Server for realistic API interactions

## Quick Start - Docker (Recommended for Submission)

### Prerequisites
- Docker
- Docker Compose

### Run with Docker Compose (Single Command)

```bash
docker-compose up --build
```

This will:
1. Build the React application (Node 18-alpine)
2. Build and start the API server (Node 18-alpine)
3. Start the frontend on `http://localhost:3000`
4. Start the API on `http://localhost:8000`
5. Both services have health checks enabled

**Visit:** `http://localhost:3000` in your browser

To stop:
```bash
docker-compose down
```

## Local Development Setup (Alternative)

### Prerequisites
- Node.js 18+ 
- npm

### Installation & Running

1. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

2. **Start the mock API server** (in terminal 1):
   ```bash
   node api/server.js
   ```

3. **Start the frontend dev server** (in terminal 2):
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to:
   ```
   http://localhost:3001
   ```
   (Vite uses 3001 if 3000 is busy)

## Project Structure

```
Social-Media/
├── src/
│   ├── components/
│   │   ├── PostCard.jsx           # Individual post component with like button
│   │   ├── SkeletonPost.jsx       # Loading skeleton placeholder
│   │   └── CreatePostModal.jsx    # Modal for creating new posts
│   ├── pages/
│   │   ├── Feed.jsx               # Main virtualized feed with infinite scroll
│   │   └── Profile.jsx            # User profile showing their posts
│   ├── App.jsx                    # Main app with routing
│   ├── main.jsx                   # React entry point
│   └── styles.css                 # Global styles
├── api/
│   └── db.json                    # Mock database
├── index.html                     # HTML entry point
├── vite.config.js                 # Vite configuration
├── package.json                   # Project dependencies
├── Dockerfile                     # Docker image for React app
├── docker-compose.yml             # Orchestration for app + API
└── .env.example                   # Environment variables template
```

## Core Requirements Implementation

### 1. Containerization
- Full Docker and Docker Compose setup included
- Both frontend and API services with health checks
- Single `docker-compose up --build` command starts all services

### 2. Environment Variables
- `.env.example` documents all required variables
- `VITE_API_BASE_URL` points to mock API (localhost:8000 locally, http://api:8000 in Docker)

### 3. Initial Feed Render (initial-feed-render)
- Fetches first page of posts on component mount
- Displays posts as distinct card elements

### 4. Infinite Scroll (infinite-scroll)
- Automatically loads next page when scrolling to bottom
- Loading indicator shown during fetch
- Prevents duplicate requests with loading flag

### 5. UI Virtualization
- Uses `react-window` FixedSizeList for efficient rendering
- Only renders visible items + buffer
- Handles 60+ posts smoothly

### 6. Skeleton Loaders (skeleton-loader)
- Gray placeholder cards mimic post layout
- Shown during initial load and infinite scroll

### 7. Optimistic Like Updates (optimistic-like-update)
- Clicking like button immediately updates UI
- PATCH request sent in background
- Reverts UI on error with toast notification

### 8. Post Creation Modal (post-creation-modal)
- Button opens modal with form
- Includes caption input and image upload area

### 9. Image Upload Preview (image-upload-preview)
- Using `react-dropzone` for image selection
- Preview displayed immediately in modal

### 10. Image Compression (image-compression-function)
- `browser-image-compression` library for client-side compression
- Exposed as `window.compressImage` globally
- Reduces image size before upload

### 11. Toast Notification (toast-notification)
- Using `react-toastify` for notifications
- Shows on successful post creation

### 12. Error Boundary (error-boundary)
- Wraps each PostCard component
- Displays fallback UI for individual post failures
- Rest of feed remains functional

### 13. User Profile Page
- Route: `/profile/:userId`
- Displays all posts by specified user
- Client-side filtering of posts

## API Endpoints

**Mock API runs on `http://localhost:8000`**

- `GET /posts` - Fetch all posts
- `GET /users` - Fetch all users
- `GET /comments` - Fetch all comments
- `PATCH /posts/:id` - Update post (like count, liked status)
- `POST /posts` - Create new post

*Note: JSON Server v1+ doesn't support query parameters. All filtering is done client-side.*

## Environment Variables

**For local development**, create a `.env` file (copy from `.env.example`):
```bash
VITE_API_BASE_URL=http://localhost:8000
```

**For Docker**, the environment is automatically set in `docker-compose.yml`:
```yaml
VITE_API_BASE_URL=http://api:8000
```

⚠️ **Important**: Do NOT commit `.env` file to Git. Only `.env.example` should be committed.

## Docker Setup & Submission

### Build and Run with Docker Compose

```bash
# Build images and start all services
docker-compose up --build

# Or just run if images already built
docker-compose up

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
docker-compose logs -f api
```

### Docker Architecture

**docker-compose.yml** orchestrates:
- **app** service: React frontend (Node 18-alpine)
  - Port: 3000
  - Health check: TCP connection every 30s
  - Environment: VITE_API_BASE_URL=http://api:8000
  
- **api** service: Custom Node.js API server (Node 18-alpine)
  - Port: 8000
  - Serves `api/db.json` with 60 mock posts
  - Health check: TCP connection every 10s

Both services have startup health checks and depend on each other starting correctly.

### Files Included

**Root Configuration:**
- `Dockerfile` - Frontend build (React app)
- `api.Dockerfile` - API server build
- `docker-compose.yml` - Service orchestration
- `.env.example` - Environment variables template (commit this, NOT `.env`)
- `.gitignore` - Git exclusion rules (excludes `.env`, `node_modules`, etc.)

**Application:**
- `src/` - React source code
- `api/` - Mock API server and database
- `dist/` - Production build output (generated by `npm run build`)
- `package.json` - Dependencies and scripts
- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration

### Services
- **App**: http://localhost:3000
- **API**: http://localhost:8000

### Submission Checklist

✅ **Included in Repository:**
- `docker-compose.yml` - Starts app + API with single command
- `.env.example` - Documents all environment variables
- `.gitignore` - Excludes `.env` and build artifacts
- `README.md` - Comprehensive setup instructions
- `Dockerfile` - Frontend containerization
- `api.Dockerfile` - API server containerization
- All source code (`src/`, `api/`)
- `package.json` with all dependencies

❌ **NOT Committed:**
- `.env` (real secrets)
- `node_modules/` (dependencies)
- `dist/` (build output)
- `.DS_Store`, `*.log`, etc.

## Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **react-window** - UI virtualization
- **react-router-dom** - Client-side routing
- **@tanstack/react-query** - Server state management
- **react-dropzone** - File upload handling
- **browser-image-compression** - Image optimization
- **react-toastify** - Toast notifications
- **json-server** - Mock API server

## Performance Optimizations

1. **Virtualization** - Only renders visible posts (~5 at a time)
2. **Image Compression** - Reduces upload size by 70-90%
3. **Lazy Loading** - Code splitting for routes
4. **Memoization** - React.memo on components to prevent unnecessary re-renders
5. **Efficient State Management** - Separate server and UI state

## Testing Features Locally

### Test Like Button (Optimistic Update)
1. Open app
2. Click the like button (♡) on any post
3. Count should increment immediately
4. Verify API call in Network tab

### Test Infinite Scroll
1. Scroll to bottom of feed
2. More posts load automatically
3. Virtualization keeps DOM lean

### Test Image Upload
1. Click "Create Post" button
2. Drag or select an image
3. See preview appear
4. Add caption and submit
5. Toast notification confirms creation

### Test Profile Page
1. Click "User X" heading on any post (or manually navigate to `/profile/1`)
2. See only posts from that user

## Troubleshooting

**Q: Posts not loading?**
- Ensure json-server is running on port 8000
- Check browser console for CORS errors
- Verify `VITE_API_BASE_URL` environment variable

**Q: Images not uploading?**
- Check file size (compression should reduce it)
- Verify browser has permission to access files
- Check Network tab for API errors

**Q: Infinite scroll not working?**
- Ensure viewport is small enough to trigger scroll
- Check console for JavaScript errors
- Verify posts are in api/db.json

## Notes

- This is a demo application with a mock API
- All data is stored in `api/db.json` and will reset on server restart
- Images are stored as blob URLs (in-memory only)
- User authentication is mocked (always logged in as User 1)

## Author

Built as a demonstration of modern React patterns for high-performance social media feeds.

#   S o c i a l - M e d i a - F e e d  
 #   - S o c i a l - M e d i a - F e e d  
 