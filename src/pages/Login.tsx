import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth, type UserRole } from '@/contexts/AuthContext';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Loader2 } from 'lucide-react';

const roles: { value: UserRole; label: string }[] = [
  { value: 'student', label: 'Student' },
  { value: 'teacher', label: 'Teacher' },
  { value: 'admin', label: 'Admin' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password, role);
      navigate({ to: '/dashboard' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title='Welcome back'
      subtitle='Sign in to access your university services'
    >
      <form onSubmit={handleSubmit} className='space-y-5'>
        {/* Role selector */}
        <div>
          <Label className='text-sm font-medium text-foreground mb-2 block'>
            I am a
          </Label>
          <div className='grid grid-cols-3 gap-2'>
            {roles.map((r) => (
              <button
                key={r.value}
                type='button'
                onClick={() => setRole(r.value)}
                className={`py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-200 border ${
                  role === r.value
                    ? 'bg-primary text-primary-foreground border-primary shadow-md'
                    : 'bg-secondary text-secondary-foreground border-border hover:border-primary/30'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>Email or Student ID</Label>
          <Input
            id='email'
            type='text'
            placeholder='you@iiuc.ac.bd'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='h-11'
          />
        </div>

        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <Label htmlFor='password'>Password</Label>
            <Link
              to='/forgot-password'
              className='text-sm text-accent hover:underline'
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id='password'
            type='password'
            placeholder='••••••••'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='h-11'
          />
        </div>

        <Button
          type='submit'
          disabled={loading}
          className='w-full h-11 text-sm font-semibold'
        >
          {loading ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <LogIn className='mr-2 h-4 w-4' />
          )}
          Sign In
        </Button>

        <p className='text-center text-sm text-muted-foreground'>
          Don't have an account?{' '}
          <Link
            to='/register'
            className='text-accent font-medium hover:underline'
          >
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
