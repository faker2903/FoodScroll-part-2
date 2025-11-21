import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const UserProfile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [savedVideos, setSavedVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedVideos();
    }, []);

    const fetchSavedVideos = async () => {
        try {
            const res = await API.get('/videos/saved');
            setSavedVideos(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching saved videos:', error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto p-4 pb-32">
                <div className="bg-[#111] border border-gray-800 rounded-2xl shadow-xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between">
                    <div className="flex items-center mb-4 md:mb-0">
                        <img
                            src={user?.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                            alt={user?.name}
                            className="w-24 h-24 rounded-full object-cover mr-6 border-2 border-pink-600 p-1"
                        />
                        <div>
                            <h1 className="text-3xl font-bold mb-1 text-white">{user?.name}</h1>
                            <p className="text-gray-400">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = '/register';
                        }}
                        className="bg-gray-800 text-white px-6 py-2.5 rounded-xl font-medium hover:bg-gray-700 transition-all duration-200 shadow-lg border border-gray-700"
                    >
                        Logout
                    </button>
                </div>

                <h2 className="text-2xl font-bold mb-4">Saved Videos</h2>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {savedVideos.map(video => (
                            <div
                                key={video._id}
                                className="relative group aspect-[9/16] bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => navigate('/saved-videos', { state: { initialVideoId: video._id } })}
                            >
                                <video
                                    src={video.videoUrl}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="text-white text-center p-2">
                                        <p className="font-bold truncate">{video.title}</p>
                                        <p className="text-xs mt-1">Click to watch</p>
                                        <Link
                                            to={`/partner/${video.partnerId._id}`}
                                            className="text-xs hover:underline block mt-1"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            by {video.partnerId.shopName}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {savedVideos.length === 0 && (
                            <div className="col-span-full text-center text-gray-500 py-10">
                                No saved videos yet. Go explore!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
