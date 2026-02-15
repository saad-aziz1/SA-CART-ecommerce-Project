import React, { useEffect, useState } from 'react';
import api from '../../utils/api.js'; 
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; 
import toast from 'react-hot-toast';

// REDUX ACTIONS
import { getProductRequest, getProductsSuccess, getProductsFail } from '../redux/productSlice';
import { addToCart, removeFromCart } from '../redux/cartSlice';

const Products = () => {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    products, 
    loading, 
    error, 
    productsCount, 
    resultPerPage 
  } = useSelector((state) => state.products);

  const { cartItems } = useSelector((state) => state.cart);
  const totalPages = Math.ceil(productsCount / resultPerPage);

  const toggleCartHandler = (item) => {
    const isExist = cartItems.find((i) => i.product === item._id);
    if (isExist) {
      dispatch(removeFromCart(item._id));
      toast.success("Removed from cart!");
    } else {
      if (item.stock < 1) return toast.error("Out of Stock!");
      dispatch(addToCart({
        product: item._id, name: item.name, price: item.price,
        image: item.images[0]?.url, stock: item.stock, quantity: 1 
      }));
      toast.success("Added to Cart!");
    }
  };

  useEffect(() => {
    const fetchProducts = async () => { 
      try {
        dispatch(getProductRequest());
        
        // Forced Absolute URL for Production
        const backendBase = import.meta.env.VITE_BACKEND_URL;
        let link = `${backendBase}/api/product/products?page=${currentPage}`;

        // Axios request using full absolute link
        const { data } = await api.get(link);
        
        dispatch(getProductsSuccess(data)); 
      } catch (err) {
        dispatch(getProductsFail(err.response?.data?.message || "Server Error"));
      }
    };
    fetchProducts();
    window.scrollTo(0, 0);
  }, [dispatch, currentPage]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-8 md:p-16 text-[#020617]"> 
      <h1 className="text-[#0F172A] text-3xl font-extrabold mb-10 text-center uppercase tracking-tight">All Products</h1>

      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-[60vh]">
          <div className="w-14 h-14 border-4 border-[#94A3B8]/30 border-t-[#0F172A] rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
            {products && products.map((item) => {
              const isInCart = cartItems.find((c) => c.product === item._id);
              return (
                <div key={item._id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#94A3B8]/10 flex flex-col">
                  <Link to={`/product/${item._id}`} className="block p-3">
                    <img src={item.images[0]?.url} alt={item.name} className="w-full h-44 object-contain group-hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <div className="p-4 flex flex-col flex-grow">
                    <h2 className="text-[#0F172A] font-bold text-base mb-1 truncate">{item.name}</h2>
                    <p className="text-[#475569] text-[12px] leading-relaxed mb-3 line-clamp-2 h-[36px]">
                      {item.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[#F59E0B] text-sm font-black">★ {item.ratings}</span>
                      <span className="text-[#94A3B8] text-[10px] font-bold">({item.numOfReviews} Reviews)</span>
                    </div>
                    <p className="text-[#10B981] font-black text-xl mb-4">Rs {item.price}</p>
                    <button 
                      onClick={() => toggleCartHandler(item)}
                      className={`w-full py-2 rounded-lg text-xs font-bold text-white transition-all ${isInCart ? 'bg-[#EF4444]' : 'bg-[#F59E0B] cursor-pointer'}`}
                    >
                      {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {productsCount > resultPerPage && (
            <div className="flex justify-center items-center gap-3 mt-16">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="px-4 py-2 bg-white border border-[#94A3B8]/30 rounded-lg font-bold text-[#0F172A] disabled:opacity-30 hover:bg-[#0F172A] hover:text-white transition-all"
              >
                Prev
              </button>
              <div className="flex gap-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => setCurrentPage(index + 1)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${
                      currentPage === index + 1 
                      ? 'bg-[#0F172A] text-white shadow-lg scale-110' 
                      : 'bg-white text-[#0F172A] border border-[#94A3B8]/20 hover:bg-[#94A3B8]/10'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="px-4 py-2 bg-white border border-[#94A3B8]/30 rounded-lg font-bold text-[#0F172A] disabled:opacity-30 hover:bg-[#0F172A] hover:text-white transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
      {error && <p className="text-center text-[#EF4444] font-bold mt-5 uppercase text-xs">{error}</p>}
    </div>
  );
};

export default Products;