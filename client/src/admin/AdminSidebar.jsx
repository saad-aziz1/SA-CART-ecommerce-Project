import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, PlusCircle, Users, LogOut, Menu, X, ShieldCheck } from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // 1: Menu Items with correct paths as per main.jsx
  const menuItems = [
    { title: "Dashboard", path: "/admin-sidebar", icon: <LayoutDashboard size={20} /> },
    { title: "All Products", path: "/admin-sidebar/products", icon: <ShoppingBag size={20} /> },
    { title: "Add Product", path: "/admin-sidebar/add-product", icon: <PlusCircle size={20} /> },
    { title: "Orders", path: "/admin-sidebar/orders", icon: <ShoppingBag size={20} /> },
    // Yahan link bilkul sahi set hai
    { title: "Users", path: "/admin-sidebar/users", icon: <Users size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      {/* MOBILE HAMBURGER BUTTON */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="bg-[#0F172A] text-white p-2 rounded-xl shadow-lg border border-[#94A3B8]/20"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR MAIN CONTAINER */}
      <div className={`
        fixed md:sticky top-0 z-40 w-64 h-screen bg-[#0F172A] text-[#94A3B8] flex flex-col border-r border-[#94A3B8]/10
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} 
      `}>
        {/* Brand Area */}
        <div className="p-8 border-b border-[#94A3B8]/10">
          <h1 className="text-white text-xl font-black tracking-tighter uppercase italic">
            Admin<span className="text-[#F59E0B]">Panel</span>
          </h1>
        </div>

        {/* Navigation Links Loop */}
        <nav className="flex-1 p-4 mt-4 space-y-2 overflow-y-auto">
          {menuItems.map((item, index) => {
            // Logic: Dashboard ke liye exact match, baqi ke liye startsWith
            const isActive = item.path === "/admin-sidebar" 
              ? location.pathname === item.path 
              : location.pathname.startsWith(item.path);

            return (
              <Link
                key={index}
                to={item.path}
                onClick={() => setIsOpen(false)} 
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 font-bold text-sm
                  ${isActive 
                    ? 'bg-[#F59E0B] text-white shadow-lg shadow-[#F59E0B]/20' 
                    : 'hover:bg-[#1E293B] hover:text-white'}`}
              >
                {item.icon}
                {item.title}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#94A3B8]/10">
          <button className="w-full flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-[#EF4444]/10 hover:text-[#EF4444] transition-all text-sm font-bold">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Welcome message sirf tab dikhayen jab exact root admin path ho */}
        {location.pathname === "/admin-sidebar" || location.pathname === "/admin-sidebar/" ? (
          <div className="flex-1 flex items-center justify-center p-6 text-center">
            <div>
              <div className="bg-[#0F172A]/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-dashed border-[#F59E0B]">
                <ShieldCheck size={40} className="text-[#0F172A]" />
              </div>
              <h2 className="text-[#020617] text-2xl md:text-4xl font-black uppercase tracking-tight">
                Only for <span className="text-[#F59E0B]">Admin</span>
              </h2>
              <p className="text-[#94A3B8] font-medium mt-2">Welcome! Select a task from the sidebar.</p>
            </div>
          </div>
        ) : (
          <div className="p-4 md:p-8">
            <Outlet /> {/* <-- All child components (AllUsers, AllProducts) render here */}
          </div>
        )}
      </div>

      {/* MOBILE OVERLAY */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-[#020617]/50 backdrop-blur-sm z-30 md:hidden" 
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminSidebar;