/**
 * 🎴 ProjectCard Component
 * 개별 프로젝트를 glassmorphism 카드 형태로 표시
 */

import { motion } from 'framer-motion';
import type { Project } from '../../../types';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  // OpenGraph 이미지 또는 기본 그라디언트 배경
  const backgroundStyle = project.owner?.avatar_url
    ? { backgroundImage: `url(${project.owner.avatar_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full sm:w-72 md:w-80 h-44 sm:h-48 md:h-52 rounded-2xl overflow-hidden group cursor-pointer"
    >
      {/* Background Image with Blur Effect */}
      <div
        className="absolute inset-0 transition-all duration-300 group-hover:scale-110"
        style={backgroundStyle}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/70 backdrop-blur-sm group-hover:backdrop-blur-none transition-all duration-300" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-5 md:p-6">
        {/* Top Section - Title & Badge */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl sm:text-2xl font-bold text-white truncate flex-1">
              {project.name}
            </h3>
            {project.is_contribution && (
              <span className="px-2 py-0.5 text-xs font-semibold bg-purple-500/30 text-purple-200 rounded-full border border-purple-400/30 shrink-0 ml-2">
                Contributed
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-300 line-clamp-2 leading-relaxed">
            {project.description || 'No description'}
          </p>
        </div>

        {/* Bottom Section - Link Button */}
        <div className="flex justify-end">
          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 sm:px-3 py-1 sm:py-1.5 text-xs font-light text-white border border-white/50 rounded-full hover:bg-white/10 transition-all flex items-center gap-1.5 group"
          >
            바로가기
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 group-hover:translate-x-0.5 transition-transform"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>

      {/* Language & Stats Overlay (bottom-left) */}
      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 z-10 flex items-center gap-2 text-xs text-gray-300">
        {project.language && (
          <span className="flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-cyan-400" />
            {project.language}
          </span>
        )}
        <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-black/30 backdrop-blur-sm">
          ⭐ {project.stargazers_count}
        </span>
      </div>
    </motion.div>
  );
};
