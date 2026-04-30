
import React, { useState, useEffect } from 'react';
import { UserRole } from '../types.ts';
import { supabase } from '../supabase.ts';

interface LoginProps {
  onLogin: (username: string, role: UserRole) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const ADMIN_EMAIL = 'admin@gmail.com';

  useEffect(() => {
    if (email.trim().toLowerCase() === ADMIN_EMAIL) {
      setRole('ADMIN');
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const normalizedEmail = email.trim().toLowerCase();

    if (role === 'ADMIN' && normalizedEmail !== ADMIN_EMAIL) {
      setError("Unauthorized Email: Only admin@gmail.com is authorized for administrative access.");
      setLoading(false);
      return;
    }

    if (role === 'STUDENT' && normalizedEmail === ADMIN_EMAIL) {
      setError("This is an Admin account. Please select 'Administrator' role to login.");
      setLoading(false);
      return;
    }

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      if (isRegistering) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
        });
        if (signUpError) throw signUpError;
        if (data.user) {
          onLogin(normalizedEmail, role);
        }
      } else {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });
        if (signInError) throw signInError;
        if (data.user) {
          const userRole: UserRole = data.user.email?.toLowerCase() === ADMIN_EMAIL ? 'ADMIN' : 'STUDENT';
          onLogin(normalizedEmail, userRole);
        }
      }
    } catch (err: any) {
      if (err.message?.includes("Invalid login credentials")) {
        setError("Login Failed: If this is your first time, please use 'Register Now' below.");
      } else {
        setError(err.message || "An authentication error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);

    try {
      const { error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (googleError) throw googleError;
    } catch (err: any) {
      setError(err.message || "Google sign in could not be started.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all">
          <div className="p-8">
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                {isRegistering ? 'Create Account' : 'Portal Login'}
              </h2>
              <p className="text-gray-500 font-medium">
                {role === 'ADMIN' ? 'Authorized Admin Personnel Only' : 'Student Identity Management'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex p-1 bg-gray-100 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${role === 'STUDENT' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`flex-1 py-2.5 text-xs font-black rounded-xl transition-all uppercase tracking-widest ${role === 'ADMIN' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Admin
                </button>
              </div>

              {role === 'STUDENT' && (
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-4 px-4 bg-white hover:bg-gray-50 text-gray-700 font-black text-xs uppercase tracking-widest rounded-2xl border-2 border-gray-100 shadow-sm transition-all transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.3 9.14 5.38 12 5.38z" />
                  </svg>
                  Continue with Google
                </button>
              )}

              {role === 'STUDENT' && (
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-100"></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">or</span>
                  <div className="h-px flex-1 bg-gray-100"></div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full px-5 py-4 border-2 border-gray-50 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold bg-gray-50"
                  placeholder={role === 'ADMIN' ? "Gmail" : "your.email@college.edu"}
                />
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full px-5 py-4 border-2 border-gray-50 text-gray-900 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all font-bold bg-gray-50"
                  placeholder="••••••••"
                />
                {role === 'ADMIN' && (
                  <p className="mt-2 text-[10px] text-blue-500 font-bold italic ml-1"></p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-100 transition-all transform active:scale-[0.98] disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Authenticating...</span>
                    </div>
                  ) : (isRegistering ? 'Complete Registration' : 'Enter Dashboard')}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError(null);
                  }}
                  className="text-xs text-blue-600 font-black uppercase tracking-widest hover:text-blue-800 transition-colors"
                >
                  {isRegistering ? '← Back to Sign In' : "Don't have an account? Register Now"}
                </button>
              </div>
            </form>
          </div>
          <div className="bg-gray-50 p-6 text-center border-t border-gray-100">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
              Secure Cloud Infrastructure • Supabase Auth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
