# 🚀 SaaS Chatbot - Comprehensive Setup Guide

## Table of Contents
1. [System Requirements](#system-requirements)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Running the Application](#running-the-application)
5. [Features Guide](#features-guide)
6. [Customization](#customization)
7. [Deployment](#deployment)
8. [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **Node.js**: 16.0.0 or higher
- **npm**: 7.0.0 or higher
- **RAM**: 4GB
- **Storage**: 500MB free space

### Recommended
- **Node.js**: 18.0.0+
- **npm**: 9.0.0+
- **RAM**: 8GB+

### Optional
- **Python**: 3.8+ (for Python backend)
- **Git**: For version control

---

## Installation

### Step 1: Clone or Download Project
```bash
# If using git
git clone <repository-url>
cd saas-chatbot

# Or extract zip and navigate to folder
cd saas-chatbot
```

### Step 2: Install Frontend Dependencies
```bash
npm install
```

This installs:
- React 18
- Vite (build tool)
- Tailwind CSS
- Axios
- React Icons
- Zustand (state management)

### Step 3: Install Backend Dependencies

**Option A: Node.js/Express**
```bash
cd backend-nodejs  # or same folder if integrated
npm install
```

**Option B: Python/Flask**
```bash
# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install flask flask-cors python-dotenv
```

---

## Configuration

### Environment Setup

1. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your settings**
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_APP_NAME=AiChat Pro
   PORT=5000
   DEBUG=true
   ```

3. **Optional: AI Service Integration**
   ```env
   # OpenAI
   OPENAI_API_KEY=sk-your-key-here

   # Azure OpenAI
   AZURE_OPENAI_KEY=your-key-here
   AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
   ```

### Vite Configuration
- **Dev Server Port**: 5173 (configurable in `vite.config.js`)
- **Build Target**: Modern browsers with ES modules
- **Hot Module Reload**: Enabled by default

### Tailwind Configuration
- **Dark Mode**: Class-based (`class` strategy)
- **Content**: Scans `src/**/*.{js,jsx}` for class usage
- **Colors**: Extended with custom primary palette
- **Plugins**: CSS utilities for animations and effects

---

## Running the Application

### Development Mode

**Terminal 1 - Frontend Development Server**
```bash
npm run dev
```
- Opens automatically at `http://localhost:5173`
- Hot reload on file changes
- Dev tools enabled

**Terminal 2 - Backend Server**

Node.js:
```bash
node backend.js
```

Python:
```bash
# If virtual env not activated, activate it first
python backend.py
```

### Production Build

**Build Frontend**
```bash
npm run build
```
- Creates optimized `dist/` folder
- Minified and bundled code
- Ready for deployment

**Test Production Build Locally**
```bash
npm run preview
```

---

## Features Guide

### Authentication
- **Mock Login System**: Enter name and email
- **User Profile**: Shows in header
- **Logout**: Returns to login screen
- **Persistent Session**: During browser session

### Chat Features

#### Message System
- **User Messages**: Right-aligned, blue gradient
- **Bot Messages**: Left-aligned, gray glass effect
- **Timestamps**: Every message shows time
- **Animations**: Smooth fade-in entrance

#### Sidebar Navigation
- **Conversation List**: All your chats
- **Quick Search**: Filter by title
- **Delete Button**: Remove individual chats
- **New Chat**: Start fresh conversation
- **Active Indicator**: Shows current chat

#### Chat Actions
- **Send Message**: Click button or press Enter
- **Clear Chat**: Delete all messages in conversation
- **Refresh**: Reload current state
- **Keyboard Support**: Shift+Enter doesn't work (reserved for future)

#### Error Handling
- **Connection Error**: Backend unreachable
- **Timeout Error**: Request > 30 seconds
- **Empty Message**: Prevented with validation
- **Invalid Response**: Graceful error display

### Theme System
- **Light Mode**: Bright background, dark text
- **Dark Mode**: Dark background, light text
- **Toggle Button**: Top right of header
- **Persistence**: Saved to localStorage
- **Smooth Transition**: 200ms theme change

### Responsive Design
Breakpoints:
- **Mobile**: < 768px - Single column, collapse sidebar
- **Tablet**: 768px - 1024px - Sidebar visible, flexible
- **Desktop**: > 1024px - Full layout with permanent sidebar

---

## Customization

### Change Colors

**Edit `tailwind.config.js`**
```javascript
theme: {
  extend: {
    colors: {
      'primary': {
        500: '#your-color', // Change primary color
      },
    },
  },
},
```

**Or in individual components**
```jsx
className="bg-primary-500 hover:bg-primary-600"
// Change to:
className="bg-purple-500 hover:bg-purple-600"
```

### Change Brand Name
**Edit `src/App.jsx` and `public/index.html`**
```jsx
<h1 className="font-bold text-lg gradient-text">Your App Name</h1>
```

### Modify Animations
**In `tailwind.config.js`**
```javascript
keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  // Add more animations here
},
```

### Add New Components
1. Create file: `src/components/YourComponent.jsx`
2. Import in parent: `import YourComponent from './components/YourComponent'`
3. Use in JSX: `<YourComponent />`

### Change API Endpoint
**Edit `src/utils/api.js`**
```javascript
const API_BASE_URL = 'your-api-url-here';
```

### Modify Backend Response
**Node.js - Edit `backend.js`**
```javascript
function getAIResponse(userMessage) {
  // Your AI logic
  return response;
}
```

**Python - Edit `backend.py`**
```python
def get_ai_response(user_message):
    # Your AI logic
    return response
```

---

## Deployment

### Frontend Deployment

**Option 1: Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**Option 2: Netlify**
```bash
# Build first
npm run build
# Then drag dist/ folder to Netlify
```

**Option 3: AWS S3 + CloudFront**
```bash
# Build
npm run build
# Upload dist/ to S3 bucket
# Configure CloudFront distribution
```

### Backend Deployment

**Node.js Options**
- Heroku (free tier available)
- Railway (modern alternative)
- Fly.io (edge deployment)
- DigitalOcean (App Platform)

**Python Options**
- PythonAnywhere (Python-focused hosting)
- Render (simple deployment)
- Replit (quick testing)
- AWS Lambda + API Gateway

### Environment Variables in Production
Set on hosting platform:
```
VITE_API_URL=https://your-api-domain.com
NODE_ENV=production
```

---

## Troubleshooting

### Common Issues

**1. Port 5173 already in use**
```bash
# Find and kill process
lsof -ti :5173 | xargs kill -9

# Or change port in vite.config.js
```

**2. Cannot connect to backend**
- ✅ Verify backend is running: `curl http://localhost:5000/health`
- ✅ Check CORS configuration
- ✅ Verify API URL in `.env`
- ✅ Check firewall settings

**3. npm install fails**
```bash
# Clear cache
npm cache clean --force

# delete node_modules
rm -rf node_modules package-lock.json

# reinstall
npm install
```

**4. Tailwind CSS not applying**
- ✅ Restart dev server
- ✅ Verify `content` in `tailwind.config.js`
- ✅ Check class names are spelled correctly

**5. Module not found errors**
- ✅ Check import paths
- ✅ Ensure all files exist in `src/`
- ✅ Run `npm install` again

**6. Dark mode not persisting**
- ✅ Check localStorage: `localStorage.getItem('theme')`
- ✅ Verify `useTheme` hook is called
- ✅ Clear browser cache

**7. Messages not sending**
- ✅ Check browser console (F12) for errors
- ✅ Verify backend response format
- ✅ Check network tab for failed requests

### Debug Tips

1. **Enable verbose logging**
   ```javascript
   // In utils/api.js
   console.log('Request:', message);
   console.log('Response:', response);
   ```

2. **Check network requests**
   - Press F12 → Network tab
   - Send message and monitor requests
   - Check status codes and response

3. **Review console errors**
   - Press F12 → Console tab
   - Look for error messages
   - Note error stack trace

4. **Test backend directly**
   ```bash
   curl -X POST http://localhost:5000/chat \
     -H "Content-Type: application/json" \
     -d '{"message":"Hello"}'
   ```

---

## Performance Tips

1. **Enable compression** - Configure server gzip
2. **Use CDN** - For distribution networks
3. **Optimize images** - Use modern formats
4. **Code splitting** - Vite handles automatically
5. **Monitor bundle size** - Use `npm run build` to check

## Security Best Practices

1. **Never commit `.env`** - Use `.env.example`
2. **Validate all inputs** - Server-side validation
3. **Use HTTPS** - In production deployment
4. **Set CORS properly** - Restrict allowed origins
5. **Keep dependencies updated** - Run `npm audit`

## Additional Resources

- **Vite**: https://vitejs.dev
- **React**: https://react.dev
- **Tailwind**: https://tailwindcss.com
- **Zustand**: https://github.com/pmndrs/zustand
- **Axios**: https://axios-http.com

---

## Support

For issues:
1. Check this guide's Troubleshooting section
2. Review README.md for features
3. Check error messages in console
4. Review backend logs
5. Test with `curl` commands

---

**You're all set!** 🎉

Start with `npm run dev` and enjoy building! 🚀
