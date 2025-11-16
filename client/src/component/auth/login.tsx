import React, { useState } from 'react';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Username: ${username}\nPassword: ${password}`);
        // TODO: ต่อ API login จริง
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="bg-[#181818] rounded-lg p-8 w-full max-w-md shadow-xs">
                <h1 className="text-3xl font-bold mb-6 text-white text-center">Login</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold text-gray-300" htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold text-gray-300" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-red-600 text-white py-2 rounded hover:bg-red-500 transition-colors mt-2"
                    >
                        Login
                    </button>
                    <div className='w-full'>
                        <a href="/" className='float-right text-gray-300'>Don't any account</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
