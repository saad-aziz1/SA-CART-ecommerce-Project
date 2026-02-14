import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, User, Search, X, UserPlus, LogOut, ChevronRight } from 'lucide-react'; 
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';
import axios from 'axios';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [keyword, setKeyword] = useState(""); // Naya: Search keyword ke liye state
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  // Naya: Search function
  const searchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/${keyword}`); // Keyword ke sath products page pr jana
    } else {
      navigate("/products"); // Khali search pr simple products page
    }
  };

  const handleLogout = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3000/api/user/logout",
        { withCredentials: true }
      );
      if (res.status === 200) {
        dispatch(logoutUser());
        toast.success("Logged out successfully!");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  return (
    <nav className="bg-[#0F172A] text-[#F8FAFC] sticky top-0 z-50 shadow-2xl border-b border-[#94A3B8]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tighter uppercase text-[#F8FAFC]">
                SA<span className="text-[#F59E0B]">-</span>CART
              </span>
            </Link>
          </div>

          {/* Search Desktop */}
          <div className="hidden lg:flex flex-1 items-center justify-center px-10">
            <form onSubmit={searchHandler} className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search products..."
                onChange={(e) => setKeyword(e.target.value)} // State update
                className="w-full bg-[#020617] text-[#F8FAFC] border border-[#94A3B8]/30 rounded-xl py-2 pl-11 pr-4 focus:outline-none focus:border-[#F59E0B] transition-all"
              />
              <Search className="absolute left-4 top-2.5 w-5 h-5 text-[#94A3B8]" />
            </form>
          </div>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-8">
            <div className="flex items-center space-x-6 text-sm font-bold uppercase tracking-widest">
              <Link to="/" className="hover:text-[#F59E0B] transition-colors">Home</Link>
              <Link to="/products" className="hover:text-[#F59E0B] transition-colors">Products</Link>
            </div>

            <div className="flex items-center space-x-3 border-l border-[#94A3B8]/20 pl-6">
              {user ? (
                <div className="flex items-center gap-3">
                  <Link to="/profile" className="flex items-center gap-3 bg-[#1E293B] px-4 py-2 rounded-xl border border-[#94A3B8]/20 hover:border-[#F59E0B]/50 transition-all group">
                    <div className="w-8 h-8 bg-[#F59E0B] rounded-full flex items-center justify-center text-[#020617] font-black border-2 border-[#F59E0B] group-hover:scale-110 transition-transform">
                      {user.firstName?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                        Hello, <span className="text-[#F59E0B]">{user.firstName || user.name?.split(" ")[0]}</span>
                        <ChevronRight className="w-3 h-3 text-[#94A3B8] group-hover:text-[#F59E0B]" />
                      </span>
                    </div>
                  </Link>
                  <button onClick={handleLogout} className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-all" title="Logout">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="flex items-center gap-1 px-3 py-1.5 hover:text-[#F59E0B] transition-all text-xs font-bold uppercase">
                    <User className="w-4 h-4" /> Login
                  </Link>
                  <Link to="/signup" className="flex items-center gap-1 bg-[#F59E0B] text-[#0F172A] px-4 py-1.5 rounded-lg font-bold text-xs uppercase hover:bg-white transition-all">
                    <UserPlus className="w-4 h-4" /> Sign Up
                  </Link>
                </>
              )}
              <Link to="/cart" className="relative p-2 group">
                <ShoppingCart className="w-6 h-6 group-hover:text-[#F59E0B] transition-all" />
                {cartItems && cartItems.length > 0 && (
                  <span className="absolute top-0 right-0 bg-[#10B981] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="lg:hidden flex items-center gap-3">
            <Link to="/cart" className="relative p-2">
              <ShoppingCart className="w-6 h-6 text-[#F8FAFC]" />
              {cartItems && cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#10B981] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cartItems.length}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 bg-[#1E293B] rounded-lg text-[#F59E0B] hover:bg-[#020617] transition-all">
              {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-[#0F172A] border-t border-[#94A3B8]/10 px-6 py-8 space-y-6 absolute w-full left-0 shadow-2xl animate-in slide-in-from-top duration-300">
          <form onSubmit={searchHandler} className="relative">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setKeyword(e.target.value)} // State update
              className="w-full bg-[#020617] text-[#F8FAFC] border border-[#94A3B8]/20 rounded-xl py-3 pl-12 focus:outline-none"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#94A3B8]" />
          </form>

          <div className="flex flex-col space-y-6 font-bold uppercase tracking-widest text-base">
            <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-[#F59E0B] transition-colors">Home</Link>
            <Link to="/products" onClick={() => setIsMenuOpen(false)} className="hover:text-[#F59E0B] transition-colors">Products</Link>
            <div className="pt-4 border-t border-[#94A3B8]/10">
              {user ? (
                <div className="space-y-4">
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 bg-[#1E293B] p-4 rounded-xl border border-[#94A3B8]/20 active:bg-[#020617]">
                    <div className="w-10 h-10 bg-[#F59E0B] rounded-full flex items-center justify-center text-[#020617] font-black">
                      {user.firstName?.charAt(0).toUpperCase() || user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col flex-1">
                      <span className="text-[10px] text-[#94A3B8]">Logged in as</span>
                      <span className="text-[#F59E0B] text-sm">{user.firstName || user.name?.split(" ")[0]}</span>
                    </div>
                    <ChevronRight className="w-5 h-5 text-[#94A3B8]" />
                  </Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full flex justify-center items-center gap-2 bg-[#EF4444]/10 text-[#EF4444] py-4 rounded-xl font-bold uppercase tracking-widest transition-all">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="flex justify-center items-center gap-2 border border-[#94A3B8]/30 py-4 rounded-xl">
                    <User className="w-5 h-5" /> Login
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="flex justify-center items-center gap-2 bg-[#F59E0B] text-[#0F172A] py-4 rounded-xl">
                    <UserPlus className="w-5 h-5" /> Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;