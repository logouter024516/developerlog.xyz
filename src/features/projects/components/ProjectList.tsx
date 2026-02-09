/**
 * 📋 ProjectList Component
 * 프로젝트 목록을 그리드로 표시 - Glassmorphism Style
 */

import { ProjectCard } from './ProjectCard';
import type { Project } from '../../../types';

interface ProjectListProps {
  title: string;
  projects: Project[];
}

export const ProjectList = ({ title, projects }: ProjectListProps) => {
  if (projects.length === 0) return null;

  return (
    <section className="mb-12 md:mb-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-300 mb-6 md:mb-8 text-center">{title}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 md:gap-8 justify-items-center">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
};
