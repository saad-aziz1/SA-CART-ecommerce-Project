import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
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

  // Review States
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const { product, loading, error, success, error: reviewError } = useSelector((state) => state.products);

  const { cartItems } = useSelector((state) => state.cart);
  const isInCart = cartItems.find((i) => i.product === id);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        dispatch(getProductRequest());
        const { data } = await axios.get(`http://localhost:3000/api/product/product/${id}`, { withCredentials: true });
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
      setRating(0);
      setComment("");
    }
  }, [dispatch, id, reviewError, success]);

  const increaseQty = () => { 
    if (product.stock <= quantity) return; 
    setQuantity(quantity + 1); 
  };
  const decreaseQty = () => { 
    if (1 >= quantity) return; 
    setQuantity(quantity - 1); 
  };

  const toggleCartHandler = () => {
    if (isInCart) {
      dispatch(removeFromCart(id));
      toast.success("Removed from cart!");
    } else {
      if (product.stock < 1) return toast.error("Out of Stock!");
      dispatch(addItemsToCart({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url,
        stock: product.stock,
        quantity: quantity 
      }));
      toast.success("Added to Cart!");
    }
  };

  // Review Submit Handler
  const reviewSubmitHandler = () => {
    if (rating === 0) return toast.error("Please select a rating");
    if (comment === "") return toast.error("Please write a comment");

    const myForm = {
      rating,
      comment,
      productId: id,
    };

    dispatch(submitReview(myForm));
  };

  if (loading) return (
    <div className="flex justify-center mt-20">
      <div className="w-12 h-12 border-4 border-[#0F172A] border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="text-6xl mb-4">🚫</div>
      <h2 className="text-[#0F172A] text-2xl font-bold mb-2">Oops! Something went wrong</h2>
      <p className="text-[#94A3B8] mb-6">{error}</p> 
      <button onClick={() => navigate("/")} className="bg-[#0F172A] text-white px-8 py-3 rounded-full font-bold">Go Back</button>
    </div>
  );

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-4 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto"> 
        
        {/* Gallery & Info Section (Same as before) */}
        <div className="bg-white rounded-[32px] shadow-sm border border-[#94A3B8]/10 overflow-hidden flex flex-col md:flex-row mb-10">
          <div className="md:w-3/5 p-8 border-r border-[#94A3B8]/10 bg-white text-center">
            <div className="w-full h-[500px] flex items-center justify-center mb-8 bg-[#F8FAFC] rounded-2xl overflow-hidden">
              <img src={mainImage || product?.images?.[0]?.url} className="max-h-full max-w-full object-contain transition-all duration-500 hover:scale-105" alt="Main" />
            </div>
            <div className="flex gap-4 justify-center overflow-x-auto py-2">
              {product?.images?.map((img, i) => (
                <img key={i} src={img.url} onClick={() => setMainImage(img.url)} className={`w-20 h-20 p-2 border-2 rounded-xl cursor-pointer transition-all ${mainImage === img.url ? 'border-[#F59E0B] scale-110' : 'border-transparent bg-gray-50'}`} />
              ))}
            </div>
          </div>

          <div className="md:w-2/5 p-10 flex flex-col justify-center bg-white">
            <h1 className="text-[#020617] text-2xl md:text-3xl font-extrabold mb-4 uppercase leading-tight tracking-tight">{product?.name}</h1>
            <div className="flex items-center gap-4 mb-6">
              <p className="text-[#10B981] text-4xl font-black italic">Rs {product?.price}</p>
              <div className="bg-[#F59E0B]/10 text-[#F59E0B] px-3 py-1 rounded-full text-sm font-bold">★ {product?.ratings}</div>
            </div>

            <div className="mb-8 py-5 border-t border-b border-dashed border-[#94A3B8]/30">
              <p className="text-xs font-black text-[#94A3B8] mb-4 tracking-widest uppercase">Key Highlights</p>
              <ul className="grid gap-3">
                {product?.features?.map((feat, i) => (
                  <li key={i} className="text-[#020617] text-sm flex items-center gap-3 font-semibold">
                    <span className="bg-[#10B981]/20 text-[#10B981] w-5 h-5 rounded-full flex items-center justify-center text-[10px]">✔</span> {feat}
                  </li>
                )) || <li className="text-[#94A3B8] text-sm italic">Premium Quality Product</li>}
              </ul>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs font-bold text-[#94A3B8] uppercase">Quantity:</span>
              <div className="flex items-center gap-6 bg-[#F8FAFC] p-2 rounded-xl border border-[#94A3B8]/20">
                <button onClick={decreaseQty} className="w-10 h-10 bg-white rounded-lg font-bold shadow-sm hover:bg-red-500 hover:text-white">-</button>
                <span className="font-bold">{quantity}</span>
                <button onClick={increaseQty} className="w-10 h-10 bg-white rounded-lg font-bold shadow-sm hover:bg-green-500 hover:text-white">+</button>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button className="w-full bg-[#0F172A] text-white py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-[#1E293B]">Buy It Now</button>
              <div className="flex gap-3">
                <button onClick={toggleCartHandler} className={`flex-[4] py-4 rounded-2xl font-bold uppercase transition-all duration-300 text-white ${isInCart ? 'bg-[#EF4444] hover:bg-[#B91C1C]' : 'bg-[#F59E0B] hover:bg-[#0F172A]'}`}>
                  {isInCart ? 'Remove from Cart' : 'Add to Cart'}
                </button>
                <button onClick={() => setIsWishlist(!isWishlist)} className={`flex-1 border-2 rounded-2xl flex items-center justify-center text-xl transition-all ${isWishlist ? 'border-[#EF4444] bg-[#EF4444] text-white' : 'border-[#94A3B8]/20 text-[#0F172A]'}`}>
                  {isWishlist ? '❤' : '♡'}
                </button>
              </div>
            </div>
            <p className={`mt-6 text-xs font-bold uppercase flex items-center gap-2 ${product?.stock > 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
              <span className={`w-2 h-2 rounded-full animate-pulse ${product?.stock > 0 ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`}></span>
              {product?.stock > 0 ? `${product?.stock} items in stock` : "Out of Stock"}
            </p>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">
          {[{L: "Free Shipping", I: "🚚"}, {L: "7 Days Return", I: "🔄"}, {L: "Verified Product", I: "✅"}, {L: "Secure Payment", I: "💳"}, {L: "24/7 Support", I: "🎧"}].map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] border border-[#94A3B8]/10 flex flex-col items-center shadow-sm">
              <span className="text-3xl mb-3">{item.I}</span>
              <span className="text-[#020617] font-bold text-[10px] uppercase text-center tracking-widest">{item.L}</span>
            </div>
          ))}
        </div>

        {/* Tabs Section */}
        <div className="bg-white rounded-[32px] border border-[#94A3B8]/10 overflow-hidden shadow-sm mb-20">
          <div className="flex gap-10 px-10 pt-6 border-b border-[#94A3B8]/10">
            {["description", "reviews"].map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`pb-5 font-bold uppercase text-xs tracking-[3px] transition-all relative ${activeTab === tab ? 'text-[#0F172A]' : 'text-[#94A3B8]'}`}>
                {tab} {tab === 'reviews' && `(${product?.numOfReviews})`}
                {activeTab === tab && <div className="absolute bottom-0 left-0 w-full h-[4px] bg-[#F59E0B] rounded-full"></div>}
              </button>
            ))}
          </div>

          <div className="p-10 md:p-14 min-h-[300px]">
            {activeTab === "description" ? (
              <div className="text-[#475569] leading-loose text-base md:text-lg whitespace-pre-line max-w-4xl italic">{product?.description}</div>
            ) : (
              <div className="max-w-4xl mx-auto">
                {/* Review Form */}
                <div className="bg-[#F8FAFC] p-8 rounded-3xl mb-10 border border-[#94A3B8]/10">
                  <h3 className="text-lg font-black uppercase tracking-widest mb-6">Write a Review</h3>
                  <div className="flex gap-2 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRating(star)} className={`text-3xl transition-all ${star <= rating ? "text-[#F59E0B]" : "text-[#94A3B8]/40"}`}>★</button>
                    ))}
                  </div>
                  <textarea 
                    className="w-full p-5 rounded-2xl border border-[#94A3B8]/20 focus:outline-none focus:border-[#F59E0B] min-h-[120px]" 
                    placeholder="Your feedback matters..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                  <button onClick={reviewSubmitHandler} className="mt-4 bg-[#0F172A] text-white px-10 py-3 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-[#F59E0B] transition-all">Submit Review</button>
                </div>

                {/* Reviews List */}
                {product.reviews && product.reviews[0] ? (
                  <div className="grid gap-6">
                    {product.reviews.map((rev) => (
                      <div key={rev._id} className="border-b border-[#94A3B8]/10 pb-6">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-10 h-10 bg-[#0F172A] text-white flex items-center justify-center rounded-full font-bold uppercase">{rev.name[0]}</div>
                          <div>
                            <p className="font-bold text-[#020617]">{rev.name}</p>
                            <p className="text-[#F59E0B] text-xs">{"★".repeat(rev.rating)}{"☆".repeat(5-rev.rating)}</p>
                          </div>
                        </div>
                        <p className="text-[#475569] text-sm italic pl-14">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-[#94A3B8] text-sm font-bold uppercase tracking-widest">No reviews yet. Be the first!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProductDetails;