import React from 'react';
import { motion } from 'framer-motion';

const EvaluationProgressTracker = ({ total, evaluated }) => {
    const percentage = total === 0 ? 0 : Math.round((evaluated / total) * 100);

    return (
        <div className="glass-panel p-6 h-full flex flex-col justify-center">
            <h3 className="text-lg font-bold mb-6 text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Evaluation Progress
            </h3>

            <div className="relative pt-2">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-100">
                            {percentage === 100 ? 'Completed' : 'In Progress'}
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-emerald-600">
                            {percentage}%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-emerald-100">
                    <motion.div
                        style={{ width: `${percentage}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-emerald-400 to-emerald-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    ></motion.div>
                </div>

                <div className="flex justify-between text-sm text-slate-500 font-medium">
                    <span>0 Projects</span>
                    <span>{evaluated} / {total} Done</span>
                    <span>{total} Total</span>
                </div>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-xl border border-blue-100">
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Remaining</p>
                    <p className="text-2xl font-bold text-blue-600">{total - evaluated}</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-wider">Completed</p>
                    <p className="text-2xl font-bold text-emerald-600">{evaluated}</p>
                </div>
            </div>
        </div>
    );
};

export default EvaluationProgressTracker;
