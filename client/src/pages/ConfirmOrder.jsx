import React from "react";
import { useSelector, useDispatch } from "react-redux"; 
import { Link, useNavigate } from "react-router-dom";
// import axios ko khatam kiya
import api from "../utils/api"; // Central api instance
import { toast } from "react-hot-toast";
import { clearCart } from "../redux/cartSlice"; 

const ConfirmOrder = () => {
  const dispatch = useDispatch(); 
  const navigate = useNavigate();
  const { shippingInfo, cartItems } = useSelector((state) => state.cart);

  const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
  const shippingCharges = subtotal > 2000 ? 0 : 200;
  
  const tax = 0; 
  const totalPrice = subtotal + tax + shippingCharges;
  const address = `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.pinCode}`;

  const placeOrderHandler = async () => {
    try {
      const orderItems = cartItems.map((i) => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
        product: i.product, 
      }));

      const orderData = {
        shippingInfo,
        orderItems,
        itemsPrice: subtotal,
        taxPrice: tax,
        shippingPrice: shippingCharges,
        totalPrice: totalPrice,
        // Production level: Cash on delivery marker
        paymentInfo: { id: "COD_" + Date.now(), status: "Cash on Delivery" }
      };

      // api instance already withCredentials aur headers handle karta hy
      const { data } = await api.post("/api/order/new", orderData);

      if (data.success) {
        toast.success("Order Placed Successfully!"); // Using 'toast' as requested
        dispatch(clearCart()); 
        navigate("/order/success"); 
      }
    } catch (error) {
      // Production style error handling
      toast.error(error.response?.data?.message || "Order Failed!");
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-10">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-[#94A3B8]/10">
            <h2 className="text-2xl font-black text-[#0F172A] mb-8 uppercase tracking-tighter flex items-center gap-3">
              <span className="w-2 h-8 bg-[#F59E0B] rounded-full"></span> Delivery Details
            </h2>
            <div className="text-sm space-y-2">
              <p><b>Name:</b> {shippingInfo.name}</p>
              <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
              <p><b>Address:</b> {address}</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-[#94A3B8]/10">
            <h2 className="text-2xl font-black text-[#0F172A] mb-8 uppercase tracking-tighter flex items-center gap-3">
               <span className="w-2 h-8 bg-[#0F172A] rounded-full"></span> Your Items
            </h2>
            {cartItems.map((item) => (
              <div key={item.product} className="flex items-center justify-between mb-4 border-b pb-4">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt="product" className="w-12 h-12 object-contain" />
                  <div>
                    <Link to={`/product/${item.product}`} className="font-bold text-[#0F172A] block">{item.name}</Link>
                    <span className="text-xs text-[#94A3B8] font-bold">Qty: {item.quantity}</span>
                  </div>
                </div>
                <p className="font-black text-[#0F172A]">Rs {item.quantity * item.price}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="w-full lg:w-[400px]">
          <div className="bg-[#0F172A] p-8 rounded-[40px] text-white">
            <h2 className="text-xl font-black mb-6 border-b border-white/10 pb-4">Order Summary</h2>
            <div className="space-y-4 text-sm text-white/70">
              <div className="flex justify-between"><span>Subtotal:</span><span>Rs {subtotal}</span></div>
              <div className="flex justify-between"><span>Shipping:</span><span>Rs {shippingCharges}</span></div>
              <div className="flex justify-between"><span>Tax:</span><span>Rs {tax}</span></div>
              <div className="flex justify-between border-t border-white/20 pt-4 text-white text-xl font-black italic">
                <span>TOTAL:</span><span>Rs {totalPrice}</span>
              </div>
            </div>
            <button onClick={placeOrderHandler} className="w-full bg-[#F59E0B] text-[#0F172A] py-5 rounded-2xl font-black mt-8 hover:bg-white transition-all active:scale-95">
              CONFIRM ORDER (COD)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmOrder;