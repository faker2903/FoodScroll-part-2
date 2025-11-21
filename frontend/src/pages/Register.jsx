import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaStore } from 'react-icons/fa';

const Register = () => {
    const [role, setRole] = useState('user');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        shopName: '',
        shopAddress: '',
        profilePic: ''
    });
    const { registerUser, registerPartner } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        let result;
        if (role === 'user') {
            result = await registerUser({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
        } else {
            result = await registerPartner(formData);
        }

        if (result.success) {
            navigate('/login');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white py-8 px-4 overflow-y-auto relative">
            {/* Background Image */}
            <div
                className="fixed inset-0 z-0"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(8px) brightness(0.4)'
                }}
            ></div>

            {/* Decorative background elements */}
            <div className="fixed top-[-10%] left-[-10%] w-96 h-96 bg-pink-600/30 rounded-full blur-3xl pointer-events-none z-0 mix-blend-screen"></div>
            <div className="fixed bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none z-0 mix-blend-screen"></div>

            <div className="w-full max-w-md pb-28 relative z-10">
                <div className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/10">
                    <h2 className="text-3xl font-bold mb-2 text-center tracking-tight">Create Account</h2>
                    <p className="text-gray-400 text-center mb-8">Join the food revolution</p>

                    {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-sm mb-6 text-center backdrop-blur-sm">{error}</div>}

                    <div className="flex bg-black/40 p-1 rounded-xl mb-6 border border-white/5">
                        <button
                            className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${role === 'user' ? 'bg-gray-700/50 text-white shadow-lg border border-white/10' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setRole('user')}
                        >
                            <FaUser className="mr-2" /> User
                        </button>
                        <button
                            className={`flex-1 flex items-center justify-center py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${role === 'partner' ? 'bg-gray-700/50 text-white shadow-lg border border-white/10' : 'text-gray-400 hover:text-white'}`}
                            onClick={() => setRole('partner')}
                        >
                            <FaStore className="mr-2" /> Partner
                        </button>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="w-full bg-black/40 text-white rounded-lg border border-white/10 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 py-3 px-4 outline-none transition-all placeholder-gray-500"
                                placeholder="Enter full name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full bg-black/40 text-white rounded-lg border border-white/10 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 py-3 px-4 outline-none transition-all placeholder-gray-500"
                                placeholder="Enter email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full bg-black/40 text-white rounded-lg border border-white/10 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 py-3 px-4 outline-none transition-all placeholder-gray-500"
                                placeholder="Create a password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {role === 'partner' && (
                            <>
                                <div className="p-4 bg-black/40 rounded-xl border border-white/10 space-y-4 backdrop-blur-sm">
                                    <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Shop Details</h3>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">Shop Name</label>
                                        <input
                                            name="shopName"
                                            type="text"
                                            required
                                            className="w-full bg-black/60 text-white rounded-lg border border-white/10 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 py-2 px-3 outline-none transition-all placeholder-gray-500"
                                            placeholder="e.g. Burger King"
                                            value={formData.shopName}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">Address</label>
                                        <input
                                            name="shopAddress"
                                            type="text"
                                            required
                                            className="w-full bg-black/60 text-white rounded-lg border border-white/10 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 py-2 px-3 outline-none transition-all placeholder-gray-500"
                                            placeholder="e.g. 123 Food St."
                                            value={formData.shopAddress}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-300 mb-1">Profile Pic URL</label>
                                        <input
                                            name="profilePic"
                                            type="text"
                                            className="w-full bg-black/60 text-white rounded-lg border border-white/10 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 py-2 px-3 outline-none transition-all placeholder-gray-500"
                                            placeholder="https://..."
                                            value={formData.profilePic}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        <button
                            type="submit"
                            className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-pink-600/20 transform transition hover:scale-[1.02] active:scale-95 border border-white/10"
                        >
                            Create Account
                        </button>
                    </form>
                    <div className="mt-8 text-center">
                        <p className="text-gray-400">
                            Already have an account? <Link to="/login" className="text-pink-400 font-semibold hover:text-pink-300 hover:underline transition-colors">Login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
