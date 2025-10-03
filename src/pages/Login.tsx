import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from 'lucide-react';

const mockUsers = [
    {
        name: 'Admin do Sistema',
        email: 'admin@mercado.com',
        password: '123'
    }
];

interface AuthPageProps {
    onLoginSuccess: (userName: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const user = mockUsers.find(
            (u) => u.email === loginData.email && u.password === loginData.password
        );

        if (user) {
            alert(`Login bem-sucedido! Bem-vindo(a) de volta, ${user.name}.`);
            onLoginSuccess(user.name);
        } else {
            alert('E-mail ou senha inválidos. Tente "admin@mercado.com" e "123".');
        }
    };

    const handleSignupSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (signupData.password !== signupData.confirmPassword) {
            alert('As senhas não coincidem!');
            return;
        }

        const existingUser = mockUsers.find((u) => u.email === signupData.email);
        if (existingUser) {
            alert('Este e-mail já está cadastrado. Por favor, faça login.');
            setIsLogin(true);
            return;
        }

        const newUser = { name: signupData.name, email: signupData.email, password: signupData.password };
        mockUsers.push(newUser);

        console.log('Usuários atualizados:', mockUsers);
        alert('Cadastro realizado com sucesso! Você será logado automaticamente.');
        onLoginSuccess(newUser.name);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F5F5F5' }}>
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header com toggle */}
                    <div className="flex border-b" style={{ borderColor: '#E0E0E0' }}>
                        <button
                            onClick={() => setIsLogin(true)}
                            className={`flex-1 py-4 text-center font-semibold transition-all ${isLogin ? 'border-b-2' : 'hover:bg-gray-50'
                                }`}
                            style={{
                                color: isLogin ? '#4CAF50' : '#666666',
                                borderBottomColor: isLogin ? '#4CAF50' : 'transparent',
                                backgroundColor: isLogin ? '#F1F8E9' : 'transparent'
                            }}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setIsLogin(false)}
                            className={`flex-1 py-4 text-center font-semibold transition-all ${!isLogin ? 'border-b-2' : 'hover:bg-gray-50'
                                }`}
                            style={{
                                color: !isLogin ? '#4CAF50' : '#666666',
                                borderBottomColor: !isLogin ? '#4CAF50' : 'transparent',
                                backgroundColor: !isLogin ? '#F1F8E9' : 'transparent'
                            }}
                        >
                            Cadastro
                        </button>
                    </div>

                    <div className="p-8">
                        {isLogin ? (
                            // CORREÇÃO: Adicionada a tag <form> aqui
                            <form onSubmit={handleLoginSubmit}>
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2" style={{ color: '#333333' }}>
                                            Bem-vindo de volta!
                                        </h2>
                                        <p style={{ color: '#666666' }}>
                                            Entre com suas credenciais para continuar
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                                                E-mail
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#999999' }} />
                                                <input
                                                    type="email"
                                                    value={loginData.email}
                                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition"
                                                    style={{ borderColor: '#DDDDDD', color: '#333333' }}
                                                    onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                                                    onBlur={(e) => e.target.style.borderColor = '#DDDDDD'}
                                                    placeholder="seu@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                                                Senha
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#999999' }} />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={loginData.password}
                                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                                    className="w-full pl-10 pr-12 py-3 border rounded-lg outline-none transition"
                                                    style={{ borderColor: '#DDDDDD', color: '#333333' }}
                                                    onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                                                    onBlur={(e) => e.target.style.borderColor = '#DDDDDD'}
                                                    placeholder="••••••••"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition"
                                                    style={{ color: '#999999' }}
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 rounded cursor-pointer" style={{ accentColor: '#4CAF50' }} />
                                            <span className="ml-2 text-sm" style={{ color: '#666666' }}>Lembrar-me</span>
                                        </label>
                                        <button type="button" className="text-sm font-medium hover:opacity-80 transition" style={{ color: '#FF9800' }}>
                                            Esqueceu a senha?
                                        </button>
                                    </div>
                                    
                                    {/* CORREÇÃO: O botão agora é do tipo "submit" */}
                                    <button
                                        type="submit"
                                        className="w-full py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                                        style={{ backgroundColor: '#4CAF50' }}
                                    >
                                        Entrar
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <form onSubmit={handleSignupSubmit}>
                                <div className="space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold mb-2" style={{ color: '#333333' }}>
                                            Crie sua conta
                                        </h2>
                                        <p style={{ color: '#666666' }}>
                                            Preencha os dados para começar
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                                                Nome completo
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#999999' }} />
                                                <input
                                                    type="text"
                                                    value={signupData.name}
                                                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition"
                                                    style={{ borderColor: '#DDDDDD', color: '#333333' }}
                                                    onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                                                    onBlur={(e) => e.target.style.borderColor = '#DDDDDD'}
                                                    placeholder="João Silva"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                                                E-mail
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#999999' }} />
                                                <input
                                                    type="email"
                                                    value={signupData.email}
                                                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition"
                                                    style={{ borderColor: '#DDDDDD', color: '#333333' }}
                                                    onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                                                    onBlur={(e) => e.target.style.borderColor = '#DDDDDD'}
                                                    placeholder="seu@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                                                Senha
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#999999' }} />
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    value={signupData.password}
                                                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                                    className="w-full pl-10 pr-12 py-3 border rounded-lg outline-none transition"
                                                    style={{ borderColor: '#DDDDDD', color: '#333333' }}
                                                    onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                                                    onBlur={(e) => e.target.style.borderColor = '#DDDDDD'}
                                                    placeholder="••••••••"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition"
                                                    style={{ color: '#999999' }}
                                                >
                                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2" style={{ color: '#333333' }}>
                                                Confirmar senha
                                            </label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#999999' }} />
                                                <input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    value={signupData.confirmPassword}
                                                    onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                                    className="w-full pl-10 pr-12 py-3 border rounded-lg outline-none transition"
                                                    style={{ borderColor: '#DDDDDD', color: '#333333' }}
                                                    onFocus={(e) => e.target.style.borderColor = '#4CAF50'}
                                                    onBlur={(e) => e.target.style.borderColor = '#DDDDDD'}
                                                    placeholder="••••••••"
                                                    required
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition"
                                                    style={{ color: '#999999' }}
                                                >
                                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-start cursor-pointer">
                                            <input type="checkbox" className="w-4 h-4 mt-1 rounded cursor-pointer" style={{ accentColor: '#4CAF50' }} required />
                                            <span className="ml-2 text-sm" style={{ color: '#666666' }}>
                                                Aceito os <button type="button" className="font-medium hover:opacity-80 transition" style={{ color: '#2E7D32' }}>termos de uso</button> e a <button type="button" className="font-medium hover:opacity-80 transition" style={{ color: '#2E7D32' }}>política de privacidade</button>
                                            </span>
                                        </label>
                                    </div>
                                    
                                    {/* CORREÇÃO: O botão agora é do tipo "submit" */}
                                    <button
                                        type="submit"
                                        className="w-full py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
                                        style={{ backgroundColor: '#4CAF50' }}
                                    >
                                        Criar conta
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                <p className="text-center mt-6 text-sm" style={{ color: '#666666' }}>
                    © 2025 Todos os direitos reservados
                </p>
            </div>
        </div>
    );
};

export default AuthPage;
