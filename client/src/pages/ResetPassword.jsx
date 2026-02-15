import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// Path aur casing check karen: agar file ka naam api.js hy toh ye sahi hy
import api from '../utils/api'; 
import toast from 'react-hot-toast';
import { KeyRound, ShieldCheck, Lock, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const email = location.state?.email || "";

  const [formData, setFormData] = useState({
    otp: "",
    newPassword: ""
  });

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Production ready call using the centralized api instance
      const res = await api.post("/api/user/reset-password", {
        email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });

      if (res.status === 200) {
        toast.success('Password Reset Successfully!');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid OTP or data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#0F172A_0%,#1E293B_50%,#0F172A_100%)] flex items-center justify-center p-4">
      <div className="bg-[#F8FAFC] w-full max-w-md rounded-[1.5rem] shadow-2xl border border-[#94A3B8]/20 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#0F172A] p-8 text-center border-b border-[#F59E0B]/20">
          <h2 className="text-[#F8FAFC] text-2xl font-black uppercase tracking-tighter">Set New <span className="text-[#F59E0B]">Password</span></h2>
          <p className="text-[#94A3B8] text-[10px] mt-2 font-medium tracking-widest uppercase italic">Complete verification to reset</p>
        </div>

        <div className="p-8">
          <form className="space-y-5" onSubmit={handleSubmit}>
            
            {/* Read-only Email */}
            <div className="space-y-1.5 opacity-70">
              <label className="text-[#020617] text-[10px] font-black uppercase tracking-widest ml-1">Account Email</label>
              <div className="relative">
                <input
                  type="email" readOnly value={email}
                  className="w-full bg-[#F1F5F9] border border-[#94A3B8]/30 rounded-xl py-3 pl-10 text-sm cursor-not-allowed text-[#475569]"
                />
                <KeyRound className="absolute left-3 top-3.5 w-4 h-4 text-[#94A3B8]" />
              </div>
            </div>

            {/* OTP Input */}
            <div className="space-y-1.5">
              <label className="text-[#020617] text-[10px] font-black uppercase tracking-widest ml-1">Enter OTP Code</label>
              <div className="relative">
                <input
                  type="text" name="otp" required value={formData.otp}
                  onChange={handleInput} placeholder="6-digit code"
                  className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3 pl-10 text-sm focus:outline-none focus:border-[#F59E0B] tracking-[0.5em] font-bold"
                />
                <ShieldCheck className="absolute left-3 top-3.5 w-4 h-4 text-[#94A3B8]" />
              </div>
            </div>

            {/* New Password Input */}
            <div className="space-y-1.5">
              <label className="text-[#020617] text-[10px] font-black uppercase tracking-widest ml-1">New Secure Password</label>
              <div className="relative">
                <input
                  type="password" name="newPassword" required value={formData.newPassword}
                  onChange={handleInput} placeholder="Enter New Password"
                  className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3 pl-10 text-sm focus:outline-none focus:border-[#F59E0B]"
                />
                <Lock className="absolute left-3 top-3.5 w-4 h-4 text-[#94A3B8]" />
              </div>
            </div>

            <button
              disabled={isLoading} type="submit"
              className="w-full bg-[#F59E0B] text-[#020617] py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#0F172A] hover:text-white transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-70 mt-4"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin"></div> : (
                <>Update Password <CheckCircle className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;