import React from 'react';
import { motion } from 'framer-motion';

const SkillRadarChart = ({ evaluation }) => {
    if (!evaluation) return null;

    const skills = [
        { name: 'Code Quality', value: (evaluation.marks.codeQuality / 20) * 100, max: 20 },
        { name: 'Logic', value: (evaluation.marks.logic / 20) * 100, max: 20 },
        { name: 'Architecture', value: (evaluation.marks.architecture / 15) * 100, max: 15 },
        { name: 'Viva', value: (evaluation.marks.viva / 25) * 100, max: 25 },
        { name: 'Innovation', value: (evaluation.marks.innovation / 20) * 100, max: 20 },
    ];

    const angleStep = (2 * Math.PI) / skills.length;
    const radius = 100;
    const centerX = 120;
    const centerY = 120;

    // Generate polygon points
    const points = skills.map((skill, i) => {
        const angle = i * angleStep - Math.PI / 2;
        const r = (skill.value / 100) * radius;
        const x = centerX + r * Math.cos(angle);
        const y = centerY + r * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    // Generate background grid circles
    const gridLevels = [20, 40, 60, 80, 100];

    return (
        <div className="glass-panel p-6">
            <h3 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Skill Breakdown
            </h3>

            <div className="flex items-center justify-center">
                <svg width="240" height="240" viewBox="0 0 240 240">
                    {/* Background grid */}
                    {gridLevels.map((level, i) => (
                        <circle
                            key={i}
                            cx={centerX}
                            cy={centerY}
                            r={(level / 100) * radius}
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="1"
                        />
                    ))}

                    {/* Axis lines */}
                    {skills.map((_, i) => {
                        const angle = i * angleStep - Math.PI / 2;
                        const x = centerX + radius * Math.cos(angle);
                        const y = centerY + radius * Math.sin(angle);
                        return (
                            <line
                                key={i}
                                x1={centerX}
                                y1={centerY}
                                x2={x}
                                y2={y}
                                stroke="#cbd5e1"
                                strokeWidth="1"
                            />
                        );
                    })}

                    {/* Skill polygon */}
                    <motion.polygon
                        points={points}
                        fill="rgba(37, 99, 235, 0.2)"
                        stroke="#2563eb"
                        strokeWidth="2"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />

                    {/* Skill points */}
                    {skills.map((skill, i) => {
                        const angle = i * angleStep - Math.PI / 2;
                        const r = (skill.value / 100) * radius;
                        const x = centerX + r * Math.cos(angle);
                        const y = centerY + r * Math.sin(angle);
                        return (
                            <motion.circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#2563eb"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 * i, duration: 0.3 }}
                            />
                        );
                    })}

                    {/* Labels */}
                    {skills.map((skill, i) => {
                        const angle = i * angleStep - Math.PI / 2;
                        const labelRadius = radius + 25;
                        const x = centerX + labelRadius * Math.cos(angle);
                        const y = centerY + labelRadius * Math.sin(angle);
                        return (
                            <text
                                key={i}
                                x={x}
                                y={y}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="text-xs font-semibold fill-slate-600"
                            >
                                {skill.name}
                            </text>
                        );
                    })}
                </svg>
            </div>

            {/* Legend */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {skills.map((skill, i) => (
                    <div key={i} className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg">
                        <span className="text-slate-600 font-medium">{skill.name}</span>
                        <span className="text-blue-600 font-bold">{skill.value.toFixed(0)}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillRadarChart;
