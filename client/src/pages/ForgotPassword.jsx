import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// axios ko replace kiya
import api from '../utils/api.js'; 
import toast from 'react-hot-toast';
import { Mail, ArrowLeft, Send } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Production ready API call using custom instance
      const res = await api.post("/api/user/forgot-password", { email });
      
      if (res.status === 200) {
        toast.success('OTP sent to your email!');
        navigate('/reset-password', { state: { email } });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#0F172A_0%,#1E293B_50%,#0F172A_100%)] flex items-center justify-center p-4">
      <div className="bg-[#F8FAFC] w-full max-w-md rounded-[1.5rem] shadow-2xl border border-[#94A3B8]/20 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0F172A] p-8 text-center border-b border-[#F59E0B]/20">
          <h2 className="text-[#F8FAFC] text-2xl font-black uppercase tracking-tighter">Forgot <span className="text-[#F59E0B]">Password?</span></h2>
          <p className="text-[#94A3B8] text-[10px] mt-2 font-medium tracking-widest uppercase italic">Enter email to receive OTP</p>
        </div>

        <div className="p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[#020617] text-[10px] font-black uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3.5 pl-10 pr-4 text-sm focus:outline-none focus:border-[#F59E0B] transition-all"
                />
                <Mail className="absolute left-3 top-4 w-4 h-4 text-[#94A3B8]" />
              </div>
            </div>

            <button
              disabled={isLoading} type="submit"
              className="w-full bg-[#F59E0B] text-[#020617] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#0F172A] hover:text-[#F8FAFC] transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-70"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-[#020617] border-t-transparent rounded-full animate-spin"></div> : (
                <>Send OTP <Send className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-[#94A3B8] text-[10px] font-black uppercase tracking-widest hover:text-[#0F172A] transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;