import React, { useState, useEffect, useRef, Suspense } from 'react';
import API from '../services/api';
import CommentModal from '../components/CommentModal';
import SkeletonVideoFeed from '../components/SkeletonVideoFeed';

// Lazy load the VideoFeedItem component
const VideoFeedItem = React.lazy(() => import('../components/VideoFeedItem'));

const Home = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
    const [activeCommentVideoId, setActiveCommentVideoId] = useState(null);

    const containerRef = useRef(null);

    useEffect(() => {
        fetchVideos();
    }, [page]);

    const fetchVideos = async () => {
        try {
            const res = await API.get(`/videos/all?page=${page}&limit=5`);
            if (res.data.length === 0) {
                setHasMore(false);
            } else {
                // Deduplicate videos by ID
                setVideos(prev => {
                    const existingIds = new Set(prev.map(v => v._id));
                    const newVideos = res.data.filter(v => !existingIds.has(v._id));
                    return [...prev, ...newVideos];
                });
            }
            setLoading(false);
        } catch (error) {
            console.error('Error fetching videos:', error);
            setLoading(false);
        }
    };

    const handleScroll = () => {
        if (containerRef.current) {
            const index = Math.round(containerRef.current.scrollTop / window.innerHeight);
            if (index !== activeVideoIndex) {
                setActiveVideoIndex(index);
            }

            // Infinite scroll trigger
            const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
            if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore && !loading) {
                setPage(prev => prev + 1);
            }
        }
    };

    if (loading && videos.length === 0) {
        return <SkeletonVideoFeed />;
    }

    if (!loading && videos.length === 0) {
        return (
            <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white">
                <div className="text-6xl mb-4">🍽️</div>
                <h2 className="text-2xl font-bold mb-2">No Videos Yet</h2>
                <p className="text-gray-400">Be the first partner to upload!</p>
            </div>
        );
    }

    return (
        <div className="relative h-screen w-full bg-black overflow-hidden">
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar"
            >
                <Suspense fallback={<SkeletonVideoFeed />}>
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
                </Suspense>

                {loading && (
                    <div className="h-full w-full snap-start">
                        <SkeletonVideoFeed />
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

export default Home;
