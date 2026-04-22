import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import AuthLayout from '@/components/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2, ArrowLeft, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSent(true);
    setLoading(false);
  };

  return (
    <AuthLayout
      title='Reset password'
      subtitle="We'll send you a link to reset your password"
    >
      {sent ? (
        <div
          className='text-center space-y-4 opacity-0 animate-fade-up'
          style={{ animationDelay: '0.1s' }}
        >
          <div className='w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto'>
            <CheckCircle className='w-8 h-8 text-success' />
          </div>
          <h3 className='text-lg font-semibold text-foreground'>
            Check your email
          </h3>
          <p className='text-sm text-muted-foreground'>
            We've sent a password reset link to <strong>{email}</strong>
          </p>
          <Link to='/login'>
            <Button variant='outline' className='mt-4'>
              <ArrowLeft className='mr-2 h-4 w-4' /> Back to login
            </Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className='space-y-5'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email address</Label>
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

          <Button
            type='submit'
            disabled={loading}
            className='w-full h-11 text-sm font-semibold'
          >
            {loading ? (
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
            ) : (
              <Mail className='mr-2 h-4 w-4' />
            )}
            Send Reset Link
          </Button>

          <p className='text-center text-sm text-muted-foreground'>
            <Link
              to='/login'
              className='text-accent font-medium hover:underline inline-flex items-center gap-1'
            >
              <ArrowLeft className='h-3 w-3' /> Back to login
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
};

export default ForgotPassword;
