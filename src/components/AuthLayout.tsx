import type { ReactNode } from 'react';
import authBg from '@/assets/auth-bg.jpg';
import iiucLogo from '@/assets/iiuc-logo.png';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
  return (
    <div className='relative flex min-h-screen'>
      {/* Left decorative panel */}
      <div className='hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center'>
        <img
          src={authBg}
          alt=''
          className='absolute inset-0 w-full h-full object-cover'
          width={1920}
          height={1080}
        />
        <div className='absolute inset-0 bg-primary/80' />
        <div
          className='relative z-10 text-center px-12 opacity-0 animate-fade-up'
          style={{ animationDelay: '0.2s' }}
        >
          <img
            src={iiucLogo}
            alt='IIUC Logo'
            className='w-28 h-28 mx-auto mb-8'
            width={512}
            height={512}
          />
          <h1 className='text-3xl font-bold text-primary-foreground mb-3'>
            International Islamic University Chittagong
          </h1>
          <p className='text-primary-foreground/70 text-lg'>
            One Login, All University Services
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className='flex-1 flex items-center justify-center p-6 sm:p-12 gradient-mesh'>
        <div
          className='w-full max-w-md opacity-0 animate-fade-up'
          style={{ animationDelay: '0.3s' }}
        >
          <div className='lg:hidden flex items-center gap-3 mb-8 justify-center'>
            <img
              src={iiucLogo}
              alt='IIUC Logo'
              className='w-12 h-12'
              width={512}
              height={512}
            />
            <span className='font-bold text-foreground text-lg'>
              IIUC Portal
            </span>
          </div>
          <div className='mb-8'>
            <h2 className='text-2xl font-bold text-foreground'>{title}</h2>
            <p className='text-muted-foreground mt-1'>{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
