# 🎨 Glassmorphism Design Applied

## ✨ Overview



### 주요 특징
- 🔮 **Glassmorphism Cards** - 반투명 blur 효과
- 🌈 **Animated Gradient Text** - 계속 변하는 그라디언트
- ✨ **Floating Blobs** - 부드럽게 움직이는 배경
- 💫 **Glow Effects** - 커서와 텍스트에 glow
- 🎨 **Dark Gradient Background** - 세련된 다크 배경

---

## 📁 수정된 파일들

### 1. `src/index.css`
Glassmorphism 유틸리티 클래스 추가:

```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

.glass-strong {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.glass-card {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(12px);
  transition: all 0.3s ease;
}

.gradient-text {
  background: linear-gradient(90deg, 
    #667eea, #764ba2, #f093fb, #4facfe, #00f2fe);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient-shift 4s ease infinite;
}

.float {
  animation: float 6s ease-in-out infinite;
}
```

### 2. `src/pages/HomePage.tsx`
- ✅ Animated floating gradient blobs (purple, blue, pink)
- ✅ Glassmorphism 헤더 카드
- ✅ Gradient animated 타이틀
- ✅ 프로젝트/기여 카운트 live display
- ✅ Glassmorphism footer

### 3. `src/features/projects/components/ProjectCard.tsx`
- ✅ `.glass-card` 스타일 적용
- ✅ Hover 시 더 강한 glass 효과 (y: -8px)
- ✅ Gradient 뱃지 디자인
- ✅ Avatar with ring effect
- ✅ Enhanced meta badges

### 4. `src/features/projects/components/ProjectList.tsx`
- ✅ 타이틀을 glassmorphism 카드로 감싸기
- ✅ 레포지토리 개수 표시

### 5. `src/features/realtime/components/CursorPointer.tsx`
- ✅ Glassmorphism 라벨
- ✅ Color-based glow effect
- ✅ Dynamic text shadow

---

## 🎨 Design System

### Color Palette

**Background Gradient:**
```css
background: linear-gradient(135deg, 
  #0f0f23 0%, 
  #1a1a2e 50%, 
  #16213e 100%
);
```

**Glass Layers:**
- Light glass: `rgba(255, 255, 255, 0.05)`
- Medium glass: `rgba(255, 255, 255, 0.08)`
- Strong glass: `rgba(255, 255, 255, 0.1-0.12)`

**Accent Colors:**
- Purple blob: `#a855f7` / 30% opacity
- Blue blob: `#3b82f6` / 30% opacity
- Pink blob: `#ec4899` / 20% opacity

**Text Colors:**
- Primary: `#ffffff`
- Secondary: `#d1d5db` (gray-300)
- Tertiary: `#9ca3af` (gray-400)

### Typography
- **Headings**: Bold, 2xl-6xl sizes
- **Body**: Regular, sm-lg sizes
- **Font**: Inter, system-ui, -apple-system

### Spacing
- **Cards**: p-6 (24px padding)
- **Sections**: mb-16/mb-20 (64px/80px margin)
- **Grid gaps**: gap-6 (24px)

---

## 🌟 Key Animations

### 1. Floating Blobs
```css
@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}
```
- Duration: 6s
- Easing: ease-in-out
- Staggered delays: 0s, -1.5s, -3s

### 2. Gradient Shift
```css
@keyframes gradient-shift {
  0%, 100% { background-position: 0% center; }
  50% { background-position: 100% center; }
}
```
- Duration: 4s
- Applies to title text

### 3. Hover Effects
**Cards:**
- Transform: `translateY(-8px) scale(1.02)`
- Background: Brightens to `rgba(255, 255, 255, 0.12)`
- Border: Brightens to `rgba(255, 255, 255, 0.3)`
- Shadow: Increases to `0 12px 40px rgba(0, 0, 0, 0.5)`

---

## 🚀 Usage

### Development
```bash
npm run dev
```
Open http://localhost:5173 to see the glassmorphism design.

### Production
```bash
npm run build
npm run preview
```

### Deployment
```bash
git push origin main
```
GitHub Actions will automatically deploy to GitHub Pages.

---

## 💡 Customization Tips

### Changing Glass Intensity
```css
/* Lighter glass */
.glass-light {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
}

/* Stronger glass */
.glass-stronger {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(25px);
}
```

### Changing Blob Colors
In `HomePage.tsx`, modify the blob divs:
```tsx
<div className="absolute ... bg-cyan-500/30 ..." />
<div className="absolute ... bg-emerald-500/30 ..." />
```

### Changing Gradient Text Colors
In `index.css`, modify `.gradient-text`:
```css
background: linear-gradient(90deg, 
  #your-color-1,
  #your-color-2,
  #your-color-3
);
```

---

## 📸 Visual Examples

### Before (Standard Dark Theme)
- Solid dark background
- Standard card borders
- Simple hover effects

### After (Glassmorphism)
- Gradient background with floating blobs
- Translucent cards with blur
- Smooth, sophisticated hover effects
- Animated gradient text
- Glow effects on interactive elements

---

## 🎯 Browser Support

- ✅ Chrome/Edge 76+
- ✅ Firefox 103+
- ✅ Safari 9+
- ⚠️ `backdrop-filter` may need prefixes for older browsers

### Fallback
If `backdrop-filter` is not supported, cards will still have:
- Semi-transparent background
- Border styling
- Box shadows

---

## 📚 References

- **Glassmorphism**: https://uxdesign.cc/glassmorphism-in-user-interfaces-1f39bb1308c9
- **CSS backdrop-filter**: https://developer.mozilla.org/en-US/docs/Web/CSS/backdrop-filter
- **Framer Motion**: https://www.framer.com/motion/

---

## ✅ Checklist

- [x] Glassmorphism utility classes
- [x] Animated gradient background
- [x] Floating blobs with animation
- [x] Glass cards with hover effects
- [x] Gradient animated text
- [x] Enhanced project cards
- [x] Glassmorphism cursors
- [x] Responsive design
- [x] Production build tested

---
