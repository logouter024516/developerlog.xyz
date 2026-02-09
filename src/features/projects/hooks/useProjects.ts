/**
 * 🪝 useProjects Hook
 * TanStack Query를 활용한 프로젝트 데이터 페칭
 */

import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../api';

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: projectsApi.getProjects,
  });
};
