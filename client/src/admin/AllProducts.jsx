import React, { useEffect, useState } from 'react';
// axios ki jagah apna banaya hua api instance import kiya
import api from '../utils/api.js'; 
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react'; 
import { toast } from 'react-hot-toast';

const AllProducts = () => {
    const [products, setProducts] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    // --- PAGINATION STATES ---
    const [currentPage, setCurrentPage] = useState(1);
    const [productsCount, setProductsCount] = useState(0);
    const [resultPerPage, setResultPerPage] = useState(8);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            // localhost hata kar sirf endpoint likha, api instance base URL khud lagaye ga
            const { data } = await api.get(`/api/product/products?page=${currentPage}`); 
            
            setProducts(data.products || []); 
            setProductsCount(data.productsCount || 0);
            setResultPerPage(data.resultPerPage || 8);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load products");
            setLoading(false);
        }
    };

    // Delete Handler
    const deleteHandler = async (id) => {
        toast((t) => (
            <span>
                Are you sure you want to delete this product?
                <div className="mt-2 flex gap-2">
                    <button 
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                // delete request ke liye bhi api instance use kiya
                                const { data } = await api.delete(`/api/product/admin/product/${id}`);
                                
                                if (data.success) {
                                    toast.success("Product Deleted Successfully!");
                                    fetchProducts(); 
                                }
                            } catch (error) {
                                const errorMsg = error.response?.data?.message || "Error deleting product";
                                toast.error(errorMsg);
                            }
                        }}
                        className="bg-[#EF4444] text-white px-3 py-1 rounded-md text-xs font-bold"
                    >
                        Delete
                    </button>
                    <button onClick={() => toast.dismiss(t.id)} className="bg-[#94A3B8] text-white px-3 py-1 rounded-md text-xs font-bold">
                        Cancel
                    </button>
                </div>
            </span>
        ), { duration: 5000 });
    };

    // --- PAGINATION LOGIC ---
    const totalPages = Math.ceil(productsCount / resultPerPage);

    useEffect(() => {
        fetchProducts();
    }, [currentPage]); 

    if (loading) return <div className="p-10 text-center font-bold text-[#0F172A]">Loading Products...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#94A3B8]/20 overflow-hidden">
            <div className="p-6 border-b border-[#94A3B8]/10 flex justify-between items-center">
                <h2 className="text-xl font-black text-[#020617]">
                    ALL PRODUCTS ({productsCount})
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F8FAFC] text-[#0F172A] uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Image</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Stock</th>
                            <th className="px-6 py-4">Price</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#94A3B8]/10">
                        {products && products.length > 0 ? (
                            products.map((item) => (
                                <tr key={item._id} className="hover:bg-[#F8FAFC] transition-colors">
                                    <td className="px-6 py-4">
                                        <img 
                                            src={item.images && item.images[0]?.url} 
                                            alt={item.name} 
                                            className="w-12 h-12 rounded-lg object-cover border" 
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-[#020617] max-w-[200px] truncate">
                                        {item.name}
                                    </td>
                                    <td className={`px-6 py-4 font-bold ${item.stock < 10 ? 'text-[#EF4444]' : 'text-[#10B981]'}`}>
                                        {item.stock}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#0F172A]">Rs {item.price}</td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => deleteHandler(item._id)}
                                            className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-[#94A3B8]">No Products Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* --- PAGINATION UI --- */}
            {productsCount > resultPerPage && (
                <div className="p-6 border-t border-[#94A3B8]/10 flex justify-center items-center gap-2">
                    <button 
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronLeft size={20} />
                    </button>

                    <div className="flex gap-1">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`w-10 h-10 rounded-lg font-bold transition-all text-sm ${
                                    currentPage === index + 1 
                                    ? 'bg-[#0F172A] text-white shadow-md' 
                                    : 'bg-white text-[#0F172A] border border-[#94A3B8]/20 hover:bg-gray-50'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>

                    <button 
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="p-2 border rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllProducts;