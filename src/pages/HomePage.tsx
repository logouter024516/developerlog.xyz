/**
 * 🏠 HomePage Component
 * 메인 포트폴리오 페이지 - Glassmorphism Design
 */

import { useState } from 'react';
import { useProjects } from '../features/projects/hooks/useProjects';
import { ProjectList } from '../features/projects/components/ProjectList';
import { CursorCanvas } from '../features/realtime/components/CursorCanvas';

export const HomePage = () => {
  const { data, isLoading, error } = useProjects();
  const [currentView, setCurrentView] = useState<'home' | 'projects'>('home');

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 z-0" />

      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl float" style={{ animationDelay: '-1.5s' }} />
      </div>

      {/* 실시간 커서 캔버스 */}
      <CursorCanvas />

      {/* Left Sidebar - Logo & Social */}
      <div className="fixed left-0 top-0 h-screen flex flex-col items-center justify-between py-8 md:py-12 px-4 md:px-8 z-50">
        <div className="flex flex-col items-center gap-4 md:gap-6">
          {/* Logo */}
          <div className="w-12 h-12 md:w-16 md:h-16 rounded-full glass-strong flex items-center justify-center text-xl md:text-2xl font-bold gradient-text shadow-lg">
            M
          </div>
          {/* GitHub Icon */}
          <a
            href="https://github.com/logouter024516"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="md:w-6 md:h-6">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
        <div className="hidden md:block text-gray-500 text-sm writing-mode-vertical-rl rotate-180 select-none">
          Designed by DEVLOG
        </div>
      </div>

      {/* Right Sidebar - Navigation */}
      <nav className="fixed right-0 top-0 h-screen flex flex-col items-end justify-center py-8 md:py-12 px-4 md:px-8 gap-3 md:gap-4 z-50">
        <button
          onClick={() => setCurrentView('home')}
          className={`text-base md:text-lg font-light transition-all ${
            currentView === 'home' 
              ? 'text-white text-xl md:text-2xl' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Home
        </button>
        <div className={`h-px bg-gradient-to-l transition-all ${
          currentView === 'home' 
            ? 'from-purple-500 w-8 md:w-12' 
            : 'from-gray-600 w-0'
        }`} />

        <button
          onClick={() => setCurrentView('projects')}
          className={`text-base md:text-lg font-light transition-all ${
            currentView === 'projects' 
              ? 'text-white text-xl md:text-2xl' 
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          Projects
        </button>
        <div className={`h-px bg-gradient-to-l transition-all ${
          currentView === 'projects' 
            ? 'from-cyan-500 w-8 md:w-12' 
            : 'from-gray-600 w-0'
        }`} />
      </nav>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center px-16 md:px-32 py-12 md:py-20 relative z-10">
        {currentView === 'home' ? (
          // Home View - Profile
          <div className="flex flex-col items-center gap-6 md:gap-8 animate-fade-in">
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden glass-strong shadow-2xl">
              <div className="w-full h-full bg-gradient-to-br from-purple-500/30 to-cyan-500/30 flex items-center justify-center text-5xl md:text-6xl">
                👨‍💻
              </div>
            </div>
            <div className="text-center">
              <h1 className="text-6xl md:text-8xl font-bold mb-2 gradient-text">DEVLOG</h1>
              <h2 className="text-3xl md:text-5xl text-cyan-400 font-light mb-4 md:mb-6">DEVLOG</h2>
              <p className="text-gray-300 text-lg md:text-xl">안녕하세요<br/>DEVLOG입니다.</p>
            </div>
          </div>
        ) : (
          // Projects View
          <div className="w-full max-w-7xl animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold mb-8 md:mb-12 text-cyan-400 text-center" style={{ fontFamily: 'cursive' }}>
              Projects
            </h1>

            {isLoading && (
              <div className="text-center py-20">
                <div className="glass rounded-2xl p-8 md:p-12 inline-block">
                  <div className="inline-block w-10 h-10 md:w-12 md:h-12 border-4 border-gray-600 border-t-cyan-500 rounded-full animate-spin mb-4" />
                  <p className="text-gray-300 text-base md:text-lg">Loading projects...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="text-center py-20">
                <div className="glass rounded-2xl p-8 md:p-12 max-w-md mx-auto border-red-500/30">
                  <p className="text-red-400 text-lg md:text-xl mb-2">⚠️ Failed to load projects</p>
                  <p className="text-gray-400 text-xs md:text-sm">{(error as Error).message}</p>
                </div>
              </div>
            )}

            {data && (
              <div className="space-y-8 md:space-y-12">
                <ProjectList
                  title="My Projects"
                  projects={data.my_projects}
                />
                {data.contributed_projects.length > 0 && (
                  <ProjectList
                    title="Contributed"
                    projects={data.contributed_projects}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
