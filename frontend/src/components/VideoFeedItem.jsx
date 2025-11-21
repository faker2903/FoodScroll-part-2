import React, { useState, useRef, useEffect } from 'react';
import { FaHeart, FaComment, FaShare, FaMusic, FaUtensils, FaBookmark, FaMapMarkerAlt, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { likeVideo, saveVideo } from '../services/api';
import { useAuth } from '../context/AuthContext';

const VideoFeedItem = ({ video, isActive, onCommentClick }) => {
    const videoRef = useRef(null);
    const { user } = useAuth();

    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [saved, setSaved] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMuted, setIsMuted] = useState(true);

    // Initialize state from video data
    useEffect(() => {
        if (video) {
            setLikesCount(video.likeCount || 0);
            setLiked(video.isLiked || false);
            setSaved(video.isSaved || false);
        }
    }, [video]);

    // Autoplay handling
    useEffect(() => {
        if (isActive) {
            // Reset mute state to true when scrolling to a new video (optional, but good for autoplay policy)
            // setIsMuted(true); 
            videoRef.current.play().catch(error => console.log('Autoplay prevented', error));
        } else {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    }, [isActive]);

    const handleLike = async () => {
        try {
            const isLiking = !liked;
            setLiked(isLiking);
            setLikesCount(prev => (isLiking ? prev + 1 : prev - 1));
            const response = await likeVideo(video._id);
            if (response.data) {
                setLiked(response.data.liked);
                setLikesCount(response.data.likeCount);
            }
        } catch (error) {
            console.error('Error liking video', error);
            setLiked(!liked);
            setLikesCount(prev => (!liked ? prev - 1 : prev + 1));
        }
    };

    const handleSave = async () => {
        try {
            const isSaving = !saved;
            setSaved(isSaving);
            const response = await saveVideo(video._id);
            if (response.data) {
                setSaved(response.data.saved);
            }
        } catch (error) {
            console.error('Error saving video', error);
            setSaved(!saved);
        }
    };

    const handleShare = async () => {
        const shareData = {
            title: `Check out ${video.partnerId?.shopName || 'this partner'}!`,
            text: `Watch this delicious video from ${video.partnerId?.shopName || 'a partner'} on FoodScroll.`,
            url: `${window.location.origin}/partner/${video.partnerId?._id || video.partnerId}`,
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.error('Error sharing:', err);
            }
        } else {
            try {
                await navigator.clipboard.writeText(shareData.url);
                alert('Link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        }
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const isPartner = user?.role === 'partner';

    return (
        <div className="relative w-full h-full bg-black snap-start">
            {/* Video Player */}
            <video
                ref={videoRef}
                src={video.videoUrl}
                className="w-full h-full object-cover cursor-pointer"
                loop
                playsInline
                muted={isMuted}
                onClick={toggleMute}
            />

            {/* Mute/Unmute Indicator */}
            <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/50 p-4 rounded-full text-white pointer-events-none transition-opacity duration-300"
                style={{ opacity: isMuted ? 0 : 0 }} // Hidden by default, could animate on toggle
            >
                {/* We can make a persistent mute button instead */}
            </div>

            {/* Persistent Volume Icon */}
            <button
                onClick={toggleMute}
                className="absolute top-4 right-4 z-30 bg-black/40 p-2 rounded-full text-white backdrop-blur-sm hover:bg-black/60 transition-all"
            >
                {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
            </button>

            {/* Right Sidebar Actions */}
            <div className="absolute right-2 bottom-32 flex flex-col items-center space-y-6 z-20">
                {/* Profile Pic */}
                <Link to={`/partner/${video.partnerId?._id || video.partnerId}`} className="relative mb-2">
                    <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden p-[1px]">
                        <img
                            src={video.partnerId?.profilePic || 'https://cdn-icons-png.flaticon.com/512/1995/1995515.png'}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-pink-600 rounded-full p-0.5">
                        <div className="w-4 h-4 flex items-center justify-center text-white text-xs font-bold">+</div>
                    </div>
                </Link>

                {/* Like Button – hide for partners */}
                {!isPartner && (
                    <div className="flex flex-col items-center">
                        <div
                            onClick={handleLike}
                            className={`p-2 rounded-full bg-gray-800 bg-opacity-50 transition-transform duration-200 cursor-pointer ${liked ? 'text-pink-600' : 'text-white'}`}
                        >
                            <FaHeart className={`text-3xl ${liked ? 'animate-bounce-custom' : ''}`} />
                        </div>
                        <span className="text-white text-xs font-semibold mt-1">{likesCount}</span>
                    </div>
                )}

                {/* Comment Button */}
                <div className="flex flex-col items-center">
                    <div
                        onClick={() => onCommentClick(video._id)}
                        className="p-2 rounded-full bg-gray-800 bg-opacity-50 text-white cursor-pointer"
                    >
                        <FaComment className="text-3xl" />
                    </div>
                    <span className="text-white text-xs font-semibold mt-1">{video.commentsCount || 0}</span>
                </div>

                {/* Save Button – hide for partners */}
                {!isPartner && (
                    <div className="flex flex-col items-center">
                        <div
                            onClick={handleSave}
                            className={`p-2 rounded-full bg-gray-800 bg-opacity-50 transition-colors duration-200 cursor-pointer ${saved ? 'text-yellow-400' : 'text-white'}`}
                        >
                            <FaBookmark className="text-3xl" />
                        </div>
                        <span className="text-white text-xs font-semibold mt-1">Save</span>
                    </div>
                )}

                {/* Share Button */}
                <div className="flex flex-col items-center">
                    <div
                        onClick={handleShare}
                        className="p-2 rounded-full bg-gray-800 bg-opacity-50 text-white cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                        <FaShare className="text-3xl" />
                    </div>
                    <span className="text-white text-xs font-semibold mt-1">Share</span>
                </div>

                {/* Zomato Link (Optional) */}
                {video.zomatoLink && (
                    <a
                        href={video.zomatoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center animate-spin-slow"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-900 border-4 border-gray-700 flex items-center justify-center overflow-hidden">
                            <FaUtensils className="text-white" />
                        </div>
                    </a>
                )}
            </div>

            {/* Bottom Info Section */}
            <div className="absolute bottom-20 left-4 right-16 z-10 text-white">
                <div className="flex items-center space-x-3 mb-3">
                    <Link
                        to={`/partner/${video.partnerId?._id || video.partnerId}`}
                        className="inline-flex items-center bg-gray-900/60 backdrop-blur-md px-3 py-1.5 rounded-full hover:bg-gray-800/80 transition-all border border-gray-700/50"
                    >
                        <FaUtensils className="text-pink-500 mr-2 text-xs" />
                        <span className="font-bold text-sm">{video.partnerId?.shopName || video.partnerId}</span>
                    </Link>

                    <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            (video.partnerId?.shopName || video.partnerId) + ' ' + (video.partnerId?.shopAddress || '')
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-gray-900/60 backdrop-blur-md px-3 py-1.5 rounded-full hover:bg-gray-800/80 transition-all border border-gray-700/50 text-green-400"
                    >
                        <FaMapMarkerAlt className="mr-1 text-xs" />
                        <span className="text-xs font-bold">Map</span>
                    </a>
                </div>

                <div className="mb-2">
                    <p
                        className={`text-sm transition-all duration-200 ${isExpanded ? '' : 'line-clamp-1'}`}
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {video.description}
                        {!isExpanded && <span className="font-bold ml-1 text-gray-400 cursor-pointer">...</span>}
                    </p>
                </div>

                <div className="flex items-center space-x-2">
                    <FaMusic className="text-xs" />
                    <div className="text-xs overflow-hidden w-32">
                        <div className="whitespace-nowrap animate-marquee">Original Sound - {video.partnerId?.shopName || video.partnerId}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoFeedItem;
