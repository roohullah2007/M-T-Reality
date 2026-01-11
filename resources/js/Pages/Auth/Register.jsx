import { Head, Link, useForm } from '@inertiajs/react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle2, Home, Search } from 'lucide-react';
import { useState } from 'react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        user_type: 'buyer',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '' };
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;

        const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
        const colors = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];

        return { strength, label: labels[strength], color: colors[strength] };
    };

    const passwordStrength = getPasswordStrength(data.password);

    return (
        <>
            <Head title="Create Account" />
            <Header />

            <main className="min-h-screen bg-[#F8F7F5] pt-[77px]">
                <div className="flex min-h-[calc(100vh-77px)]">
                    {/* Left Side - Image */}
                    <div className="hidden lg:flex lg:w-1/2 relative">
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{
                                backgroundImage: 'url(/images/hero-1.avif)',
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
                        </div>
                        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
                            <h2
                                className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-6"
                                style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                            >
                                Join<br />
                                <span className="text-[#A41E34]">OKByOwner</span>
                            </h2>
                            <p className="text-white/80 text-lg max-w-md mb-8" style={{ fontFamily: '"Poppins", sans-serif' }}>
                                Create your free account and start your journey to selling or buying property directly, without the middleman.
                            </p>

                            {/* Benefits */}
                            <div className="space-y-4">
                                {[
                                    'List your property for free',
                                    'Connect directly with buyers',
                                    'Save thousands in commission fees',
                                    'Full control over your listings'
                                ].map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-[#A41E34]" />
                                        <span className="text-white/90" style={{ fontFamily: '"Poppins", sans-serif' }}>
                                            {benefit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Form */}
                    <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
                        <div className="w-full max-w-md">
                            {/* Mobile Logo */}
                            <div className="lg:hidden text-center mb-8">
                                <Link href="/">
                                    <img
                                        src="/images/okbyowner-logo.png"
                                        alt="OKByOwner"
                                        className="h-10 mx-auto"
                                    />
                                </Link>
                            </div>

                            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10">
                                <div className="text-center mb-8">
                                    <h1
                                        className="text-3xl font-bold text-[#111111] mb-2"
                                        style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                                    >
                                        Create Account
                                    </h1>
                                    <p className="text-gray-500" style={{ fontFamily: '"Poppins", sans-serif' }}>
                                        Fill in your details to get started
                                    </p>
                                </div>

                                <form onSubmit={submit} className="space-y-5">
                                    {/* User Type Selection */}
                                    <div>
                                        <label
                                            className="block text-sm font-semibold text-[#111111] mb-3"
                                            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                                        >
                                            I am a
                                        </label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setData('user_type', 'buyer')}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                                                    data.user_type === 'buyer'
                                                        ? 'border-[#A41E34] bg-[#A41E34]/5'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className={`p-3 rounded-full ${
                                                    data.user_type === 'buyer'
                                                        ? 'bg-[#A41E34] text-white'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    <Search className="w-5 h-5" />
                                                </div>
                                                <span className={`font-semibold ${
                                                    data.user_type === 'buyer'
                                                        ? 'text-[#A41E34]'
                                                        : 'text-gray-700'
                                                }`} style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                                                    Buyer
                                                </span>
                                                <span className="text-xs text-gray-500 text-center">
                                                    Looking for property
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('user_type', 'seller')}
                                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-300 ${
                                                    data.user_type === 'seller'
                                                        ? 'border-[#A41E34] bg-[#A41E34]/5'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            >
                                                <div className={`p-3 rounded-full ${
                                                    data.user_type === 'seller'
                                                        ? 'bg-[#A41E34] text-white'
                                                        : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    <Home className="w-5 h-5" />
                                                </div>
                                                <span className={`font-semibold ${
                                                    data.user_type === 'seller'
                                                        ? 'text-[#A41E34]'
                                                        : 'text-gray-700'
                                                }`} style={{ fontFamily: '"Instrument Sans", sans-serif' }}>
                                                    Seller
                                                </span>
                                                <span className="text-xs text-gray-500 text-center">
                                                    Selling my property
                                                </span>
                                            </button>
                                        </div>
                                        {errors.user_type && (
                                            <p className="mt-2 text-sm text-red-600">{errors.user_type}</p>
                                        )}
                                    </div>

                                    {/* Name Field */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-semibold text-[#111111] mb-2"
                                            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                                        >
                                            Full Name
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <User className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="name"
                                                type="text"
                                                name="name"
                                                value={data.name}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-[#111111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] transition-all duration-300"
                                                style={{ fontFamily: '"Poppins", sans-serif' }}
                                                placeholder="John Doe"
                                                autoComplete="name"
                                                autoFocus
                                                onChange={(e) => setData('name', e.target.value)}
                                                required
                                            />
                                        </div>
                                        {errors.name && (
                                            <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    {/* Email Field */}
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className="block text-sm font-semibold text-[#111111] mb-2"
                                            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                                        >
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Mail className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="email"
                                                type="email"
                                                name="email"
                                                value={data.email}
                                                className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl text-[#111111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] transition-all duration-300"
                                                style={{ fontFamily: '"Poppins", sans-serif' }}
                                                placeholder="you@example.com"
                                                autoComplete="username"
                                                onChange={(e) => setData('email', e.target.value)}
                                                required
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>

                                    {/* Password Field */}
                                    <div>
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-semibold text-[#111111] mb-2"
                                            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                                        >
                                            Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={data.password}
                                                className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl text-[#111111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] transition-all duration-300"
                                                style={{ fontFamily: '"Poppins", sans-serif' }}
                                                placeholder="Create a strong password"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {/* Password Strength Indicator */}
                                        {data.password && (
                                            <div className="mt-2">
                                                <div className="flex gap-1 mb-1">
                                                    {[1, 2, 3, 4].map((level) => (
                                                        <div
                                                            key={level}
                                                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                                                level <= passwordStrength.strength
                                                                    ? passwordStrength.color
                                                                    : 'bg-gray-200'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Password strength: <span className="font-medium">{passwordStrength.label}</span>
                                                </p>
                                            </div>
                                        )}
                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div>
                                        <label
                                            htmlFor="password_confirmation"
                                            className="block text-sm font-semibold text-[#111111] mb-2"
                                            style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                                        >
                                            Confirm Password
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                id="password_confirmation"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl text-[#111111] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:border-[#A41E34] transition-all duration-300"
                                                style={{ fontFamily: '"Poppins", sans-serif' }}
                                                placeholder="Confirm your password"
                                                autoComplete="new-password"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        {/* Password Match Indicator */}
                                        {data.password_confirmation && (
                                            <p className={`mt-2 text-xs ${
                                                data.password === data.password_confirmation
                                                    ? 'text-green-600'
                                                    : 'text-red-600'
                                            }`}>
                                                {data.password === data.password_confirmation
                                                    ? 'Passwords match'
                                                    : 'Passwords do not match'
                                                }
                                            </p>
                                        )}
                                        {errors.password_confirmation && (
                                            <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-[#A41E34] text-white rounded-full py-4 font-semibold text-base transition-all duration-300 hover:bg-[#8B1A2C] focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
                                        style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Creating Account...
                                            </span>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </button>
                                </form>

                                {/* Divider */}
                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-200"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-white text-gray-500" style={{ fontFamily: '"Poppins", sans-serif' }}>
                                            Already have an account?
                                        </span>
                                    </div>
                                </div>

                                {/* Login Link */}
                                <Link
                                    href={route('login')}
                                    className="w-full flex items-center justify-center border-2 border-[#111111] text-[#111111] rounded-full py-4 font-semibold text-base transition-all duration-300 hover:bg-[#111111] hover:text-white"
                                    style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                                >
                                    Sign In Instead
                                </Link>
                            </div>

                            {/* Terms */}
                            <p
                                className="mt-6 text-center text-sm text-gray-500"
                                style={{ fontFamily: '"Poppins", sans-serif' }}
                            >
                                By creating an account, you agree to our{' '}
                                <Link href="/terms-of-use" className="text-[#A41E34] hover:underline">
                                    Terms of Use
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy-policy" className="text-[#A41E34] hover:underline">
                                    Privacy Policy
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </>
    );
}

// Opt out of the default MainLayout
Register.layout = (page) => page;

export default Register;
