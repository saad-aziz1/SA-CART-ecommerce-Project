import React from "react";
import { Link } from "react-router-dom";

const OrderSuccess = () => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[#F8FAFC] p-6">
      {/* Compact & Premium Card */}
      <div className="bg-white px-8 py-12 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-[#94A3B8]/10 flex flex-col items-center max-w-[380px] w-full text-center">
        
        {/* Success Icon with Soft Glow */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-[#10B981] blur-2xl opacity-20 rounded-full"></div>
          <div className="relative w-20 h-20 bg-[#10B981] rounded-full flex items-center justify-center shadow-lg shadow-[#10B981]/30">
            <svg 
              className="w-10 h-10 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="3.5" 
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
          </div>
        </div>

        {/* Text Section */}
        <h2 className="text-2xl font-black text-[#0F172A] mb-3 uppercase tracking-tight">
          Success!
        </h2>
        
        <p className="text-[#94A3B8] text-sm font-bold uppercase tracking-wider mb-10 leading-relaxed">
          Your order has been placed.<br/> 
          <span className="text-[#0F172A]/40 text-[10px]">Payment Method: Cash on Delivery</span>
        </p>

        {/* Single Primary Action */}
        <Link 
          to="/" 
          className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-black uppercase text-xs tracking-[2px] hover:bg-[#F59E0B] hover:text-[#0F172A] transition-all duration-300 shadow-xl shadow-[#0F172A]/10 active:scale-95"
        >
          Continue Shopping
        </Link>
        
        <p className="mt-6 text-[10px] text-[#94A3B8] font-bold uppercase tracking-widest">
            Thank you for choosing us
        </p>
      </div>
    </div>
  );
};

export default OrderSuccess;