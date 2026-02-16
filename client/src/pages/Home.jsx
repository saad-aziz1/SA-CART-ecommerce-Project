import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductRequest, getProductsSuccess, getProductsFail } from '../redux/productSlice';
import api from '../../utils/api.js'; 

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        dispatch(getProductRequest());
        // Limit 12 mangwaye hain taaky 3 sections (4+4+4) ban saken
        const { data } = await api.get("/api/product/products?limit=12");
        dispatch(getProductsSuccess(data));
      } catch (err) {
        dispatch(getProductsFail(err.response?.data?.message || "Server Error"));
      }
    };
    fetchLatestProducts();
  }, [dispatch]);

  // Product Card Component (Reusable)
  const ProductCard = ({ item }) => (
    <Link to={`/product/${item._id}`} className="group relative">
      <div className="bg-[#F8FAFC] rounded-[2rem] p-4 transition-all duration-500 group-hover:bg-white group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-transparent group-hover:border-[#94A3B8]/10">
        <div className="relative overflow-hidden rounded-[1.5rem] bg-white aspect-square flex items-center justify-center">
          <img 
            src={item.images[0]?.url} 
            alt={item.name} 
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-700 ease-out" 
          />
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
             <span className="bg-[#0F172A] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">Quick View</span>
          </div>
        </div>
        <div className="mt-4 px-2">
          <p className="text-[#94A3B8] font-bold text-[10px] uppercase tracking-[0.2em] mb-1">{item.category}</p>
          <h3 className="text-[#0F172A] font-black text-sm truncate group-hover:text-[#F59E0B] transition-colors">{item.name}</h3>
          <p className="text-[#10B981] font-black text-base mt-1">Rs {item.price.toLocaleString()}</p>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen font-sans">
      
      {/* --- PREMIUM HERO SECTION --- */}
      <section className="relative h-[90vh] flex items-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0">
          {/* Subtle Animated Background Elements */}
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#F59E0B]/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#1E293B]/50 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-center lg:text-left">
            <span className="text-[#F59E0B] font-black uppercase tracking-[0.5em] text-xs mb-4 block">Premium Tech Wear</span>
            <h1 className="text-white text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase mb-8">
              LESS IS <br /> <span className="text-transparent border-b-4 border-[#F59E0B] italic" style={{ WebkitTextStroke: '1px white' }}>MORE</span>
            </h1>
            <p className="text-[#94A3B8] text-lg font-medium mb-10 max-w-md mx-auto lg:mx-0">
              Future-proof essentials for the modern lifestyle. Minimal design, maximum impact.
            </p>
            <Link to="/products">
              <button className="bg-white text-[#0F172A] px-12 py-5 rounded-full font-black uppercase text-xs tracking-[0.2em] hover:bg-[#F59E0B] hover:text-white transition-all duration-500 shadow-xl">
                Shop Collection
              </button>
            </Link>
          </div>
          <div className="hidden lg:block relative">
             <div className="relative z-10 animate-bounce-slow">
                {/* Agar apky pas koi hero image ho to yahan lagayen, warna ye gradient placeholder hy */}
                <div className="w-full h-[500px] bg-gradient-to-tr from-[#1E293B] to-[#0F172A] rounded-[3rem] border border-white/5 shadow-2xl overflow-hidden flex items-center justify-center">
                   <h2 className="text-white/10 text-9xl font-black rotate-90">SA-CART</h2>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* --- CATEGORY BUBBLES --- */}
      <div className="py-10 bg-white border-b border-[#94A3B8]/10 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-6 flex justify-between gap-8 min-w-[800px]">
          {['Watches', 'Audio', 'Accessories', 'New Drops', 'Premium'].map((cat, i) => (
            <div key={i} className="flex flex-col items-center gap-3 cursor-pointer group">
              <div className="w-20 h-20 rounded-full bg-[#F8FAFC] border border-[#94A3B8]/20 flex items-center justify-center group-hover:border-[#F59E0B] group-hover:scale-110 transition-all duration-500">
                <span className="text-xs font-black uppercase">{cat[0]}</span>
              </div>
              <span className="text-[#0F172A] font-black text-[10px] uppercase tracking-widest">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-40 bg-white">
          <div className="w-10 h-10 border-2 border-[#F59E0B] border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          {/* SECTION 1: LATEST */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-16">
                <h2 className="text-[#0F172A] text-5xl font-black uppercase tracking-tighter">New Arrivals</h2>
                <div className="w-20 h-1 bg-[#F59E0B] mt-4"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products?.slice(0, 4).map(item => <ProductCard key={item._id} item={item} />)}
              </div>
            </div>
          </section>

          {/* SECTION 2: FEATURED DROPS (Zero Style) */}
          <section className="py-24 bg-[#0F172A]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex justify-between items-center mb-16">
                <h2 className="text-white text-5xl font-black uppercase tracking-tighter italic">Featured Drops</h2>
                <Link to="/products" className="text-white font-black text-xs uppercase border-b border-[#F59E0B]">Explore All</Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products?.slice(4, 8).map(item => <ProductCard key={item._id} item={item} />)}
              </div>
            </div>
          </section>

          {/* SECTION 3: TOP RATED */}
          <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="mb-16 text-right">
                <h2 className="text-[#0F172A] text-5xl font-black uppercase tracking-tighter">Best Sellers</h2>
                <div className="w-20 h-1 bg-[#F59E0B] mt-4 ml-auto"></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products?.slice(8, 12).map(item => <ProductCard key={item._id} item={item} />)}
              </div>
            </div>
          </section>
        </>
      )}

      {/* --- NEWSLETTER --- */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto bg-[#F8FAFC] border border-[#94A3B8]/20 rounded-[4rem] p-16 text-center">
          <h2 className="text-[#0F172A] text-5xl font-black uppercase mb-6 tracking-tighter">The Insider Club</h2>
          <p className="text-[#94A3B8] font-bold mb-10 tracking-[0.2em] uppercase text-xs">Drop alerts. Early access. No spam.</p>
          <div className="flex flex-col md:flex-row gap-2 max-w-xl mx-auto">
            <input type="email" placeholder="YOUR EMAIL" className="flex-1 bg-white border border-[#94A3B8]/20 rounded-full px-8 py-5 text-sm focus:outline-none focus:border-[#0F172A]" />
            <button className="bg-[#0F172A] text-white px-10 py-5 rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-[#F59E0B] transition-colors">Join Now</button>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;