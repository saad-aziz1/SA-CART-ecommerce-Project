import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { getProductRequest, getProductDetailsSuccess, getProductsFail } from '../redux/productSlice';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  
  const { product, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        dispatch(getProductRequest()); 

        
        const { data } = await axios.get(`http://localhost:3000/api/product/product/${id}`, { withCredentials: true });

        
        dispatch(getProductDetailsSuccess(data)); 
      } catch (err) {
        dispatch(getProductsFail(err.response?.data?.message || "Product not found"));
      }
    };

    fetchProductDetails();
  }, [dispatch, id]);

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen bg-[#F8FAFC]">
      <div className="w-12 h-12 border-4 border-[#94A3B8]/20 border-t-[#0F172A] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-6 md:p-12">
      
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-[#94A3B8]/10">
        
        
        <div className="md:w-1/2 p-8 bg-white flex items-center justify-center border-b md:border-b-0 md:border-r border-[#94A3B8]/10">
          <img 
            src={product?.images?.[0]?.url} 
            alt={product?.name} 
            className="w-full max-h-[450px] object-contain hover:scale-105 transition-transform duration-500"
          />
        </div>

        
        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <p className="text-[#94A3B8] text-sm font-bold uppercase tracking-[0.2em] mb-2">{product?.category}</p>
          <h1 className="text-[#020617] text-4xl font-black mb-4 leading-tight">{product?.name}</h1>
          
         
          <div className="flex items-center gap-3 mb-6">
            <div className="flex text-[#F59E0B] text-xl">
              {"★".repeat(Math.round(product?.ratings || 0))}
              <span className="text-[#94A3B8]/30">{"★".repeat(5 - Math.round(product?.ratings || 0))}</span>
            </div>
            <span className="text-[#94A3B8] text-sm font-medium">({product?.numOfReviews} Customer Reviews)</span>
          </div>

          <p className="text-[#020617] text-3xl font-bold mb-6 text-[#10B981]">${product?.price}</p>
          
          <div className="border-t border-[#94A3B8]/10 pt-6">
            <h3 className="text-[#0F172A] font-bold mb-3">Description:</h3>
            <p className="text-[#94A3B8] leading-relaxed mb-8 text-sm md:text-base">
              {product?.description}
            </p>
          </div>

          
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <button className="flex-1 bg-[#F59E0B] text-white py-4 rounded-2xl font-black uppercase tracking-wider hover:bg-[#0F172A] transition-all duration-300 shadow-lg active:scale-95">
              Add to Cart
            </button>
            <button className="px-8 bg-white border-2 border-[#0F172A] text-[#0F172A] py-4 rounded-2xl font-black hover:bg-[#0F172A] hover:text-white transition-all duration-300 active:scale-95">
              ♡
            </button>
          </div>

          
          <div className="mt-8 flex items-center gap-4">
             <span className={`h-3 w-3 rounded-full ${product?.stock > 0 ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}></span>
             <p className="text-sm font-bold text-[#0F172A]">
               {product?.stock > 0 ? `In Stock (${product?.stock} available)` : "Out of Stock"}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;