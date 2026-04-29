
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