import React, { useEffect, useState } from 'react';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        // Replace with your actual backend API endpoint
        fetch('/api/user/details', {
            credentials: 'include', // if using cookies for auth
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

    if (loading) return <div>Loading user details...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!user) return <div>No user data found.</div>;

    return (
        <div>
            <h2>Dashboard</h2>
            <div>
                <strong>Name:</strong> {user.name}
            </div>
            <div>
                <strong>Email:</strong> {user.email}
            </div>
            {/* Add more user details as needed */}
        </div>
    );
};

// Ensure you export the Dashboard component
export default Dashboard;