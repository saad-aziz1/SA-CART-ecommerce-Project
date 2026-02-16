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
        const { data } = await api.get("/api/product/products?limit=12");
        dispatch(getProductsSuccess(data));
      } catch (err) {
        dispatch(getProductsFail(err.response?.data?.message || "Server Error"));
      }
    };
    fetchLatestProducts();
  }, [dispatch]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">

      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center bg-gradient-to-br from-[#0F172A] via-[#111827] to-black overflow-hidden">

        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-[#F59E0B]/20 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#10B981]/20 blur-[180px] rounded-full"></div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">

          <div>
            <h1 className="text-white text-6xl md:text-7xl font-black leading-tight tracking-tighter mb-6">
              Redefine <span className="text-[#F59E0B]">Premium</span> <br />
              Online Shopping
            </h1>

            <p className="text-gray-400 text-lg mb-10 max-w-lg">
              Discover curated gadgets and lifestyle essentials crafted for those who demand excellence.
            </p>

            <div className="flex gap-6">
              <Link to="/products">
                <button className="bg-[#F59E0B] text-black px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition duration-300 shadow-xl">
                  Shop Now
                </button>
              </Link>

              <Link to="/products">
                <button className="border border-white/20 text-white px-10 py-4 rounded-2xl font-black uppercase text-sm tracking-widest hover:bg-white hover:text-black transition duration-300">
                  Explore
                </button>
              </Link>
            </div>
          </div>

          <div className="hidden lg:flex justify-center">
            <div className="bg-white/5 backdrop-blur-2xl p-10 rounded-[3rem] border border-white/10 shadow-2xl">
              <img
                src={products[0]?.images[0]?.url}
                alt="Hero Product"
                className="h-[350px] object-contain"
              />
            </div>
          </div>

        </div>
      </section>

      {/* PRODUCT SECTION */}
      {[
        { title: "New Arrivals", slice: products.slice(0,4) },
        { title: "Best Sellers", slice: products.slice(4,8) },
        { title: "Trending Now", slice: products.slice(8,12) },
      ].map((section, idx) => (
        <section key={idx} className={`py-24 ${idx % 2 === 1 ? "bg-white" : "bg-[#F8FAFC]"}`}>
          <div className="max-w-7xl mx-auto px-6">

            <div className="flex justify-between items-end mb-14">
              <h2 className="text-4xl font-black tracking-tight text-[#0F172A]">
                {section.title}
              </h2>

              <Link to="/products" className="text-sm font-bold border-b-2 border-[#F59E0B] pb-1 hover:text-[#F59E0B] transition">
                View All
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-t-[#0F172A] rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {section.slice.map((item) => (
                  <Link to={`/product/${item._id}`} key={item._id} className="group">
                    <div className="bg-white rounded-[2.5rem] p-6 shadow-sm hover:shadow-2xl transition duration-500">
                      <div className="overflow-hidden mb-6">
                        <img
                          src={item.images[0]?.url}
                          alt={item.name}
                          className="h-60 w-full object-contain group-hover:scale-110 transition duration-700"
                        />
                      </div>

                      <h3 className="font-bold text-[#0F172A] truncate mb-2">
                        {item.name}
                      </h3>

                      <div className="flex justify-between items-center">
                        <span className="text-[#10B981] font-black text-lg">
                          Rs {item.price.toLocaleString()}
                        </span>

                        <button className="bg-[#0F172A] text-white text-xs px-4 py-2 rounded-xl uppercase tracking-wider hover:bg-[#F59E0B] hover:text-black transition">
                          View
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      ))}

      {/* CTA  */}
      <section className="py-28 bg-gradient-to-r from-[#0F172A] to-black text-center">
        <h2 className="text-white text-4xl font-black mb-6">
          Experience Luxury Shopping
        </h2>
        <p className="text-gray-400 mb-10 max-w-xl mx-auto">
          Premium products. Premium design. Premium experience.
        </p>
        <Link to="/products">
          <button className="bg-[#F59E0B] text-black px-12 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition duration-300 shadow-xl">
            Discover Collection
          </button>
        </Link>
      </section>

    </div>
  );
};

export default Home;
