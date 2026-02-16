import React, { useEffect, useMemo } from 'react';
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
        const { data } = await api.get("/api/product/products?limit=8");
        dispatch(getProductsSuccess(data));
      } catch (err) {
        dispatch(getProductsFail(err.response?.data?.message || "Server Error"));
      }
    };
    fetchLatestProducts();
  }, [dispatch]);

  // --- SMART REAL SECTIONS ---
  const topRated = useMemo(() => {
    return [...(products || [])]
      .sort((a, b) => b.ratings - a.ratings)
      .slice(0, 4);
  }, [products]);

  const trending = useMemo(() => {
    return [...(products || [])]
      .sort((a, b) => (b.ratings + Math.random()) - (a.ratings + Math.random()))
      .slice(0, 4);
  }, [products]);

  return (
    <div className="bg-[#F8FAFC]">

      {/* ================= HERO ================= */}
      <section className="relative h-[90vh] flex items-center justify-center text-center overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#111827] to-[#1E293B]">

        <div className="absolute w-[600px] h-[600px] bg-[#F59E0B]/20 rounded-full blur-[180px] -top-20 -left-20"></div>
        <div className="absolute w-[600px] h-[600px] bg-[#10B981]/20 rounded-full blur-[180px] bottom-0 right-0"></div>

        <div className="relative z-10 max-w-4xl px-6">
          <h1 className="text-white text-6xl md:text-7xl font-extrabold tracking-tight leading-tight mb-6">
            Discover Premium <br />
            <span className="text-[#F59E0B]">Modern Essentials</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-10">
            Curated luxury gadgets & lifestyle products crafted for those who demand excellence.
          </p>

          <div className="flex justify-center gap-6">
            <Link to="/products">
              <button className="bg-[#F59E0B] text-[#0F172A] px-10 py-4 rounded-2xl font-bold uppercase tracking-wider hover:scale-105 transition-all duration-300 shadow-xl">
                Shop Now
              </button>
            </Link>

            <Link to="/products">
              <button className="border border-white/30 text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300">
                Explore
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ================= PRODUCT SECTION TEMPLATE ================= */}
      {[
        { title: "New Arrivals", data: products?.slice(0, 4) },
        { title: "Top Rated", data: topRated },
        { title: "Trending Now", data: trending }
      ].map((section, index) => (
        <section key={index} className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6">

            <div className="flex justify-between items-end mb-14">
              <h2 className="text-4xl font-extrabold text-[#0F172A] tracking-tight">
                {section.title}
              </h2>
              <Link
                to="/products"
                className="text-sm font-bold uppercase tracking-wider text-[#F59E0B] hover:underline"
              >
                View All
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-t-[#0F172A] rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {section.data?.map((item) => (
                  <Link to={`/product/${item._id}`} key={item._id} className="group">
                    <div className="relative bg-[#F8FAFC] p-8 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500">

                      <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

                      <img
                        src={item.images[0]?.url}
                        alt={item.name}
                        className="w-full h-56 object-contain group-hover:scale-110 transition-transform duration-700"
                      />

                      <div className="mt-6">
                        <h3 className="font-bold text-[#0F172A] truncate mb-2">
                          {item.name}
                        </h3>

                        <div className="flex justify-between items-center">
                          <p className="text-[#10B981] font-extrabold text-lg">
                            Rs {item.price.toLocaleString()}
                          </p>

                          <div className="text-sm text-yellow-500 font-bold">
                            ⭐ {item.ratings?.toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* ================= PREMIUM CTA ================= */}
      <section className="py-28 bg-[#0F172A] text-center text-white relative overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-[#F59E0B]/10 blur-[150px] rounded-full top-0 left-0"></div>

        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-5xl font-extrabold mb-6">
            Elevate Your Shopping Experience
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            Premium quality. Trusted service. Seamless checkout.
          </p>

          <Link to="/products">
            <button className="bg-[#F59E0B] text-black px-12 py-4 rounded-2xl font-bold uppercase tracking-wider hover:scale-105 transition-all duration-300 shadow-2xl">
              Start Shopping
            </button>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;
