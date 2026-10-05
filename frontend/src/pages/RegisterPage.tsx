import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User as UserIcon, Mail, Phone, Lock } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name || !email || !phone || !password || !confirmPassword) {
      setFormError('Please fill out all registration fields');
      return;
    }

    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      const user = await register({
        name,
        email,
        phone,
        password,
        role: 'USER',
      });
      success(`Welcome to BiteFlow, ${user.name}!`);
      navigate('/');
    } catch (err: any) {
      setFormError(err.message || 'Registration failed');
      toastError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-14">
      <div className="bg-[#FFFDF5] border border-sand-border/80 rounded-3xl p-6 sm:p-8 shadow-card space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <img
            src="/logo.png"
            alt="BiteFlow Logo"
            className="w-14 h-14 object-contain rounded-2xl mx-auto shadow-subtle mb-2"
          />
          <h1 className="font-serif-title text-2xl sm:text-3xl font-bold text-olive-dark">
            Create an Account
          </h1>
          <p className="text-xs sm:text-sm text-olive-dark/70">
            Join BiteFlow to order artisanal meals & save your addresses
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
            label="Full Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            startIcon={<UserIcon className="w-4 h-4" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@example.com"
            startIcon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 123-4567"
            startIcon={<Phone className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 6 characters"
            startIcon={<Lock className="w-4 h-4" />}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
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
            Create BiteFlow Account
          </Button>
        </form>

        <div className="text-center pt-2 text-xs text-olive-dark/70">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-olive underline hover:text-olive-dark">
            Sign In here
          </Link>
        </div>
      </div>
    </div>
  );
};
