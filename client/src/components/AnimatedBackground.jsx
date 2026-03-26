import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = ({ children }) => {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Gradient Background */}
            <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 animate-gradient-shift"></div>

                {/* Floating Orbs */}
                <motion.div
                    className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, -50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.3, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />

                <motion.div
                    className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
                    animate={{
                        x: [0, -50, 50, 0],
                        y: [0, 50, -50, 0],
                        scale: [1, 1.1, 1.2, 1],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Content */}
            {children}
        </div>
    );
};

export default AnimatedBackground;
