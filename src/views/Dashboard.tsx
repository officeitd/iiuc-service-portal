import { Navigate } from '@tanstack/react-router';
import DashboardHeader from '@/components/DashboardHeader';
import ServiceCard from '@/components/ServiceCard';
import { useAuth } from '@/contexts/AuthContext';
import { GraduationCap, Users, Bus, BookOpen, Globe } from 'lucide-react';
import websitePreview from '@/assets/services/website.png';
import portalPreview from '@/assets/services/portal.png';
import hrdPreview from '@/assets/services/hrd.png';
import transportPreview from '@/assets/services/transport.png';
import libraryPreview from '@/assets/services/library.png';

const services = [
  {
    icon: Globe,
    title: 'IIUC Website',
    description:
      'Official university website with news, events and information',
    color: 'bg-primary/10 text-primary',
    url: 'https://iiuc.ac.bd',
    preview: websitePreview,
  },
  {
    icon: GraduationCap,
    title: 'Student / Teacher Portal',
    description: 'Academic records, grades, course materials and schedules',
    color: 'bg-accent/10 text-accent',
    url: 'https://portal.iiuc.ac.bd',
    preview: portalPreview,
  },
  {
    icon: Users,
    title: 'HRD IIUC',
    description: 'Employee management, payroll, attendance tracking',
    color: 'bg-gold/10 text-gold-foreground',
    url: 'https://hrd.iiuc.ac.bd',
    preview: hrdPreview,
  },
  {
    icon: Bus,
    title: 'IIUC Transport',
    description: 'Bus tracking, schedules, routes and bookings',
    color: 'bg-success/10 text-success',
    url: 'https://transport.iiuc.ac.bd',
    preview: transportPreview,
  },
  {
    icon: BookOpen,
    title: 'Library',
    description: 'Digital library, e-books, journal access and reservations',
    color: 'bg-primary/10 text-primary',
    url: 'https://library.iiuc.ac.bd',
    preview: libraryPreview,
  },
];

const Dashboard = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className='min-h-screen bg-background gradient-mesh'>
      <DashboardHeader />

      <main className='container mx-auto px-4 sm:px-6 py-8 sm:py-12'>
        {/* Welcome section */}
        <div
          className='mb-10 opacity-0 animate-fade-up'
          style={{ animationDelay: '0.1s' }}
        >
          <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
            {greeting()} 👋
          </h1>
          <p className='text-muted-foreground mt-1'>
            Access your university services from one place
          </p>
        </div>

        {/* Service grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
          {services.map((service, i) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              color={service.color}
              delay={0.15 + i * 0.08}
              url={service.url}
              preview={service.preview}
            />
          ))}
        </div>

        {/* Footer */}
        <div
          className='mt-16 text-center opacity-0 animate-fade-up'
          style={{ animationDelay: '0.8s' }}
        >
          <p className='text-xs text-muted-foreground'>
            © {new Date().getFullYear()} International Islamic University
            Chittagong. All rights reserved.
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
