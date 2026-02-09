/**
 * 🖱️ CursorPointer Component
 * 개별 사용자의 커서를 glassmorphism 스타일로 렌더링하는 컴포넌트
 */

import { motion } from 'framer-motion';
import type { Cursor } from '../../../types';

interface CursorPointerProps {
  cursor: Cursor;
}

export function CursorPointer({ cursor }: CursorPointerProps) {
  return (
    <motion.div
      className="absolute pointer-events-none z-50"
      style={{
        left: `${cursor.x}%`,
        top: `${cursor.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* 원형 커서 - pulse 애니메이션 */}
      <motion.div
        className="w-3.5 h-3.5 rounded-full"
        style={{
          backgroundColor: cursor.color || 'rgba(0, 255, 255, 0.8)',
          boxShadow: `0 0 20px ${cursor.color || 'rgba(0, 255, 255, 0.8)'}`,
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 사용자 이름 라벨 - 상단 중앙 */}
      <div
        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md whitespace-nowrap"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
        }}
      >
        <p className="text-xs text-white font-medium">
          {cursor.userName}
        </p>
      </div>
    </motion.div>
  );
}
