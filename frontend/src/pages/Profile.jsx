import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { productAPI, userAPI, authAPI, aiAPI } from '../services/api';
import { User, Package, Heart, LayoutDashboard, Settings, ShoppingBag, Plus, Sparkles, TrendingUp, X, Save, Shield, Trash2, Mail, Lock, Wand2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';

const Profile = () => {
    const { user, logout, fetchProfile } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'dashboard');
    const [vendorProducts, setVendorProducts] = useState([]);
    const [adminUsers, setAdminUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAddProduct, setShowAddProduct] = useState(false);

    // AI Insights State
    const [isGenerating, setIsGenerating] = useState(false);

    // Admin stats
    const [adminStats, setAdminStats] = useState({ users: 0, products: 0, orders: 0 });

    const [newProduct, setNewProduct] = useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        image: ''
    });

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                confirmPassword: ''
            });
        }
        if (user?.role === 'vendor') {
            fetchVendorProducts();
        }
        if (user?.role === 'admin') {
            fetchAdminData();
        }
    }, [user, activeTab]);

    const fetchVendorProducts = async () => {
        setLoading(true);
        try {
            const { data } = await productAPI.getAll();
            setVendorProducts(data.filter(p => p.vendor?._id === user?._id));
        } catch (error) {
            // toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            const [usersRes, productsRes] = await Promise.all([
                userAPI.getAllUsers(),
                productAPI.getAll()
            ]);
            setAdminUsers(usersRes.data);
            setAdminStats({
                users: usersRes.data.length,
                products: productsRes.data.length,
                orders: 0 // Genuine count
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        try {
            const productData = {
                ...newProduct,
                price: Number(newProduct.price),
                stock: Number(newProduct.stock),
                images: [newProduct.image]
            };
            await productAPI.create(productData);
            toast.success('Product created successfully!');
            setShowAddProduct(false);
            setNewProduct({ name: '', description: '', price: '', category: '', stock: '', image: '' });
            fetchVendorProducts();
        } catch (error) {
            toast.error('Failed to create product');
        }
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userAPI.deleteUser(id);
                toast.success('User deleted');
                fetchAdminData();
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (profileData.password && profileData.password !== profileData.confirmPassword) {
            return toast.error('Passwords do not match');
        }
        try {
            await authAPI.updateProfile({
                name: profileData.name,
                email: profileData.email,
                password: profileData.password
            });
            toast.success('Profile updated successfully');
            fetchProfile();
        } catch (error) {
            toast.error('Failed to update profile');
        }
    };

    const handleRemoveFromWishlist = async (id) => {
        try {
            await userAPI.removeFromWishlist(id);
            toast.success('Removed from wishlist');
            fetchProfile();
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    const handleGenerateInsights = async () => {
        if (!newProduct.name || !newProduct.category) {
            return toast.error('Please enter a Product Name and Category first.');
        }

        setIsGenerating(true);
        try {
            const { data } = await aiAPI.generateInsights({
                name: newProduct.name,
                category: newProduct.category,
                description: newProduct.description
            });

            // formatting the AI response into the description
            const formattedDescription = `${data.improvedDescription}\n\n🏷️ Tags: ${data.tags?.join(', ')}\n🎯 Target Audience: ${data.targetAudience}`;

            setNewProduct(prev => ({
                ...prev,
                description: formattedDescription
            }));

            toast.success('✨ AI Insights Generated!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to generate insights. Try again.');
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && tab !== activeTab) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleTabChange = (id) => {
        setActiveTab(id);
        setSearchParams({ tab: id });
    };

    const SidebarItem = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => handleTabChange(id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${activeTab === id
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30'
                : 'text-slate-500 hover:bg-slate-100'
                }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm mb-6 flex flex-col items-center relative overflow-hidden">
                        <div className={`absolute top-0 w-full h-2 ${user?.role === 'admin' ? 'bg-red-500' : user?.role === 'vendor' ? 'bg-primary-500' : 'bg-secondary-500'}`}></div>
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-primary-600 mb-4 border-4 border-primary-50 relative z-10">
                            <User size={40} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-lg">{user?.name}</h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mt-2 ${user?.role === 'admin' ? 'bg-red-100 text-red-600' :
                            user?.role === 'vendor' ? 'bg-primary-100 text-primary-600' :
                                'bg-secondary-100 text-secondary-600'
                            }`}>
                            {user?.role}
                        </div>
                    </div>

                    <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />

                    {user?.role === 'user' && (
                        <>
                            <SidebarItem id="orders" icon={Package} label="Order History" />
                            <SidebarItem id="wishlist" icon={Heart} label="Wishlist" />
                        </>
                    )}

                    {user?.role === 'vendor' && (
                        <SidebarItem id="products" icon={ShoppingBag} label="Manage Products" />
                    )}

                    {user?.role === 'admin' && (
                        <SidebarItem id="admin_users" icon={Shield} label="Manage Users" />
                    )}

                    <SidebarItem id="settings" icon={Settings} label="Settings" />
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {user?.role === 'admin' ? (
                                        <>
                                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4"><User size={24} /></div>
                                                <div className="text-3xl font-bold text-slate-900">{adminStats.users}</div>
                                                <div className="text-sm text-slate-500 font-medium">Total Users</div>
                                            </div>
                                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                                <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 mb-4"><ShoppingBag size={24} /></div>
                                                <div className="text-3xl font-bold text-slate-900">{adminStats.products}</div>
                                                <div className="text-sm text-slate-500 font-medium">Total Products</div>
                                            </div>
                                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                                <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600 mb-4"><Package size={24} /></div>
                                                <div className="text-3xl font-bold text-slate-900">{adminStats.orders}</div>
                                                <div className="text-sm text-slate-500 font-medium">Total Orders</div>
                                            </div>
                                        </>
                                    ) : user?.role === 'vendor' ? (
                                        <>
                                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-4"><ShoppingBag size={24} /></div>
                                                <div className="text-3xl font-bold text-slate-900">{vendorProducts.length}</div>
                                                <div className="text-sm text-slate-500 font-medium">My Active Products</div>
                                            </div>
                                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                                <div className="w-12 h-12 rounded-2xl bg-secondary-50 flex items-center justify-center text-secondary-600 mb-4"><TrendingUp size={24} /></div>
                                                <div className="text-3xl font-bold text-slate-900">0</div>
                                                <div className="text-sm text-slate-500 font-medium">Total Sales</div>
                                            </div>
                                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600 mb-4"><User size={24} /></div>
                                                <div className="text-3xl font-bold text-slate-900">0</div>
                                                <div className="text-sm text-slate-500 font-medium">Customer Reviews</div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* User Stats */}
                                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                                <div className="w-12 h-12 rounded-2xl bg-secondary-50 flex items-center justify-center text-secondary-600 mb-4"><Heart size={24} /></div>
                                                <div className="text-3xl font-bold text-slate-900">{user?.wishlist?.filter(item => typeof item === 'object').length || 0}</div>
                                                <div className="text-sm text-slate-500 font-medium">Saved Items</div>
                                            </div>
                                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                                                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600 mb-4"><Package size={24} /></div>
                                                <div className="text-3xl font-bold text-slate-900">0</div>
                                                <div className="text-sm text-slate-500 font-medium">Orders Placed</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">Welcome back, {user?.name}!</h3>
                                    <p className="text-slate-500">Manage your account and view your activity here.</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Wishlist Tab */}
                        {activeTab === 'wishlist' && (
                            <motion.div key="wishlist" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 font-display">My Wishlist</h2>
                                {(!user?.wishlist || user.wishlist.length === 0) ? (
                                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                                        <Heart size={40} className="mx-auto text-slate-300 mb-4" />
                                        <p className="text-slate-500">Your wishlist is empty.</p>
                                        <Link to="/products" className="text-primary-600 font-bold mt-2 inline-block hover:underline">Browse Products</Link>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {user.wishlist.map(product => (
                                            /* Handle both populated object and ID string - fallback if not populated yet */
                                            product && typeof product === 'object' ? (
                                                <div key={product._id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm relative group">
                                                    <button
                                                        onClick={() => handleRemoveFromWishlist(product._id)}
                                                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full text-slate-400 hover:text-red-500 transition-colors z-10"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                    <Link to={`/product/${product._id}`}>
                                                        <img src={product.images?.[0]} alt={product.name} className="w-full h-48 object-cover rounded-xl mb-4" />
                                                        <h3 className="font-bold text-slate-900 mb-1">{product.name}</h3>
                                                        <p className="text-primary-600 font-bold">${product.price}</p>
                                                    </Link>
                                                </div>
                                            ) : null
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Order History Tab */}
                        {activeTab === 'orders' && (
                            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Order History</h2>
                                <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
                                    <Package size={40} className="mx-auto text-slate-300 mb-4" />
                                    <p className="text-slate-500">You haven't placed any orders yet.</p>
                                </div>
                            </motion.div>
                        )}

                        {/* Settings Tab */}
                        {activeTab === 'settings' && (
                            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Settings</h2>
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm max-w-2xl">
                                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="text"
                                                    value={profileData.name}
                                                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                <input
                                                    type="email"
                                                    value={profileData.email}
                                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="border-t border-slate-100 pt-6 mt-6">
                                            <h3 className="font-bold text-slate-900 mb-4">Change Password</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                        <input
                                                            type="password"
                                                            placeholder="Leave blank to keep current"
                                                            value={profileData.password}
                                                            onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Confirm New Password</label>
                                                    <div className="relative">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                        <input
                                                            type="password"
                                                            placeholder="Confirm new password"
                                                            value={profileData.confirmPassword}
                                                            onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                                                            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pt-4 flex justify-end">
                                            <button type="submit" className="btn-primary px-6 py-2 flex items-center">
                                                <Save size={18} className="mr-2" />
                                                Save Changes
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'products' && user?.role === 'vendor' && (
                            <motion.div
                                key="products"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-bold text-slate-900">Manage Your Products</h2>
                                    <button
                                        onClick={() => setShowAddProduct(true)}
                                        className="btn-primary py-2 px-4 text-sm flex items-center"
                                    >
                                        <Plus size={18} className="mr-2" />
                                        Add Product
                                    </button>
                                </div>

                                <div className="bg-white overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 text-sm font-bold text-slate-600">Product</th>
                                                <th className="px-6 py-4 text-sm font-bold text-slate-600">Price</th>
                                                <th className="px-6 py-4 text-sm font-bold text-slate-600">Stock</th>
                                                <th className="px-6 py-4 text-sm font-bold text-slate-600">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {vendorProducts.map((p) => (
                                                <tr key={p._id}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-10 h-10 rounded-lg bg-slate-50 overflow-hidden">
                                                                <img src={p.images?.[0]} className="w-full h-full object-cover" alt={p.name} />
                                                            </div>
                                                            <span className="font-medium text-slate-800">{p.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">${p.price}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${p.stock > 10 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                                            {p.stock} Units
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button className="text-primary-600 font-bold text-xs hover:underline">Edit</button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {vendorProducts.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-400">No products found. Add your first product to start selling!</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {/* Admin Users Tab */}
                        {activeTab === 'admin_users' && user?.role === 'admin' && (
                            <motion.div
                                key="admin_users"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Manage Users</h2>
                                <div className="bg-white overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
                                    <table className="w-full text-left">
                                        <thead className="bg-slate-50 border-b border-slate-100">
                                            <tr>
                                                <th className="px-6 py-4 text-sm font-bold text-slate-600">Name</th>
                                                <th className="px-6 py-4 text-sm font-bold text-slate-600">Email</th>
                                                <th className="px-6 py-4 text-sm font-bold text-slate-600">Role</th>
                                                <th className="px-6 py-4 text-sm font-bold text-slate-600">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {adminUsers.filter(u => u._id !== user._id).map((u) => (
                                                <tr key={u._id}>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
                                                                <User size={16} />
                                                            </div>
                                                            <span className="font-medium text-slate-800">{u.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600">{u.email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-red-100 text-red-600' :
                                                            u.role === 'vendor' ? 'bg-primary-100 text-primary-600' :
                                                                'bg-secondary-100 text-secondary-600'
                                                            }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <button
                                                            onClick={() => handleDeleteUser(u._id)}
                                                            className="text-slate-400 hover:text-red-500 transition-colors"
                                                            title="Delete User"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Add Product Modal */}
            <AnimatePresence>
                {showAddProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center p-6 border-b border-slate-100">
                                <h3 className="text-xl font-bold text-slate-900">Add New Product</h3>
                                <button onClick={() => setShowAddProduct(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={24} />
                                </button>
                            </div>
                            <form onSubmit={handleCreateProduct} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                        value={newProduct.name}
                                        onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                            value={newProduct.category}
                                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            type="button"
                                            onClick={handleGenerateInsights}
                                            disabled={isGenerating}
                                            className="w-full py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:shadow-violet-600/20 font-medium flex items-center justify-center disabled:opacity-70 transition-all"
                                        >
                                            {isGenerating ? (
                                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>Thinking...</>
                                            ) : (
                                                <><Wand2 size={16} className="mr-2" /> AI Create</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                                    <textarea
                                        required
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                        rows="4"
                                        placeholder="Describe your product manually or use AI Create..."
                                        value={newProduct.description}
                                        onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Price ($)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                            value={newProduct.price}
                                            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                            value={newProduct.stock}
                                            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
                                    <input
                                        type="url"
                                        required
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none"
                                        value={newProduct.image}
                                        onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                                    />
                                </div>
                                <div className="pt-4 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowAddProduct(false)}
                                        className="px-6 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-medium"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 font-medium flex items-center shadow-lg shadow-primary-600/20"
                                    >
                                        <Save size={18} className="mr-2" />
                                        Save Product
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Profile;
