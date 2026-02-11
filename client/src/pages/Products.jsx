import React, { useEffect } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; 

// REDUX ACTIONS: Products fetch karne ke liye
import { getProductRequest, getProductsSuccess, getProductsFail } from '../redux/productSlice';

const Products = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    const fetchProducts = async () => { 
      try {
        dispatch(getProductRequest());
        const { data } = await axios.get("http://localhost:3000/api/product/products", { withCredentials: true });
        dispatch(getProductsSuccess(data)); 
      } catch (err) {
        dispatch(getProductsFail(err.response?.data?.message || "Server Error"));
      }
    };
    fetchProducts();
  }, [dispatch]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-8 md:p-16"> 
      <h1 className="text-[#0F172A] text-3xl font-extrabold mb-10 text-center tracking-tight uppercase">All Products</h1>

      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-[60vh] w-full">
          <div className="w-14 h-14 border-4 border-[#94A3B8]/30 border-t-[#0F172A] rounded-full animate-spin"></div>
          <p className="mt-4 text-[#0F172A] font-medium animate-pulse">Fetching latest items...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {products && products.map((item) => (
            <div key={item._id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#94A3B8]/10 flex flex-col max-w-[280px] mx-auto w-full">
              
              <Link to={`/product/${item._id}`} className="block overflow-hidden bg-white p-3">
                <img
                  src={item.images[0]?.url}
                  alt={item.name}
                  className="w-full h-44 object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </Link>

              <div className="p-4 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-1.5">
                   <p className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest">{item.category}</p>
                   <span className="bg-[#10B981]/10 text-[#10B981] text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase">In Stock</span>
                </div>
                
                <h2 className="text-[#0F172A] font-bold text-base mb-1 truncate">{item.name}</h2>

                {/* Ratings Section */}
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-[#F59E0B] text-sm">★</span> 
                  <span className="text-[#0F172A] text-xs font-bold">{item.ratings || 0}</span>
                  <span className="text-[#94A3B8] text-[10px]">({item.numOfReviews || 0} Reviews)</span>
                </div>

                {/* --- LINE CLAMP CLASS --- */}
                {/* 'line-clamp-2' wo class hy jo text ko 2 lines k bad truncate krti hy (...) 
                  'h-8' height is liye di hy takay description na honay par b card ka size same rahay.
                */}
                <p className="text-[#0F172A] text-[11px] leading-tight mb-3 line-clamp-2 overflow-hidden ">
                  {item.description}
                </p>

                <p className="text-[#10B981] font-black text-xl mb-4">${item.price}</p>

                <div className="flex gap-2 mt-auto">
                  <Link to={`/product/${item._id}`} className="flex-1">
                    <button className="w-full bg-white border border-[#0F172A] text-[#0F172A] py-1.5 rounded-lg text-xs font-bold hover:bg-[#0F172A] hover:text-white transition-all duration-300">
                      Details
                    </button>
                  </Link>

                  <button className="flex-1 bg-[#F59E0B] text-white py-1.5 rounded-lg text-xs font-bold hover:bg-[#0F172A] transition-all duration-300 shadow-sm active:scale-95">
                    + Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <div className="max-w-md mx-auto text-[#EF4444] text-center font-medium mt-8">{error}</div>}
    </div>
  );
};

export default Products;