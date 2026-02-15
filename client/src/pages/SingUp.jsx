import React, { useState } from 'react';
// axios ko hata kar central api utility use ki
import api from '../../utils/api'; 
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import { useDispatch } from "react-redux";
import { setAuthUser } from "../redux/authSlice";

const SignUp = () => {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Normal Email/Password Signup
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      // Production ready call: api instance logic
      const res = await api.post("/api/user/signup", formData);
      
      if (res.status === 201) {
        toast.success('Account created successfully! Please verify your email.');
        navigate('/verify');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed.');
    } finally {
      setIsloading(false);
    }
  };

  // Google Authentication Signup/Login
  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const { displayName, email } = response.user;

      // Central api utility handles the base URL
      const res = await api.post("/api/user/googlelogin", { 
        name: displayName, 
        email 
      });

      dispatch(setAuthUser(res.data.user)); 
      toast.success("Google Sign Up Successful!");
      navigate("/");
    } catch (error) {
      console.error("Google signup error:", error);
      toast.error("Google Sign-In failed.");
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#0F172A_0%,#1E293B_50%,#0F172A_100%)] flex items-center justify-center p-4 py-10">
      <div className="bg-[#F8FAFC] w-full max-w-md rounded-[1.5rem] shadow-2xl border border-[#94A3B8]/20 overflow-hidden">
        
        {/* Brand Header */}
        <div className="bg-[#0F172A] p-8 text-center border-b border-[#F59E0B]/20">
          <h2 className="text-[#F8FAFC] text-3xl font-black tracking-tighter uppercase italic">
            SA<span className="text-[#F59E0B]">-</span>CART
          </h2>
        </div>

        <div className="p-6 md:p-8 space-y-4">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[#020617] text-[10px] font-black uppercase tracking-widest ml-1">First Name</label>
                <div className="relative">
                  <input type="text" name="firstName" required value={formData.firstName} onChange={handleForm} placeholder="First" className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-[#F59E0B] outline-none" />
                  <User className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[#020617] text-[10px] font-black uppercase tracking-widest ml-1">Last Name</label>
                <div className="relative">
                  <input type="text" name="lastName" required value={formData.lastName} onChange={handleForm} placeholder="Last" className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-[#F59E0B] outline-none" />
                  <User className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#020617] text-[10px] font-black uppercase tracking-widest ml-1">Email</label>
              <div className="relative">
                <input type="email" name="email" required value={formData.email} onChange={handleForm} placeholder="Email" className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-[#F59E0B] outline-none" />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#020617] text-[10px] font-black uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" required value={formData.password} onChange={handleForm} placeholder="Password" className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3 pl-10 pr-12 text-sm focus:border-[#F59E0B] outline-none" />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                <button type="button" className="absolute right-4 top-3 text-[#94A3B8] hover:text-[#0F172A]" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button disabled={isLoading} type="submit" className="w-full bg-[#F59E0B] text-[#020617] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#0F172A] hover:text-[#F8FAFC] transition-all flex items-center justify-center gap-2 shadow-lg mt-4 disabled:opacity-70 active:scale-95">
              {isLoading ? <div className="w-5 h-5 border-2 border-[#020617] border-t-transparent rounded-full animate-spin"></div> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6 text-center">
            <hr className="border-[#94A3B8]/20" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F8FAFC] px-4 text-[#94A3B8] text-[9px] font-black uppercase tracking-widest">Or</span>
          </div>

          {/* Google Signup Button */}
          <button type="button" className="w-full bg-white border border-[#94A3B8]/20 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-3 hover:border-[#F59E0B] transition-all shadow-sm active:scale-95" onClick={googleSignUp}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" /> Continue with Google
          </button>

          <p className="text-center mt-6 text-xs text-[#94A3B8] font-medium">
            Already a member? 
            <Link to="/login" className="text-[#0F172A] font-black hover:text-[#F59E0B] ml-1 transition-colors underline decoration-2">
              Login Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;