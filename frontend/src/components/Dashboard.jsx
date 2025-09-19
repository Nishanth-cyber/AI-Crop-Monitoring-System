import React, { useEffect, useState } from 'react';
import '../styles/dashboard.css'; // We'll create this CSS file

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/user/details', {
            credentials: 'include',
        })
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch user details');
                return res.json();
            })
            .then((data) => {
                setUser(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, []);

    if (loading) return (
        <div className="dashboard-loading">
            <div className="loading-spinner"></div>
            <p>Loading user details...</p>
        </div>
    );
    
    if (error) return (
        <div className="dashboard-error">
            <div className="error-icon">⚠️</div>
            <h3>Oops! Something went wrong</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="retry-btn">
                Try Again
            </button>
        </div>
    );
    
    if (!user) return (
        <div className="dashboard-error">
            <div className="error-icon">🔍</div>
            <h3>No user data found</h3>
            <p>Please check your connection or try again later.</p>
        </div>
    );

    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h2>Welcome to Your Dashboard</h2>
                <p>Here's your profile information</p>
            </div>
            
            <div className="dashboard-content">
                <div className="user-card">
                    <div className="user-avatar">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    
                    <div className="user-info">
                        <div className="info-item">
                            <span className="info-label">Name</span>
                            <span className="info-value">{user.name}</span>
                        </div>
                        
                        <div className="info-item">
                            <span className="info-label">Email</span>
                            <span className="info-value">{user.email}</span>
                        </div>
                        
                        {/* Add more user details as needed */}
                        {user.role && (
                            <div className="info-item">
                                <span className="info-label">Role</span>
                                <span className="info-value">{user.role}</span>
                            </div>
                        )}
                        
                        {user.joinedDate && (
                            <div className="info-item">
                                <span className="info-label">Member Since</span>
                                <span className="info-value">{user.joinedDate}</span>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Additional dashboard widgets can be added here */}
                <div className="dashboard-widgets">
                    <div className="widget">
                        <h4>Quick Stats</h4>
                        <div className="widget-content">
                            <span>Coming soon...</span>
                        </div>
                    </div>
                    
                    <div className="widget">
                        <h4>Recent Activity</h4>
                        <div className="widget-content">
                            <span>No recent activity</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

