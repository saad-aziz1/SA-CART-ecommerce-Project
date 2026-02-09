import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, User, Search, X, UserPlus } from 'lucide-react';

import { useSelector } from 'react-redux';

const Navbar = () => {
    
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    
    const { user } = useSelector((state) => state.auth);

    return (
        <nav className="bg-[#0F172A] text-[#F8FAFC] sticky top-0 z-50 shadow-2xl border-b border-[#94A3B8]/10">
            {/* --- mainContainer --- */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* LogoAsText */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-1">
                            <span className="text-2xl font-black tracking-tighter uppercase text-[#F8FAFC]">
                                SA<span className="text-[#F59E0B]">-</span>CART
                            </span>
                        </Link>
                    </div>

                    {/* SearchBarDesktop */}
                    <div className="hidden lg:flex flex-1 items-center justify-center px-10">
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full bg-[#020617] text-[#F8FAFC] border border-[#94A3B8]/30 rounded-xl py-2 pl-11 pr-4 focus:outline-none focus:border-[#F59E0B] transition-all"
                            />
                            <Search className="absolute left-4 top-2.5 w-5 h-5 text-[#94A3B8]" />
                        </div>
                    </div>

                    {/* NavigationLinksLargeScreens */}
                    <div className="hidden lg:flex items-center space-x-8">
                        <div className="flex items-center space-x-6 text-sm font-bold uppercase tracking-widest">
                            <Link to="/" className="hover:text-[#F59E0B] transition-colors">Home</Link>
                            <Link to="/products" className="hover:text-[#F59E0B] transition-colors">Products</Link>
                        </div>

                        {/* AuthIconsDesktop */}
                        <div className="flex items-center space-x-3 border-l border-[#94A3B8]/20 pl-6">
                            
                            {/* NEW LOGIC: Check kar rahe hain agar user hai to profile dikhao, warna login/signup */}
                            {user ? (
                                <div className="flex items-center gap-3 bg-[#1E293B] px-4 py-2 rounded-xl border border-[#94A3B8]/20">
                                    <div className="w-8 h-8 bg-[#F59E0B] rounded-full flex items-center justify-center text-[#020617] font-black border-2 border-[#F59E0B]">
                                        {user.firstName?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">
                                        Hello, <span className="text-[#F59E0B]">{user.firstName}</span>
                                    </span>
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
                                <span className="absolute top-0 right-0 bg-[#10B981] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                                    0
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* 5. MobileTabletControls */}
                    <div className="lg:hidden flex items-center gap-3">
                        <Link to="/cart" className="relative p-2">
                            <ShoppingCart className="w-6 h-6 text-[#F8FAFC]" />
                            <span className="absolute top-0 right-0 bg-[#10B981] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">0</span>
                        </Link>

                        {/* ToggleButton */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 bg-[#1E293B] rounded-lg text-[#F59E0B] hover:bg-[#020617] transition-all"
                        >
                            {isMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                        </button>
                    </div>

                </div>
            </div>

            {/* --- MobileTablitMenu --- */}
            {isMenuOpen && (
                <div className="lg:hidden bg-[#0F172A] border-t border-[#94A3B8]/10 px-6 py-8 space-y-6 absolute w-full left-0 shadow-2xl animate-in slide-in-from-top duration-300">
                    {/* Mobile Search */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-[#020617] text-[#F8FAFC] border border-[#94A3B8]/20 rounded-xl py-3 pl-12 focus:outline-none"
                        />
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-[#94A3B8]" />
                    </div>

                    <div className="flex flex-col space-y-6 font-bold uppercase tracking-widest text-base">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="hover:text-[#F59E0B] transition-colors">Home</Link>
                        <Link to="/products" onClick={() => setIsMenuOpen(false)} className="hover:text-[#F59E0B] transition-colors">Products</Link>

                        {/* MobileTabletAuthLinks */}
                        <div className="pt-4 border-t border-[#94A3B8]/10">
                           
                            {user ? (
                                <div className="flex items-center gap-4 bg-[#1E293B] p-4 rounded-xl border border-[#94A3B8]/20">
                                    <div className="w-10 h-10 bg-[#F59E0B] rounded-full flex items-center justify-center text-[#020617] font-black">
                                        {user.firstName?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-[#94A3B8]">Logged in as</span>
                                        <span className="text-[#F59E0B] text-sm">{user.firstName} {user.lastName}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex justify-center items-center gap-2 border border-[#94A3B8]/30 py-4 rounded-xl hover:bg-[#1E293B] transition-all"
                                    >
                                        <User className="w-5 h-5" /> Login
                                    </Link>
                                    <Link
                                        to="/signup"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="flex justify-center items-center gap-2 bg-[#F59E0B] text-[#0F172A] py-4 rounded-xl hover:bg-white transition-all"
                                    >
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