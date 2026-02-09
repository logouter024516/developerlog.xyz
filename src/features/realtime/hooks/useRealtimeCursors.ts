/**
 * 🎯 useRealtimeCursors Hook
 *
 * Supabase Broadcast를 활용한 실시간 멀티 커서 시스템
 * - 좌표는 백분율(%)로 처리하여 해상도 독립성 확보
 * - throttle로 네트워크 트래픽 최적화 (100ms)
 * - 사용자별 랜덤 색상 자동 할당
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import throttle from 'lodash/throttle';
import type { DebouncedFunc } from 'lodash';
import { supabase, CURSOR_CHANNEL } from '../../../lib/supabase';
import type { Cursor } from '../../../types';

const THROTTLE_MS = 100; // 100ms throttle

// 랜덤 파스텔 색상 생성
const generateRandomColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 60%)`;
};

// 세션별 고유 ID 생성
const generateUserId = (): string => {
  return `user_${Math.random().toString(36).substr(2, 9)}`;
};

export const useRealtimeCursors = () => {
  const [cursors, setCursors] = useState<Map<string, Cursor>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [userName, setUserName] = useState<string>('');

  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  const userIdRef = useRef<string>(generateUserId());
  const userColorRef = useRef<string>(generateRandomColor());
  const throttledSendRef = useRef<DebouncedFunc<(x: number, y: number) => void> | null>(null);

  // throttle 함수 초기화
  useEffect(() => {
    throttledSendRef.current = throttle((x: number, y: number) => {
      if (!channelRef.current || !userName) return;

      const cursor: Cursor = {
        id: userIdRef.current,
        x,
        y,
        userName: userName,
        color: userColorRef.current,
      };

      channelRef.current.send({
        type: 'broadcast',
        event: 'cursor_move',
        payload: cursor,
      });
    }, THROTTLE_MS);

    return () => {
      throttledSendRef.current?.cancel();
    };
  }, [userName]);

  // 다른 사용자의 커서 업데이트 수신
  useEffect(() => {
    const channel = supabase.channel(CURSOR_CHANNEL, {
      config: {
        broadcast: { self: false }, // 자신의 이벤트는 받지 않음
      },
    });

    channel
      .on('broadcast', { event: 'cursor_move' }, ({ payload }) => {
        const cursor = payload as Cursor;
        setCursors((prev) => {
          const next = new Map(prev);
          next.set(cursor.id, cursor);
          return next;
        });
      })
      .on('broadcast', { event: 'cursor_leave' }, ({ payload }) => {
        const { id } = payload as { id: string };
        setCursors((prev) => {
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
      })
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED');
      });

    channelRef.current = channel;

    // Cleanup: 떠날 때 leave 이벤트 발송
    const currentUserId = userIdRef.current;
    return () => {
      if (channelRef.current) {
        channelRef.current.send({
          type: 'broadcast',
          event: 'cursor_leave',
          payload: { id: currentUserId },
        });
        channelRef.current.unsubscribe();
      }
    };
  }, []);

  // 마우스 이동 핸들러
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isConnected || !throttledSendRef.current) return;

      // 뷰포트 대비 백분율 계산
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      throttledSendRef.current(x, y);
    },
    [isConnected]
  );

  return {
    cursors: Array.from(cursors.values()),
    isConnected,
    handleMouseMove,
    setUserName,
    userName,
  };
};
