import React, { useState } from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { linkWithCredential, signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';

const SignUp = () => {
  const navigate = useNavigate()
  const [isLoading, setIsloading] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  })

  const handleForm = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsloading(true)
    try {
      const res = await axios.post("http://localhost:3000/api/user/signup", formData, {withCredentials:true})
      if(res.status === 201){
        toast.success('Account created successfully! Please verify your email.')
        navigate('/verify')
      }
      

    } catch (error) {
      toast.error('Signup failed. Please check your details.')
      console.log(error);
    } finally {
      setIsloading(false)
    }
  }

  const googleSignUp = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      const user = response.user
      const name = user.displayName
      const email = user.email

      const result = await axios.post("http://localhost:3000/api/user/googlelogin", {name,email}, {withCredentials:true})
      console.log(result.data);                 
      

      
    } catch (error) {
      console.log(error);
    }
  }

  return (

    // mainPage
    <div className="min-h-screen bg-[linear-gradient(135deg,#1E293B_0%,#334155_50%,#1E293B_100%)] flex items-center justify-center p-4 py-16">

      {/* MainCard  */}
      <div className="bg-[#F8FAFC] w-full max-w-xl rounded-[2rem] shadow-2xl border border-[#94A3B8]/20 overflow-hidden">

        {/* Branding Section */}
        <div className="bg-[#0F172A] p-10 text-center border-b border-[#F59E0B]/20">
          <h2 className="text-[#F8FAFC] text-4xl font-black tracking-tighter uppercase">
            SA<span className="text-[#F59E0B]">-</span>CART
          </h2>
          <p className="text-[#94A3B8] text-sm mt-3 font-medium tracking-wide">Join the premium shopping experience</p>
        </div>

        <div className="p-8 md:p-12">

          <form className="space-y-6" onSubmit={handleSubmit}>

            {/* fistName */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[#020617] text-xs font-black uppercase tracking-widest ml-1">First Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleForm}
                    placeholder="First Name"
                    className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#F59E0B] transition-all"
                  />
                  <User className="absolute left-4 top-4 w-5 h-5 text-[#94A3B8]" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[#020617] text-xs font-black uppercase tracking-widest ml-1">Last Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleForm}
                    placeholder="Last Name"
                    className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#F59E0B] transition-all"
                  />
                  <User className="absolute left-4 top-4 w-5 h-5 text-[#94A3B8]" />
                </div>
              </div>
            </div>

            {/* email */}
            <div className="space-y-2">
              <label className="text-[#020617] text-xs font-black uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleForm}
                  placeholder="Email"
                  className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-[#F59E0B] transition-all"
                />
                <Mail className="absolute left-4 top-4 w-5 h-5 text-[#94A3B8]" />
              </div>
            </div>

            {/* password */}
            <div className="space-y-2">
              <label className="text-[#020617] text-xs font-black uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleForm}
                  className="w-full bg-white border border-[#94A3B8]/30 rounded-xl py-3.5 pl-11 pr-12 focus:outline-none focus:border-[#F59E0B] transition-all"
                />
                <Lock className="absolute left-4 top-4 w-5 h-5 text-[#94A3B8]" />


                <button
                  type="button"
                  className="absolute right-4 top-4 text-[#94A3B8] hover:text-[#0F172A] transition-colors"
                  onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* submit */}
            <button
              
              disabled={isLoading}
              type="submit"
              className="w-full bg-[#F59E0B] text-[#020617] py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#0F172A] hover:text-[#F8FAFC] transition-all flex items-center justify-center gap-2 shadow-xl shadow-[#F59E0B]/20 group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-[#020617] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Create My Account
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>


          <div className="relative my-10 text-center">
            <hr className="border-[#94A3B8]/20" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#F8FAFC] px-4 text-[#94A3B8] text-[10px] font-black uppercase tracking-[0.2em]">
              Or Join With
            </span>
          </div>

          {/* google */}
          <button className="w-full bg-white border-2 border-[#94A3B8]/10 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:border-[#F59E0B] transition-all text-[#020617] shadow-sm" onClick={googleSignUp}>
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
          Continue with Google
          </button>

          {/* fotorLinlk */}
          <p className="text-center mt-10 text-sm text-[#94A3B8] font-medium">
            Already a member?
            <Link to="/login" className="text-[#0F172A] font-black hover:text-[#F59E0B] ml-1 transition-colors">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;