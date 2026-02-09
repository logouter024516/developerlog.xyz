# 🔌 Realtime Cursor System Test Guide

## ✅ 현재 상태

### Supabase 설정
- **URL**: `https://kicdxjelgpfcyqoafhsz.supabase.co`
- **ANON_KEY**: ✅ 설정됨
- **채널**: `portfolio:cursors`

### 작동 방식
1. **Supabase Realtime Broadcast** 사용 (Socket.IO 아님!)
2. **좌표**: 백분율(%)로 변환 (해상도 독립적)
3. **Throttle**: 100ms (네트워크 최적화)
4. **자동 정리**: 사용자가 떠날 때 `cursor_leave` 이벤트 전송

---

## 🧪 테스트 방법

### 방법 1: React 앱에서 테스트 (메인)
```bash
# 1. 브라우저에서 열기
http://localhost:5173

# 2. 개발자 도구 열기 (F12)
# 3. 콘솔에서 확인:
#    - "🎨 CursorCanvas:" 로그 확인
#    - 연결 상태: Connected ✅
#    - 커서 수: 0명

# 4. 새 탭에서 같은 URL 열기
http://localhost:5173

# 5. 두 탭에서 마우스 움직이기
#    → 서로의 커서가 보여야 함!
```

### 방법 2: 테스트 페이지 사용 (간단)
```bash
# 브라우저에서 열기
http://localhost:5173/cursor-test.html

# 새 탭에서 다시 열기
http://localhost:5173/cursor-test.html

# 마우스 움직이기 → 커서 동기화 확인
```

---

## 🐛 디버그 정보

### 콘솔에서 확인할 것
```javascript
// 연결 상태
🔌 Channel status: SUBSCRIBED

// 커서 움직임
📍 Cursor move: {id: "user_abc123", x: 45.2, y: 67.8, ...}

// 커서 수
🎨 CursorCanvas: {isConnected: true, cursorCount: 1, ...}
```

### 우측 상단 UI
```
┌─────────────────┐
│ ● Connected     │
│ 커서: 1명       │
└─────────────────┘
```

---

## 🔧 트러블슈팅

### ❌ "Disconnected" 표시되는 경우
1. **.env 파일 확인**
   ```bash
   VITE_SUPABASE_URL=https://kicdxjelgpfcyqoafhsz.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```

2. **서버 재시작**
   ```bash
   # Ctrl + C로 종료 후
   npm run dev
   ```

3. **브라우저 강제 새로고침**
   ```
   Ctrl + Shift + R (Windows)
   Cmd + Shift + R (Mac)
   ```

### ❌ 커서가 안 보이는 경우
1. **콘솔 에러 확인**
   - F12 → Console 탭
   - 빨간 에러 메시지 확인

2. **네트워크 탭 확인**
   - F12 → Network 탭
   - WS (WebSocket) 연결 확인

3. **두 탭이 필요해요!**
   - 같은 사용자의 커서는 보이지 않음
   - 반드시 새 탭을 열어야 함

---

## 📊 예상 결과

### ✅ 성공 시
```
탭 1:
- Connected ✅
- 커서: 1명 (탭 2의 커서)
- 마우스 움직임 → 탭 2에 반영

탭 2:
- Connected ✅
- 커서: 1명 (탭 1의 커서)
- 마우스 움직임 → 탭 1에 반영
```

### ❌ 실패 시
```
- Disconnected
- 커서: 0명
- 콘솔에 에러 메시지
```

---

## 🔍 코드 위치

| 파일 | 역할 |
|------|------|
| `src/lib/supabase.ts` | Supabase 클라이언트 설정 |
| `src/features/realtime/hooks/useRealtimeCursors.ts` | 실시간 로직 |
| `src/features/realtime/components/CursorCanvas.tsx` | 렌더링 + 상태 표시 |
| `src/features/realtime/components/CursorPointer.tsx` | 개별 커서 UI |
| `public/cursor-test.html` | 순수 HTML 테스트 페이지 |

---

## 🎯 핵심 차이점

### ❌ examples/script.js (Socket.IO)
```javascript
const socket = io("https://DEVLOG-cursor.loca.lt");  // 작동 안함!
```

### ✅ 우리 코드 (Supabase Realtime)
```typescript
const channel = supabase.channel('portfolio:cursors');
channel.send({ type: 'broadcast', event: 'cursor_move', payload: {...} });
```

---

**지금 바로 테스트해봐!** 🚀

```bash
# 1. 브라우저 열기
http://localhost:5173

# 2. 새 탭 열기 (Ctrl + T)
http://localhost:5173

# 3. 마우스 움직이기 → 커서 동기화 확인! ✨
```
