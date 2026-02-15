import React, { useEffect, useState } from 'react';
// axios ko replace kiya central api instance se
import api from '../../utils/api.js'; 
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Package, ChevronDown, ChevronUp, Clock, ShoppingCart, MapPin, CreditCard, User } from 'lucide-react';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null); 

  const fetchMyOrders = async () => {
    try {
      setLoading(true);
      // api instance production URL aur credentials khud handle karega
      const { data } = await api.get('/api/order/me');
      if (data.success) {
        setOrders(data.orders);
      }
      setLoading(false);
    } catch (error) {
      // toast message in English as requested
      toast.error(error.response?.data?.message || "Could not fetch your orders");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  const toggleOrder = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#F59E0B] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 font-sans text-[#020617]">
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-[#0F172A] tracking-tighter uppercase">My History</h1>
          <p className="text-[#94A3B8] text-sm font-semibold uppercase tracking-widest">Manage and track your orders</p>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-[#94A3B8]/10 font-black text-[#10B981]">
          Total: {orders.length}
        </div>
      </div>

      {orders && orders.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-[#94A3B8]/20">
          <ShoppingCart className="text-[#94A3B8] mx-auto mb-6" size={48} />
          <h2 className="text-2xl font-black text-[#0F172A] uppercase">No Orders Found</h2>
          <Link to="/products" className="text-[#F59E0B] font-black uppercase text-xs tracking-widest mt-4 inline-block underline">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-[32px] border border-[#94A3B8]/10 overflow-hidden shadow-sm transition-all">
              {/* Main Card */}
              <div 
                onClick={() => toggleOrder(order._id)}
                className="p-6 flex flex-col md:flex-row items-center gap-6 cursor-pointer hover:bg-[#F8FAFC] transition-colors"
              >
                <div className="w-20 h-20 bg-[#F8FAFC] rounded-2xl overflow-hidden shrink-0">
                  <img src={order.orderItems[0]?.image} alt="product" className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 text-center md:text-left">
                  <p className="text-[10px] font-black text-[#94A3B8] uppercase tracking-widest">Order ID: {order._id.slice(-8)}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-1">
                    <span className="flex items-center gap-1 text-xs font-bold text-[#94A3B8]"><Clock size={14}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1 text-xs font-bold text-[#0F172A]"><Package size={14}/> {order.orderItems.length} Items</span>
                  </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-1 shrink-0">
                  <p className="text-xl font-black text-[#10B981]">Rs {order.totalPrice}</p>
                  <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${order.orderStatus === "Delivered" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#F59E0B]/10 text-[#F59E0B]"}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="bg-[#0F172A] p-3 rounded-xl text-white">
                  {expandedOrder === order._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>

              {/* Expanded Detail Section */}
              {expandedOrder === order._id && (
                <div className="bg-[#F8FAFC] border-t border-[#94A3B8]/10 p-8 animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    
                    <div className="space-y-6">
                      <div className="bg-white p-6 rounded-3xl border border-[#94A3B8]/10 shadow-sm">
                        <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-widest mb-4 flex items-center gap-2">
                          <MapPin size={16} className="text-[#F59E0B]" /> Shipping Info
                        </h4>
                        <div className="space-y-2 text-sm font-medium text-[#0F172A]">
                          <p className="flex justify-between"><span className="text-[#94A3B8]">Address:</span> {order.shippingInfo.address}</p>
                          <p className="flex justify-between"><span className="text-[#94A3B8]">City:</span> {order.shippingInfo.city}</p>
                          <p className="flex justify-between"><span className="text-[#94A3B8]">Phone:</span> {order.shippingInfo.phoneNo}</p>
                        </div>
                      </div>

                      <div className="bg-white p-6 rounded-3xl border border-[#94A3B8]/10 shadow-sm">
                        <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-widest mb-4 flex items-center gap-2">
                          <CreditCard size={16} className="text-[#10B981]" /> Payment Summary
                        </h4>
                        <div className="space-y-2 text-sm font-bold">
                          <div className="flex justify-between"><span className="text-[#94A3B8]">Items Price</span> <span>Rs {order.itemsPrice}</span></div>
                          <div className="flex justify-between"><span className="text-[#94A3B8]">Shipping</span> <span>Rs {order.shippingPrice}</span></div>
                          <div className="flex justify-between pt-2 border-t border-[#F8FAFC] text-[#10B981] text-lg font-black italic">
                            <span>TOTAL</span> <span>Rs {order.totalPrice}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-[#94A3B8]/10 shadow-sm">
                      <h4 className="text-[11px] font-black text-[#0F172A] uppercase tracking-widest mb-4">Ordered Items</h4>
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {order.orderItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-4 bg-[#F8FAFC] p-3 rounded-2xl border border-[#94A3B8]/5">
                            <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                            <div className="flex-1">
                              <p className="text-[10px] font-black text-[#0F172A] uppercase line-clamp-1">{item.name}</p>
                              <p className="text-[10px] font-bold text-[#94A3B8]">{item.quantity} x Rs {item.price}</p>
                            </div>
                            <p className="text-xs font-black text-[#0F172A]">Rs {item.quantity * item.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;