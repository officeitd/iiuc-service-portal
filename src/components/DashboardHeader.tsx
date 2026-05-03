import { useNavigate } from '@tanstack/react-router';
import { LogOut } from 'lucide-react';

import iiucLogo from '@/assets/logo.webp';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const DashboardHeader = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate({ to: '/login' });
  };

  return (
    <header className='border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-50'>
      <div className='container mx-auto flex items-center justify-between h-16 px-4 sm:px-6'>
        <div className='flex items-center gap-3'>
          <img
            src={iiucLogo}
            alt='IIUC'
            className='w-9 h-9'
            width={512}
            height={512}
          />
          <div>
            <span className='font-bold text-foreground text-sm sm:text-base'>
              IIUC Service Portal
            </span>
            <p className='text-xs text-muted-foreground hidden sm:block'>
              University Digital Ecosystem
            </p>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          {user ? (
            <div className='hidden sm:block text-right'>
              <p className='text-sm font-medium text-foreground'>{user.name}</p>
              <p className='text-xs capitalize text-muted-foreground'>
                {user.role}
              </p>
            </div>
          ) : null}

          <Button variant='outline' size='sm' onClick={handleLogout}>
            <LogOut className='mr-2 h-4 w-4' />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
