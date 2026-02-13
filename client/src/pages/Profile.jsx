import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, Edit, ShoppingBag, Lock, Camera, Loader2 } from 'lucide-react';
import { updateProfile, clearErrors, updateProfileReset, loadUser } from "../redux/authSlice"; 
import toast from "react-hot-toast";

const Profile = () => {
  const { user, loading, isAuthenticated, isUpdated, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Protect Route
  useEffect(() => {
    if (isAuthenticated === false) {
      navigate("/login");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Profile Image Updated!");
      dispatch(loadUser());
      dispatch(updateProfileReset());
    }
  }, [navigate, isAuthenticated, error, isUpdated, dispatch]);

  // 🔥 Image Update Logic
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        // Sirf avatar bhej rahy hain backend ko
        dispatch(updateProfile({ avatar: reader.result }));
      }
    };
    reader.readAsDataURL(file);
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-[#0F172A]">Loading Profile...</div>;
  }

  const fullName = user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-black text-[#0F172A] mb-6 uppercase tracking-tight border-l-4 border-[#F59E0B] pl-3">
          My Profile
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* --- LEFT SIDE: USER CARD --- */}
          <div className="bg-white p-6 rounded-[24px] shadow-sm border border-[#94A3B8]/20 text-center h-fit">
            <div className="relative inline-block mb-4 group">
              {/* Profile Image Preview */}
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#F59E0B] p-0.5 mx-auto relative">
                {user?.avatar?.url ? (
                  <img src={user.avatar.url} alt={fullName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#0F172A] flex items-center justify-center text-[#F59E0B] text-3xl font-black uppercase">
                    {fullName.charAt(0)}
                  </div>
                )}
                
                {/* 🔥 Loading Overlay */}
                {loading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                    <Loader2 className="animate-spin text-white w-8 h-8" />
                  </div>
                )}
              </div>

              {/* 🔥 Hidden File Input & Camera Icon */}
              <label className="absolute bottom-0 right-0 bg-[#F59E0B] p-2 rounded-full cursor-pointer shadow-lg hover:bg-[#0F172A] transition-colors border-2 border-white group-hover:scale-110">
                <Camera className="w-4 h-4 text-white" />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageChange}
                  disabled={loading}
                />
              </label>
            </div>
            
            <h2 className="text-xl font-bold text-[#0F172A]">{fullName}</h2>
            <p className="text-[#94A3B8] text-sm mb-5">{user?.email}</p>
          </div>

          {/* --- RIGHT SIDE: DETAILS --- */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-white p-4 rounded-[16px] border border-[#94A3B8]/10 shadow-sm flex items-center gap-4">
              <div className="bg-[#F8FAFC] p-2.5 rounded-xl"><User className="text-[#F59E0B] w-5 h-5" /></div>
              <div>
                <p className="text-[#94A3B8] text-[10px] font-black uppercase tracking-widest">Full Name</p>
                <p className="text-[#0F172A] text-base font-bold">{fullName}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-[16px] border border-[#94A3B8]/10 shadow-sm flex items-center gap-4">
              <div className="bg-[#F8FAFC] p-2.5 rounded-xl"><Mail className="text-[#F59E0B] w-5 h-5" /></div>
              <div>
                <p className="text-[#94A3B8] text-[10px] font-black uppercase tracking-widest">Email Address</p>
                <p className="text-[#0F172A] text-base font-bold">{user?.email}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-[16px] border border-[#94A3B8]/10 shadow-sm flex items-center gap-4">
              <div className="bg-[#F8FAFC] p-2.5 rounded-xl"><Calendar className="text-[#F59E0B] w-5 h-5" /></div>
              <div>
                <p className="text-[#94A3B8] text-[10px] font-black uppercase tracking-widest">Joined On</p>
                <p className="text-[#0F172A] text-base font-bold">
                  {user?.createdAt ? String(user?.createdAt).substr(0, 10) : "N/A"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Link to="/orders" className="flex items-center justify-center gap-2 bg-[#10B981] text-white py-3 rounded-xl font-bold text-sm uppercase shadow-md hover:opacity-90 transition-all">
                <ShoppingBag className="w-4 h-4" /> My Orders
              </Link>
              <Link to="/password/update" className="flex items-center justify-center gap-2 bg-[#0F172A] text-white py-3 rounded-xl font-bold text-sm uppercase shadow-md hover:bg-[#1E293B] transition-all">
                <Lock className="w-4 h-4" /> Change Password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;