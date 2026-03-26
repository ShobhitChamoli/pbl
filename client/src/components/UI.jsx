import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidth} overflow-hidden`}
            >
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="text-lg font-bold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </motion.div>
        </div>
    );
};

export const Card = ({ children, className = '', hover = true, ...props }) => (
    <motion.div
        className={`glass-panel p-6 ${className}`}
        whileHover={hover ? { y: -4, scale: 1.01 } : {}}
        transition={{ duration: 0.2, ease: "easeOut" }}
        {...props}
    >
        {children}
    </motion.div>
);

export const Button = ({ children, variant = 'primary', className = '', loading = false, ...props }) => (
    <motion.button
        className={`glass-button ${variant === 'primary' ? 'btn-primary' : variant === 'outline' ? 'btn-outline' : 'btn-secondary'} px-6 py-2.5 ${className} ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        disabled={loading}
        whileHover={!loading ? { scale: 1.02 } : {}}
        whileTap={!loading ? { scale: 0.98 } : {}}
        transition={{ duration: 0.15 }}
        {...props}
    >
        {loading ? (
            <div className="flex items-center gap-2">
                <div className="w-4 h-4 loading-spinner"></div>
                <span>Loading...</span>
            </div>
        ) : children}
    </motion.button>
);

export const Input = ({ label, error, icon, ...props }) => (
    <div className="mb-4 fade-in">
        {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
        <div className="relative group">
            {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">{icon}</div>}
            <input
                className={`glass-input ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''} ${icon ? 'pl-10' : ''}`}
                {...props}
            />
        </div>
        {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1 font-medium">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
        </p>}
    </div>
);

export const Select = ({ label, error, icon, children, ...props }) => (
    <div className="mb-4 fade-in">
        {label && <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>}
        <div className="relative group">
            {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">{icon}</div>}
            <select
                className={`glass-input appearance-none ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : ''} ${icon ? 'pl-10' : ''}`}
                {...props}
            >
                {children}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
            </div>
        </div>
        {error && <p className="text-red-500 text-xs mt-1 flex items-center gap-1 font-medium">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
        </p>}
    </div>
);

export const Badge = ({ children, variant = 'primary', className = '' }) => {
    // Enterprise pill badges with solid distinct colors
    const variants = {
        primary: 'bg-blue-50 text-blue-700 border-blue-200',
        success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        warning: 'bg-amber-50 text-amber-700 border-amber-200',
        danger: 'bg-red-50 text-red-700 border-red-200',
        info: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] || variants.info} ${className}`}>
            {children}
        </span>
    );
};

export const StatCard = ({ title, value, icon, trend, className = '' }) => (
    <div className={`stat-card ${className}`}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-slate-500 text-sm font-semibold uppercase tracking-wide mb-1">{title}</p>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">{value}</p>
                {trend && (
                    <p className={`text-xs mt-2 flex items-center gap-1 font-medium ${trend > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </p>
                )}
            </div>
            {icon && <div className="text-blue-500/20 text-4xl p-2 rounded-xl bg-blue-50">{icon}</div>}
        </div>
    </div>
);

export const LoadingSpinner = ({ size = 'md' }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    return (
        <div className="flex items-center justify-center p-8">
            <div className={`loading-spinner ${sizes[size]}`}></div>
        </div>
    );
};
