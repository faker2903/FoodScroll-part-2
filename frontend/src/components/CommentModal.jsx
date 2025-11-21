import React, { useState, useEffect } from 'react';
import { FaTimes, FaArrowUp, FaHeart, FaTrash } from 'react-icons/fa';
import { getComments, postComment, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';

const CommentModal = ({ isOpen, onClose, videoId }) => {
    const { user } = useAuth();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && videoId) {
            fetchComments();
        }
    }, [isOpen, videoId]);

    const fetchComments = async () => {
        try {
            const res = await getComments(videoId);
            setComments(res.data);
        } catch (error) {
            console.error("Error fetching comments", error);
        }
    };

    const handlePostComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const res = await postComment(videoId, newComment);
            setComments(prev => [res.data, ...prev]);
            setNewComment('');
        } catch (error) {
            console.error("Error posting comment", error);
            alert("Failed to post comment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await deleteComment(commentId);
            setComments(prev => prev.filter(c => c._id !== commentId));
        } catch (error) {
            console.error("Error deleting comment", error);
            alert("Failed to delete comment: " + (error.response?.data?.message || error.message));
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div
                className="w-full h-[70vh] bg-[#111] rounded-t-2xl flex flex-col animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative flex items-center justify-center p-4 border-b border-gray-800">
                    <h3 className="text-white font-bold text-sm">{comments.length} comments</h3>
                    <button
                        onClick={onClose}
                        className="absolute right-4 text-gray-400 hover:text-white"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {comments.length === 0 ? (
                        <p className="text-gray-500 text-center text-sm mt-10">No comments yet. Be the first!</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment._id} className="flex items-start space-x-3">
                                <div className="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden">
                                    <img
                                        src={comment.userId?.profilePic || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                        alt="User"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-400 text-xs font-bold mb-1">
                                        {comment.userId?.name || 'Unknown User'}
                                    </p>
                                    <p className="text-white text-sm">{comment.text}</p>
                                    <div className="flex items-center space-x-4 mt-1 text-gray-500 text-xs">
                                        <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                        <span
                                            className="font-semibold cursor-pointer hover:text-gray-300"
                                            onClick={() => setNewComment(`@${comment.userId?.name || 'user'} `)}
                                        >
                                            Reply
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center text-gray-500 space-y-2">
                                    <FaHeart className="text-xs hover:text-red-500 cursor-pointer" />
                                    <span className="text-[10px] mt-0.5">0</span>
                                    {user && comment.userId?._id === user.id && (
                                        <FaTrash
                                            className="text-xs hover:text-red-500 cursor-pointer"
                                            onClick={() => handleDeleteComment(comment._id)}
                                        />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input Area */}
                <form onSubmit={handlePostComment} className="p-4 border-t border-gray-800 bg-[#111] flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add comment..."
                            className="w-full bg-gray-800 text-white rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600"
                        />
                        <button
                            type="submit"
                            disabled={loading || !newComment.trim() || !videoId}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-pink-600 disabled:text-gray-600"
                        >
                            <FaArrowUp />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CommentModal;
