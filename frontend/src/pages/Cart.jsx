import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
    const { user, fetchProfile } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile().finally(() => setLoading(false));
    }, []);

    const removeItem = async (id) => {
        try {
            await userAPI.removeFromCart(id);
            fetchProfile();
            toast.success('Removed from cart');
        } catch (error) {
            toast.error('Failed to remove item');
        }
    };

    const validCartItems = user?.cart?.filter(item => item.product && item.product._id) || [];

    const subtotal = validCartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
    const shipping = subtotal > 500 ? 0 : (subtotal > 0 ? 25 : 0);
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-display font-bold text-slate-900 mb-10">Your Shopping Cart</h1>

            {validCartItems.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full text-slate-300 mb-6">
                        <ShoppingBag size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Cart is empty</h2>
                    <p className="text-slate-500 mb-8">Looks like you haven't added anything to your cart yet.</p>
                    <Link to="/products" className="btn-primary inline-flex items-center">
                        Start Shopping <ArrowRight className="ml-2" size={18} />
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence>
                            {validCartItems.map((item) => (
                                <motion.div
                                    key={item.product._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center space-x-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                                        <img
                                            src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <Link to={`/product/${item.product._id}`} className="font-bold text-lg text-slate-800 hover:text-primary-600 transition-colors">
                                                {item.product.name}
                                            </Link>
                                            <span className="font-bold text-slate-900">${(item.product.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mb-4">{item.product.category}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm">
                                                <span className="text-slate-500">Qty: {item.quantity}</span>
                                                <span className="text-slate-300">|</span>
                                                <span className="text-slate-500">${item.product.price} / unit</span>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.product._id)}
                                                className="text-slate-400 hover:text-red-500 transition-colors p-2"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold text-slate-900 mb-6 font-display">Order Summary</h2>

                            <div className="space-y-4 mb-6 pb-6 border-b border-slate-100">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Shipping</span>
                                    <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-slate-600">
                                    <span>Estimated Tax (8%)</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-baseline mb-8">
                                <span className="text-lg font-bold text-slate-900">Total</span>
                                <span className="text-3xl font-bold gradient-text">${total.toFixed(2)}</span>
                            </div>

                            <button className="btn-primary w-full py-4 flex items-center justify-center font-bold mb-6">
                                Proceed to Checkout
                                <ArrowRight className="ml-2" size={20} />
                            </button>

                            <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                <ShieldCheck size={14} />
                                <span className="text-green-600">Payment integration coming soon</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
