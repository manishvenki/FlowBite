import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const redirectPath = new URLSearchParams(location.search).get('redirect') || '/';
  const isAdminLogin = location.pathname.includes('/admin') || redirectPath === '/admin';

  // If already logged in as ADMIN, forward directly to admin portal
  React.useEffect(() => {
    const token = localStorage.getItem('biteflow_token');
    const storedUser = localStorage.getItem('biteflow_user');
    if (token && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed.role === 'ADMIN' && isAdminLogin) {
          navigate('/admin', { replace: true });
        }
      } catch (e) {
        // ignore JSON parse error
      }
    }
  }, [isAdminLogin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      const user = await login({ email, password });
      success(`Welcome back, ${user.name}!`);

      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } catch (err: any) {
      setFormError(err.message || 'Invalid credentials');
      toastError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 sm:py-16">
      <div className="bg-[#FFFDF5] border border-sand-border/80 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <img
            src="/logo.png"
            alt="BiteFlow Logo"
            className="w-14 h-14 object-contain rounded-2xl mx-auto shadow-subtle mb-2"
          />
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-olive-dark">
            {isAdminLogin ? 'Store Admin Sign In' : 'Sign In to BiteFlow'}
          </h1>
          <p className="text-xs sm:text-sm text-olive-dark/70">
            {isAdminLogin
              ? 'Enter administrator credentials to manage your store'
              : 'Order fresh meals from your favorite neighborhood kitchens'}
          </p>
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-terracotta/10 border border-terracotta/30 text-xs text-terracotta font-medium">
            {formError}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            startIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            startIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            isLoading={loading}
          >
            Sign In
          </Button>
        </form>

        {/* Footer link */}
        <div className="text-center pt-2 text-xs text-olive-dark/70">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-olive underline hover:text-olive-dark">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};
