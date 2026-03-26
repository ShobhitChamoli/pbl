import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { Card, Button, Input } from '../../components/UI';
import { Lock, Mail, ArrowRight } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await login(email, password);
            if (data.role === 'student') navigate('/student/dashboard');
            else if (data.role === 'mentor') navigate('/mentor/dashboard');
            else if (data.role === 'admin') navigate('/admin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md slide-up">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold gradient-text mb-2">Welcome Back</h1>
                    <p className="text-gray-400">Sign in to continue to AuditX</p>
                </div>

                <Card className="backdrop-blur-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <Input
                            type="email"
                            placeholder="Email Address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            icon={<Mail size={18} />}
                            label="Email"
                        />

                        <Input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            icon={<Lock size={18} />}
                            label="Password"
                            error={error}
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                                <input type="checkbox" className="rounded border-gray-600 bg-white/5 text-primary focus:ring-primary/20" />
                                Remember me
                            </label>
                            <a href="#" className="text-primary hover:text-secondary transition-colors">Forgot password?</a>
                        </div>

                        <Button type="submit" className="w-full flex items-center justify-center gap-2" loading={loading}>
                            {!loading && (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10">
                        <p className="text-center text-gray-400 text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-primary hover:text-secondary font-semibold transition-colors">
                                Create Account
                            </Link>
                        </p>
                    </div>

                </Card>
            </div>
        </div>
    );
};

export default Login;
