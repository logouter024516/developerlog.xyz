/**
 * 🔌 GitHub Projects API Client
 * GitHub REST API를 직접 호출하여 프로젝트 데이터 수집
 */

import type { Project, ProjectsResponse } from '../../types';

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || 'YOUR_USERNAME';
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN; // Optional: rate limit 증가용

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  fork: boolean;
}

interface GitHubEvent {
  type: string;
  repo: {
    id: number;
    name: string;
    url: string;
  };
}

interface GitHubSearchResult {
  items: Array<{
    repository_url: string;
  }>;
}

const headers: HeadersInit = {
  'Accept': 'application/vnd.github.v3+json',
};

if (GITHUB_TOKEN) {
  headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
}

/**
 * GitHub API 호출 헬퍼
 */
async function fetchGitHub<T>(url: string): Promise<T> {
  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(`GitHub API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

/**
 * GitHub Repo를 Project 타입으로 변환
 */
function mapRepoToProject(repo: GitHubRepo, isContribution: boolean): Project {
  return {
    id: repo.id.toString(),
    name: repo.name,
    description: repo.description || 'No description provided',
    html_url: repo.html_url,
    homepage: repo.homepage || undefined,
    stargazers_count: repo.stargazers_count,
    forks_count: repo.forks_count,
    language: repo.language || undefined,
    topics: repo.topics || [],
    created_at: repo.created_at,
    updated_at: repo.updated_at,
    is_contribution: isContribution,
    owner: {
      login: repo.owner.login,
      avatar_url: repo.owner.avatar_url,
    },
  };
}

/**
 * 내가 실제로 기여한 레포지토리 찾기
 * - Pull Request를 올린 레포
 * - Issue를 올린 레포
 * - Commit을 올린 레포 (Events API)
 */
async function getContributedRepos(): Promise<Set<string>> {
  const contributedRepoNames = new Set<string>();

  try {
    // 1. Events API: 최근 활동에서 기여한 레포 찾기
    const events = await fetchGitHub<GitHubEvent[]>(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`
    );

    events.forEach((event) => {
      // PushEvent, PullRequestEvent, IssuesEvent 등에서 레포 추출
      if (['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'IssueCommentEvent'].includes(event.type)) {
        const repoFullName = event.repo.name; // "owner/repo" 형식
        const owner = repoFullName.split('/')[0];

        // 내 레포가 아닌 것만
        if (owner !== GITHUB_USERNAME) {
          contributedRepoNames.add(repoFullName);
        }
      }
    });

    // 2. Search API: 내가 만든 PR 검색 (더 정확함)
    if (GITHUB_TOKEN) { // 토큰 필요
      try {
        const prSearch = await fetchGitHub<GitHubSearchResult>(
          `https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:pr&per_page=100`
        );

        // PR이 올라간 레포 URL에서 레포 정보 추출
        for (const pr of prSearch.items) {
          const repoUrl = pr.repository_url;
          const repoFullName = repoUrl.replace('https://api.github.com/repos/', '');
          const owner = repoFullName.split('/')[0];

          if (owner !== GITHUB_USERNAME) {
            contributedRepoNames.add(repoFullName);
          }
        }
      } catch (error) {
        console.warn('Search API failed (token may be required):', error);
      }
    }
  } catch (error) {
    console.warn('Failed to fetch contributed repos:', error);
  }

  return contributedRepoNames;
}

export const projectsApi = {
  /**
   * 내 프로젝트 + Contributed 프로젝트 가져오기
   *
   * 분류 기준:
   * - My Projects: 내가 소유하고 fork가 아닌 레포
   * - Contributed:
   *   1. 내가 fork한 레포
   *   2. 다른 사람 레포에 PR/Issue/Commit을 올린 경우
   */
  async getProjects(): Promise<ProjectsResponse> {
    try {
      // 1. 내가 소유한 모든 repo 가져오기
      const myRepos = await fetchGitHub<GitHubRepo[]>(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`
      );

      // 2. 실제로 기여한 레포 찾기
      const contributedRepoNames = await getContributedRepos();

      // 3. 내 프로젝트 분류
      const myProjects: Project[] = [];
      const contributedProjects: Project[] = [];

      myRepos.forEach((repo) => {
        const isFork = repo.fork;
        const isOwnedByMe = repo.owner.login === GITHUB_USERNAME;

        if (isFork) {
          // Fork한 레포는 무조건 Contributed
          contributedProjects.push(mapRepoToProject(repo, true));
        } else if (isOwnedByMe) {
          // 내 소유 레포는 My Projects
          myProjects.push(mapRepoToProject(repo, false));
        }
      });

      // 4. 다른 사람 레포에 기여한 것들 추가
      for (const repoFullName of contributedRepoNames) {
        // 이미 fork로 추가된 건 스킵
        const alreadyAdded = contributedProjects.some(
          p => `${p.owner?.login}/${p.name}` === repoFullName
        );

        if (!alreadyAdded) {
          try {
            // 레포 상세 정보 가져오기
            const repoDetail = await fetchGitHub<GitHubRepo>(
              `https://api.github.com/repos/${repoFullName}`
            );
            contributedProjects.push(mapRepoToProject(repoDetail, true));
          } catch (error) {
            console.warn(`Failed to fetch repo ${repoFullName}:`, error);
          }
        }
      }

      // 5. 최신순 정렬
      myProjects.sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
      contributedProjects.sort((a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );

      return {
        my_projects: myProjects,
        contributed_projects: contributedProjects,
      };
    } catch (error) {
      console.error('Failed to fetch GitHub projects:', error);
      throw error;
    }
  },
};
