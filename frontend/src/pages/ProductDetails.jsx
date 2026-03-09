import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productAPI, userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Heart, Shield, Truck, RotateCcw, Star, Plus, Minus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const ProductDetails = () => {
    const { id } = useParams();
    const { user, fetchProfile } = useAuth();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await productAPI.getById(id);
                setProduct(data);
            } catch (error) {
                toast.error('Product not found');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        if (!user) return toast.error('Please login to add items to cart');
        try {
            await userAPI.addToCart(product._id, quantity);
            toast.success('Added to cart!');
            fetchProfile(); // Update header count
        } catch (error) {
            toast.error('Failed to add to cart');
        }
    };

    const addToWishlist = async () => {
        if (!user) return toast.error('Please login to add items to wishlist');
        try {
            if (isWishlisted) {
                await userAPI.removeFromWishlist(product._id);
                toast.success('Removed from wishlist');
            } else {
                await userAPI.addToWishlist(product._id);
                toast.success('Added to wishlist!');
            }
            fetchProfile(); // Update header count and local state
        } catch (error) {
            toast.error('Failed to update wishlist');
        }
    };

    const isWishlisted = user?.wishlist?.some(item => {
        const itemId = typeof item === 'object' ? item._id : item;
        return itemId === product?._id;
    });

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    if (!product) return <div className="text-center py-20">Product not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* Image Gallery */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="space-y-4"
                >
                    <div className="aspect-square rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-xl shadow-slate-200/50">
                        <img
                            src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                        {product.images?.slice(0, 4).map((img, i) => (
                            <div key={i} className="aspect-square rounded-xl overflow-hidden border border-slate-200 hover:border-primary-500 cursor-pointer transition-colors">
                                <img src={img} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Product Info */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex flex-col"
                >
                    <div className="mb-6">
                        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary-50 text-primary-600 text-xs font-bold uppercase tracking-wider rounded-lg mb-4">
                            <Sparkles size={14} />
                            <span>{product.category}</span>
                        </div>
                        <h1 className="text-4xl font-display font-bold text-slate-900 mb-2">{product.name}</h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={18} fill={i < Math.round(product.ratings || 4.5) ? "currentColor" : "none"} />
                                ))}
                                <span className="ml-2 text-sm font-semibold text-slate-700">{product.ratings || 4.5} (120 reviews)</span>
                            </div>
                            <span className="text-slate-300">|</span>
                            <span className="text-sm text-green-600 font-medium">In Stock ({product.stock})</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex items-baseline space-x-3 mb-2">
                            <span className="text-4xl font-bold text-slate-900">${product.price}</span>
                            {product.comparePrice && (
                                <span className="text-xl text-slate-400 line-through">${product.comparePrice}</span>
                            )}
                        </div>
                        <p className="text-slate-600 leading-relaxed">
                            {product.description}
                        </p>
                    </div>

                    <div className="space-y-6 mb-10">
                        <div className="flex items-center space-x-6">
                            <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors"
                                >
                                    <Minus size={18} />
                                </button>
                                <span className="w-12 text-center font-bold text-slate-900">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white rounded-lg transition-colors"
                                >
                                    <Plus size={18} />
                                </button>
                            </div>

                            <button
                                onClick={addToCart}
                                className="flex-1 btn-primary flex items-center justify-center py-4"
                            >
                                <ShoppingCart className="mr-2" size={20} />
                                Add to Cart
                            </button>

                            <button
                                onClick={addToWishlist}
                                className={`p-4 rounded-xl border transition-all ${isWishlisted
                                    ? 'border-red-200 bg-red-50 text-red-500 hover:bg-red-100'
                                    : 'border-slate-200 text-slate-400 hover:text-secondary-500 hover:border-secondary-200 hover:bg-secondary-50'
                                    }`}
                            >
                                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-8 border-t border-slate-100">
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 mb-2">
                                <Truck size={20} />
                            </div>
                            <span className="text-xs font-bold text-slate-900">Free Shipping</span>
                            <span className="text-[10px] text-slate-500">Orders over $50</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 mb-2">
                                <Shield size={20} />
                            </div>
                            <span className="text-xs font-bold text-slate-900">2 Year Warranty</span>
                            <span className="text-[10px] text-slate-500">Secure protection</span>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 mb-2">
                                <RotateCcw size={20} />
                            </div>
                            <span className="text-xs font-bold text-slate-900">30 Day Returns</span>
                            <span className="text-[10px] text-slate-500">Easy exchange</span>
                        </div>
                    </div>

                    {product.aiDescription && (
                        <div className="mt-10 p-6 bg-primary-50/50 rounded-2xl border border-primary-100">
                            <div className="flex items-center space-x-2 text-primary-600 font-bold text-sm mb-3">
                                <Sparkles size={16} />
                                <span>AI INSIGHT</span>
                            </div>
                            <p className="text-sm text-slate-700 italic leading-relaxed">
                                "{product.aiDescription}"
                            </p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetails;
