import React, { useEffect, useState } from "react";
// Axios ki jagah custom api instance use kiya
import api from "../../utils/api.js"; 
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

const ProcessOrder = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);

  // 1: Order Details Fetch Karna
  const getOrderDetails = async () => {
    try {
      // Localhost aur withCredentials nikaal diya, api instance base URL use karega
      const { data } = await api.get(`/api/order/${id}`);
      setOrder(data.order);
      setLoading(false);
    } catch (error) {
      toast.error("Order details nahi mil saki");
      setLoading(false);
    }
  };

  // 2: Status Update Function
  const updateOrderHandler = async (e) => {
    e.preventDefault();
    if (!status) return toast.error("Please select a status first");

    try {
      setUpdateLoading(true);
      
      // Request payload aur relative path ke sath update call
      const { data } = await api.put(
        `/api/order/admin/order/${id}`, 
        { status }
      );

      toast.success(data.message);
      getOrderDetails(); // UI refresh karne ke liye data dubara fetch kiya
      setUpdateLoading(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
      setUpdateLoading(false);
    }
  };

  useEffect(() => {
    getOrderDetails();
  }, [id]);

  if (loading) return <div className="p-10 text-center font-bold text-[#94A3B8]">Loading Details...</div>;

  return (
    <div className="p-4 md:p-10 bg-[#F8FAFC] min-h-screen font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT SIDE: CUSTOMER & ORDER INFO */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-[#94A3B8]/10">
            <h2 className="text-xl font-black text-[#0F172A] mb-6 uppercase tracking-tighter">Shipping Info</h2>
            <div className="space-y-3 text-sm">
              <p><b className="text-[#94A3B8]">Name:</b> {order.shippingInfo.name}</p>
              <p><b className="text-[#94A3B8]">Phone:</b> {order.shippingInfo.phoneNo}</p>
              <p><b className="text-[#94A3B8]">Address:</b> {`${order.shippingInfo.address}, ${order.shippingInfo.city}, ${order.shippingInfo.pinCode}`}</p>
              <p><b className="text-[#94A3B8]">Email:</b> {order.user ? order.user.email : "Email not found"}</p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-[#94A3B8]/10">
            <h2 className="text-xl font-black text-[#0F172A] mb-6 uppercase tracking-tighter">Order Items</h2>
            <div className="space-y-4">
              {order.orderItems.map((item) => (
                <div key={item.product} className="flex items-center justify-between border-b border-[#F8FAFC] pb-4 last:border-0">
                  <div className="flex items-center gap-4">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded-lg" />
                    <div>
                      <p className="font-bold text-[#0F172A] text-sm">{item.name}</p>
                      <p className="text-xs text-[#94A3B8] font-bold">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-black text-[#10B981] text-sm">Rs {item.price * item.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: STATUS & SUMMARY */}
        <div className="space-y-6">
          <div className="bg-[#0F172A] p-8 rounded-[40px] text-white shadow-xl">
            <h2 className="text-lg font-black mb-6 border-b border-white/10 pb-4 uppercase tracking-widest">Order Summary</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between text-white/70"><span>Status:</span>
                <span className={order.orderStatus === "Delivered" ? "text-[#10B981] font-bold" : "text-[#F59E0B] font-bold"}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="flex justify-between text-white/70"><span>Subtotal:</span><span>Rs {order.itemsPrice}</span></div>
              <div className="flex justify-between text-white/70"><span>Shipping:</span><span>Rs {order.shippingPrice}</span></div>
              <div className="flex justify-between border-t border-white/20 pt-4 text-xl font-black italic">
                <span>TOTAL:</span><span>Rs {order.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* --- UPDATE STATUS SECTION --- */}
          <div className="bg-white p-8 rounded-[32px] shadow-sm border border-[#94A3B8]/10">
              <h2 className="text-lg font-black text-[#0F172A] mb-4 uppercase">Update Status</h2>
              
              {order.orderStatus === "Delivered" ? (
                <p className="text-[#10B981] font-bold text-center py-4 bg-[#10B981]/5 rounded-xl border border-[#10B981]/20">
                  Order Delivered Successfully!
                </p>
              ) : (
                <form onSubmit={updateOrderHandler} className="space-y-4">
                  <select 
                    className="w-full p-4 rounded-2xl bg-[#F8FAFC] border border-[#94A3B8]/20 font-bold text-sm focus:outline-none focus:border-[#F59E0B]"
                    onChange={(e) => setStatus(e.target.value)}
                    value={status}
                  >
                    <option value="">Choose Category</option>
                    {order.orderStatus === "Processing" && <option value="Shipped">Shipped</option>}
                    {order.orderStatus === "Shipped" && <option value="Delivered">Delivered</option>}
                  </select>

                  <button 
                    type="submit"
                    disabled={updateLoading || status === ""}
                    className="w-full bg-[#F59E0B] text-[#0F172A] font-black py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 uppercase tracking-widest text-xs"
                  >
                    {updateLoading ? "Updating..." : "Process Order"}
                  </button>
                </form>
              )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProcessOrder;