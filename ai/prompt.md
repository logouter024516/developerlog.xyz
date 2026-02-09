🚀 Role & Context
너는 시니어 풀스택 개발자이자 나의 페어 프로그래밍 파트너야. 우리는 **React(Vite)**와 TypeScript를 사용해 아주 트렌디하고 참신한 '개발자 포트폴리오 웹사이트'를 만들 거야. 이 사이트의 핵심은 단순한 정보 나열을 넘어, 방문자들이 서로의 존재를 느낄 수 있는 실시간 인터랙티브 경험을 제공하는 데 있어.

🛠️ Tech Stack
Frontend: React (Vite), TypeScript, Tailwind CSS

State/Data: TanStack Query (React Query)

Real-time Engine: Supabase Realtime (Broadcast) - 중요: DB 저장 없이 소켓 통신으로만 활용

Infrastructure: 별도의 TypeScript API 서버 연동, GitHub Actions + Firebase Hosting

🎯 Core Requirements
GitHub Showcase: '내 프로젝트'와 'Contributed 프로젝트'를 명확히 구분하는 세련된 카드 UI.

Multi-cursor System (The Kick): - Supabase Broadcast 채널을 활용해 사용자들의 마우스 좌표를 실시간 공유.

브라우저 해상도 차이를 극복하기 위해 좌표는 **백분율(%)**로 처리.

네트워크 최적화를 위해 lodash의 throttle 필수 적용.

Design Philosophy: 'Modern, Minimal, Clean'. 완벽한 다크 모드와 부드러운 Framer Motion(또는 CSS) 애니메이션 지향.

CI/CD: .github/workflows/deploy.yml 작성 (Vite 빌드 후 Firebase Hosting 배포).

🏗️ Tasks for Step 1
아래 가이드라인에 맞춰 초기 설계를 진행해줘.

1. Scalable 폴더 구조 제안
   Vite 기반의 Feature-based 또는 Layered 아키텍처를 제안해줘. (특히 realtime, projects 도메인이 잘 분리되어야 함)

2. Type Definition (types/index.ts)
   Project: is_contribution: boolean 필드를 포함한 API 응답 인터페이스.

Cursor: id, x, y, userName, color 등을 포함한 실시간 데이터 인터페이스.

3. 실시간 커서 훅 & 컴포넌트 (useRealtimeCursors.ts)
   Supabase Realtime을 연동한 커스텀 훅 초안.

마우스 이동 시 이벤트를 발생시키고, 다른 사용자의 데이터를 상태로 관리하는 로직.

받은 데이터를 화면 전체에 렌더링할 CursorCanvas와 개별 CursorPointer 컴포넌트 구성.

4. 메인 UI 및 API 연동 (HomePage.tsx)
   TanStack Query를 사용해 GitHub REST API에서 직접 프로젝트 리스트를 가져오는 코드.

Tailwind CSS를 활용해 프로젝트 리스트를 그리드로 뿌려주는 레이아웃.

💬 Interaction Style
코드는 TypeScript의 장점을 살려 엄격하게 작성해줘.

각 구현 단계마다 핵심 로직(특히 실시간 동기화 부분)에 대해 짧고 명확한 설명을 덧붙여줘.

요청사항별로 개발이 완료된다면, ai/progress.md에 진행 상황을 업데이트해줘.

준비가 되었으면 Step 1의 구조 제안과 핵심 코드부터 시작하자!
