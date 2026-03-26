import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, Upload } from 'lucide-react';

const GrowthTimeline = ({ project }) => {
    const milestones = [
        {
            title: 'Project Submitted',
            date: new Date(project.createdAt).toLocaleDateString(),
            icon: Upload,
            status: 'completed',
            color: 'blue'
        },
        {
            title: 'Under Review',
            date: project.evaluation ? new Date(project.evaluation.evaluatedAt || Date.now()).toLocaleDateString() : 'Pending',
            icon: Clock,
            status: project.evaluation ? 'completed' : 'current',
            color: project.evaluation ? 'blue' : 'amber'
        },
        {
            title: 'Evaluation Complete',
            date: project.evaluation ? new Date(project.evaluation.evaluatedAt || Date.now()).toLocaleDateString() : '-',
            icon: CheckCircle,
            status: project.evaluation ? 'completed' : 'pending',
            color: project.evaluation ? 'emerald' : 'slate'
        }
    ];

    return (
        <div className="glass-panel p-6">
            <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Project Timeline
            </h3>

            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-blue-300 to-slate-200"></div>

                <div className="space-y-8">
                    {milestones.map((milestone, index) => {
                        const Icon = milestone.icon;
                        const colorClasses = {
                            blue: 'bg-blue-100 text-blue-600 border-blue-300',
                            amber: 'bg-amber-100 text-amber-600 border-amber-300',
                            emerald: 'bg-emerald-100 text-emerald-600 border-emerald-300',
                            slate: 'bg-slate-100 text-slate-400 border-slate-300'
                        };

                        return (
                            <motion.div
                                key={index}
                                className="relative flex items-start gap-4"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.2, duration: 0.4 }}
                            >
                                {/* Icon */}
                                <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${colorClasses[milestone.color]}`}>
                                    <Icon size={20} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 pt-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="font-bold text-slate-800">{milestone.title}</h4>
                                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${milestone.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                                milestone.status === 'current' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-slate-100 text-slate-500'
                                            }`}>
                                            {milestone.status === 'completed' ? 'Completed' :
                                                milestone.status === 'current' ? 'In Progress' : 'Pending'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">{milestone.date}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            {project.evaluation && (
                <motion.div
                    className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="text-emerald-600" size={20} />
                        <span className="font-bold text-emerald-800">Evaluation Completed!</span>
                    </div>
                    <p className="text-sm text-slate-600">
                        Your project scored <span className="font-bold text-blue-600">{project.evaluation.total}/100</span>
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default GrowthTimeline;
