import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";

// ====== CONFIG ======
const API_URL = "https://56d4a4e5459c.ngrok-free.app";

// Helpers de auth para outras telas usarem também
export function getToken(): string | null {
  return localStorage.getItem("auth_token");
}
export function getAuthHeaders(): HeadersInit {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
}
export function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_name");
}

async function safeError(res: Response) {
  try {
    const data = await res.json();
    return data?.message || data?.error || res.statusText;
  } catch {
    return res.statusText;
  }
}

// Tipos de resposta esperados do backend
type SignResponse = {
  token: string;
  user?: { id?: string | number; name?: string; email?: string };
};

interface AuthPageProps {
  onLoginSuccess: (userName: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Auto-login se já tiver token salvo
  useEffect(() => {
    const t = getToken();
    const savedName = localStorage.getItem("auth_name") || "";
    if (t && savedName) {
      onLoginSuccess(savedName);
    }
  }, [onLoginSuccess]);

  async function login() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      if (!res.ok) {
        const msg = await safeError(res);
        throw new Error(msg || "Falha no login");
      }

      const data: SignResponse = await res.json();
      if (!data.token) throw new Error("Resposta sem token");

      localStorage.setItem("auth_token", data.token);
      const name = data.user?.name || loginData.email.split("@")[0];
      localStorage.setItem("auth_name", name);

      onLoginSuccess(name);
    } catch (err: any) {
      alert(err.message || "Erro ao autenticar");
    } finally {
      setLoading(false);
    }
  }

  async function signup() {
    if (signupData.password !== signupData.confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ajuste aqui se o backend usar record/dto com outros nomes
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
        }),
      });

      if (!res.ok) {
        const msg = await safeError(res);
        throw new Error(msg || "Falha no cadastro");
      }

      const data: SignResponse = await res.json();

      // se seu backend já retorna token no signup:
      if (data.token) {
        localStorage.setItem("auth_token", data.token);
        const name = data.user?.name || signupData.name;
        localStorage.setItem("auth_name", name);
        onLoginSuccess(name);
        return;
      }

      // se não retornar token no signup, peça login:
      alert("Cadastro realizado! Faça login para continuar.");
      setIsLogin(true);
    } catch (err: any) {
      alert(err.message || "Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  }

  // exemplo de uso do token em outra chamada (POST /products/create)
  async function createProductDemo() {
    try {
      const res = await fetch(`${API_URL}/products/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          name: "Coca-Cola Lata",
          description: "Refrigerante gelado 350ml",
          price: 5.5,
          expirationDate: "2025-12-31",
          quantity: 100,
        }),
      });
      if (!res.ok) {
        const msg = await safeError(res);
        throw new Error(msg || "Erro ao criar produto");
      }
      const json = await res.json();
      console.log("Produto criado:", json);
      alert("Produto criado (checa o console)!");
    } catch (e: any) {
      alert(e.message);
    }
  }

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login();
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signup();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Header com toggle */}
          <div className="flex border-b" style={{ borderColor: "#E0E0E0" }}>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-center font-semibold transition-all ${
                isLogin ? "border-b-2" : "hover:bg-gray-50"
              }`}
              style={{
                color: isLogin ? "#4CAF50" : "#666666",
                borderBottomColor: isLogin ? "#4CAF50" : "transparent",
                backgroundColor: isLogin ? "#F1F8E9" : "transparent",
              }}
              disabled={loading}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-center font-semibold transition-all ${
                !isLogin ? "border-b-2" : "hover:bg-gray-50"
              }`}
              style={{
                color: !isLogin ? "#4CAF50" : "#666666",
                borderBottomColor: !isLogin ? "#4CAF50" : "transparent",
                backgroundColor: !isLogin ? "#F1F8E9" : "transparent",
              }}
              disabled={loading}
            >
              Cadastro
            </button>
          </div>

          <div className="p-8">
            {isLogin ? (
              <form onSubmit={handleLoginSubmit}>
                <div className="space-y-6">
                  <div>
                    <h2
                      className="text-2xl font-bold mb-2"
                      style={{ color: "#333333" }}
                    >
                      Bem-vindo de volta!
                    </h2>
                    <p style={{ color: "#666666" }}>
                      Entre com suas credenciais para continuar
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#333333" }}
                      >
                        E-mail
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                          style={{ color: "#999999" }}
                        />
                        <input
                          type="email"
                          value={loginData.email}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              email: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition"
                          style={{ borderColor: "#DDDDDD", color: "#333333" }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#4CAF50")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#DDDDDD")
                          }
                          placeholder="seu@email.com"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#333333" }}
                      >
                        Senha
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                          style={{ color: "#999999" }}
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) =>
                            setLoginData({
                              ...loginData,
                              password: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-3 border rounded-lg outline-none transition"
                          style={{ borderColor: "#DDDDDD", color: "#333333" }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#4CAF50")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#DDDDDD")
                          }
                          placeholder="••••••••"
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition"
                          style={{ color: "#999999" }}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded cursor-pointer"
                        style={{ accentColor: "#4CAF50" }}
                      />
                      <span
                        className="ml-2 text-sm"
                        style={{ color: "#666666" }}
                      >
                        Lembrar-me
                      </span>
                    </label>
                    <button
                      type="button"
                      className="text-sm font-medium hover:opacity-80 transition"
                      style={{ color: "#FF9800" }}
                    >
                      Esqueceu a senha?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                    style={{ backgroundColor: "#4CAF50" }}
                    disabled={loading}
                  >
                    {loading ? "Entrando..." : "Entrar"}
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Botão opcional pra testar chamada autenticada */}
                  {/* <button type="button" onClick={createProductDemo} className="mt-3 underline text-sm">Testar criar produto</button> */}
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit}>
                <div className="space-y-6">
                  <div>
                    <h2
                      className="text-2xl font-bold mb-2"
                      style={{ color: "#333333" }}
                    >
                      Crie sua conta
                    </h2>
                    <p style={{ color: "#666666" }}>
                      Preencha os dados para começar
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#333333" }}
                      >
                        Nome completo
                      </label>
                      <div className="relative">
                        <User
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                          style={{ color: "#999999" }}
                        />
                        <input
                          type="text"
                          value={signupData.name}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              name: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition"
                          style={{ borderColor: "#DDDDDD", color: "#333333" }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#4CAF50")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#DDDDDD")
                          }
                          placeholder="João Silva"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#333333" }}
                      >
                        E-mail
                      </label>
                      <div className="relative">
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                          style={{ color: "#999999" }}
                        />
                        <input
                          type="email"
                          value={signupData.email}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              email: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-3 border rounded-lg outline-none transition"
                          style={{ borderColor: "#DDDDDD", color: "#333333" }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#4CAF50")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#DDDDDD")
                          }
                          placeholder="seu@email.com"
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#333333" }}
                      >
                        Senha
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                          style={{ color: "#999999" }}
                        />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={signupData.password}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              password: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-3 border rounded-lg outline-none transition"
                          style={{ borderColor: "#DDDDDD", color: "#333333" }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#4CAF50")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#DDDDDD")
                          }
                          placeholder="••••••••"
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition"
                          style={{ color: "#999999" }}
                          tabIndex={-1}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-sm font-medium mb-2"
                        style={{ color: "#333333" }}
                      >
                        Confirmar senha
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
                          style={{ color: "#999999" }}
                        />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={signupData.confirmPassword}
                          onChange={(e) =>
                            setSignupData({
                              ...signupData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-12 py-3 border rounded-lg outline-none transition"
                          style={{ borderColor: "#DDDDDD", color: "#333333" }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "#4CAF50")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = "#DDDDDD")
                          }
                          placeholder="••••••••"
                          required
                          disabled={loading}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:opacity-70 transition"
                          style={{ color: "#999999" }}
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <label className="flex items-start cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 mt-1 rounded cursor-pointer"
                      style={{ accentColor: "#4CAF50" }}
                      required
                    />
                    <span className="ml-2 text-sm" style={{ color: "#666666" }}>
                      Aceito os{" "}
                      <button
                        type="button"
                        className="font-medium hover:opacity-80 transition"
                        style={{ color: "#2E7D32" }}
                      >
                        termos de uso
                      </button>{" "}
                      e a{" "}
                      <button
                        type="button"
                        className="font-medium hover:opacity-80 transition"
                        style={{ color: "#2E7D32" }}
                      >
                        política de privacidade
                      </button>
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                    style={{ backgroundColor: "#4CAF50" }}
                    disabled={loading}
                  >
                    {loading ? "Criando..." : "Criar conta"}
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: "#666666" }}>
          © 2025 Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
