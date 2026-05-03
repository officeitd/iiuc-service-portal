import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus, Loader2 } from 'lucide-react';
import { useAuth, type UserRole } from '@/contexts/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setError('');

    try {
      await register(name, email, password, role);
      navigate({ to: '/dashboard' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const roles: { value: UserRole; label: string }[] = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'admin', label: 'Admin' },
  ];

  return (
    <AuthLayout
      title='Create account'
      subtitle='Register to get started with IIUC services'
    >
      <form onSubmit={handleSubmit} className='space-y-5'>
        <div>
          <Label className='text-sm font-medium text-foreground mb-2 block'>
            Role
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
          <Label htmlFor='name'>Full Name</Label>
          <Input
            id='name'
            placeholder='Your full name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className='h-11'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            type='email'
            placeholder='you@iiuc.ac.bd'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className='h-11'
          />
        </div>

        <div className='space-y-2'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            type='password'
            placeholder='Create a strong password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className='h-11'
          />
        </div>

        {error ? (
          <p className='rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive'>
            {error}
          </p>
        ) : null}

        <Button
          type='submit'
          disabled={loading}
          className='w-full h-11 text-sm font-semibold'
        >
          {loading ? (
            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
          ) : (
            <UserPlus className='mr-2 h-4 w-4' />
          )}
          Create Account
        </Button>

        <p className='text-center text-sm text-muted-foreground'>
          Already have an account?{' '}
          <Link to='/login' className='text-accent font-medium hover:underline'>
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Register;
