import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import { HomePage } from './pages/HomePage';
import { AdminPage } from './pages/AdminPage';

function App() {
  // 간단한 URL 기반 라우팅
  const isAdminPage = window.location.pathname === '/admin' || window.location.pathname === '/admin.html';

  return (
    <QueryClientProvider client={queryClient}>
      {isAdminPage ? <AdminPage /> : <HomePage />}
    </QueryClientProvider>
  );
}

export default App;
