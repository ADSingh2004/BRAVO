import { FormEvent, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { signIn, signUp } from '../utils/auth';

interface LoginProps {
  onLogin: (email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up new user
        const result = await signUp(email, password);
        if (result.success) {
          setSuccess('Account created! Please check your email to confirm.');
          // For development, auto-login after signup
          setTimeout(() => {
            onLogin(email);
          }, 1500);
        } else {
          setError(result.error || 'Sign up failed');
        }
      } else {
        // Sign in existing user
        const result = await signIn(email, password);
        if (result.success) {
          onLogin(email);
        } else {
          setError(result.error || 'Login failed');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-600 to-emerald-500 flex items-center justify-center p-4">
      <div className="w-full max-w-[440px] bg-white rounded-[24px] shadow-2xl p-[50px_40px] animate-slideIn">
        <div className="text-center mb-9">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-600 to-emerald-500 rounded-[20px] flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Sparkles className="w-[45px] h-[45px] text-white" />
          </div>
          <h1 className="text-3xl font-bold text-teal-600 mb-2">
            {isSignUp ? 'Create Account' : 'Welcome to fitnessFREAK'}
          </h1>
          <p className="text-gray-500 text-[15px]">Your AI-powered fitness companion</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-[22px]">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full px-4 py-[14px] border-2 border-gray-200 rounded-xl text-[15px] transition-all focus:outline-none focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"
            />
          </div>

          <div className="mb-[22px]">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full px-4 py-[14px] border-2 border-gray-200 rounded-xl text-[15px] transition-all focus:outline-none focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"
            />
            <div className="text-right mt-2">
              <a href="#forgot" className="text-teal-500 text-sm font-medium hover:text-teal-600">
                Forgot password?
              </a>
            </div>
          </div>

          <div className="flex items-center gap-2 my-5">
            <input
              type="checkbox"
              id="remember"
              className="w-[18px] h-[18px] cursor-pointer accent-teal-500"
            />
            <label htmlFor="remember" className="text-sm text-gray-700 cursor-pointer">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-teal-600 text-white text-base font-semibold rounded-xl cursor-pointer transition-all hover:bg-teal-700 hover:shadow-lg active:transform active:translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Login')}
          </button>
        </form>

        <div className="flex items-center my-8 text-gray-400 text-sm before:content-[''] before:flex-1 before:h-[1px] before:bg-gray-200 after:content-[''] after:flex-1 after:h-[1px] after:bg-gray-200">
          <span className="px-4">or continue with</span>
        </div>

        <div className="flex gap-4 mb-6">
          <button className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-xl bg-white transition-all hover:border-teal-500 hover:bg-teal-50 flex items-center justify-center gap-2 text-sm font-medium text-gray-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button className="flex-1 py-3 px-4 border-2 border-gray-200 rounded-xl bg-white transition-all hover:border-teal-500 hover:bg-teal-50 flex items-center justify-center gap-2 text-sm font-medium text-gray-700">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

        <div className="text-center text-gray-500 text-sm">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button 
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setSuccess('');
            }}
            className="text-teal-500 font-semibold hover:text-teal-600"
          >
            {isSignUp ? 'Login' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}