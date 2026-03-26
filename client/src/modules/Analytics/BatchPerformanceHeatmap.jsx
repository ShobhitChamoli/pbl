import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell } from 'recharts';
import { motion } from 'framer-motion';

const BatchPerformanceHeatmap = ({ projects }) => {
    // Determine data for heatmap based on project evaluations
    // We'll map (Technology) vs (Score Range)

    // Group projects by tech stack (simplified)
    const processData = () => {
        if (!projects || projects.length === 0) return [];

        const cardData = [];
        const techs = ['React', 'Node', 'Python', 'Java', 'Other'];
        const ranges = ['0-40', '41-60', '61-75', '76-85', '86-100'];

        // Initialize grid
        techs.forEach((tech, x) => {
            ranges.forEach((range, y) => {
                cardData.push({ x: x, y: y, z: 0, tech, range });
            });
        });

        projects.forEach(p => {
            if (!p.evaluation) return;
            const score = p.evaluation.total;
            let rangeIndex = 0;
            if (score > 85) rangeIndex = 4;
            else if (score > 75) rangeIndex = 3;
            else if (score > 60) rangeIndex = 2;
            else if (score > 40) rangeIndex = 1;

            const techName = p.techStack ? p.techStack.split(',')[0].trim() : 'Other';
            let techIndex = techs.findIndex(t => techName.includes(t));
            if (techIndex === -1) techIndex = 4; // Other

            // Find the cell and increment count
            const cell = cardData.find(c => c.x === techIndex && c.y === rangeIndex);
            if (cell) cell.z += 1;
        });

        return cardData.filter(c => c.z > 0); // Only return active cells for scatter, or keep all for heatmap grid
    };

    const data = processData();
    const parseDomain = () => [
        0,
        Math.max(
            Math.max.apply(
                null,
                data.map((entry) => entry.z)
            ),
            1
        ),
    ];

    const domain = parseDomain();
    const range = [40, 400]; // Size of bubble

    return (
        <div className="glass-panel p-6 h-full">
            <h3 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Batch Performance Distribution
            </h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart
                        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
                    >
                        <XAxis
                            type="number"
                            dataKey="x"
                            name="Technology"
                            tickFormatter={(val) => ['React', 'Node', 'Python', 'Java', 'Other'][val]}
                            domain={[0, 4]}
                            tickCount={5}
                            interval={0}
                        />
                        <YAxis
                            type="number"
                            dataKey="y"
                            name="Score Range"
                            tickFormatter={(val) => ['Fail', 'Pass', 'Good', 'V.Good', 'Excellent'][val]}
                            domain={[0, 4]}
                            tickCount={5}
                            interval={0}
                        />
                        <ZAxis type="number" dataKey="z" range={range} domain={domain} name="Students" />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                    <div className="bg-white p-3 rounded-xl shadow-xl border border-blue-100">
                                        <p className="font-bold text-slate-800">{data.tech}</p>
                                        <p className="text-sm text-slate-500">Range: {data.range}</p>
                                        <p className="text-blue-600 font-bold">{data.z} Projects</p>
                                    </div>
                                );
                            }
                            return null;
                        }} />
                        <Scatter name="Projects" data={data} fill="#8884d8">
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.y >= 3 ? '#10b981' : entry.y === 2 ? '#3b82f6' : '#f59e0b'} />
                            ))}
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-slate-400 mt-2">Bubble size indicates number of projects</p>
        </div>
    );
};

export default BatchPerformanceHeatmap;
