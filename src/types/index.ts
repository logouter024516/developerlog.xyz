/**
 * 🎯 Core Type Definitions for Portfolio Website
 */

// ============================================
// Realtime Cursor Types
// ============================================

export interface Cursor {
  id: string;
  x: number; // 백분율 (0-100)
  y: number; // 백분율 (0-100)
  userName: string;
  color: string;
  timestamp?: number;
}

export interface CursorEvent {
  type: 'cursor_move' | 'cursor_join' | 'cursor_leave';
  payload: Cursor;
}

// ============================================
// Project Types
// ============================================

export interface Project {
  id: string;
  name: string;
  description: string;
  html_url: string;
  homepage?: string;
  stargazers_count: number;
  forks_count: number;
  language?: string;
  topics: string[];
  created_at: string;
  updated_at: string;
  is_contribution: boolean; // 핵심: 내 프로젝트 vs Contributed 구분
  owner?: {
    login: string;
    avatar_url: string;
  };
}

export interface ProjectsResponse {
  my_projects: Project[];
  contributed_projects: Project[];
}

// ============================================
// API Types
// ============================================

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
