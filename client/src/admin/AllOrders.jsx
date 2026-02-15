import React, { useEffect, useState } from "react";
import api from "../../utils/api.js"; // Axios instance use kiya
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersCount, setOrdersCount] = useState(0);
  const [resultPerPage, setResultPerPage] = useState(10);

  const getAllOrders = async (page = 1) => {
    try {
      setLoading(true);
      // Localhost aur withCredentials nikaal kar api instance use kiya
      const { data } = await api.get(`/api/order/admin/orders?page=${page}`);
      
      if (data.success) {
        setOrders(data.orders);
        setOrdersCount(data.ordersCount);
        setResultPerPage(data.resultPerPage);
        setLoading(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      setLoading(false);
    }
  };

  // --- MODERN DELETE HANDLER WITH TOAST CONFIRMATION ---
  const deleteOrderHandler = (id) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-2xl rounded-2xl pointer-events-auto flex flex-col p-6 border border-[#94A3B8]/20`}>
        <div className="flex-1">
          <p className="text-sm font-black text-[#0F172A] uppercase tracking-widest mb-1">Confirm Deletion</p>
          <p className="text-xs font-bold text-[#94A3B8]">Are you sure you want to delete this order permanently?</p>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              executeDelete(id);
              toast.dismiss(t.id);
            }}
            className="flex-1 bg-[#EF4444] text-white py-2 rounded-xl text-xs font-black uppercase hover:bg-red-700 transition-all"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="flex-1 bg-[#F8FAFC] text-[#0F172A] py-2 rounded-xl text-xs font-black uppercase border border-[#94A3B8]/20 hover:bg-gray-100 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const executeDelete = async (id) => {
    try {
      // API call using the custom instance
      const { data } = await api.delete(`/api/order/admin/order/${id}`);

      if (data.success) {
        toast.success("Order Deleted Successfully");
        setOrders(orders.filter((order) => order._id !== id));
        setOrdersCount((prev) => prev - 1);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    getAllOrders(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(ordersCount / resultPerPage);

  return (
    <div className="p-4 sm:p-8 bg-[#F8FAFC] min-h-screen font-sans text-[#020617]">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-[#0F172A] tracking-tighter uppercase">All Orders</h1>
          <p className="text-[#94A3B8] text-sm font-semibold">Manage and track all customer orders</p>
        </div>
        <div className="bg-[#0F172A] text-white px-6 py-3 rounded-2xl font-bold shadow-lg">
          Total Orders: {ordersCount}
        </div>
      </div>

      <div className="bg-white rounded-[32px] shadow-sm border border-[#94A3B8]/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0F172A] text-white uppercase text-[10px] tracking-widest">
              <tr>
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-center">Items Qty</th>
                <th className="px-6 py-5">Amount</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#94A3B8]/10 text-sm">
              {loading ? (
                <tr><td colSpan="5" className="text-center py-10 font-bold text-[#94A3B8]">Loading...</td></tr>
              ) : (
                orders.map((order) => {
                  const totalQty = order.orderItems.reduce((acc, item) => acc + item.quantity, 0);

                  return (
                    <tr key={order._id} className="hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-6 py-4 font-mono text-[#94A3B8] text-xs">{order._id}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                          order.orderStatus === "Delivered" ? "bg-[#10B981]/10 text-[#10B981]" : "bg-[#F59E0B]/10 text-[#F59E0B]"
                        }`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#0F172A] text-center">{totalQty}</td>
                      <td className="px-6 py-4 font-black text-[#10B981]">Rs {order.totalPrice}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-4">
                          <Link to={`/admin-sidebar/order/${order._id}`} className="text-[#0F172A] hover:text-[#F59E0B] font-black uppercase text-xs transition-all">
                            Details ➔
                          </Link>
                          <button 
                            onClick={() => deleteOrderHandler(order._id)}
                            className="text-[#EF4444] hover:scale-110 transition-all p-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-8 py-6 bg-[#F8FAFC]/50 border-t border-[#94A3B8]/10">
          <p className="text-xs font-bold text-[#94A3B8] uppercase italic">
            Page {currentPage} of {totalPages || 1}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-[#94A3B8]/20 text-[#0F172A] disabled:opacity-30 transition-all hover:bg-[#0F172A] hover:text-white"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCurrentPage((prev) => (currentPage < totalPages ? prev + 1 : prev))}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-xl bg-white border border-[#94A3B8]/20 text-[#0F172A] disabled:opacity-30 transition-all hover:bg-[#0F172A] hover:text-white"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;