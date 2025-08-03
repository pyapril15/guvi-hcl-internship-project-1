# 🧮 Calculator Frontend

A modern, responsive calculator web application built with Next.js, featuring persistent calculation history and real-time backend synchronization.

## ✨ Features

- **🎨 Modern UI/UX** - Clean, intuitive calculator interface
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **💾 Persistent History** - All calculations saved to MySQL database
- **🔄 Real-time Sync** - Instant synchronization with backend API
- **⚡ Fast Performance** - Optimized with Next.js and React 18
- **🎯 Error Handling** - Graceful error messages and offline indicators
- **🔐 Input Validation** - Client-side and server-side validation
- **🌐 API Integration** - RESTful API communication
- **📊 Calculation History** - View, reuse, and clear calculation history
- **⌨️ Keyboard Support** - Full keyboard navigation support

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+
- **npm**, **yarn**, **pnpm**, or **bun**
- **Calculator Backend** running on port 3006

### 1. Installation
```bash
# Clone the repository
git clone <repository-url>
cd calculator-frontend

# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### 2. Environment Configuration
```bash
# Create environment file
cp .env.example .env.local

# Edit .env.local with your backend URL
```

### 3. Start Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the calculator.

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Backend API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3006/api

# For production deployment:
# NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

## 📱 Application Features

### Calculator Interface
- **Basic Operations**: Addition (+), Subtraction (-), Multiplication (×), Division (÷)
- **Decimal Support**: Floating-point calculations
- **Error Prevention**: Division by zero protection
- **Clear Functions**: AC (All Clear) and Backspace
- **Expression Display**: Shows current operation being performed

### Calculation History
- **Persistent Storage**: All calculations saved to database
- **Chronological Order**: Newest calculations displayed first
- **Clickable Results**: Click any result to reuse in calculator
- **Clear All**: Delete all calculations from database (with confirmation)
- **Real-time Updates**: History updates immediately after calculations

### Connection Status
- **Live Indicator**: Shows backend connection status
- **Offline Mode**: Graceful handling when backend is unavailable
- **Error Messages**: Clear feedback for connection issues
- **Retry Functionality**: Easy reconnection attempts

## 🎯 User Interface

### Calculator Layout
```
┌─────────────────────────┐
│     Expression         │  ← Shows current operation
│     Display: 42        │  ← Shows current number/result
├─────────────────────────┤
│    [Show History]      │  ← Toggle history panel
├─────────────────────────┤
│  AC  ⌫   ÷   ×        │  ← Function buttons
│  7   8   9   -        │  ← Number pad
│  4   5   6   +        │  
│  1   2   3   =        │  ← Equals spans 2 rows
│  0       .            │  
└─────────────────────────┘
```

### History Panel
```
┌─────────────────────────┐
│ Calculation History     │
│                [Clear] │
├─────────────────────────┤
│ 20 × 3 = 60            │  ← Click to reuse result
│ 2023-07-28 14:30       │
├─────────────────────────┤
│ 15 + 5 = 20            │
│ 2023-07-28 14:29       │
├─────────────────────────┤
│ Total: 2 calculations  │
└─────────────────────────┘
```

## 🔧 Technical Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useCallback)
- **API Client**: Native Fetch API
- **Icons**: Remix Icons
- **Build Tool**: Next.js built-in bundler

### Project Structure
```
calculator-frontend/
├── app/
│   ├── components/
│   │   ├── Calculator.tsx        # Main calculator component
│   │   ├── HistoryPanel.tsx      # History display component
│   │   └── ErrorBanner.tsx       # Error message component
│   ├── hooks/
│   │   └── useCalculations.ts    # API integration hook
│   ├── types/
│   │   └── calculation.ts        # TypeScript interfaces
│   ├── utils/
│   │   └── api.ts               # API client functions
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main page component
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── .env.example                # Environment template
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies & scripts
├── tailwind.config.js          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

### Key Components

#### Calculator.tsx
- Handles all calculator logic and state
- Manages display, operations, and input
- Validates calculations before sending to API
- Supports keyboard input

#### HistoryPanel.tsx
- Displays calculation history from database
- Handles history clearing with confirmation
- Provides clickable results for reuse
- Shows loading states during operations

#### useCalculations.ts
- Custom hook for API integration
- Manages server connection state
- Handles error states and retries
- Provides loading indicators

## 📡 API Integration

### Backend Communication
The frontend communicates with the Calculator Backend API:

```typescript
// Save calculation
POST /api/calculations
{
  "operand1": 10,
  "operator": "+", 
  "operand2": 5,
  "result": 15
}

// Get history
GET /api/calculations

// Clear all history
DELETE /api/calculations

// Health check
GET /api/health
```

### Error Handling
- **Network Errors**: Offline indicators and retry options
- **API Errors**: User-friendly error messages
- **Validation Errors**: Input validation feedback
- **Timeout Handling**: Request timeout management

## 🎨 Styling & Theming

### Design System
- **Color Palette**: Blue gradient backgrounds, orange operator buttons
- **Typography**: Modern, clean fonts optimized for readability
- **Spacing**: Consistent 4px grid system
- **Components**: Rounded corners, subtle shadows, smooth transitions

### Responsive Design
```css
/* Mobile First Approach */
- Mobile: 320px - 768px
- Tablet: 768px - 1024px  
- Desktop: 1024px+

/* Key Breakpoints */
- Container max-width: 28rem (448px)
- Adaptive button sizes
- Flexible typography scaling
```

