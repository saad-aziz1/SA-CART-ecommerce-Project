import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
// NAYA KAAM: addItemsToCart (Thunk) import kiya backend sync ke liye
import { addItemsToCart, removeFromCart } from '../redux/cartSlice'; 
import toast from 'react-hot-toast';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);

  // ===============================
  // 🔥 FIX 1: Quantity Increase (Updated with Backend Sync)
  // ===============================
  const increaseQty = (item) => {
    const newQty = Number(item.quantity) + 1;

    if (Number(item.stock) <= item.quantity)
      return toast.error("Stock limit reached");

    // NAYA KAAM: Ab addToCart ki jagah addItemsToCart call ho raha hy
    dispatch(addItemsToCart({
      ...item, 
      quantity: newQty
    }));
  };

  // ===============================
  // 🔥 FIX 2: Quantity Decrease (Updated with Backend Sync)
  // ===============================
  const decreaseQty = (item) => {
    if (Number(item.quantity) <= 1) return;

    const newQty = Number(item.quantity) - 1;

    // NAYA KAAM: Ab addToCart ki jagah addItemsToCart call ho raha hy
    dispatch(addItemsToCart({
      ...item, 
      quantity: newQty
    }));
  };

  const removeHandler = (id) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed");
  };

  // ===============================
  // 🔥 FIX 3: Safe Calculations
  // ===============================
  const subtotal = cartItems.reduce((acc, item) => {
    const itemPrice = Number(item.price) || 0;
    const itemQty = Number(item.quantity) || 0;
    return acc + (itemQty * itemPrice);
  }, 0);

  const shipping = subtotal > 1000 ? 0 : 200;
  const total = Number(subtotal) + Number(shipping);

  // Empty Cart View
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F8FAFC] p-4">
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-[#94A3B8]/20 text-center">
          <div className="bg-[#F59E0B]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-[#F59E0B]" />
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] mb-2 uppercase">Your Cart is Empty</h2>
          <p className="text-[#94A3B8] mb-8 font-medium">Looks like you haven't added anything yet.</p>
          <Link to="/products" className="inline-flex items-center gap-2 bg-[#0F172A] text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#1E293B] transition-all">
            <ArrowLeft className="w-5 h-5" /> Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-black text-[#0F172A] mb-10 uppercase tracking-tighter italic">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.product} className="bg-white p-6 rounded-[24px] border border-[#94A3B8]/10 shadow-sm flex flex-col sm:flex-row items-center gap-6">
                <img src={item.image} alt={item.name} className="w-24 h-24 object-contain bg-[#F8FAFC] rounded-xl p-2" />
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-[#0F172A] font-bold text-lg mb-1">{item.name}</h3>
                  <p className="text-[#10B981] font-black">
                    Rs {Number(item.price || 0).toLocaleString()}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-[#F8FAFC] p-2 rounded-xl border border-[#94A3B8]/20">
                  <button 
                    onClick={() => decreaseQty(item)} 
                    className="w-8 h-8 bg-white rounded-lg font-bold shadow-sm hover:text-[#EF4444]"
                  >
                    -
                  </button>

                  <span className="font-bold w-4 text-center">
                    {Number(item.quantity) || 0}
                  </span>

                  <button 
                    onClick={() => increaseQty(item)} 
                    className="w-8 h-8 bg-white rounded-lg font-bold shadow-sm hover:text-[#10B981]"
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-[#0F172A] font-black mb-2">
                    Rs {(Number(item.price || 0) * Number(item.quantity || 0)).toLocaleString()}
                  </p>
                  <button onClick={() => removeHandler(item.product)} className="text-[#EF4444] hover:bg-[#EF4444]/10 p-2 rounded-lg transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-[#0F172A] text-white p-8 rounded-[32px] shadow-2xl sticky top-24">
              <h2 className="text-xl font-bold mb-6 uppercase tracking-widest border-b border-white/10 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[#94A3B8] font-medium">
                  <span>Subtotal</span>
                  <span className="text-white">Rs {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-[#94A3B8] font-medium">
                  <span>Shipping</span>
                  <span className="text-white">
                    {shipping === 0 ? "FREE" : `Rs ${shipping}`}
                  </span>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between">
                  <span className="text-lg font-bold uppercase">Total</span>
                  <span className="text-2xl font-black text-[#F59E0B]">
                    Rs {total.toLocaleString()}
                  </span>
                </div>
              </div>

              <button 
                onClick={() => navigate("/shipping")}
                className="w-full bg-[#F59E0B] text-[#0F172A] py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95"
              >
                Checkout Now
              </button>

              <p className="text-[10px] text-[#94A3B8] mt-6 text-center uppercase tracking-widest">
                Tax calculated at checkout
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Cart;