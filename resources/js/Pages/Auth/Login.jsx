import { Head, Link, useForm } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import Header from '@/Components/Header';
import Footer from '@/Components/Footer';

function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login" />
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
                                Welcome Back to<br />
                                <span className="text-[#A41E34]">OKByOwner</span>
                            </h2>
                            <p className="text-white/80 text-lg max-w-md" style={{ fontFamily: '"Poppins", sans-serif' }}>
                                Sign in to manage your property listings, connect with buyers, and take control of your real estate journey.
                            </p>
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
                                        Sign In
                                    </h1>
                                    <p className="text-gray-500" style={{ fontFamily: '"Poppins", sans-serif' }}>
                                        Enter your credentials to access your account
                                    </p>
                                </div>

                                {status && (
                                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-sm font-medium text-green-700">
                                        {status}
                                    </div>
                                )}

                                <form onSubmit={submit} className="space-y-5">
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
                                                autoFocus
                                                onChange={(e) => setData('email', e.target.value)}
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
                                                placeholder="Enter your password"
                                                autoComplete="current-password"
                                                onChange={(e) => setData('password', e.target.value)}
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
                                        {errors.password && (
                                            <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                        )}
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                name="remember"
                                                checked={data.remember}
                                                onChange={(e) => setData('remember', e.target.checked)}
                                                className="w-4 h-4 text-[#A41E34] border-gray-300 rounded focus:ring-[#A41E34]/20 cursor-pointer"
                                            />
                                            <span
                                                className="ml-2 text-sm text-gray-600"
                                                style={{ fontFamily: '"Poppins", sans-serif' }}
                                            >
                                                Remember me
                                            </span>
                                        </label>

                                        {canResetPassword && (
                                            <Link
                                                href={route('password.request')}
                                                className="text-sm text-[#A41E34] hover:text-[#8B1A2C] font-medium transition-colors"
                                                style={{ fontFamily: '"Poppins", sans-serif' }}
                                            >
                                                Forgot password?
                                            </Link>
                                        )}
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-[#A41E34] text-white rounded-full py-4 font-semibold text-base transition-all duration-300 hover:bg-[#8B1A2C] focus:outline-none focus:ring-2 focus:ring-[#A41E34]/20 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                        style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                                    >
                                        {processing ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Signing in...
                                            </span>
                                        ) : (
                                            'Sign In'
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
                                            New to OKByOwner?
                                        </span>
                                    </div>
                                </div>

                                {/* Register Link */}
                                <Link
                                    href={route('register')}
                                    className="w-full flex items-center justify-center border-2 border-[#111111] text-[#111111] rounded-full py-4 font-semibold text-base transition-all duration-300 hover:bg-[#111111] hover:text-white"
                                    style={{ fontFamily: '"Instrument Sans", sans-serif' }}
                                >
                                    Create an Account
                                </Link>
                            </div>

                            {/* Terms */}
                            <p
                                className="mt-6 text-center text-sm text-gray-500"
                                style={{ fontFamily: '"Poppins", sans-serif' }}
                            >
                                By signing in, you agree to our{' '}
                                <Link href="/terms" className="text-[#A41E34] hover:underline">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link href="/privacy" className="text-[#A41E34] hover:underline">
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
Login.layout = (page) => page;

export default Login;
