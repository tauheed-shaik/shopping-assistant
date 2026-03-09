import React, { useEffect, useState } from 'react';
import { productAPI } from '../services/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await productAPI.getAll();
                setProducts(data);
            } catch (error) {
                console.error('Error fetching products:', error);
                toast.error('Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const ProductCard = ({ product }) => (
        <motion.div
            whileHover={{ y: -5 }}
            className="group bg-white rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl hover:shadow-primary-600/10 transition-all duration-300"
        >
            <Link to={`/product/${product._id}`}>
                <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
                    <img
                        src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-slate-900 rounded-full shadow-sm">
                            {product.category}
                        </span>
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-900 line-clamp-1 text-lg group-hover:text-primary-600 transition-colors">
                            {product.name}
                        </h3>
                        <div className="flex items-center text-amber-400 bg-amber-50 px-2 py-1 rounded-lg">
                            <Star size={12} fill="currentColor" />
                            <span className="ml-1 text-xs font-bold text-amber-700">{product.ratings || 4.5}</span>
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10 leading-relaxed">
                        {product.description}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-50 pt-4">
                        <span className="text-xl font-display font-bold text-slate-900">${product.price}</span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-600 group-hover:text-white transition-all transform group-hover:rotate-[-45deg]">
                            <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );

    return (
        <div className="min-h-screen pb-20 pt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-slate-900">Explore Products</h1>
                        <p className="text-slate-500 mt-2">Discover our curated collection of premium items.</p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                            <div key={i} className="aspect-[3/4] bg-slate-100 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <>
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                                {filteredProducts.map(product => (
                                    <ProductCard key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-full text-slate-300 mb-6">
                                    <ShoppingBag size={40} />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">No products found</h2>
                                <p className="text-slate-500">Try adjusting your search terms.</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Products;
