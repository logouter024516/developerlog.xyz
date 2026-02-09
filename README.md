# 🚀 Developer Portfolio with Real-time Multi-cursor

> **A modern, interactive portfolio website featuring real-time collaborative cursors**

[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/03_portfolio_web/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/03_portfolio_web/actions/workflows/deploy.yml)

## ✨ Features

- 🎯 **GitHub Projects Showcase**: Display your projects and contributions with glassmorphism card UI
- 👆 **Real-time Multi-cursor System**: See other visitors' cursors moving in real-time (circular pulse animation)
- 🎨 **Modern Glassmorphism Design**: Clean, minimal aesthetic inspired by examples with blur effects
- 🔀 **Two-View System**: Switch between Home (profile) and Projects (repository list)
- 📱 **Fully Responsive**: Mobile-first design that adapts beautifully to all screen sizes
- 🚀 **Blazing Fast**: Built with Vite + React for optimal performance
- 🔒 **Type-safe**: Written in TypeScript with strict type checking
- ✨ **Smooth Animations**: Fade-in transitions, floating blobs, and gradient text effects

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS 4** - Styling
- **Framer Motion** - Animations

### State Management & Data Fetching
- **TanStack Query (React Query)** - Server state management

### Real-time Engine
- **Supabase Realtime (Broadcast)** - WebSocket-based real-time communication
  - No database storage, pure socket communication
  - Coordinates sent as percentages (%) for resolution independence
  - Network-optimized with lodash throttle

### Infrastructure
- **GitHub Actions** - CI/CD
- **GitHub Pages** - Hosting

## 📁 Project Structure

```
src/
├── features/           # Feature-based modules
│   ├── projects/      # GitHub projects showcase
│   │   ├── api.ts
│   │   ├── components/
│   │   │   ├── ProjectCard.tsx
│   │   │   └── ProjectList.tsx
│   │   ├── hooks/
│   │   │   └── useProjects.ts
│   │   └── types/
│   └── realtime/      # Real-time cursor system
│       ├── components/
│       │   ├── CursorCanvas.tsx
│       │   └── CursorPointer.tsx
│       ├── hooks/
│       │   └── useRealtimeCursors.ts
│       └── types/
├── lib/               # Shared utilities
│   ├── supabase.ts   # Supabase client
│   └── query-client.ts
├── pages/             # Page components
│   └── HomePage.tsx
├── types/             # Global type definitions
│   └── index.ts
└── main.tsx          # Entry point
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/03_portfolio_web.git
cd 03_portfolio_web

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration (Realtime only)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# GitHub Configuration
VITE_GITHUB_USERNAME=your_github_username
VITE_GITHUB_TOKEN=your_github_personal_access_token  # Optional: increases rate limit
```

**Getting Supabase credentials:**

1. Go to [supabase.com](https://supabase.com/) and create a free project
2. Go to Project Settings > API
3. Copy the Project URL and anon public key

**Getting GitHub token (optional but recommended):**

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token (classic)
3. No special scopes needed for public repos
4. This increases rate limit from 60 to 5000 requests/hour

### Development

```bash
# Start development server
npm run dev

# Open http://localhost:5173
```

### Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Deployment

The project automatically deploys to GitHub Pages when you push to the `main` branch.

**Setup GitHub Pages:**

1. Go to your repository settings
2. Navigate to "Pages"
3. Set source to "GitHub Actions"
4. Add the following secrets to your repository:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_GITHUB_USERNAME`
   - `VITE_GITHUB_TOKEN` (optional)

## 🎯 Key Features Implementation

### Real-time Multi-cursor System

The cursor system uses **Supabase Broadcast** for real-time synchronization:

- **Resolution Independence**: Coordinates are sent as percentages (0-100%)
- **Network Optimization**: Throttled to 100ms using lodash
- **No Database**: Pure WebSocket communication without persistence
- **User Identification**: Random colors and IDs for each session

```typescript
// Example: Cursor position broadcast
const handleMouseMove = throttle((e: MouseEvent) => {
  const x = (e.clientX / window.innerWidth) * 100;
  const y = (e.clientY / window.innerHeight) * 100;
  
  channel.send({
    type: 'broadcast',
    event: 'cursor_move',
    payload: { id: userId, x, y, userName, color }
  });
}, 100);
```

### Project Showcase

Projects are fetched directly from **GitHub REST API** and automatically categorized:

- **My Projects**: Repositories you own (not forked)
- **Contributed Projects**: Forked repositories or those you've contributed to

No separate backend server needed - everything runs client-side!

## 📝 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for the real-time engine
- [Vite](https://vitejs.dev/) for the blazing fast build tool
- [TanStack Query](https://tanstack.com/query) for server state management

---

Made with ❤️ by [Your Name]

      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
