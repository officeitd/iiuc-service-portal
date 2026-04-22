import iiucLogo from '@/assets/logo.webp';

const DashboardHeader = () => {
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
      </div>
    </header>
  );
};

export default DashboardHeader;
