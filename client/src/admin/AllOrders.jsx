import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersCount, setOrdersCount] = useState(0);
  const [resultPerPage, setResultPerPage] = useState(10);

  const getAllOrders = async (page = 1) => {
    try {
      setLoading(true);
      const config = { withCredentials: true };
      const { data } = await axios.get(`http://localhost:3000/api/order/admin/orders?page=${page}`, config);
      
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

  useEffect(() => {
    getAllOrders(currentPage);
  }, [currentPage]);

  const totalPages = Math.ceil(ordersCount / resultPerPage);

  return (
    <div className="p-4 sm:p-8 bg-[#F8FAFC] min-h-screen font-sans">
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
                  // Har order ki total quantity calculate karna
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
                        <Link to={`/admin-sidebar/order/${order._id}`} className="text-[#0F172A] hover:text-[#F59E0B] font-black uppercase text-xs">
                          Details ➔
                        </Link>
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