import { QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { queryClient } from './lib/query-client';
import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';

function App() {
  useEffect(() => {
    const scriptId = 'google-adsense-script';
    const scriptSrc = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1926397520827358';

    const existingScript = document.getElementById(scriptId)
      || document.querySelector(`script[src="${scriptSrc}"]`);

    if (existingScript) {
      return;
    }

    const adScript = document.createElement('script');
    adScript.id = scriptId;
    adScript.async = true;
    adScript.src = scriptSrc;
    adScript.setAttribute('crossorigin', 'anonymous');
    document.head.appendChild(adScript);
  }, []);

  // 간단한 URL 기반 라우팅
  const isAdminPage = window.location.pathname === '/admin' || window.location.pathname === '/admin.html';

  return (
    <QueryClientProvider client={queryClient}>
      {isAdminPage ? <AdminPage /> : <HomePage />}
    </QueryClientProvider>
  );
}

export default App;
