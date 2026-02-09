/**
 * 🔧 Admin Page - Repository Management
 * GUI로 표시할 레포지토리를 선택하는 관리자 페이지
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { projectsApi } from '../features/projects/api';
import type { Project } from '../types';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

interface RepoSettings {
  hiddenRepos: string[]; // 숨길 레포 이름들
  showOnlyMode: boolean; // true: whitelist, false: blacklist
  selectedRepos: string[]; // whitelist 모드일 때 선택된 레포들
}

export const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<RepoSettings>({
    hiddenRepos: [],
    showOnlyMode: false,
    selectedRepos: [],
  });
  const [saved, setSaved] = useState(false);

  // 저장된 설정 불러오기 (GitHub에서)
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/repo-settings.json');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
          console.log('✅ 설정 불러오기 성공:', data);
        }
      } catch {
        console.log('설정 파일이 없거나 불러오기 실패, 기본값 사용');
      }
    };
    loadSettings();
  }, []);

  // 인증 후 레포 목록 가져오기
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
    }
  }, [isAuthenticated]);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await projectsApi.getProjects();
      setProjects([...data.my_projects, ...data.contributed_projects]);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('❌ 비밀번호가 틀렸습니다!');
    }
  };

  const handleToggleRepo = (repoName: string) => {
    if (settings.showOnlyMode) {
      // Whitelist 모드: selectedRepos 토글
      setSettings((prev) => ({
        ...prev,
        selectedRepos: prev.selectedRepos.includes(repoName)
          ? prev.selectedRepos.filter((r) => r !== repoName)
          : [...prev.selectedRepos, repoName],
      }));
    } else {
      // Blacklist 모드: hiddenRepos 토글
      setSettings((prev) => ({
        ...prev,
        hiddenRepos: prev.hiddenRepos.includes(repoName)
          ? prev.hiddenRepos.filter((r) => r !== repoName)
          : [...prev.hiddenRepos, repoName],
      }));
    }
  };

  const handleSave = async () => {
    try {
      // GitHub API로 설정 파일 저장 (모든 사용자에게 공통 적용)
      const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
      const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME;
      const REPO_NAME = import.meta.env.VITE_GITHUB_REPO_NAME || '03_portfolio_web';

      if (!GITHUB_TOKEN) {
        alert('⚠️ GITHUB_TOKEN이 설정되지 않았습니다!\n.env 파일에 VITE_GITHUB_TOKEN을 추가하세요.');
        return;
      }

      // 설정을 JSON으로 변환
      const settingsJson = JSON.stringify(settings, null, 2);
      const settingsBase64 = btoa(unescape(encodeURIComponent(settingsJson)));

      // 기존 파일의 SHA 가져오기 (업데이트를 위해)
      let sha: string | undefined;
      try {
        const getResponse = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/public/repo-settings.json`,
          {
            headers: {
              'Authorization': `Bearer ${GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );
        if (getResponse.ok) {
          const data = await getResponse.json();
          sha = data.sha;
        }
      } catch {
        console.log('파일이 존재하지 않음, 새로 생성합니다.');
      }

      // GitHub API로 파일 저장/업데이트
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/public/repo-settings.json`,
        {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: '🎛️ Update repository filter settings',
            content: settingsBase64,
            ...(sha && { sha }), // 기존 파일이 있으면 SHA 포함
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'GitHub API 오류');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      alert('✅ 설정이 GitHub에 저장되었습니다!\n\n모든 방문자에게 동일하게 적용됩니다.\n약 1-2분 후 GitHub Actions가 자동 배포하면 반영됩니다.');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert(`❌ 설정 저장 실패:\n${error instanceof Error ? error.message : '알 수 없는 오류'}\n\nGITHUB_TOKEN에 'repo' 권한이 있는지 확인하세요.`);
    }
  };

  const handleReset = async () => {
    if (confirm('⚠️ 모든 설정을 초기화하시겠습니까?\n\n모든 방문자에게 적용됩니다.')) {
      const resetSettings = {
        hiddenRepos: [],
        showOnlyMode: false,
        selectedRepos: [],
      };
      setSettings(resetSettings);

      // GitHub에도 초기화된 설정 저장
      const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
      const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME;
      const REPO_NAME = import.meta.env.VITE_GITHUB_REPO_NAME || '03_portfolio_web';

      if (!GITHUB_TOKEN) {
        alert('⚠️ GITHUB_TOKEN이 설정되지 않았습니다!');
        return;
      }

      try {
        const settingsJson = JSON.stringify(resetSettings, null, 2);
        const settingsBase64 = btoa(unescape(encodeURIComponent(settingsJson)));

        // 기존 파일 SHA 가져오기
        let sha: string | undefined;
        const getResponse = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/public/repo-settings.json`,
          {
            headers: {
              'Authorization': `Bearer ${GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
            },
          }
        );
        if (getResponse.ok) {
          const data = await getResponse.json();
          sha = data.sha;
        }

        // 초기화된 설정 저장
        await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${REPO_NAME}/contents/public/repo-settings.json`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${GITHUB_TOKEN}`,
              'Accept': 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: '🔄 Reset repository filter settings',
              content: settingsBase64,
              ...(sha && { sha }),
            }),
          }
        );

        alert('🔄 설정이 초기화되었습니다!');
      } catch (error) {
        console.error('Failed to reset settings:', error);
        alert('❌ 초기화 실패');
      }
    }
  };

  const isRepoVisible = (repoName: string) => {
    if (settings.showOnlyMode) {
      return settings.selectedRepos.includes(repoName);
    } else {
      return !settings.hiddenRepos.includes(repoName);
    }
  };

  // 로그인 화면
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20"
        >
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            🔐 Admin Login
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter admin password"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Default password: admin123
          </p>
        </motion.div>
      </div>
    );
  }

  // 관리자 페이지
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                🎛️ Repository Settings
              </h1>
              <p className="text-gray-300 text-sm">
                포트폴리오에 표시할 레포지토리를 선택하세요
              </p>
            </div>
            <a
              href="/"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              ← 홈으로
            </a>
          </div>
        </motion.div>

        {/* Mode Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">필터 모드</h2>
          <div className="flex gap-4">
            <button
              onClick={() =>
                setSettings((prev) => ({ ...prev, showOnlyMode: false }))
              }
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                !settings.showOnlyMode
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              🚫 Blacklist Mode
              <p className="text-xs mt-1 opacity-80">
                체크된 레포는 숨김
              </p>
            </button>
            <button
              onClick={() =>
                setSettings((prev) => ({ ...prev, showOnlyMode: true }))
              }
              className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                settings.showOnlyMode
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              ✅ Whitelist Mode
              <p className="text-xs mt-1 opacity-80">
                체크된 레포만 표시
              </p>
            </button>
          </div>
        </motion.div>

        {/* Repository List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-6"
        >
          <h2 className="text-xl font-bold text-white mb-4">
            레포지토리 목록 ({projects.length}개)
          </h2>

          {loading ? (
            <div className="text-center py-8 text-gray-400">
              Loading repositories...
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {projects.map((project) => {
                const isVisible = isRepoVisible(project.name);
                return (
                  <label
                    key={project.id}
                    className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all ${
                      isVisible
                        ? 'bg-green-500/20 border border-green-500/30'
                        : 'bg-red-500/20 border border-red-500/30'
                    } hover:scale-[1.02]`}
                  >
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => handleToggleRepo(project.name)}
                      className="w-5 h-5 accent-purple-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">
                          {project.name}
                        </span>
                        {project.private && (
                          <span className="px-2 py-0.5 text-xs bg-red-500/30 text-red-200 rounded-full border border-red-400/30">
                            🔒 Private
                          </span>
                        )}
                        {project.is_contribution && (
                          <span className="px-2 py-0.5 text-xs bg-purple-500/30 text-purple-200 rounded-full border border-purple-400/30">
                            Contributed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {project.description}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      ⭐ {project.stargazers_count}
                    </div>
                  </label>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <button
            onClick={handleSave}
            className="flex-1 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors"
          >
            {saved ? '✅ 저장 완료!' : '💾 설정 저장'}
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors"
          >
            🔄 초기화
          </button>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 bg-blue-500/10 backdrop-blur-lg rounded-xl p-4 border border-blue-500/30"
        >
          <p className="text-sm text-blue-200">
            💡 <strong>Tip:</strong> 설정은 GitHub에 저장되어 모든 방문자에게 동일하게 적용됩니다.
            <br />
            저장 후 약 1-2분 후 GitHub Actions가 자동 배포하면 반영됩니다.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