### Dark Mode Ready
The design system is prepared for dark mode implementation with CSS custom properties.

## 🧪 Testing

### Manual Testing Checklist
- [ ] Basic arithmetic operations (+, -, ×, ÷)
- [ ] Decimal number calculations
- [ ] Division by zero handling
- [ ] Backspace and clear functions
- [ ] History saving and loading
- [ ] History clearing with confirmation
- [ ] Offline behavior when backend is down
- [ ] Responsive design on different screen sizes
- [ ] Keyboard navigation

### Browser Testing
- **Chrome** 90+ ✅
- **Firefox** 88+ ✅
- **Safari** 14+ ✅
- **Edge** 90+ ✅
- **Mobile Safari** ✅
- **Chrome Mobile** ✅

## 🚢 Deployment

### Production Build
```bash
# Build for production
npm run build

# Start production server
npm start

# Export static files (if needed)
npm run build && npm run export
```

### Environment Variables for Production
```env
# Production API URL
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Deployment Platforms

#### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

#### Netlify
```bash
# Build command: npm run build
# Publish directory: out (if using static export)
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🛠️ Development Scripts

```bash
# Development
npm run dev              # Start development server with hot reload
npm run build           # Build for production
npm start              # Start production server

# Code Quality
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint issues
npm run type-check     # TypeScript type checking

# Testing
npm run test           # Run tests (when configured)
npm run test:watch     # Watch mode testing
```

## 🔧 Configuration

### Next.js Configuration (next.config.js)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    CUSTOM_KEY: 'value',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        calculator: {
          bg: '#f8fafc',
          display: '#1e293b',
          button: '#f1f5f9',
          operator: '#ea580c',
        },
      },
    },
  },
  plugins: [],
};
```

## 🐛 Troubleshooting

### Common Issues

**Backend Connection Failed**
```
Error: "Backend server is not available"
Solution: 
1. Ensure backend is running on port 3006
2. Check NEXT_PUBLIC_API_URL in .env.local
3. Verify CORS settings in backend
```

**Build Errors**
```
Error: Type errors during build
Solution:
1. Run npm run type-check
2. Fix TypeScript errors
3. Update @types packages if needed
```

**Styling Issues**
```
Error: Tailwind classes not applying
Solution:
1. Check tailwind.config.js content paths
2. Ensure CSS imports are correct
3. Clear .next cache and rebuild
```

**API Integration Issues**
```
Error: API calls failing
Solution:
1. Check browser network tab for errors
2. Verify API endpoint URLs
3. Check CORS headers
4. Test backend endpoints directly
```

### Development Tips
- Use React DevTools for component debugging
- Check browser console for JavaScript errors
- Use Network tab to monitor API calls
- Test with backend health endpoint first

## 📊 Performance Optimization

### Next.js Optimizations
- **Automatic Code Splitting**: Components loaded on demand
- **Image Optimization**: Next.js Image component
- **Font Optimization**: Built-in font optimization
- **Bundle Analysis**: Analyze bundle size with `@next/bundle-analyzer`

### Performance Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.0s
- **Cumulative Layout Shift**: < 0.1

## 🔐 Security Considerations

- **Environment Variables**: Sensitive data in .env.local (gitignored)
- **API Validation**: Input validation on both client and server
- **XSS Prevention**: React's built-in XSS protection
- **HTTPS**: Always use HTTPS in production
- **CSP Headers**: Content Security Policy implementation ready

## 🤝 Integration with Backend

### Expected Backend Features
- Calculator Backend API running on port 3006
- CORS configured for frontend domain
- All CRUD endpoints implemented
- Health check endpoint available
- Error responses in consistent JSON format

### Data Flow
1. **User Input** → Calculator component validates input
2. **Calculation** → Frontend performs calculation
3. **API Call** → Sends result to backend for storage
4. **Database** → Backend saves to MySQL
5. **History Update** → Frontend refreshes history from API
6. **UI Update** → Component state updates, UI re-renders

## 📈 Future Enhancements

### Planned Features
- [ ] **Scientific Calculator Mode** - Advanced mathematical functions
- [ ] **Keyboard Shortcuts** - Full keyboard navigation
- [ ] **Themes** - Dark mode and custom themes
- [ ] **History Export** - Download calculations as CSV/PDF
- [ ] **Memory Functions** - M+, M-, MR, MC operations
- [ ] **Formula History** - Save and reuse complex formulas
- [ ] **Multi-language Support** - Internationalization
- [ ] **Accessibility** - Screen reader optimization

### Technical Improvements
- [ ] **Unit Testing** - Jest + React Testing Library
- [ ] **E2E Testing** - Playwright or Cypress
- [ ] **Performance Monitoring** - Web Vitals tracking
- [ ] **PWA Features** - Offline functionality, app installation
- [ ] **State Management** - Zustand or Redux for complex state

## 📞 Support & Contributing

### Getting Help
1. Check this README for common solutions
2. Review browser console for error messages
3. Test backend connectivity with health endpoint
4. Verify environment variables are set correctly

### Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

### Development Guidelines
- Follow TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Update documentation for new features

---

## 🎉 **You're Ready to Calculate!**

Your calculator frontend is now configured and ready for development. Start the development server and begin building an amazing calculator experience!

**Next Steps:**
1. `npm run dev` - Start development server
2. Open `http://localhost:3000` - View your calculator
3. Ensure backend is running on port 3006
4. Start calculating and watch the magic happen! ✨

**Happy Calculating! 🧮**