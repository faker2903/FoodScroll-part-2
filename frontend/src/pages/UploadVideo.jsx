import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaCloudUploadAlt, FaVideo } from 'react-icons/fa';

const UploadVideo = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [zomatoLink, setZomatoLink] = useState('');
    const [videoFile, setVideoFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoFile) return alert('Please select a video file');

        setUploading(true);
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('zomatoLink', zomatoLink);
        formData.append('video', videoFile);

        try {
            await axios.post('/api/videos/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Video uploaded successfully!');
            navigate('/partner/profile');
        } catch (error) {
            console.error('Upload error:', error);
            const msg = error.response?.data?.message || 'Error uploading video';
            alert(msg);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-20">
            <div className="max-w-md mx-auto bg-[#111] rounded-2xl shadow-2xl border border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-800">
                    <h2 className="text-2xl font-bold text-center flex items-center justify-center">
                        <FaVideo className="mr-2 text-pink-600" /> Upload Video
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Video Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="w-full bg-gray-900 text-white rounded-lg border border-gray-800 focus:border-pink-600 focus:ring-1 focus:ring-pink-600 py-3 px-4 outline-none transition-colors"
                            placeholder="Delicious Dish Name"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows="3"
                            className="w-full bg-gray-900 text-white rounded-lg border border-gray-800 focus:border-pink-600 focus:ring-1 focus:ring-pink-600 py-3 px-4 outline-none transition-colors resize-none"
                            placeholder="Tell us about this dish..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-1 uppercase tracking-wider">Zomato Link (Optional)</label>
                        <input
                            type="url"
                            value={zomatoLink}
                            onChange={(e) => setZomatoLink(e.target.value)}
                            className="w-full bg-gray-900 text-white rounded-lg border border-gray-800 focus:border-pink-600 focus:ring-1 focus:ring-pink-600 py-3 px-4 outline-none transition-colors"
                            placeholder="https://zomato.com/..."
                        />
                    </div>

                    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 border-dashed">
                        <label className="block text-xs font-medium text-gray-400 mb-3 uppercase tracking-wider text-center">Video File</label>
                        <div className="flex justify-center">
                            <input
                                type="file"
                                accept="video/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-700 cursor-pointer"
                            />
                        </div>
                        {uploading && (
                            <div className="mt-4 flex items-center justify-center text-blue-400 text-sm animate-pulse">
                                <FaCloudUploadAlt className="mr-2" /> Uploading...
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={uploading}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Publishing...' : 'Publish Video'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default UploadVideo;
