import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
// axios ko replace kiya central api instance se
import api from '../utils/api'; 
import { getProductRequest, getProductDetailsSuccess, getProductsFail, newReviewReset } from '../redux/productSlice';
import { submitReview, clearReviewErrors } from '../redux/actions/productActions.js';
import { addItemsToCart, removeFromCart } from '../redux/cartSlice.js'; 
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlist, setIsWishlist] = useState(false); 

  // Review states jo pehle missing thin
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [openReview, setOpenReview] = useState(false);

  const { product, loading, success, error: reviewError } = useSelector((state) => state.products);
  const { cartItems } = useSelector((state) => state.cart);
  const isInCart = cartItems.find((i) => i.product === id);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        dispatch(getProductRequest());
        // api instance use ho raha hy
        const { data } = await api.get(`/api/product/product/${id}`);
        dispatch(getProductDetailsSuccess(data)); 
        if(data.product.images?.length > 0) setMainImage(data.product.images[0].url);
      } catch (err) {
        dispatch(getProductsFail(err.response?.data?.message || "Product not found"));
      }
    };
    fetchProductDetails();

    if (reviewError) {
      toast.error(reviewError);
      dispatch(clearReviewErrors());
    }

    if (success) {
      toast.success("Review Submitted Successfully");
      dispatch(newReviewReset());
      setOpenReview(false); // Modal close karne ke liye
    }
  }, [dispatch, id, success, reviewError]);

  const increaseQty = () => { if (product.stock <= quantity) return; setQuantity(quantity + 1); };
  const decreaseQty = () => { if (1 >= quantity) return; setQuantity(quantity - 1); };

  const toggleCartHandler = () => {
    if (isInCart) {
      dispatch(removeFromCart(id));
      toast.success("Removed from cart!");
    } else {
      if (product.stock < 1) return toast.error("Out of Stock!");
      dispatch(addItemsToCart({
        product: product._id, name: product.name, price: product.price,
        image: product.images[0]?.url, stock: product.stock, quantity: quantity 
      }));
      toast.success("Added to Cart!");
    }
  };

  // Review Submit Logic jo pehle missing tha
  const reviewSubmitHandler = () => {
    const myForm = new FormData();
    myForm.set("rating", rating);
    myForm.set("comment", comment);
    myForm.set("productId", id);

    dispatch(submitReview(myForm));
  };

  const buyNowHandler = () => {
    if (product.stock < 1) return toast.error("Out of Stock!");
    dispatch(addItemsToCart({
      product: product._id, name: product.name, price: product.price,
      image: product.images[0]?.url, stock: product.stock, quantity: quantity 
    }));
    navigate("/shipping");
  };

  if (loading) return <div className="flex justify-center mt-20"><div className="w-12 h-12 border-4 border-[#0F172A] border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-12 font-sans text-[#020617]">
      <div className="max-w-7xl mx-auto"> 
        <div className="bg-white rounded-[32px] shadow-sm border border-[#94A3B8]/10 overflow-hidden flex flex-col md:flex-row mb-10">
          {/* Left: Images */}
          <div className="md:w-3/5 p-8 border-r border-[#94A3B8]/10 bg-white text-center">
            <div className="w-full h-[500px] flex items-center justify-center mb-8 bg-[#F8FAFC] rounded-2xl overflow-hidden">
              <img src={mainImage || product?.images?.[0]?.url} className="max-h-full max-w-full object-contain transition-all duration-500 hover:scale-105" alt="Main" />
            </div>
            <div className="flex gap-4 justify-center overflow-x-auto py-2">
              {product?.images?.map((img, i) => (
                <img key={i} src={img.url} onClick={() => setMainImage(img.url)} className={`w-20 h-20 p-2 border-2 rounded-xl cursor-pointer transition-all ${mainImage === img.url ? 'border-[#F59E0B] scale-110' : 'border-transparent bg-gray-50'}`} alt="thumb" />
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="md:w-2/5 p-10 flex flex-col justify-center bg-white">
            <h1 className="text-[#020617] text-2xl md:text-3xl font-extrabold mb-4 uppercase leading-tight tracking-tight">{product?.name}</h1>
            
            <div className="flex items-center gap-4 mb-6">
              <p className="text-[#10B981] text-4xl font-black italic">Rs {product?.price}</p>
              <div className="bg-[#F59E0B]/10 text-[#F59E0B] px-3 py-1 rounded-full text-sm font-bold">★ {product?.ratings}</div>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-xs font-bold text-[#94A3B8] uppercase">Quantity:</span>
              <div className="flex items-center gap-6 bg-[#F8FAFC] p-2 rounded-xl border border-[#94A3B8]/20">
                <button onClick={decreaseQty} className="w-10 h-10 bg-white rounded-lg font-bold shadow-sm hover:bg-[#EF4444] hover:text-white transition-colors">-</button>
                <span className="font-bold">{quantity}</span>
                <button onClick={increaseQty} className="w-10 h-10 bg-white rounded-lg font-bold shadow-sm hover:bg-[#10B981] hover:text-white transition-colors">+</button>
              </div>
            </div>

            <div className="mb-6">
               <p className={`text-sm font-black ${product?.stock < 1 ? "text-[#EF4444]" : "text-[#10B981]"}`}>
                 {product?.stock > 0 ? `${product?.stock} Items Left in Stock` : "Out of Stock"}
               </p>
            </div>

            {/* Dynamic Features */}
            <div className="space-y-3 mb-8 bg-[#F8FAFC] p-6 rounded-2xl border border-[#10B981]/10">
              {product?.features && product.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 py-1 border-b border-[#10B981]/5 last:border-0">
                  <span className="text-[#10B981] font-bold text-lg leading-none">✓</span>
                  <span className="text-[11px] font-bold text-[#0F172A] uppercase tracking-normal leading-tight">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3">
              <button onClick={buyNowHandler} className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#1E293B] transition-all">Buy It Now</button>
              <div className="flex gap-3">
                <button onClick={toggleCartHandler} className={`flex-[4] py-4 rounded-2xl font-bold uppercase transition-all duration-300 text-white ${isInCart ? 'bg-[#EF4444] hover:bg-[#B91C1C]' : 'bg-[#F59E0B] hover:bg-[#0F172A]'}`}>
                  {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                </button>
                <button onClick={() => setIsWishlist(!isWishlist)} className={`flex-1 border-2 rounded-2xl flex items-center justify-center text-xl transition-all ${isWishlist ? 'border-[#EF4444] bg-[#EF4444] text-white' : 'border-[#94A3B8]/20 text-[#0F172A]'}`}>
                  {isWishlist ? '❤' : '♡'}
                </button>
              </div>
              {/* Review Button */}
              <button onClick={() => setOpenReview(true)} className="text-[10px] font-black uppercase tracking-[2px] text-[#94A3B8] mt-2 hover:text-[#0F172A]">Submit a Review</button>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-[32px] shadow-sm border border-[#94A3B8]/10 overflow-hidden">
          <div className="flex border-b border-[#94A3B8]/10 bg-[#F8FAFC]">
            <button onClick={() => setActiveTab("description")} className={`px-10 py-5 font-black uppercase tracking-widest text-xs transition-all ${activeTab === "description" ? "bg-white text-[#F59E0B] border-t-4 border-[#F59E0B]" : "text-[#94A3B8] hover:text-[#0F172A]"}`}>Description</button>
            <button onClick={() => setActiveTab("reviews")} className={`px-10 py-5 font-black uppercase tracking-widest text-xs transition-all ${activeTab === "reviews" ? "bg-white text-[#F59E0B] border-t-4 border-[#F59E0B]" : "text-[#94A3B8] hover:text-[#0F172A]"}`}>Reviews ({product?.numOfReviews})</button>
          </div>
          
          <div className="p-10">
            {activeTab === "description" ? (
              <p className="text-[#475569] leading-relaxed text-sm whitespace-pre-wrap">{product?.description}</p>
            ) : (
              <div className="space-y-6">
                {product?.reviews && product.reviews[0] ? (
                  product.reviews.map((rev) => (
                    <div key={rev._id} className="bg-[#F8FAFC] p-6 rounded-2xl border border-[#94A3B8]/10">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-[#0F172A] rounded-full flex items-center justify-center text-white font-bold uppercase">{rev.name[0]}</div>
                        <div>
                          <p className="font-bold text-[#0F172A] text-sm">{rev.name}</p>
                          <p className="text-[#F59E0B] text-xs font-black">★ {rev.rating}</p>
                        </div>
                      </div>
                      <p className="text-[#475569] text-sm italic">"{rev.comment}"</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-[#94A3B8] font-bold italic">No reviews yet. Be the first to review!</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- SIMPLE REVIEW MODAL --- */}
      {openReview && (
        <div className="fixed inset-0 bg-[#0F172A]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8">
            <h3 className="text-xl font-black uppercase mb-6 text-[#0F172A]">Submit Review</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest block mb-2">Rating</label>
                <input type="number" max="5" min="1" value={rating} onChange={(e) => setRating(e.target.value)} className="w-full bg-[#F8FAFC] border border-[#94A3B8]/20 rounded-xl p-3" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest block mb-2">Comment</label>
                <textarea rows="4" value={comment} onChange={(e) => setComment(e.target.value)} className="w-full bg-[#F8FAFC] border border-[#94A3B8]/20 rounded-xl p-3"></textarea>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={() => setOpenReview(false)} className="flex-1 py-3 font-bold uppercase text-xs text-[#94A3B8]">Cancel</button>
                <button onClick={reviewSubmitHandler} className="flex-1 bg-[#F59E0B] text-[#0F172A] py-3 rounded-xl font-bold uppercase text-xs">Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;