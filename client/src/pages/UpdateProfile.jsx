import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User, Camera, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateProfile, clearErrors, updateProfileReset, loadUser } from "../redux/authSlice"; 
import toast from "react-hot-toast";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isUpdated, error, loading } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");          // Base64 string
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setAvatarPreview(user.avatar?.url || "");
    }

    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      toast.success("Profile Updated Successfully!");
      dispatch(updateProfileReset());
      dispatch(loadUser()); 
      navigate("/profile");
    }
  }, [dispatch, user, error, isUpdated, navigate]);

  const updateProfileSubmit = (e) => {
    e.preventDefault();

    const userData = { name, email };
    if (avatar) userData.avatar = avatar;  // base64 string

    dispatch(updateProfile(userData));
  };

  const updateProfileDataChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);  // base64 string
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center py-12 px-4">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-xl border border-[#94A3B8]/20 p-8">
        <h2 className="text-2xl font-black text-[#0F172A] mb-8 uppercase tracking-tight text-center border-b-4 border-[#F59E0B] pb-2 inline-block">
          Update Profile
        </h2>

        <form onSubmit={updateProfileSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-3.5 w-5 h-5 text-[#94A3B8]" />
            <input
              type="text"
              placeholder="Full Name"
              required
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#94A3B8]/20 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#F59E0B] transition-all font-bold text-[#020617]"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-[#94A3B8]" />
            <input
              type="email"
              placeholder="Email Address"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#F8FAFC] border border-[#94A3B8]/20 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-[#F59E0B] transition-all font-bold text-[#020617]"
            />
          </div>

          <div className="flex items-center gap-4 bg-[#F8FAFC] p-4 rounded-2xl border border-dashed border-[#94A3B8]/40">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#F59E0B] bg-[#0F172A] flex items-center justify-center shrink-0">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#F59E0B] font-black text-xl uppercase">
                  {name ? name.charAt(0) : "U"}
                </span>
              )}
            </div>

            <div className="relative flex-1">
              <label className="flex items-center justify-center gap-2 bg-[#0F172A] text-white py-2 px-4 rounded-lg text-xs font-bold cursor-pointer hover:bg-[#1E293B] transition-all">
                <Camera className="w-4 h-4" /> Change Photo
                <input 
                  type="file" 
                  name="avatar"
                  accept="image/*" 
                  onChange={updateProfileDataChange} 
                  className="hidden" 
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#F59E0B] text-[#0F172A] py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#0F172A] hover:text-white transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;