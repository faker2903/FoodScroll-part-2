import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import VideoFeedItem from '../components/VideoFeedItem';
import CommentModal from '../components/CommentModal';
import { FaArrowLeft } from 'react-icons/fa';

const PartnerVideosFeed = () => {
    const { id } = useParams();
    const { user } = useAuth();
    // Restrict partners to only view their own videos
    if (user?.role === 'partner' && user.id !== id) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <p className="text-gray-500">Partners can only view their own videos.</p>
            </div>
        );
    }

    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [activeCommentVideoId, setActiveCommentVideoId] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const initialVideoId = location.state?.initialVideoId;

    useEffect(() => {
        fetchPartnerVideos();
    }, [id]);

    const fetchPartnerVideos = async () => {
        try {
            const res = await API.get(`/videos/by-partner/${id}`);
            // API returns { partner, videos }
            setVideos(res.data.videos);
            setLoading(false);

            // Scroll to initial video if present
            if (initialVideoId && res.data.videos.length > 0) {
                const index = res.data.videos.findIndex(v => v._id === initialVideoId);
                if (index !== -1) {
                    setActiveVideoIndex(index);
                    // Need to wait for render to scroll
                    setTimeout(() => {
                        if (containerRef.current) {
                            containerRef.current.scrollTop = index * window.innerHeight;
                        }
                    }, 100);
                }
            }
        } catch (error) {
            console.error('Error fetching partner videos:', error);
            setLoading(false);
        }
    };

    const handleScroll = () => {
        if (containerRef.current) {
            const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
            if (index !== activeVideoIndex) {
                setActiveVideoIndex(index);
            }
        }
    };

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 z-50 text-white bg-black/50 p-2 rounded-full hover:bg-black/70 transition-colors"
            >
                <FaArrowLeft />
            </button>

            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
            >
                {videos.map((video, index) => (
                    <div key={`${video._id}-${index}`} className="h-full w-full snap-start">
                        <VideoFeedItem
                            video={video}
                            isActive={index === activeVideoIndex}
                            onCommentClick={(videoId) => {
                                setActiveCommentVideoId(videoId);
                                setIsCommentModalOpen(true);
                            }}
                        />
                    </div>
                ))}
                {loading && (
                    <div className="h-full w-full flex items-center justify-center snap-start bg-black text-white">
                        Loading...
                    </div>
                )}
                {!loading && videos.length === 0 && (
                    <div className="h-full w-full flex items-center justify-center snap-start bg-black text-white">
                        No videos found for this partner.
                    </div>
                )}
            </div>

            <CommentModal
                isOpen={isCommentModalOpen}
                onClose={() => setIsCommentModalOpen(false)}
                videoId={activeCommentVideoId}
            />
        </div>
    );
};

export default PartnerVideosFeed;
