import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { Card, Button, Input } from '../../components/UI';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student' });
    const [error, setError] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await register(formData.name, formData.email, formData.password, formData.role);
            if (data.role === 'student') navigate('/student/dashboard');
            else navigate('/mentor/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <Card className="w-full max-w-md">
                <h2 className="text-3xl font-bold text-center mb-8 gradient-text">Join AuditX</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="name" placeholder="Full Name" onChange={handleChange} required />
                    <Input name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
                    <Input name="password" type="password" placeholder="Password" onChange={handleChange} required />

                    <div className="space-y-1">
                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">Role</label>
                        <div className="relative group">
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="glass-input appearance-none bg-no-repeat bg-right pr-6"
                                style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em' }}
                            >
                                <option value="student">Student</option>
                                <option value="mentor">Mentor</option>
                            </select>
                        </div>
                    </div>



                    {error && <p className="text-red-400 text-sm text-center">{error}</p>}
                    <Button type="submit" className="w-full mt-4">Create Account</Button>
                </form>
                <p className="mt-6 text-center text-slate-500 text-sm font-medium">
                    Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">Login</Link>
                </p>
            </Card>
        </div>
    );
};

export default Register;
