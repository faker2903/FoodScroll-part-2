import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaStore } from 'react-icons/fa';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password, role);
        if (result.success) {
            if (role === 'user') navigate('/');
            else navigate('/partner/profile');
        } else {
            setError(result.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4 relative overflow-hidden">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(8px) brightness(0.4)'
                }}
            ></div>

            {/* Decorative background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-600/30 rounded-full blur-3xl pointer-events-none z-0 mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-3xl pointer-events-none z-0 mix-blend-screen"></div>

            <div className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/10 relative z-10">
                <h2 className="text-3xl font-bold mb-2 text-center tracking-tight">Welcome Back</h2>
                <p className="text-gray-400 text-center mb-8">Login to continue your food journey</p>

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

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-black/40 text-white rounded-lg border border-white/10 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 py-3 px-4 outline-none transition-all placeholder-gray-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-black/40 text-white rounded-lg border border-white/10 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 py-3 px-4 outline-none transition-all placeholder-gray-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-lg shadow-pink-600/20 transform transition hover:scale-[1.02] active:scale-95 border border-white/10"
                    >
                        Log In
                    </button>
                </form>
                <div className="mt-8 text-center">
                    <p className="text-gray-400">
                        Don't have an account? <Link to="/register" className="text-pink-400 font-semibold hover:text-pink-300 hover:underline transition-colors">Register</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
