import React from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';

const PerformanceComparison = ({ yourScore, classAverage }) => {
    const difference = yourScore - classAverage;
    const differencePercent = ((difference / classAverage) * 100).toFixed(1);

    return (
        <div className="glass-panel p-6">
            <h3 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Performance vs Class
            </h3>

            <div className="space-y-6">
                {/* Your Score */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-600">Your Score</span>
                        <span className="text-2xl font-bold text-blue-600">
                            <CountUp end={yourScore} duration={1.5} />%
                        </span>
                    </div>
                    <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${yourScore}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                    </div>
                </div>

                {/* Class Average */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-slate-600">Class Average</span>
                        <span className="text-2xl font-bold text-slate-500">
                            <CountUp end={classAverage} duration={1.5} />%
                        </span>
                    </div>
                    <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-slate-400 to-slate-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${classAverage}%` }}
                            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                        />
                    </div>
                </div>

                {/* Difference Indicator */}
                <div className={`p-4 rounded-xl ${difference >= 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-amber-50 border border-amber-200'}`}>
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-700">Difference</span>
                        <div className="flex items-center gap-2">
                            {difference >= 0 ? (
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            ) : (
                                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                                </svg>
                            )}
                            <span className={`text-lg font-bold ${difference >= 0 ? 'text-emerald-700' : 'text-amber-700'}`}>
                                {difference >= 0 ? '+' : ''}{differencePercent}%
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">
                        {difference >= 0
                            ? `You're performing ${Math.abs(differencePercent)}% above the class average! 🎉`
                            : `You're ${Math.abs(differencePercent)}% below average. Keep improving! 💪`
                        }
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PerformanceComparison;
