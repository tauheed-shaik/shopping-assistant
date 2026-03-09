import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Heart, User, LogOut, Search, Sparkles } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <nav className="sticky top-0 z-50 glass border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-600/30">
                                <Sparkles size={24} />
                            </div>
                            <span className="text-xl font-display font-bold gradient-text">SmartShop AI</span>
                        </Link>
                    </div>

                    <div className="hidden md:flex flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search premium products..."
                                className="pl-10 py-2 text-sm"
                            />
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {user.role === 'admin' && (
                                    <Link to="/profile" className="p-2 text-slate-600 hover:text-primary-600 transition-colors font-medium text-sm hidden md:block">
                                        Admin Dashboard
                                    </Link>
                                )}
                                {user.role === 'vendor' && (
                                    <Link to="/profile" className="p-2 text-slate-600 hover:text-primary-600 transition-colors font-medium text-sm hidden md:block">
                                        Vendor Panel
                                    </Link>
                                )}
                                <Link to="/profile?tab=wishlist" className="p-2 text-slate-600 hover:text-secondary-600 transition-colors relative">
                                    <Heart size={22} />
                                    {user.wishlist?.length > 0 && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-secondary-500 rounded-full"></span>
                                    )}
                                </Link>
                                <Link to="/cart" className="p-2 text-slate-600 hover:text-primary-600 transition-colors relative">
                                    <ShoppingCart size={22} />
                                    {user.cart?.length > 0 && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
                                    )}
                                </Link>
                                <div className="flex items-center space-x-2 pl-4 border-l border-slate-200">
                                    <Link to="/profile" className="flex items-center space-x-2 group">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200 group-hover:border-primary-500 group-hover:text-primary-600 transition-all">
                                            <User size={18} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.name}</span>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600">Login</Link>
                                <Link to="/register" className="btn-primary py-2 px-4 text-sm">Join Now</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
