import { Navigate } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} />;
};

export default Index;
