import { useLocation } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import Testimonial from '../components/Testimonial';

const AuthPage = ({ onAuth }) => {
    const location = useLocation();
    const isLogin = location.pathname === '/login';

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
            <header className="absolute top-0 left-0 p-8"><h1 className="font-serif text-2xl font-bold">Logo</h1></header>
            <main className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
                <AuthForm onAuth={onAuth} isLogin={isLogin} />
                <Testimonial />
            </main>
            <footer className="absolute bottom-0 left-0 p-8"><p className="text-sm text-gray-500">&copy; 2025 RawRecruit</p></footer>
        </div>
    );
};

export default AuthPage;

