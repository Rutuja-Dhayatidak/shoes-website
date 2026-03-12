import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { registerUser } from '../../api/authApi';
import { toast } from 'react-toastify';

const Register = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = (e) => {
        e.preventDefault();

        // Validation for Step 2
        if (step === 2) {
            if (formData.password !== formData.confirmPassword) {
                toast.error("Passwords do not match!", {
                    position: "top-right",
                    autoClose: 3000,
                });
                return;
            }
        }

        if (step < 3) setStep(step + 1);
    };

    const prevStep = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await registerUser(formData);
            toast.success("Registration Successful \u2705", {
                position: "top-right",
                autoClose: 1000,
            });
            console.log(response.data);
            setTimeout(() => {
                navigate('/login');
            }, 1000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Error", {
                position: "top-right",
                autoClose: 1000,
            });
        }
    };

    return (
        <div className="relative min-h-screen bg-[#0a0f1a] flex flex-col justify-between overflow-hidden perspective-1000">
            <Navbar />

            {/* Background elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md mx-auto z-10 my-auto px-4 mt-32 mb-16 relative perspective-[2000px]">

                {/* Header Container (Always visible, stays on top) */}
                <div className="text-center mb-8 relative z-50">
                    <h2 className="text-3xl font-bold text-white uppercase tracking-wider mb-2">Create Account</h2>
                    <p className="text-gray-400 text-sm">Join us to explore the latest collections</p>

                    {/* Progress indicators */}
                    <div className="flex justify-center space-x-3 mt-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-white' : 'w-4 bg-white/20'}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Form Container with 3D context */}
                <div className="relative preserve-3d w-full pb-[450px]">

                    {/* Step 1: Basic Info */}
                    <div
                        className={`absolute top-0 left-0 w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transform-origin-bottom transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform backface-hidden ${step === 1 ? 'opacity-100 z-30 translate-y-0 rotate-x-0' :
                            step > 1 ? 'opacity-0 z-10 -translate-y-[20%] rotate-x-[90deg] pointer-events-none' : ''
                            }`}
                    >
                        <h3 className="text-xl font-semibold text-white mb-6 uppercase tracking-wider border-b border-white/10 pb-4">Step 1: Identity</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2" htmlFor="name">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors duration-300"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2" htmlFor="email">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors duration-300"
                                    placeholder="john@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2" htmlFor="role">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 focus:bg-[#1a2333] transition-colors duration-300 appearance-none"
                                >
                                    <option value="user" className="bg-[#0a0f1a] text-white">User</option>
                                    <option value="vendor" className="bg-[#0a0f1a] text-white">Vendor</option>
                                </select>
                            </div>
                            <button
                                onClick={nextStep}
                                className="w-full bg-white text-[#0a0f1a] hover:bg-gray-200 transition-colors duration-300 text-sm uppercase tracking-[0.2em] font-bold py-4 rounded-xl mt-4"
                            >
                                Continue to Security
                            </button>


                        </div>
                    </div>

                    {/* Step 2: Security */}
                    <div
                        className={`absolute top-0 left-0 w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transform-origin-top transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform backface-hidden ${step === 2 ? 'opacity-100 z-30 translate-y-0 rotate-x-0' :
                            step < 2 ? 'opacity-0 z-10 translate-y-[20%] -rotate-x-[90deg] pointer-events-none' :
                                'opacity-0 z-10 -translate-y-[20%] rotate-x-[90deg] pointer-events-none'
                            }`}
                    >
                        <h3 className="text-xl font-semibold text-white mb-6 uppercase tracking-wider border-b border-white/10 pb-4">Step 2: Security</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        name="password"
                                        required
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors duration-300 pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2" htmlFor="confirmPassword">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        required
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-colors duration-300 pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showConfirmPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            <div className="flex space-x-4 pt-4">
                                <button
                                    onClick={prevStep}
                                    className="w-1/3 bg-transparent border border-white/20 text-white hover:bg-white/10 transition-colors duration-300 text-xs uppercase tracking-[0.1em] font-bold py-4 rounded-xl"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={nextStep}
                                    className="w-2/3 bg-white text-[#0a0f1a] hover:bg-gray-200 transition-colors duration-300 text-xs uppercase tracking-[0.1em] font-bold py-4 rounded-xl"
                                >
                                    Final Step
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Finish */}
                    <div
                        className={`absolute top-0 left-0 w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transform-origin-top transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform backface-hidden ${step === 3 ? 'opacity-100 z-30 translate-y-0 rotate-x-0' :
                            'opacity-0 z-10 translate-y-[20%] -rotate-x-[90deg] pointer-events-none'
                            }`}
                    >
                        <div className="text-center space-y-6">
                            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50">
                                <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white uppercase tracking-wider">Almost Done!</h3>
                            <p className="text-gray-400 text-sm mb-8">
                                Please review your details and confirm registration to join our exclusive members.
                            </p>

                            <div className="flex space-x-4 pt-4">
                                <button
                                    onClick={prevStep}
                                    className="w-1/3 bg-transparent border border-white/20 text-white hover:bg-white/10 transition-colors duration-300 text-xs uppercase tracking-[0.1em] font-bold py-4 rounded-xl"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    className="w-2/3 bg-white text-[#0a0f1a] hover:bg-gray-200 transition-colors duration-300 text-xs uppercase tracking-[0.1em] font-bold py-4 rounded-xl relative overflow-hidden group"
                                >
                                    <span className="relative z-10">Complete</span>
                                    <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center relative z-50">
                    <p className="text-gray-400 text-sm">
                        Already have an account?{' '}
                        <Link to="/login" className="text-white hover:underline transition-all">
                            Login Here
                        </Link>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Register;
