import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductRequest, getProductsSuccess, getProductsFail } from '../redux/productSlice';
// axios ko replace kiya central api instance se
import api from '../../utils/api.js'; 

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        dispatch(getProductRequest());
        // Home page par hum limit=8 bhej rhy hain taky sirf latest items ayen
        // api instance use ho raha hy jo base URL handle karega
        const { data } = await api.get("/api/product/products?limit=8");
        dispatch(getProductsSuccess(data));
      } catch (err) {
        dispatch(getProductsFail(err.response?.data?.message || "Server Error"));
      }
    };
    fetchLatestProducts();
  }, [dispatch]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="relative h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-72 h-72 bg-[#F59E0B] rounded-full blur-[120px]"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#10B981] rounded-full blur-[150px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10 text-center lg:text-left">
          <h1 className="text-white text-5xl md:text-7xl font-black leading-tight tracking-tighter uppercase mb-6">
            Elevate Your <span className="text-[#F59E0B]">Lifestyle</span> <br /> With SA-CART
          </h1>
          <p className="text-[#94A3B8] text-lg md:text-xl font-medium mb-10 max-w-2xl">
            Experience the future of shopping with our curated collection of premium gadgets and luxury essentials. 
          </p>
          <Link to="/products">
            <button className="bg-[#F59E0B] text-[#0F172A] px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-2xl shadow-[#F59E0B]/20">
              Explore Shop
            </button>
          </Link>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Express Shipping", desc: "Delivery within 24 hours", icon: "🚀" },
            { title: "Secure Payments", desc: "100% Encrypted Transactions", icon: "🛡️" },
            { title: "24/7 Support", desc: "Always here to help you", icon: "💬" }
          ].map((f, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-[#94A3B8]/10 hover:shadow-xl transition-all duration-500 group">
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="text-[#0F172A] font-black text-lg mb-2 uppercase">{f.title}</h3>
              <p className="text-[#94A3B8] font-bold text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- LATEST PRODUCTS GRID --- */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[#F59E0B] font-black uppercase tracking-[0.3em] text-xs mb-2">New Arrivals</p>
              <h2 className="text-[#0F172A] text-4xl font-black uppercase tracking-tighter">Our Latest Collection</h2>
            </div>
            <Link to="/products" className="text-[#0F172A] font-black text-sm uppercase border-b-2 border-[#F59E0B] pb-1 hover:text-[#F59E0B] transition-all">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-t-[#0F172A] rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {products && products.slice(0, 4).map((item) => (
                <Link to={`/product/${item._id}`} key={item._id} className="group">
                  <div className="bg-[#F8FAFC] rounded-[2.5rem] p-6 mb-4 overflow-hidden relative border border-transparent group-hover:border-[#94A3B8]/20 transition-all duration-500">
                    <img src={item.images[0]?.url} alt={item.name} className="w-full h-56 object-contain group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl">
                      <p className="text-[#10B981] font-black text-lg">Rs {item.price.toLocaleString()}</p>
                    </div>
                  </div>
                  <h3 className="text-[#0F172A] font-black text-base truncate px-2">{item.name}</h3>
                  <p className="text-[#94A3B8] font-bold text-[10px] uppercase tracking-widest px-2">{item.category}</p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- NEWSLETTER SECTION --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-[#0F172A] rounded-[3rem] p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#F59E0B]/10 rounded-full blur-3xl"></div>
          <h2 className="text-white text-3xl md:text-4xl font-black uppercase mb-4 relative z-10">Join the SA-CART Club</h2>
          <p className="text-[#94A3B8] font-bold mb-8 relative z-10">Get exclusive offers and early access to new drops.</p>
          <div className="flex flex-col md:flex-row gap-4 max-w-md mx-auto relative z-10">
            <input type="email" placeholder="Enter your email" className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-gray-500 focus:outline-none focus:border-[#F59E0B]" />
            <button className="bg-[#F59E0B] text-[#0F172A] px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest">Subscribe</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;