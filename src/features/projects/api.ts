/**
 * 🔌 GitHub Projects API Client
 * GitHub REST API를 직접 호출하여 프로젝트 데이터 수집
 *
 * ✨ Features:
 * - Private 레포 지원 (GITHUB_TOKEN 필수)
 * - 레포 필터링 (표시할 레포만 선택 or 특정 레포 숨기기)
 */

import type { Project, ProjectsResponse } from '../../types';

const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN; // Private 레포 접근에 필수!

// 레포 필터링 옵션 (환경변수에서 로드)
const SHOW_ONLY_REPOS = import.meta.env.VITE_GITHUB_SHOW_ONLY_REPOS
  ? import.meta.env.VITE_GITHUB_SHOW_ONLY_REPOS.split(',').map((r: string) => r.trim())
  : null;

const HIDE_REPOS = import.meta.env.VITE_GITHUB_HIDE_REPOS
  ? import.meta.env.VITE_GITHUB_HIDE_REPOS.split(',').map((r: string) => r.trim())
  : [];

console.log('✅ GitHub Username:', GITHUB_USERNAME);
console.log('🔑 GitHub Token:', GITHUB_TOKEN ? '✅ Configured (Private repos enabled)' : '❌ Not set (Public only)');
console.log('🎯 Show Only Repos:', SHOW_ONLY_REPOS || 'All repos');
console.log('🚫 Hide Repos:', HIDE_REPOS.length > 0 ? HIDE_REPOS : 'None');

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
  private: boolean; // Private 레포 여부
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

// 인증 헤더 설정 (Private 레포 접근 위해 필수)
const headers: HeadersInit = {
  'Accept': 'application/vnd.github.v3+json',
};

