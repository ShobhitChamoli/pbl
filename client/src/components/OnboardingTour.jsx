import React, { useState, useEffect, useContext } from 'react';
import Joyride, { ACTIONS, EVENTS, STATUS } from 'react-joyride';
import { useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const OnboardingTour = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();
    const [run, setRun] = useState(false);
    const [steps, setSteps] = useState([]);

    useEffect(() => {
        if (!user) {
            setRun(false);
            return;
        }

        const role = user.role;
        const currentPath = location.pathname;
        const hasSeenOnboarding = localStorage.getItem(`auditx_onboarding_${role}`);

        if (hasSeenOnboarding) {
            setRun(false);
            return;
        }

        // Define steps based on role and path
        if (role === 'student' && currentPath === '/student/dashboard') {
            setSteps([
                {
                    target: 'body',
                    content: 'Welcome to your Student Dashboard! This is where you can track your project progress and view evaluation results.',
                    placement: 'center',
                },
                {
                    target: '.slide-up', // Header greeting
                    content: 'This is your personal dashboard.',
                },
                {
                    target: 'button[type="submit"]', // Assuming submission form button
                    content: 'Submit your project details here once you are ready for evaluation.',
                },
                {
                    target: '.glass-panel', // Example for charts if visible
                    content: 'After evaluation, you will see detailed analytics here.',
                }
            ]);
            setRun(true);
        } else if (role === 'mentor' && currentPath === '/mentor/dashboard') {
            setSteps([
                {
                    target: 'body',
                    content: 'Welcome, Mentor! This dashboard helps you manage and evaluate student projects efficiently.',
                    placement: 'center',
                },
                {
                    target: '.grid.grid-cols-1.md\\:grid-cols-3', // Stats section
                    content: 'Overview of total projects, evaluated count, and pending submissions.',
                },
                {
                    target: '.lg\\:col-span-1', // Sidebar list
                    content: 'Select a project from this list to view details.',
                },
                {
                    target: '.lg\\:col-span-2', // Main panel
                    content: 'Here you can view project details, start AI Viva sessions, and submit manual grades.',
                }
            ]);
            setRun(true);
        } else {
            setRun(false);
        }
    }, [user, location.pathname]);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
            setRun(false);
            if (user) {
                localStorage.setItem(`auditx_onboarding_${user.role}`, 'true');
            }
        }
    };

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showSkipButton
            showProgress
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    primaryColor: '#2563eb',
                    textColor: '#1e293b',
                    backgroundColor: '#ffffff',
                    arrowColor: '#ffffff',
                },
                tooltip: {
                    borderRadius: '1rem',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                },
                buttonNext: {
                    borderRadius: '0.5rem',
                    padding: '0.5rem 1rem',
                },
                buttonBack: {
                    marginRight: '0.5rem',
                }
            }}
        />
    );
};

export default OnboardingTour;
