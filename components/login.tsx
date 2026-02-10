import React from 'react';
import { setRole, Role } from '../services/auth';

type Props = {
    onLogin: (role: Role) => void;
};

export const Login: React.FC<Props> = ({ onLogin }) => {
    const handleLogin = (role: Role) => {
        setRole(role);
        onLogin(role);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm space-y-4">
                <h1 className="text-xl font-bold text-center">CashClose Login</h1>

                <button
                    onClick={() => handleLogin('admin')}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg"
                >
                    Entrar como ADMIN
                </button>

                <button
                    onClick={() => handleLogin('staff')}
                    className="w-full bg-gray-200 py-3 rounded-lg"
                >
                    Entrar como FUNCIONÁRIO
                </button>
            </div>
        </div>
    );
};
