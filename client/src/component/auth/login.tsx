import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { table_number } = useParams();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || `Login failed with status: ${res.status}`);
                return;
            }

            localStorage.setItem("token", data.token);
            alert("Login Success!");
            window.location.href = '/dashboard';

        }
        catch (err) {
            console.error("Fetch/JSON Error:", err);
            alert("Server error: Cannot connect to server or response is invalid.");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gray-300">
            <div className="bg-gray-100 border-2 border-gray-300 rounded-lg p-8 w-full max-w-md shadow-2xl">
                <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Login</h1>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold text-gray-600" htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            className="border border-gray-200 text-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            required
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="mb-2 font-semibold text-gray-600" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="border border-gray-200 text-gray-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-gray-800 text-gray-200 py-2 rounded hover:bg-red-500 transition-colors mt-2 disabled:bg-gray-600"
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>

                    <div className='w-full'>
                        <a href={`/${table_number}/`} className='float-right text-gray-600'>Don't have any account?</a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
