import React, { useContext } from 'react';
import AuthContext from '../../context/AuthContext';
import { Card } from '../../components/UI';

const StudentDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
            <h1 className="text-3xl font-extrabold text-white mb-2">Student Dashboard</h1>
            <p className="text-blue-200 mb-8">Welcome back, {user?.name}</p>
            <Card>
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4 text-white">Project Details</h2>
                    <p className="text-gray-300">Form UI will be added here...</p>
                </div>
            </Card>
        </div>
    );
};

export default StudentDashboard;
