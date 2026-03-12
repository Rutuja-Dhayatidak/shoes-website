import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { loginUser } from '../../api/authApi';
import { toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await loginUser({ email: formData.email, password: formData.password });
            const data = response.data;

            // Save token and user data
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({
                _id: data._id,
                name: data.name,
                email: data.email,
                role: data.role
            }));

            toast.success("Login Successful \u2705", {
                position: "top-right",
                autoClose: 1000,
            });

            // Role based redirect
            setTimeout(() => {
                if (data.role === "admin") {
                    navigate("/admin");
                } else if (data.role === "vendor") {
                    navigate("/vendor/dashboard");
                } else {
                    navigate("/");
                }
            }, 1000);
        } catch (error) {
            toast.error(error.response?.data?.message || "Login Failed", {
                position: "top-right",
                autoClose: 1000,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen bg-[#0a0f1a] flex flex-col justify-between overflow-hidden perspective-1000">
            <Navbar />

            {/* Background glowing elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="w-full max-w-md mx-auto z-10 my-auto px-4 mt-32 mb-16 relative perspective-[2000px]">

                {/* Header Container (Always visible, stays on top) */}
                <div className="text-center mb-8 relative z-50">
                    <h2 className="text-3xl font-bold text-white uppercase tracking-wider mb-2">Welcome Back</h2>
                    <p className="text-gray-400 text-sm">Enter your credentials to access your account</p>

                    {/* Progress indicators - Hidden but keeps spacing consistent with register */}
                    <div className="flex justify-center space-x-3 mt-6 opacity-0">
                        <div className="h-1.5 w-8 rounded-full bg-white transition-all duration-500" />
                    </div>
                </div>

                {/* Form Container with 3D context */}
                <div className="relative preserve-3d w-full pb-[450px]">

                    {/* Step 1: Login */}
                    <div
                        className="absolute top-0 left-0 w-full bg-white/5 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] transform-origin-bottom transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] will-change-transform backface-hidden opacity-100 z-30 translate-y-0 rotate-x-0"
                    >
                        <h3 className="text-xl font-semibold text-white mb-6 uppercase tracking-wider border-b border-white/10 pb-4">Login</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">

                            {/* Email Field */}
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

                            {/* Password Field */}
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest" htmlFor="password">
                                        Password
                                    </label>
                                    <Link to="/forgot-password" className="text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                                        Forgot Password?
                                    </Link>
                                </div>
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

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-white text-[#0a0f1a] hover:bg-gray-200 transition-colors duration-300 text-sm uppercase tracking-[0.2em] font-bold py-4 rounded-xl mt-4 relative overflow-hidden group disabled:opacity-70"
                            >
                                <span className={`flex items-center justify-center relative z-10 transition-all duration-300 ${isLoading ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'}`}>
                                    Access Account
                                </span>

                                {/* Loading state animation */}
                                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isLoading ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-4'}`}>
                                    <svg className="animate-spin h-5 w-5 text-[#0a0f1a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>

                                <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                            </button>


                        </form>
                    </div>
                </div>

                <div className="mt-8 text-center relative z-50">
                    <p className="text-gray-400 text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-white hover:underline transition-all">
                            Register Here
                        </Link>
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default Login;
