import { useAuth } from '@/contexts/AuthContext';
import iiucLogo from '@/assets/iiuc-logo.png';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';

const roleBadgeStyles: Record<string, string> = {
  student: 'bg-accent/10 text-accent',
  teacher: 'bg-gold/10 text-gold-foreground',
  admin: 'bg-destructive/10 text-destructive',
};

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
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
          <div className='hidden sm:flex items-center gap-2'>
            <div className='w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center'>
              <User className='w-4 h-4 text-primary' />
            </div>
            <div className='text-right'>
              <p className='text-sm font-medium text-foreground'>
                {user?.name}
              </p>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${roleBadgeStyles[user?.role || 'student']}`}
              >
                {user?.role}
              </span>
            </div>
          </div>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleLogout}
            className='text-muted-foreground hover:text-destructive'
          >
            <LogOut className='w-4 h-4' />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
