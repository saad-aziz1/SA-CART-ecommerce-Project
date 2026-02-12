import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, User } from 'lucide-react'; 
import { toast } from 'react-hot-toast';

const AllUsers = () => {
    // 1: Users state initialize
    const [users, setUsers] = useState([]); 
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            // Backend se users mangwana (withCredentials token ke liye zaroori hy)
            const { data } = await axios.get('http://localhost:3000/api/user/admin/users', { withCredentials: true }); 
            setUsers(data.users || []); 
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load users");
            setLoading(false);
        }
    };

    // --- Role Update Handler ---
    const updateRoleHandler = async (id, newRole) => {
        try {
            const { data } = await axios.put(
                `http://localhost:3000/api/user/admin/user/${id}`,
                { role: newRole },
                { withCredentials: true }
            );

            if (data.success) {
                toast.success("User Role Updated!");
                fetchUsers(); // List refresh karna taake naya role table mein nazar aaye
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error updating role");
        }
    };

    // Delete User Handler
    const deleteHandler = async (id) => {
        toast((t) => (
            <span>
                Are you sure you want to delete this user?
                <div className="mt-2 flex gap-2">
                    <button 
                        onClick={async () => {
                            toast.dismiss(t.id);
                            try {
                                const { data } = await axios.delete(
                                    `http://localhost:3000/api/user/admin/user/${id}`, 
                                    { withCredentials: true }
                                );
                                if (data.success) {
                                    toast.success("User Deleted Successfully!");
                                    fetchUsers(); 
                                }
                            } catch (error) {
                                const errorMsg = error.response?.data?.message || "Error deleting user";
                                toast.error(errorMsg);
                            }
                        }}
                        className="bg-[#EF4444] text-white px-3 py-1 rounded-md text-xs font-bold"
                    >
                        Delete
                    </button>
                    <button 
                        onClick={() => toast.dismiss(t.id)}
                        className="bg-[#94A3B8] text-white px-3 py-1 rounded-md text-xs font-bold"
                    >
                        Cancel
                    </button>
                </div>
            </span>
        ), { duration: 5000 });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    if (loading) return <div className="p-10 text-center font-bold text-[#0F172A]">Loading Users...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-[#94A3B8]/20 overflow-hidden">
            <div className="p-6 border-b border-[#94A3B8]/10 flex justify-between items-center">
                <h2 className="text-xl font-black text-[#020617]">
                    ALL USERS ({users?.length || 0})
                </h2>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#F8FAFC] text-[#0F172A] uppercase text-xs font-bold">
                        <tr>
                            <th className="px-6 py-4">Avatar</th>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Email</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#94A3B8]/10">
                        {users && users.length > 0 ? (
                            users.map((user) => (
                                <tr key={user._id} className="hover:bg-[#F8FAFC] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="w-10 h-10 rounded-full bg-[#0F172A]/10 flex items-center justify-center text-[#0F172A]">
                                            <User size={20} />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-[#020617]">
                                        {user.name}
                                    </td>
                                    <td className="px-6 py-4 text-[#94A3B8]">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Dropdown for Role Update */}
                                        <select
                                            value={user.role}
                                            onChange={(e) => updateRoleHandler(user._id, e.target.value)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase outline-none cursor-pointer border
                                                ${user.role === 'admin' 
                                                    ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20' 
                                                    : 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20'}`}
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => deleteHandler(user._id)}
                                            className="p-2 text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="px-6 py-10 text-center text-[#94A3B8]">No Users Found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllUsers;