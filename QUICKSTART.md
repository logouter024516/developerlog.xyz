# 🚀 Quick Start Guide

## ⚡ 30초만에 시작하기

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. 브라우저 열기
```
http://localhost:5173
```

**끝!** 🎉 이제 glassmorphism 포트폴리오를 볼 수 있어요!

---

## 🎨 뭘 보게 되나요?

### 메인 화면
- ✨ **Animated floating blobs** - 부드럽게 움직이는 gradient 원들
- 🎯 **Glassmorphism header** - 반투명 blur 효과의 헤더
- 🌈 **Gradient animated title** - "Developer Portfolio" 텍스트가 색상 변화
- 📊 **Project stats** - 실시간 프로젝트/기여 개수

### 프로젝트 섹션
- 🚀 **My Projects** - 내가 만든 레포지토리들
- 🤝 **Contributed Projects** - 기여한 레포지토리들
- 🎴 **Glassmorphism cards** - 마우스 올리면 살짝 뜨는 카드들
- ⭐ **Meta info** - 별, 포크, 언어 정보

### Real-time 커서
- 👥 **Multi-cursor** - 다른 사용자의 커서 실시간 표시
- 🎨 **Random colors** - 각 사용자마다 다른 색상
- 💫 **Glow effects** - 커서 주위로 glow 효과
- 🔮 **Glassmorphism labels** - 사용자 이름 라벨

---

## 🔧 문제 해결

### 빈 화면이 나와요
**원인**: `.env` 파일 설정이 안 되어 있음

**해결**:
```bash
# .env 파일이 이미 있는지 확인
ls .env

# 있으면 GitHub username 확인
cat .env | grep GITHUB_USERNAME

# VITE_GITHUB_USERNAME=logouter024516 로 되어 있어야 함
```

### Supabase 에러가 나요
**원인**: Supabase 설정이 잘못됨 (실시간 커서 기능)

**해결**:
1. https://supabase.com 가입
2. 새 프로젝트 생성
3. Settings → API에서 URL과 anon key 복사
4. `.env` 파일에 붙여넣기

**임시 해결**: Supabase 없어도 **프로젝트 목록은 정상 표시**됨

### GitHub API rate limit
**증상**: "API rate limit exceeded" 에러

**해결**: GitHub token 추가
1. GitHub Settings → Developer settings → Tokens
2. Generate new token (classic)
3. 권한 선택 안 해도 됨
4. `.env`에 `VITE_GITHUB_TOKEN=` 뒤에 붙여넣기

---

## 📝 빠른 커스터마이징

### 내 정보로 변경
`.env` 파일 수정:
```env
VITE_GITHUB_USERNAME=your_username_here
```

### 색상 변경
`src/index.css`에서:
```css
/* Blob 색상 변경 */
.bg-purple-500/30  → .bg-cyan-500/30
.bg-blue-500/30    → .bg-green-500/30
.bg-pink-500/20    → .bg-yellow-500/20
```

### 타이틀 변경
`src/pages/HomePage.tsx`에서:
```tsx
<h1 className="text-6xl font-bold mb-4 gradient-text">
  Your Name's Portfolio  {/* 여기 수정 */}
</h1>
```

---

## 🚀 배포하기

### GitHub Pages에 배포
```bash
# 1. GitHub에 코드 push
git add .
git commit -m "🚀 Deploy portfolio"
git push origin main

# 2. GitHub Actions가 자동으로 빌드 & 배포
# 3. 몇 분 후 https://logouter024516.github.io/03_portfolio_web/ 에서 확인
```

### 필요한 설정
GitHub repository Settings → Secrets에 추가:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_GITHUB_USERNAME`
- `VITE_GITHUB_TOKEN` (optional)

---

## 📚 더 알아보기

- **디자인 가이드**: `GLASSMORPHISM.md`
- **배포 가이드**: `DEPLOYMENT.md`
- **프로젝트 요약**: `STATUS.md`
- **전체 문서**: `README.md`

---

## 💡 꿀팁

### 1. 여러 브라우저로 열어보기
개발 서버를 켜놓고 Chrome, Firefox 등 여러 브라우저로 열어보세요. 
**실시간 커서가 서로 보여요!** 👥

### 2. 모바일에서 확인
같은 Wi-Fi에서 모바일로 접속:
```
http://YOUR_PC_IP:5173
```

### 3. 성능 측정
```bash
npm run build
npm run preview
```
Lighthouse로 성능 측정 가능

---

## ⚡ 명령어 정리

```bash
# 개발
npm run dev          # 개발 서버 (http://localhost:5173)

# 빌드
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기

# 코드 품질
npm run lint         # ESLint 검사

# 배포
git push origin main # GitHub Pages 자동 배포
```

---

## 🎉 완료!

이제 **glassmorphism 스타일의 멋진 포트폴리오**를 가지게 되었어요!

**즐거운 코딩 되세요!** 🚀✨

---

**Questions?** 문서들을 확인하거나 GitHub Issues를 열어주세요!
