import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaSearch, FaPlus, FaInbox, FaUser } from 'react-icons/fa';

import { useAuth } from '../context/AuthContext';

const BottomNav = () => {
    const location = useLocation();
    const { user } = useAuth();
    const isActive = (path) => location.pathname === path;

    const navItems = [
        ...(user?.role !== 'partner' ? [{ icon: FaHome, label: 'Home', path: '/' }] : []),
        // { icon: FaSearch, label: 'Discover', path: '/discover' }, // Removed as requested
        ...(user?.role === 'partner' ? [{ icon: FaPlus, label: 'Upload', path: '/upload', isUpload: true }] : []),
        // Inbox removed for user as requested
        { icon: FaUser, label: 'Profile', path: user?.role === 'partner' ? '/partner/profile' : '/profile' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 h-16 flex justify-around items-center z-50 text-white">
            {navItems.map((item, index) => (
                <Link
                    key={index}
                    to={item.path}
                    className={`flex flex-col items-center justify-center w-full h-full ${isActive(item.path) ? 'text-white' : 'text-gray-500'}`}
                >
                    {item.isUpload ? (
                        <div className="bg-white text-black rounded-md px-3 py-1 relative">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-l-md -z-10 transform -translate-x-1"></div>
                            <div className="absolute right-0 top-0 bottom-0 w-1 bg-pink-600 rounded-r-md -z-10 transform translate-x-1"></div>
                            <FaPlus className="text-lg" />
                        </div>
                    ) : (
                        <>
                            <item.icon className={`text-2xl mb-1 ${isActive(item.path) ? 'opacity-100' : 'opacity-60'}`} />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </>
                    )}
                </Link>
            ))}
        </div>
    );
};

export default BottomNav;
