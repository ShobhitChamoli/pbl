import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Mic, Save, ArrowRight, CheckCircle, Clock, X } from 'lucide-react';
import { Button, Card, Badge } from '../../components/UI';
import axios from '../../config/axiosConfig';

const VivaSession = ({ project, onComplete, onCancel }) => {
    const [questions, setQuestions] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState({});
    const [marks, setMarks] = useState({ codeQuality: 0, logic: 0, architecture: 0, viva: 0, innovation: 0 });
    const [loading, setLoading] = useState(false);
    const [isThinking, setIsThinking] = useState(false); // AI typing effect

    useEffect(() => {
        // Initial AI generation if needed, or start with welcome
        if (questions.length === 0) {
            handleGenerateQuestions();
        }
    }, []);

    const handleGenerateQuestions = async () => {
        setIsThinking(true);
        try {
            const token = localStorage.getItem('token');
            const { data } = await axios.post('/api/ai/generate-viva', { projectId: project.id }, { headers: { Authorization: `Bearer ${token}` } });
            setQuestions(data.questions);
            if (data.suggestedScores) {
                setMarks(prev => ({ ...prev, ...data.suggestedScores }));
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsThinking(false);
        }
    };

    const handleScoreChange = (category, value) => {
        setMarks(prev => ({ ...prev, [category]: parseInt(value) || 0 }));
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const total = Object.values(marks).reduce((a, b) => a + Number(b), 0);

            await axios.post('/api/evaluations', {
                projectId: project.id,
                marks,
                feedback: 'Evaluated via Interactive Viva Session',
                qa: answers // Save Q&A transcript if backend supports it
            }, { headers: { Authorization: `Bearer ${token}` } });

            onComplete();
        } catch (err) {
            alert('Failed to submit evaluation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                        Live Viva Session
                    </h2>
                    <p className="text-sm text-slate-500">Evaluating: <span className="font-bold text-blue-600">{project.teamName}</span></p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="text-right mr-4">
                        <p className="text-xs font-bold uppercase text-slate-400">Current Score</p>
                        <p className="text-2xl font-black text-slate-800">{Object.values(marks).reduce((a, b) => a + Number(b), 0)}<span className="text-sm text-slate-400">/100</span></p>
                    </div>
                    <Button variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button onClick={handleSubmit} loading={loading} className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white">
                        <CheckCircle size={18} /> Finalize Grade
                    </Button>
                    <button
                        onClick={onCancel}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        title="Close Session"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden grid grid-cols-12">
                {/* Left: AI Interviewer */}
                <div className="col-span-3 bg-slate-100 border-r border-slate-200 p-4 flex flex-col">
                    <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <MessageSquare size={18} /> Difficulty Flow
                    </h3>
                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {isThinking && (
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-200 animate-pulse flex gap-2 items-center text-sm text-slate-500">
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></span>
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></span>
                                <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></span>
                                Generating Questions...
                            </div>
                        )}
                        {questions.map((q, i) => (
                            <div
                                key={i}
                                onClick={() => setCurrentStep(i)}
                                className={`p-4 rounded-xl cursor-pointer transition-all border ${currentStep === i
                                    ? 'bg-blue-600 text-white shadow-md scale-[1.02]'
                                    : 'bg-white text-slate-600 hover:bg-blue-50 border-slate-200'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${currentStep === i ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'
                                        }`}>Q{i + 1}</span>
                                    <span className={`text-xs ${currentStep === i ? 'text-blue-100' : 'text-slate-400'
                                        }`}>{q.difficulty}</span>
                                </div>
                                <p className={`text-sm font-medium line-clamp-2 ${currentStep === i ? 'text-white' : ''}`}>
                                    {q.question}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center: Interaction Area */}
                <div className="col-span-6 bg-white p-8 flex flex-col overflow-y-auto">
                    {questions.length > 0 && (
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="flex-1 flex flex-col max-w-2xl mx-auto w-full"
                            >
                                <div className="mb-8">
                                    <Badge variant="info" className="mb-4">{questions[currentStep].category}</Badge>
                                    <h2 className="text-3xl font-bold text-slate-800 leading-tight">
                                        {questions[currentStep].question}
                                    </h2>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
                                    <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Mentor Notes / Answer Summary</h4>
                                    <textarea
                                        className="w-full bg-transparent border-0 focus:ring-0 p-0 text-slate-700 min-h-[100px] resize-none text-lg"
                                        placeholder="Type student's key points here..."
                                        value={answers[currentStep] || ''}
                                        onChange={(e) => setAnswers({ ...answers, [currentStep]: e.target.value })}
                                    />
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                                        <button className="text-slate-400 hover:text-blue-600 transition-colors flex items-center gap-2 text-sm font-medium">
                                            <Mic size={16} /> Use Speech-to-Text (Beta)
                                        </button>
                                        <div className="text-xs text-slate-400">Auto-saving...</div>
                                    </div>
                                </div>

                                <div className="mt-auto flex justify-end">
                                    <Button onClick={handleNext} disabled={currentStep === questions.length - 1} className="gap-2">
                                        Next Question <ArrowRight size={18} />
                                    </Button>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    )}
                </div>

                {/* Right: Live Scoring */}
                <div className="col-span-3 bg-slate-50 border-l border-slate-200 p-6 overflow-y-auto">
                    <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <CheckCircle size={18} className="text-emerald-600" /> Live Grading
                    </h3>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                                Viva Performance
                                <span className="text-blue-600">{marks.viva}/25</span>
                            </label>
                            <input
                                type="range"
                                min="0" max="25"
                                value={marks.viva}
                                onChange={(e) => handleScoreChange('viva', e.target.value)}
                                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                                Code Quality
                                <span className="text-blue-600">{marks.codeQuality}/20</span>
                            </label>
                            <input
                                type="range"
                                min="0" max="20"
                                value={marks.codeQuality}
                                onChange={(e) => handleScoreChange('codeQuality', e.target.value)}
                                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                                Logic & Impl.
                                <span className="text-blue-600">{marks.logic}/20</span>
                            </label>
                            <input
                                type="range"
                                min="0" max="20"
                                value={marks.logic}
                                onChange={(e) => handleScoreChange('logic', e.target.value)}
                                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                                Architecture
                                <span className="text-blue-600">{marks.architecture}/15</span>
                            </label>
                            <input
                                type="range"
                                min="0" max="15"
                                value={marks.architecture}
                                onChange={(e) => handleScoreChange('architecture', e.target.value)}
                                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                                Innovation
                                <span className="text-blue-600">{marks.innovation}/20</span>
                            </label>
                            <input
                                type="range"
                                min="0" max="20"
                                value={marks.innovation}
                                onChange={(e) => handleScoreChange('innovation', e.target.value)}
                                className="w-full accent-blue-600 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        <div className="pt-6 border-t border-slate-200">
                            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Grade</p>
                                <p className="text-4xl font-extrabold text-slate-800 mt-1">
                                    {Object.values(marks).reduce((a, b) => a + Number(b), 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VivaSession;
