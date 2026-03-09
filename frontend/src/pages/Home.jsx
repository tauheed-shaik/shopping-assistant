import React, { useEffect, useState } from 'react';
import { aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Sparkles, TrendingUp, ArrowRight, Star, Brain, Cpu, Zap, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Home = () => {
    const [trending, setTrending] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const trendingRes = await aiAPI.getTrending();
                setTrending(trendingRes.data);

                if (user) {
                    const recRes = await aiAPI.getRecommendations();
                    setRecommendations(recRes.data);
                }
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const scrollToAI = () => {
        const element = document.getElementById('ai-works');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-slate-900 transition-all">
                            <ArrowRight size={16} />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <section className="relative min-h-[700px] flex items-center overflow-hidden bg-slate-900 pt-20">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80"
                        alt="Hero Background"
                        className="w-full h-full object-cover opacity-20"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/50"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary-500/10 backdrop-blur-md border border-primary-500/20 rounded-full text-primary-400 text-sm font-semibold mb-8">
                                <Sparkles size={16} />
                                <span>AI-Powered Personalization v2.0</span>
                            </div>
                            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-[1.1]">
                                Shopping Reimagined with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Intelligence.</span>
                            </h1>
                            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-xl">
                                Experience a personalized shopping journey driven by advanced AI. We learn your preferences to deliver products you'll truly love.
                            </p>
                            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                                <Link to="/products" className="btn-primary flex items-center justify-center text-lg px-8 py-4">
                                    Explore Products
                                    <ShoppingCart className="ml-2" size={20} />
                                </Link>
                                <button
                                    onClick={scrollToAI}
                                    className="px-8 py-4 border border-slate-700 text-white rounded-xl hover:bg-white/10 flex items-center justify-center font-bold transition-all text-lg"
                                >
                                    Learn How AI Works
                                    <Brain className="ml-2" size={20} />
                                </button>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="hidden lg:block relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary-500/20 to-secondary-500/20 rounded-full blur-3xl w-full h-full animate-pulse-slow"></div>
                            <img
                                src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2670&auto=format&fit=crop"
                                alt="Shopping Experience"
                                className="relative rounded-3xl shadow-2xl border border-white/10 transform rotate-3 hover:rotate-0 transition-transform duration-500"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 space-y-32">

                {/* Recommendation Section */}
                {user && recommendations.length > 0 && (
                    <section>
                        <div className="flex items-end justify-between mb-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 flex items-center mb-4">
                                    <Sparkles className="mr-3 text-primary-500" size={32} />
                                    Picked Just for You
                                </h2>
                                <p className="text-xl text-slate-500">Curated specifically based on your unique taste.</p>
                            </div>
                            <Link to="/products" className="text-primary-600 font-bold hover:text-primary-700 flex items-center group">
                                View All Products <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" size={20} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {recommendations.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    </section>
                )}

                {/* Trending Section */}
                <section>
                    <div className="flex items-end justify-between mb-12">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 flex items-center mb-4">
                                <TrendingUp className="mr-3 text-secondary-500" size={32} />
                                Trending Now
                            </h2>
                            <p className="text-xl text-slate-500">See what the community is loving right now.</p>
                        </div>
                        <Link to="/products" className="text-secondary-600 font-bold hover:text-secondary-700 flex items-center group">
                            Explore All <ArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" size={20} />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="aspect-[4/5] bg-slate-100 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {/* Show only first 4 if available, or all */}
                            {trending.slice(0, 4).map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </section>

                {/* AI Features Section (Target for Scroll) */}
                <section id="ai-works" className="bg-slate-900 rounded-[3rem] p-12 md:p-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-slate-800 to-transparent"></div>
                    <div className="relative z-10 max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">How Our AI Works</h2>
                        <p className="text-xl text-slate-400">We use state-of-the-art machine learning models to analyze your interactions and preferences in real-time.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 hover:border-primary-500/50 transition-colors group">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-primary-400 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                                <Brain size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Behavioral Analysis</h3>
                            <p className="text-slate-400">Our system learns from what you view, like, and add to your cart to understand your unique style.</p>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 hover:border-secondary-500/50 transition-colors group">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-secondary-400 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                                <Cpu size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Smart Matching</h3>
                            <p className="text-slate-400">We compare your profile with thousands of products to find the perfect matches instantly.</p>
                        </div>
                        <div className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 hover:border-green-500/50 transition-colors group">
                            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-green-400 mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-black/20">
                                <Zap size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Real-time Adaptation</h3>
                            <p className="text-slate-400">Recommendations update instantly as your preferences evolve, ensuring you always see relevant items.</p>
                        </div>
                    </div>
                </section>

                <section className="text-center py-20">
                    <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Ready to start your personalized journey?</h2>
                    <Link to="/products" className="btn-primary inline-flex items-center text-lg px-10 py-4 shadow-xl shadow-primary-600/20">
                        Start Shopping Now
                        <ArrowRight className="ml-2" size={20} />
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default Home;
