import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaUtensils } from 'react-icons/fa';

const PartnerProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [partner, setPartner] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    // If no ID is provided, and user is a partner, show their own profile
    const profileId = id || (user?.role === 'partner' ? user.id : null);

    useEffect(() => {
        if (profileId) {
            fetchProfile();
        }
    }, [profileId]);

    const fetchProfile = async () => {
        try {
            // If viewing own profile as partner, we might need a different endpoint or just use the public one
            // The public endpoint returns partner info and videos
            const res = await axios.get(`/api/videos/by-partner/${profileId}`);
            setPartner(res.data.partner);
            setVideos(res.data.videos);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching profile:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="text-center mt-10 text-white">Loading...</div>;
    if (!partner) return <div className="text-center mt-10 text-white">Partner not found</div>;

    const isOwnProfile = user?.role === 'partner' && user.id === partner._id;

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="max-w-4xl mx-auto p-4 pb-32">
                <div className="bg-[#111] border border-gray-800 rounded-2xl shadow-xl p-6 mb-6 flex flex-col md:flex-row items-center">
                    <img
                        src={partner.profilePic || 'https://cdn-icons-png.flaticon.com/512/1995/1995515.png'}
                        alt={partner.shopName}
                        className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-8 border-2 border-pink-600 p-1"
                    />
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-3xl font-bold mb-2 text-white">{partner.shopName}</h1>
                        <p className="text-gray-400 mb-2">{partner.shopAddress}</p>
                        {isOwnProfile && (
                            <div className="mt-4 space-x-4 flex items-center justify-center md:justify-start">
                                <Link to="/upload" className="bg-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-pink-700 transition-colors flex items-center">
                                    <span className="mr-2">+</span> Upload Video
                                </Link>
                                <button
                                    onClick={() => {
                                        logout();
                                        window.location.href = '/register';
                                    }}
                                    className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {user?.role === 'partner' && user.id !== partner._id ? (
                    <div className="text-center text-gray-500 mt-10">
                        Partners can only view their own videos.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {videos.map(video => (
                            <div
                                key={video._id}
                                className="relative group aspect-[9/16] bg-gray-200 rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => navigate(`/partner/${profileId}/feed`, { state: { initialVideoId: video._id } })}
                            >
                                <video
                                    src={video.videoUrl}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                                    <div className="text-white text-center p-2">
                                        <p className="font-bold truncate">{partner.shopName}</p>
                                        <p className="text-xs mt-1">Click to watch</p>
                                        {video.zomatoLink && (
                                            <a
                                                href={video.zomatoLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-block mt-2 bg-red-600 p-2 rounded-full"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <FaUtensils />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {videos.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">No videos uploaded yet.</div>
                )}
            </div>
        </div>
    );
};

export default PartnerProfile;
