import React, { useState } from 'react';
import { Mail, Phone, ArrowLeft, Lock, Loader2 } from 'lucide-react';
import { AuthState } from '../types';

interface LoginPageProps {
  onSuccess: (email: string) => void;
  onBack: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onSuccess, onBack }) => {
  const [auth, setAuth] = useState<AuthState>({
    step: 'INPUT',
    method: 'email',
    value: '',
    loading: false,
    error: null,
  });

  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.value) {
      setAuth(prev => ({ ...prev, error: 'Please enter your details.' }));
      return;
    }
    
    setAuth(prev => ({ ...prev, loading: true, error: null }));
    
    // Simulate API delay
    setTimeout(() => {
      setAuth(prev => ({ ...prev, loading: false, step: 'OTP' }));
    }, 1500);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length !== 6) return;

    setAuth(prev => ({ ...prev, loading: true }));

    // Simulate Verification
    setTimeout(() => {
      onSuccess(auth.value);
    }, 1500);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md animate-fade-in rounded-none border border-sienna/10 bg-white/50 p-8 shadow-xl backdrop-blur-sm md:p-12">
        
        <button onClick={onBack} className="mb-8 flex items-center gap-2 text-sm text-sienna/70 hover:text-sienna">
          <ArrowLeft size={16} />
          Back to home
        </button>

        <div className="mb-8">
          <h2 className="mb-2 font-serif text-3xl text-warmGray">Welcome back</h2>
          <p className="text-warmGray/60">Sign in to see our moments.</p>
        </div>

        {auth.step === 'INPUT' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="flex gap-4 border-b border-sienna/10 pb-4">
              <button
                type="button"
                className={`flex-1 pb-2 text-center text-sm font-medium transition-colors ${auth.method === 'email' ? 'border-b-2 border-sienna text-sienna' : 'text-warmGray/40 hover:text-warmGray/60'}`}
                onClick={() => setAuth({ ...auth, method: 'email', error: null })}
              >
                Email
              </button>
              <button
                type="button"
                className={`flex-1 pb-2 text-center text-sm font-medium transition-colors ${auth.method === 'phone' ? 'border-b-2 border-sienna text-sienna' : 'text-warmGray/40 hover:text-warmGray/60'}`}
                onClick={() => setAuth({ ...auth, method: 'phone', error: null })}
              >
                Phone
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium uppercase tracking-wider text-warmGray/50">
                {auth.method === 'email' ? 'Email Address' : 'Mobile Number'}
              </label>
              <div className="relative">
                <input
                  type={auth.method === 'email' ? 'email' : 'tel'}
                  value={auth.value}
                  onChange={(e) => setAuth({ ...auth, value: e.target.value })}
                  placeholder={auth.method === 'email' ? 'you@example.com' : '+1 234 567 8900'}
                  className="w-full border-b border-warmGray/20 bg-transparent py-3 pl-10 text-lg text-warmGray placeholder-warmGray/30 focus:border-sienna focus:outline-none"
                  autoFocus
                />
                <div className="absolute left-0 top-3 text-warmGray/40">
                  {auth.method === 'email' ? <Mail size={20} /> : <Phone size={20} />}
                </div>
              </div>
            </div>

            {auth.error && <p className="text-sm text-red-500">{auth.error}</p>}

            <button
              type="button" // Change to submit for real action, button for now to catch enter elsewhere if needed
              onClick={handleSendOtp}
              disabled={auth.loading}
              className="flex w-full items-center justify-center gap-2 bg-warmGray py-4 font-sans text-white transition-all hover:bg-sienna disabled:opacity-70"
            >
              {auth.loading ? <Loader2 className="animate-spin" /> : 'Send Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-4">
               <label className="text-xs font-medium uppercase tracking-wider text-warmGray/50">
                Verification Code
              </label>
              <p className="text-sm text-warmGray/60">
                We sent a 6-digit code to <span className="font-semibold text-sienna">{auth.value}</span>
              </p>
              
              <div className="flex justify-between gap-2">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="h-12 w-full border border-warmGray/20 bg-white/40 text-center text-xl text-warmGray focus:border-sienna focus:bg-white focus:outline-none"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={auth.loading}
              className="flex w-full items-center justify-center gap-2 bg-sienna py-4 font-sans text-white transition-all hover:bg-sienna/90 disabled:opacity-70"
            >
              {auth.loading ? <Loader2 className="animate-spin" /> : 'Enter Gallery'}
            </button>
             <button 
              type="button"
              onClick={() => setAuth({...auth, step: 'INPUT', loading: false})}
              className="w-full text-center text-sm text-warmGray/50 hover:text-sienna"
            >
              Changed your mind?
            </button>
          </form>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-warmGray/40">
          <Lock size={12} />
          <span>Private & Secure. We respect your memories.</span>
        </div>
      </div>
    </div>
  );
};
