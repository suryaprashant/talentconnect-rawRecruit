import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GoogleIcon, LinkedinIcon } from './Icons.jsx';
import { authApi } from '../lib/api.js';

const AuthForm = ({ onAuth, isLogin = false }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const title = isLogin ? "Log In" : "Sign Up";

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        try {
            const res = await authApi.login({ email, password });
            if (res?.success) {
                onAuth(true);
            }
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="flex flex-col justify-center py-12 px-6 lg:flex-none lg:px-20 xl:px-24">
            <div className="mx-auto w-full max-w-md lg:w-[28rem]">
                <div>
                    <h2 className="font-serif text-5xl font-bold text-gray-900">{title}</h2>
                    <p className="mt-4 text-sm text-gray-600">Lorem ipsum dolor sit amet adipiscing elit.</p>
                </div>
                <div className="mt-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full h-12 rounded-full border border-gray-300 bg-gray-100 px-5 text-sm shadow-sm focus:border-black focus:ring-black" />
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full h-12 rounded-full border border-gray-300 bg-gray-100 px-5 text-sm shadow-sm focus:border-black focus:ring-black" />
                        {error && <p className="text-sm text-red-600">{error}</p>}
                        <button type="submit" className="flex w-full h-12 items-center justify-center rounded-full border border-transparent bg-black px-6 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2">{title}</button>
                    </form>

                    <div className="my-6 h-px w-full bg-gray-200" />

                    <div className="grid grid-cols-1 gap-3">
                        <button className="flex w-full h-12 items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-6 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"><GoogleIcon /><span>{title} with Google</span></button>
                        <button className="flex w-full h-12 items-center justify-center gap-3 rounded-full border border-gray-300 bg-white px-6 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"><LinkedinIcon /><span>{title} with LinkedIn</span></button>
                    </div>

                    <p className="mt-8 text-center text-sm text-gray-600">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                        <Link to={isLogin ? '/signup' : '/login'} className="font-medium text-black hover:underline">{isLogin ? "Sign Up" : "Log In"}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthForm;

