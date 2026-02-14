import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; 
import toast from 'react-hot-toast';
import Pagination from 'react-js-pagination'; // Pagination Import

// REDUX ACTIONS
import { getProductRequest, getProductsSuccess, getProductsFail } from '../redux/productSlice';
import { addToCart, removeFromCart } from '../redux/cartSlice';

const Products = () => {
  const dispatch = useDispatch();
  
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);

  const { products, loading, error, productsCount, resultPerPage } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);

  // --- ADD / REMOVE FROM CART HANDLER ---
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

  // --- PAGINATION FUNCTION ---
  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  useEffect(() => {
    const fetchProducts = async () => { 
      try {
        dispatch(getProductRequest());
        
        // Backend API with Page number
        let link = `http://localhost:3000/api/product/products?page=${currentPage}`;

        const { data } = await axios.get(link, { withCredentials: true });
        
        // Pura data bhej rahy hain taky productsCount bhi redux me jaye
        dispatch(getProductsSuccess(data)); 
      } catch (err) {
        dispatch(getProductsFail(err.response?.data?.message || "Server Error"));
      }
    };
    fetchProducts();
  }, [dispatch, currentPage]); // Jab page badle ga, data refresh hoga

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-8 md:p-16"> 
      <h1 className="text-[#0F172A] text-3xl font-extrabold mb-10 text-center tracking-tight uppercase">All Products</h1>

      {loading ? (
        <div className="flex flex-col justify-center items-center min-h-[60vh] w-full">
          <div className="w-14 h-14 border-4 border-[#94A3B8]/30 border-t-[#0F172A] rounded-full animate-spin"></div>
          <p className="mt-4 text-[#0F172A] font-medium animate-pulse">Fetching latest items...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 max-w-7xl mx-auto">
            {products && products.map((item) => {
              const isInCart = cartItems.find((cartItem) => cartItem.product === item._id);
              return (
                <div key={item._id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-[#94A3B8]/10 flex flex-col max-w-[280px] mx-auto w-full">
                  <Link to={`/product/${item._id}`} className="block overflow-hidden bg-white p-3">
                    <img src={item.images[0]?.url} alt={item.name} className="w-full h-44 object-contain group-hover:scale-105 transition-transform duration-500" />
                  </Link>

                  <div className="p-4 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-1.5">
                       <p className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-widest">{item.category}</p>
                       <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full uppercase ${item.stock > 0 ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-[#EF4444]/10 text-[#EF4444]'}`}>
                        {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                       </span>
                    </div>
                    <h2 className="text-[#0F172A] font-bold text-base mb-1 truncate">{item.name}</h2>
                    <div className="flex items-center gap-1 mb-2">
                      <span className="text-[#F59E0B] text-sm">★</span> 
                      <span className="text-[#0F172A] text-xs font-bold">{item.ratings || 0}</span>
                      <span className="text-[#94A3B8] text-[10px]">({item.numOfReviews || 0} Reviews)</span>
                    </div>
                    <p className="text-[#0F172A] text-[11px] leading-tight mb-3 line-clamp-2 overflow-hidden">{item.description}</p>
                    <p className="text-[#10B981] font-black text-xl mb-4">Rs {item.price}</p>
                    <div className="flex gap-2 mt-auto">
                      <Link to={`/product/${item._id}`} className="flex-1">
                        <button className="w-full bg-white border border-[#0F172A] text-[#0F172A] py-1.5 rounded-lg text-xs font-bold hover:bg-[#0F172A] hover:text-white transition-all duration-300">Details</button>
                      </Link>
                      <button onClick={() => toggleCartHandler(item)} className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 shadow-sm active:scale-95 text-white ${isInCart ? 'bg-[#EF4444] hover:bg-[#B91C1C]' : 'bg-[#F59E0B] hover:bg-[#0F172A]'}`}>
                        {isInCart ? 'Remove' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- PAGINATION UI --- */}
          {resultPerPage < productsCount && (
            <div className="flex justify-center mt-16">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productsCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="1st"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </>
      )}
      {error && <div className="max-w-md mx-auto text-[#EF4444] text-center font-medium mt-8">{error}</div>}
    </div>
  );
};

export default Products;