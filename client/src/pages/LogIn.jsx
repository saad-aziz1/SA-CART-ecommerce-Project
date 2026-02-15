import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// axios ko replace kiya central api instance se
import api from '../../utils/api.js'; 
import toast from 'react-hot-toast';
import { Eye, EyeOff, Mail, Lock, LogIn as LoginIcon } from 'lucide-react';
// Firebase imports for Google Login
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';

import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/authSlice';

const LogIn = () => {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Manual Login Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      // api instance production URL automatically handle karega
      const res = await api.post("/api/user/login", formData);
      
      if (res.status === 200 || res.status === 201) {
        dispatch(setAuthUser(res.data.user)); 
        toast.success('Logged in successfully!');
        navigate('/'); 
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Login failed.');
    } finally {
      setIsloading(false);
    }
  };

  // Google Login Handler
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Google login ke liye bhi api instance use kiya
      const res = await api.post(
        "/api/user/googlelogin",
        {
          name: user.displayName,
          email: user.email,
        }
      );

      dispatch(setAuthUser(res.data.user)); 
      toast.success("Google Login Successful!");
      navigate("/");
    } catch (error) {
      console.error("Google login error:", error);
      toast.error("Google Sign-In failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#0F172A_0%,#1E293B_50%,#0F172A_100%)] flex items-center justify-center p-4 py-10">
      <div className="bg-[#F8FAFC] w-full max-w-md md:max-w-[460px] rounded-[1.5rem] shadow-2xl border border-[#94A3B8]/20 overflow-hidden">
        
        {/* Header Section */}
        <div className="bg-[#0F172A] p-8 text-center border-b border-[#F59E0B]/20">
          <h2 className="text-[#F8FAFC] text-3xl font-black tracking-tighter uppercase">
            SA<span className="text-[#F59E0B]">-</span>CART
          </h2>
          <p className="text-[#94A3B8] text-xs mt-2 font-medium tracking-wide italic">Login to your premium account</p>
        </div>

        <div className="p-6 md:p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[#020617] text-[10px] font-black uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email" name="email" required
                  value={formData.email} onChange={handleForm}
                  placeholder="Email"
                  className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#F59E0B] transition-all"
                />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[#020617] text-[10px] font-black uppercase tracking-widest">Password</label>
                <Link to="/forgot-password" intrinsic="true" className="text-[#F59E0B] text-[10px] font-black uppercase tracking-widest hover:underline transition-all">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"} name="password" required
                  value={formData.password} onChange={handleForm}
                  placeholder="Password"
                  className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3 pl-10 pr-12 text-sm focus:outline-none focus:border-[#F59E0B] transition-all"
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3 text-[#94A3B8] hover:text-[#0F172A]">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit" disabled={isLoading}
              className="w-full bg-[#F59E0B] text-[#020617] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#0F172A] hover:text-[#F8FAFC] transition-all flex items-center justify-center gap-2 shadow-lg group mt-4 active:scale-95 disabled:opacity-70"
            >
              {isLoading ? <div className="w-5 h-5 border-2 border-[#020617] border-t-transparent rounded-full animate-spin"></div> : (
                <>Sign In Now <LoginIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8 text-center">
            <hr className="border-[#94A3B8]/20" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F8FAFC] px-4 text-[#94A3B8] text-[9px] font-black uppercase tracking-widest">Or Social Login</span>
          </div>

          {/* Google Login Button */}
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="w-full bg-white border border-[#94A3B8]/20 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-3 hover:border-[#F59E0B] transition-all text-[#020617] shadow-sm active:scale-[0.98]" 
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
            Sign in with Google
          </button>

          {/* Footer Link */}
          <p className="text-center mt-8 text-xs text-[#94A3B8] font-medium">
            Don't have an account?
            <Link to="/signup" className="text-[#0F172A] font-black hover:text-[#F59E0B] ml-1.5 transition-colors underline decoration-[#F59E0B]/30 underline-offset-4">Create One</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogIn;