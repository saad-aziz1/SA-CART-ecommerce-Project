import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Send } from 'lucide-react';

const Footer = () => {
  // Function to scroll to top
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Smooth scrolling effect
    });
  };

  return (
    // MainFooterContainer
    <footer className="bg-[#0F172A] text-[#F8FAFC] pt-16 pb-8 border-t border-[#94A3B8]/10">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* GridLayout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link to="/" onClick={handleScrollToTop} className="text-2xl font-black tracking-tighter uppercase">
              SA<span className="text-[#F59E0B]">-</span>CART
            </Link>
            <p className="text-[#94A3B8] text-sm leading-relaxed">
              Your one-stop destination for premium products. We deliver quality and style right to your doorstep with unmatched customer service.
            </p>
            <div className="flex items-center space-x-4">
              <Link className="p-2 bg-[#1E293B] rounded-full hover:text-[#F59E0B] transition-all"><Facebook className="w-5 h-5" /></Link>
              <Link className="p-2 bg-[#1E293B] rounded-full hover:text-[#F59E0B] transition-all"><Instagram className="w-5 h-5" /></Link>
              <Link className="p-2 bg-[#1E293B] rounded-full hover:text-[#F59E0B] transition-all"><Twitter className="w-5 h-5" /></Link>
            </div>
          </div>

          {/* Column 2: QuickLinks */}
          <div>
            <h3 className="text-[#F8FAFC] font-bold uppercase tracking-widest text-sm mb-6">Quick Links</h3>
            <ul className="space-y-4 text-[#94A3B8] text-sm font-medium">
              <li><Link to="/products" onClick={handleScrollToTop} className="hover:text-[#F59E0B] transition-colors">All Products</Link></li>
              <li><Link to="/categories" onClick={handleScrollToTop} className="hover:text-[#F59E0B] transition-colors">Categories</Link></li>
              {/* Admin Panel Link with Scroll to Top */}
              <li>
                <Link 
                  to="/admin-sidebar" 
                  onClick={handleScrollToTop} 
                  className="hover:text-[#F59E0B] transition-colors"
                >
                  Admin Panel
                </Link>
              </li>
              <li><Link to="/contact" onClick={handleScrollToTop} className="hover:text-[#F59E0B] transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Column 3: ContactInfo */}
          <div>
            <h3 className="text-[#F8FAFC] font-bold uppercase tracking-widest text-sm mb-6">Contact Us</h3>
            <ul className="space-y-4 text-[#94A3B8] text-sm">
              <li className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#F59E0B]" />
                <span>Lahore, Punjab, Pakistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-[#F59E0B]" />
                <span>+92 300 1234567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#F59E0B]" />
                <span>support@sa-cart.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-[#F8FAFC] font-bold uppercase tracking-widest text-sm mb-6">Newsletter</h3>
            <p className="text-[#94A3B8] text-xs mb-4">Subscribe to get special offers and once-in-a-lifetime deals.</p>
            <form className="relative">
              <input 
                type="email" 
                placeholder="Enter email"
                className="w-full bg-[#020617] border border-[#94A3B8]/20 rounded-lg py-3 px-4 text-sm focus:outline-none focus:border-[#F59E0B]"
              />
              <button className="absolute right-2 top-1.5 bg-[#F59E0B] text-[#020617] p-1.5 rounded-md hover:bg-white transition-all">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar - Copyright & Local Payment Methods */}
        <div className="pt-8 border-t border-[#94A3B8]/10 flex flex-col md:flex-row justify-between items-center gap-6">
          
          {/* Copyright Text */}
          <p className="text-[#94A3B8] text-xs">
            © 2026 <span className="text-[#F8FAFC] font-bold">SA-CART</span>. All rights reserved.
          </p>

          {/* Local Payment Methods */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#94A3B8]">
            <span className="px-3 py-1 border border-[#94A3B8]/20 rounded-md hover:text-[#10B981] transition-colors cursor-default">
              Cash on Delivery
            </span>
            <span className="px-3 py-1 border border-[#94A3B8]/20 rounded-md hover:text-[#F59E0B] transition-colors cursor-default">
              Credit / Debit Card
            </span>
            
            <span className="px-3 py-1 border border-[#10B981]/40 text-[#10B981] rounded-md cursor-default">
              EasyPaisa
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;