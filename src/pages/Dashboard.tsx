import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from '@tanstack/react-router';
import DashboardHeader from '@/components/DashboardHeader';
import ServiceCard from '@/components/ServiceCard';
import {
  GraduationCap,
  Users,
  Bus,
  BookOpen,
  CreditCard,
  Bell,
  Settings,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';

const services = [
  {
    icon: GraduationCap,
    title: 'Student / Teacher Panel',
    description: 'Academic records, grades, course materials and schedules',
    color: 'bg-accent/10 text-accent',
    roles: ['student', 'teacher', 'admin'],
  },
  {
    icon: Users,
    title: 'HRD System',
    description: 'Employee management, payroll, attendance tracking',
    color: 'bg-gold/10 text-gold-foreground',
    roles: ['admin', 'teacher'],
  },
  {
    icon: Bus,
    title: 'Transport System',
    description: 'Bus tracking, schedules, routes and bookings',
    color: 'bg-success/10 text-success',
    roles: ['student', 'teacher', 'admin'],
  },
  {
    icon: BookOpen,
    title: 'Library Portal',
    description: 'Digital library, e-books, journal access and reservations',
    color: 'bg-primary/10 text-primary',
    roles: ['student', 'teacher', 'admin'],
  },
  {
    icon: CreditCard,
    title: 'Fee Management',
    description: 'Tuition payments, fee structures and financial records',
    color: 'bg-destructive/10 text-destructive',
    roles: ['student', 'admin'],
  },
  {
    icon: Bell,
    title: 'Notice Board',
    description: 'University announcements, events and important updates',
    color: 'bg-accent/10 text-accent',
    roles: ['student', 'teacher', 'admin'],
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Performance metrics, reports and institutional data',
    color: 'bg-gold/10 text-gold-foreground',
    roles: ['admin'],
  },
  {
    icon: Settings,
    title: 'System Settings',
    description: 'Portal configuration, user management and access control',
    color: 'bg-muted-foreground/10 text-muted-foreground',
    roles: ['admin'],
  },
];

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to='/login' />;

  const availableServices = services.filter((s) =>
    s.roles.includes(user!.role),
  );

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
            {greeting()}, {user?.name} 👋
          </h1>
          <p className='text-muted-foreground mt-1'>
            Access your university services from one place
          </p>
        </div>

        {/* Service grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {availableServices.map((service, i) => (
            <ServiceCard
              key={service.title}
              icon={service.icon}
              title={service.title}
              description={service.description}
              color={service.color}
              delay={0.15 + i * 0.08}
              onClick={() => toast.info(`${service.title} module coming soon!`)}
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
