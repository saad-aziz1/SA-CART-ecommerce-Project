import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';

const SignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsloading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // InputChange
  const handleForm = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/user/signup", formData, { withCredentials: true });
      if (res.status === 201) {
        toast.success('Account created successfully! Please verify your email.');
        navigate('/verify');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed. Please check your details.');
      console.log(error);
    } finally {
      setIsloading(false);
    }
  };

  // GoogleSignUP
  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const { displayName, email } = response.user;

      const result = await axios.post(
        "http://localhost:3000/api/user/googlelogin", 
        { name: displayName, email }, 
        { withCredentials: true }
      );

      if (result.status === 200) {
        toast.success('User Sign Up Successful!');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Google Sign-In failed.');
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#0F172A_0%,#1E293B_50%,#0F172A_100%)] flex items-center justify-center p-4 py-10">
      
     
      <div className="bg-[#F8FAFC] w-full max-w-md md:max-w-[460px] rounded-[1.5rem] shadow-2xl border border-[#94A3B8]/20 overflow-hidden">
        
        
        <div className="bg-[#0F172A] p-8 text-center border-b border-[#F59E0B]/20">
          <h2 className="text-[#F8FAFC] text-3xl font-black tracking-tighter uppercase">
            SA<span className="text-[#F59E0B]">-</span>CART
          </h2>
          <p className="text-[#94A3B8] text-xs mt-2 font-medium tracking-wide italic">Join the premium shopping experience</p>
        </div>

        <div className="p-6 md:p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            
            {/* form */}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[#020617] text-[10px] font-black uppercase tracking-widest ml-1">First Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleForm}
                    placeholder="First Name"
                    className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#F59E0B] transition-all"
                  />
                  <User className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#020617] text-[10px] font-black uppercase tracking-widest ml-1">Last Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleForm}
                    placeholder="Last Name"
                    className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#F59E0B] transition-all"
                  />
                  <User className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[#020617] text-[10px] font-black uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleForm}
                  placeholder="Email"
                  className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-[#F59E0B] transition-all"
                />
                <Mail className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[#020617] text-[10px] font-black uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleForm}
                  placeholder="Password"
                  className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3 pl-10 pr-12 text-sm focus:outline-none focus:border-[#F59E0B] transition-all"
                />
                <Lock className="absolute left-3 top-3 w-4 h-4 text-[#94A3B8]" />
                <button
                  type="button"
                  className="absolute right-4 top-3 text-[#94A3B8] hover:text-[#0F172A]"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-[#F59E0B] text-[#020617] py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-[#0F172A] hover:text-[#F8FAFC] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F59E0B]/20 group disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-[#020617] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8 text-center">
            <hr className="border-[#94A3B8]/20" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F8FAFC] px-4 text-[#94A3B8] text-[9px] font-black uppercase tracking-widest">
              Or Social Signup
            </span>
          </div>

          {/* Google Button */}
          <button 
            type="button"
            className="w-full bg-white border border-[#94A3B8]/20 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-3 hover:border-[#F59E0B] transition-all text-[#020617] shadow-sm active:scale-[0.98]" 
            onClick={googleSignUp}
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4" alt="Google" />
            Continue with Google
          </button>

          {/* Footer Link */}
          <p className="text-center mt-8 text-xs text-[#94A3B8] font-medium">
            Already a member?
            <Link to="/login" className="text-[#0F172A] font-black hover:text-[#F59E0B] ml-1.5 transition-colors underline decoration-[#F59E0B]/30 underline-offset-4">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;