/**
 * 🎨 CursorCanvas Component
 * 모든 사용자의 커서를 렌더링하는 캔버스 컴포넌트
 */

import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useRealtimeCursors } from '../hooks/useRealtimeCursors';
import { CursorPointer } from './CursorPointer';
import { NicknameModal } from './NicknameModal';

interface CursorCanvasProps {
  isVisible?: boolean; // Projects 뷰에서 커서 숨김용
}

export const CursorCanvas = ({ isVisible = true }: CursorCanvasProps) => {
  const { cursors, isConnected, handleMouseMove, setUserName, userName } = useRealtimeCursors();
  const [showNicknameModal, setShowNicknameModal] = useState(false);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  useEffect(() => {
    console.log('🎨 CursorCanvas:', {
      isConnected,
      cursorCount: cursors.length,
      cursors: cursors.map(c => ({ id: c.id.slice(-4), x: c.x.toFixed(1), y: c.y.toFixed(1) }))
    });
  }, [cursors, isConnected]);

  const handleNicknameSubmit = (nickname: string) => {
    setUserName(nickname);
    setShowNicknameModal(false);
  };

  const handleChangeNickname = () => {
    localStorage.removeItem('portfolio_nickname');
    setShowNicknameModal(true);
  };

  return (
    <>
      {/* 닉네임 모달 */}
      {showNicknameModal && <NicknameModal onSubmit={handleNicknameSubmit} />}
      {!userName && <NicknameModal onSubmit={handleNicknameSubmit} />}

      {/* 연결 상태 표시 */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 items-end">
        <div className="px-3 py-2 rounded-lg text-xs font-medium glass border border-white/10">
          {isConnected ? (
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400">Connected</span>
              </div>
              <div className="text-gray-400 text-[10px]">
                커서: {cursors.length}명
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-red-400">Disconnected</span>
            </div>
          )}
        </div>

        {/* 내 닉네임 표시 & 변경 버튼 */}
        {userName && (
          <button
            onClick={handleChangeNickname}
            className="px-3 py-2 rounded-lg text-xs font-medium glass border border-white/10 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-400 group-hover:text-white">👤</span>
              <span className="text-white">{userName}</span>
            </div>
            <div className="text-[10px] text-gray-500 group-hover:text-gray-400 mt-0.5">
              클릭하여 변경
            </div>
          </button>
        )}
      </div>

      {/* 다른 사용자의 커서들 렌더링 - isVisible이 true일 때만 */}
      {isVisible && (
        <AnimatePresence>
          {cursors.map((cursor) => (
            <CursorPointer key={cursor.id} cursor={cursor} />
          ))}
        </AnimatePresence>
      )}
    </>
  );
};
