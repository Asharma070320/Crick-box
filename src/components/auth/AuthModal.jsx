import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal';

export default function AuthModal() {
    const { isAuthModalOpen, closeAuthModal, signInWithEmail, signUpWithEmail, signInWithGoogle } = useAuth();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    if (!isAuthModalOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        let result;
        if (isSignUp) {
            if (!name.trim()) {
                setError('Name is required');
                setLoading(false);
                return;
            }
            result = await signUpWithEmail(email, password, name);
        } else {
            result = await signInWithEmail(email, password);
        }

        if (result?.error) {
            setError(result.error);
        }
        setLoading(false);
    };

    // Reset state when toggling tabs
    const toggleMode = (signup) => {
        setIsSignUp(signup);
        setError('');
        setEmail('');
        setPassword('');
        setName('');
    };

    return (
        <Modal isOpen={isAuthModalOpen} onClose={closeAuthModal} title={isSignUp ? "Create Account" : "Welcome Back"}>
            <div className="space-y-4">
                {/* Tabs */}
                <div className="flex p-1 bg-surface-800 rounded-xl mb-4">
                    <button
                        onClick={() => toggleMode(false)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isSignUp ? 'bg-primary-600 text-white shadow' : 'text-surface-400 hover:text-white'}`}
                        type="button"
                    >
                        Sign In
                    </button>
                    <button
                        onClick={() => toggleMode(true)}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isSignUp ? 'bg-primary-600 text-white shadow' : 'text-surface-400 hover:text-white'}`}
                        type="button"
                    >
                        Sign Up
                    </button>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-900/30 border border-red-500/50 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-3">
                    {isSignUp && (
                        <div>
                            <label className="text-xs text-surface-400 mb-1 block">Full Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="input text-sm w-full"
                                placeholder="Virat Kohli"
                                required={isSignUp}
                            />
                        </div>
                    )}
                    <div>
                        <label className="text-xs text-surface-400 mb-1 block">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="input text-sm w-full"
                            placeholder="player@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="text-xs text-surface-400 mb-1 block">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input text-sm w-full"
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary w-full py-3 mt-4"
                    >
                        {loading ? 'Processing...' : (isSignUp ? 'Create Account' : 'Sign In')}
                    </button>
                </form>

                <div className="flex items-center gap-3 my-2">
                    <div className="flex-1 h-px bg-surface-700" />
                    <span className="text-xs text-surface-500">or</span>
                    <div className="flex-1 h-px bg-surface-700" />
                </div>

                <button
                    type="button"
                    onClick={async () => {
                        setError('');
                        setGoogleLoading(true);
                        const result = await signInWithGoogle();
                        if (result?.error) setError(result.error);
                        setGoogleLoading(false);
                    }}
                    disabled={googleLoading}
                    className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-surface-600 bg-surface-800 hover:bg-surface-700 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M47.532 24.552c0-1.636-.147-3.2-.42-4.704H24.48v8.897h12.983c-.56 3.02-2.26 5.58-4.816 7.296v6.063h7.796c4.56-4.2 7.09-10.38 7.09-17.552z" fill="#4285F4"/>
                        <path d="M24.48 48c6.504 0 11.964-2.156 15.952-5.84l-7.796-6.063c-2.156 1.444-4.912 2.3-8.156 2.3-6.276 0-11.592-4.24-13.492-9.936H2.924v6.256C6.9 42.952 15.12 48 24.48 48z" fill="#34A853"/>
                        <path d="M10.988 28.46A14.46 14.46 0 0 1 10.22 24c0-1.556.268-3.068.768-4.46v-6.256H2.924A23.97 23.97 0 0 0 .48 24c0 3.868.928 7.532 2.444 10.716l8.064-6.256z" fill="#FBBC05"/>
                        <path d="M24.48 9.604c3.532 0 6.704 1.216 9.196 3.604l6.892-6.892C36.436 2.392 30.984 0 24.48 0 15.12 0 6.9 5.048 2.924 13.284l8.064 6.256c1.9-5.696 7.216-9.936 13.492-9.936z" fill="#EA4335"/>
                    </svg>
                    {googleLoading ? 'Signing in...' : 'Continue with Google'}
                </button>

            </div>
        </Modal>
    );
}
