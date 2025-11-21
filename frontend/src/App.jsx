import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PartnerProfile from './pages/PartnerProfile';
import UserProfile from './pages/UserProfile';
import UploadVideo from './pages/UploadVideo';
import Inbox from './pages/Inbox';
import SavedVideosFeed from './pages/SavedVideosFeed';
import PartnerVideosFeed from './pages/PartnerVideosFeed';
import BottomNav from './components/BottomNav';

const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) return <div className="bg-black text-white h-screen flex items-center justify-center">Loading...</div>;

    if (!user) {
        return <Navigate to="/register" state={{ from: location }} replace />;
    }

    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

function App() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-black text-white font-sans">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    <Route
                        path="/"
                        element={
                            <ProtectedRoute roles={['user']}>
                                <Home />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute roles={['user']}>
                                <UserProfile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/inbox"
                        element={
                            <ProtectedRoute roles={['user']}>
                                <Inbox />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/saved-videos"
                        element={
                            <ProtectedRoute roles={['user']}>
                                <SavedVideosFeed />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/partner/profile"
                        element={
                            <ProtectedRoute roles={['partner']}>
                                <PartnerProfile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/partner/:id"
                        element={
                            <ProtectedRoute roles={['user', 'partner']}>
                                <PartnerProfile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/partner/:id/feed"
                        element={
                            <ProtectedRoute roles={['user', 'partner']}>
                                <PartnerVideosFeed />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/upload"
                        element={
                            <ProtectedRoute roles={['partner']}>
                                <UploadVideo />
                            </ProtectedRoute>
                        }
                    />
                </Routes>

                {/* Show BottomNav only for authenticated users */}
                <AuthWrapper>
                    <BottomNav />
                </AuthWrapper>
            </div>
        </AuthProvider>
    );
}

const AuthWrapper = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    const hideNavRoutes = ['/login', '/register'];
    const shouldHideNav = hideNavRoutes.includes(location.pathname);

    if (shouldHideNav) return null;

    return user ? children : null;
};

export default App;
