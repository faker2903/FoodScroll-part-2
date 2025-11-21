import React from 'react';

const SkeletonVideoFeed = () => {
    return (
        <div className="relative h-full w-full bg-gray-900 animate-pulse">
            {/* Video Placeholder */}
            <div className="absolute inset-0 bg-gray-800"></div>

            {/* Right Side Action Buttons Skeleton */}
            <div className="absolute bottom-32 right-4 flex flex-col items-center space-y-6 z-20">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex flex-col items-center space-y-1">
                        <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                        <div className="w-8 h-3 bg-gray-700 rounded"></div>
                    </div>
                ))}
            </div>

            {/* Bottom Info Skeleton */}
            <div className="absolute bottom-20 left-4 right-16 z-20 space-y-3">
                <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-gray-700 rounded-full"></div>
                    <div className="w-32 h-4 bg-gray-700 rounded"></div>
                </div>
                <div className="w-3/4 h-4 bg-gray-700 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-700 rounded"></div>
            </div>
        </div>
    );
};

export default SkeletonVideoFeed;
