/**
 * 👤 NicknameModal Component
 * 처음 접속 시 닉네임 입력 모달
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NicknameModalProps {
  onSubmit: (nickname: string) => void;
}

export const NicknameModal = ({ onSubmit }: NicknameModalProps) => {
  const [nickname, setNickname] = useState('');
  const [isVisible, setIsVisible] = useState(() => {
    // localStorage에서 닉네임 확인 (초기 렌더링 시 한 번만)
    const savedNickname = localStorage.getItem('portfolio_nickname');
    return !savedNickname; // 저장된 닉네임이 없으면 모달 표시
  });

  useEffect(() => {
    // localStorage에 닉네임이 있으면 자동으로 설정
    const savedNickname = localStorage.getItem('portfolio_nickname');
    if (savedNickname) {
      onSubmit(savedNickname);
    }
  }, [onSubmit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedNickname = nickname.trim();
    if (trimmedNickname.length === 0) return;

    // localStorage에 저장
    localStorage.setItem('portfolio_nickname', trimmedNickname);
    onSubmit(trimmedNickname);
    setIsVisible(false);
  };

  const handleSkip = () => {
    const randomNickname = `Guest_${Math.random().toString(36).substr(2, 5)}`;
    localStorage.setItem('portfolio_nickname', randomNickname);
    onSubmit(randomNickname);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100]"
            onClick={handleSkip}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-md px-4"
          >
            <div className="glass-strong rounded-2xl p-8 border-2 border-white/20 shadow-2xl">
              {/* 헤더 */}
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">👋</div>
                <h2 className="text-3xl font-bold gradient-text mb-2">
                  Welcome!
                </h2>
                <p className="text-gray-400 text-sm">
                  다른 방문자들이 당신을 알아볼 수 있도록 닉네임을 입력하세요
                </p>
              </div>

              {/* 폼 */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="닉네임을 입력하세요..."
                    maxLength={20}
                    autoFocus
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:bg-white/10 transition-all"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    {nickname.length}/20자
                  </p>
                </div>

                {/* 버튼들 */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white transition-all"
                  >
                    건너뛰기
                  </button>
                  <button
                    type="submit"
                    disabled={nickname.trim().length === 0}
                    className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-medium hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
                  >
                    시작하기
                  </button>
                </div>
              </form>

              {/* 힌트 */}
              <div className="mt-6 text-center text-xs text-gray-500">
                💡 닉네임은 언제든지 변경할 수 있어요
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
