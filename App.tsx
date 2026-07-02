import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { Routes } from './src/routes';
import { LockScreen } from './src/screens/LockScreen';

function AppContent() {
  const { isLocked, isInitialized } = useAuth();

  if (!isInitialized) return null;

  return (
    <>
      <Routes />
      {isLocked ? <LockScreen /> : null}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
