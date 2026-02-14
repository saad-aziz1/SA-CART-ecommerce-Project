import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { saveShippingInfo } from "../redux/cartSlice";

const Shipping = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shippingInfo } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth); // User info for email initial value

  const [name, setName] = useState(shippingInfo?.name || "");
  const [email, setEmail] = useState(shippingInfo?.email || user?.email || ""); // Email state added
  const [address, setAddress] = useState(shippingInfo?.address || "");
  const [city, setCity] = useState(shippingInfo?.city || "");
  const [pinCode, setPinCode] = useState(shippingInfo?.pinCode || "");
  const [phoneNo, setPhoneNo] = useState(shippingInfo?.phoneNo || "");

  const shippingSubmit = (e) => {
    e.preventDefault();

    // Validations
    if (phoneNo.length < 10 || phoneNo.length > 11) {
      toast.error("Phone Number must be 10-11 digits");
      return;
    }

    // COD selection ko state mein save karna including Email
    dispatch(
      saveShippingInfo({ 
        name, 
        email, 
        address, 
        city, 
        pinCode, 
        phoneNo, 
        paymentMethod: "COD" 
      })
    );
    
    navigate("/confirm-order");
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8">
        
        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-8 px-4">
            <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-xs font-bold ring-4 ring-[#0F172A]/10">1</div>
                <span className="text-[10px] font-black uppercase text-[#0F172A]">Shipping</span>
            </div>
            <div className="h-[2px] flex-1 bg-[#94A3B8]/20 mx-2 -mt-4"></div>
            <div className="flex flex-col items-center gap-2 opacity-40">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-[#94A3B8] text-[#94A3B8] flex items-center justify-center text-xs font-bold">2</div>
                <span className="text-[10px] font-black uppercase text-[#94A3B8]">Confirm</span>
            </div>
        </div>

        {/* Main Card */}
        <div className="bg-white p-10 rounded-[40px] shadow-[0_20px_50px_rgba(15,23,42,0.05)] border border-[#94A3B8]/10 relative overflow-hidden">
          
          {/* COD Badge */}
          <div className="absolute top-0 right-0 bg-[#10B981] text-white px-6 py-1 rounded-bl-2xl text-[10px] font-black uppercase tracking-widest shadow-lg">
            Cash On Delivery
          </div>

          <div className="mb-10 text-center">
            <h2 className="text-3xl font-black text-[#0F172A] tracking-tighter uppercase">Shipping Info</h2>
            <p className="text-[#94A3B8] text-xs font-semibold mt-2">Enter your delivery address to proceed</p>
          </div>

          <form onSubmit={shippingSubmit} className="space-y-5">
            
            <div className="space-y-1">
                <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest ml-1">Full Name</label>
                <input type="text" required placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} 
                className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all font-semibold text-[#0F172A] placeholder-[#94A3B8]" />
            </div>

            {/* EMAIL FIELD ADDED */}
            <div className="space-y-1">
                <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest ml-1">Email Address</label>
                <input type="email" required placeholder="saad@example.com" value={email} onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all font-semibold text-[#0F172A]" />
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest ml-1">Home Address</label>
                <input type="text" required placeholder="Street 123, Phase 5..." value={address} onChange={(e) => setAddress(e.target.value)} 
                className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all font-semibold text-[#0F172A]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest ml-1">City</label>
                    <input type="text" required placeholder="Lahore" value={city} onChange={(e) => setCity(e.target.value)} 
                    className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all font-semibold text-[#0F172A]" />
                </div>
                <div className="space-y-1">
                    <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest ml-1">Zip Code</label>
                    <input type="number" required placeholder="54000" value={pinCode} onChange={(e) => setPinCode(e.target.value)} 
                    className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all font-semibold text-[#0F172A]" />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-black text-[#0F172A] uppercase tracking-widest ml-1">WhatsApp / Phone</label>
                <input type="number" required placeholder="03XXXXXXXXX" value={phoneNo} onChange={(e) => setPhoneNo(e.target.value)} 
                className="w-full p-4 bg-[#F8FAFC] border-2 border-transparent rounded-2xl focus:outline-none focus:border-[#F59E0B] focus:bg-white transition-all font-semibold text-[#0F172A]" />
            </div>

            <div className="pt-4">
                <button type="submit" className="group w-full bg-[#0F172A] text-white py-5 rounded-3xl font-black uppercase tracking-[2px] shadow-[0_15px_30px_rgba(15,23,42,0.2)] hover:bg-[#F59E0B] hover:shadow-[0_15px_30px_rgba(245,158,11,0.3)] transition-all duration-500 flex items-center justify-center gap-3">
                    Continue to Summary
                    <span className="group-hover:translate-x-2 transition-transform">➔</span>
                </button>
            </div>
          </form>

          <p className="text-center mt-8 text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest">
            🛡️ 100% Secure Checkout
          </p>
        </div>
      </div>
    </div>
  );
};

export default Shipping;