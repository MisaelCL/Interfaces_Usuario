import { useState } from 'react';
import { User, Lock, Eye, EyeOff, LogIn, Store } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LoginScreenProps {
  onLogin: (username: string, role: 'admin' | 'cashier') => void;
}

// Usuarios de ejemplo para el sistema
const mockUsers = [
  { username: 'admin', password: 'admin123', role: 'admin' as const, name: 'Administrador' },
  { username: 'cajero1', password: 'caja123', role: 'cashier' as const, name: 'Ana García' },
  { username: 'cajero2', password: 'caja123', role: 'cashier' as const, name: 'Carlos López' },
  { username: 'maria', password: 'maria123', role: 'cashier' as const, name: 'María Rodríguez' },
];

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de autenticación
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = mockUsers.find(
      u => u.username === username && u.password === password
    );

    if (user) {
      onLogin(user.name, user.role);
    } else {
      setError('Usuario o contraseña incorrectos');
    }

    setIsLoading(false);
  };

  const handleDemoLogin = (userType: 'admin' | 'cashier') => {
    const user = userType === 'admin' 
      ? mockUsers[0] 
      : mockUsers[1];
    
    setUsername(user.username);
    setPassword(user.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Image Section */}
        <div className="hidden lg:block">
          <div className="relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1586447950450-bf0457d21a4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMGdyb2NlcnklMjBzdG9yZSUyMHRlYW0lMjBzbWlsaW5nJTIwZW1wbG95ZWVzfGVufDF8fHx8MTc1ODM0MzA1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Empleados amigables de abarrotes"
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-green-900/20 to-transparent rounded-2xl" />
            <div className="absolute bottom-6 left-6 text-white">
              <h2 className="text-2xl mb-2">¡Bienvenido al equipo!</h2>
              <p className="text-green-100">Sistema POS para abarrotes modernos</p>
            </div>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="w-full max-w-md mx-auto">
          <Card className="p-8 shadow-xl border-0 bg-white/95 backdrop-blur">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-green-600 p-3 rounded-full">
                  <Store className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-green-600 mb-2">Abarrotes POS</h1>
              <p className="text-gray-600">Inicia sesión para continuar</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm mb-2">Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 rounded-xl border-2 focus:border-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 rounded-xl border-2 focus:border-green-500"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4" />
                    Iniciar Sesión
                  </div>
                )}
              </Button>
            </form>

            {/* Demo Users */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-600 mb-4">Usuarios de demostración:</p>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('admin')}
                  className="rounded-lg border-green-200 text-green-700 hover:bg-green-50"
                >
                  👨‍💼 Admin
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('cashier')}
                  className="rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  👩‍💼 Cajero
                </Button>
              </div>
              <div className="mt-3 text-xs text-gray-500 space-y-1">
                <p><strong>Admin:</strong> admin / admin123</p>
                <p><strong>Cajero:</strong> cajero1 / caja123</p>
              </div>
            </div>

            {/* Mobile Image */}
            <div className="lg:hidden mt-6">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1586447950450-bf0457d21a4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMGdyb2NlcnklMjBzdG9yZSUyMHRlYW0lMjBzbWlsaW5nJTIwZW1wbG95ZWVzfGVufDF8fHx8MTc1ODM0MzA1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Empleados amigables"
                className="w-full h-32 object-cover rounded-lg"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}