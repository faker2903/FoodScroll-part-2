import React, { useState, useEffect } from 'react';
import { getSavedVideos } from '../services/api';
import { Link } from 'react-router-dom';

const Inbox = () => {
    const [savedVideos, setSavedVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSavedVideos();
    }, []);

    const fetchSavedVideos = async () => {
        try {
            const res = await getSavedVideos();
            setSavedVideos(res.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching saved videos:', error);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white pb-24 overflow-y-auto">
            <div className="p-4 border-b border-gray-800 sticky top-0 bg-black z-10">
                <h1 className="text-xl font-bold text-center">Saved Cravings</h1>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-600"></div>
                </div>
            ) : savedVideos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                    <p>No saved videos yet.</p>
                    <Link to="/" className="mt-4 text-pink-600 font-semibold">Discover Food</Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-2 p-2">
                    {savedVideos.map((video) => (
                        <div key={video._id} className="relative aspect-[9/16] bg-gray-900 rounded-lg overflow-hidden group">
                            <video
                                src={video.videoUrl}
                                className="w-full h-full object-cover"
                                loop
                                muted
                                playsInline
                                onMouseEnter={(e) => e.target.play()}
                                onMouseLeave={(e) => {
                                    e.target.pause();
                                    e.target.currentTime = 0;
                                }}
                                onClick={(e) => {
                                    if (e.target.paused) {
                                        e.target.play();
                                    } else {
                                        e.target.pause();
                                    }
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                <div className="absolute bottom-2 left-2 right-2">
                                    <p className="text-sm font-bold text-white line-clamp-2">{video.title}</p>
                                    <p className="text-xs text-gray-300 line-clamp-1">{video.description}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Inbox;