if (GITHUB_TOKEN) {
  headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`;
} else {
  console.warn('⚠️ GITHUB_TOKEN이 없습니다. Private 레포는 표시되지 않습니다.');
}

/**
 * 🎯 레포 필터링 체크 (GitHub 저장소 기반 - 모든 사용자 공통 적용)
 * @param repoName - 레포지토리 이름
 * @returns 표시 여부
 */
async function getRepoSettings(): Promise<any> {
  try {
    // GitHub에 저장된 설정 파일 불러오기
    const response = await fetch('/repo-settings.json?' + Date.now()); // 캐시 방지
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.log('설정 파일 없음, 기본값 사용');
  }
  return null;
}

function shouldShowRepo(repoName: string, settings: any): boolean {
  // 1. GitHub 설정 파일 확인 (관리자가 설정한 공통 필터)
  if (settings) {
    if (settings.showOnlyMode) {
      // Whitelist 모드: selectedRepos에 있는 것만 표시
      const shouldShow = settings.selectedRepos.includes(repoName);
      if (!shouldShow) {
        console.log(`⏭️ Skipping repo (GitHub whitelist): ${repoName}`);
      }
      return shouldShow;
    } else {
      // Blacklist 모드: hiddenRepos에 없는 것만 표시
      if (settings.hiddenRepos.includes(repoName)) {
        console.log(`🚫 Hiding repo (GitHub blacklist): ${repoName}`);
        return false;
      }
    }
  }

  // 2. Fallback: 환경변수 기반 필터링
  // HIDE_REPOS에 있으면 무조건 숨김
  if (HIDE_REPOS.includes(repoName)) {
    console.log(`🚫 Hiding repo (env): ${repoName}`);
    return false;
  }

  // SHOW_ONLY_REPOS가 설정되어 있으면 해당 레포만 표시
  if (SHOW_ONLY_REPOS) {
    const shouldShow = SHOW_ONLY_REPOS.includes(repoName);
    if (!shouldShow) {
      console.log(`⏭️ Skipping repo (env whitelist): ${repoName}`);
    }
    return shouldShow;
  }

  // 3. 필터가 없으면 모두 표시
  return true;
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
    private: repo.private, // Private 레포 여부
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
    // 1. Events API: 최근 활동에서 기여한 레포 찾기 (300개로 증가)
    const events = await fetchGitHub<GitHubEvent[]>(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`
    );

    events.forEach((event) => {
      // 더 많은 이벤트 타입 감지
      const contributionEvents = [
        'PushEvent',
        'PullRequestEvent',
        'PullRequestReviewEvent',
        'PullRequestReviewCommentEvent',
        'IssuesEvent',
        'IssueCommentEvent',
        'CommitCommentEvent',
        'CreateEvent', // 브랜치/태그 생성
        'DeleteEvent',
      ];

      if (contributionEvents.includes(event.type)) {
        const repoFullName = event.repo.name; // "owner/repo" 형식
        const owner = repoFullName.split('/')[0];

        // 내 레포가 아닌 것만 + 포크 아닌 것만
        if (owner !== GITHUB_USERNAME) {
          contributedRepoNames.add(repoFullName);
        }
      }
    });

    // 2. Search API: 내가 만든 PR 검색 (더 정확함)
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
      console.warn('Search API 실패 (토큰 없거나 rate limit):', error);
    }

    // 3. Search API: 내가 만든 Issue도 검색
    try {
      const issueSearch = await fetchGitHub<GitHubSearchResult>(
        `https://api.github.com/search/issues?q=author:${GITHUB_USERNAME}+type:issue&per_page=100`
      );

      for (const issue of issueSearch.items) {
        const repoUrl = issue.repository_url;
        const repoFullName = repoUrl.replace('https://api.github.com/repos/', '');
        const owner = repoFullName.split('/')[0];

        if (owner !== GITHUB_USERNAME) {
          contributedRepoNames.add(repoFullName);
        }
      }
    } catch (error) {
      console.warn('Issue Search API 실패:', error);
    }
  } catch (error) {
    console.warn('Failed to fetch contributed repos:', error);
  }

  console.log('✅ 발견한 기여 레포:', Array.from(contributedRepoNames));
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
   *
   * ✨ 새로운 기능:
   * - Private 레포 지원 (GITHUB_TOKEN 필요)
   * - 레포 필터링 (SHOW_ONLY_REPOS, HIDE_REPOS)
   */
  async getProjects(): Promise<ProjectsResponse> {
    try {
      // 0. GitHub에 저장된 필터 설정 불러오기 (관리자가 설정)
      const repoSettings = await getRepoSettings();
      if (repoSettings) {
        console.log('🎛️ Admin filter settings loaded:', repoSettings);
      }

      // 1. 내가 소유한 모든 repo 가져오기 (Public + Private)
      // type=all로 설정하면 private 레포도 포함됨 (토큰 필요)
      const myRepos = await fetchGitHub<GitHubRepo[]>(
        `https://api.github.com/users/${GITHUB_USERNAME}/repos?type=all&sort=updated&per_page=100`
      );

      console.log(`📦 Total repos fetched: ${myRepos.length}`);
      const privateCount = myRepos.filter(r => r.private).length;
      if (privateCount > 0) {
        console.log(`🔒 Private repos found: ${privateCount}`);
      }

      // 2. 실제로 기여한 레포 찾기
      const contributedRepoNames = await getContributedRepos();

      // 3. 내 프로젝트 분류
      const myProjects: Project[] = [];
      const contributedProjects: Project[] = [];

      myRepos.forEach((repo) => {
        const isFork = repo.fork;
        const isOwnedByMe = repo.owner.login === GITHUB_USERNAME;

        // 🎯 필터링 체크 (관리자 설정 적용)
        if (!shouldShowRepo(repo.name, repoSettings)) {
          return; // 필터링된 레포는 건너뛰기
        }

        // ✅ 포크한 레포는 완전히 제외
        if (isFork) {
          return; // 건너뛰기
        }

        // 내 소유 레포만 My Projects에 추가
        if (isOwnedByMe) {
          myProjects.push(mapRepoToProject(repo, false));
        }
      });

      // 4. 다른 사람 레포에 기여한 것들 추가
      for (const repoFullName of contributedRepoNames) {
        const repoName = repoFullName.split('/')[1];

        // 🎯 필터링 체크 (관리자 설정 적용)
        if (!shouldShowRepo(repoName, repoSettings)) {
          continue;
        }

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

      console.log(`✅ My Projects: ${myProjects.length}`);
      console.log(`✅ Contributed Projects: ${contributedProjects.length}`);

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
