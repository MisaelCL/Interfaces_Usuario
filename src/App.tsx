import { useState } from 'react';
import { Settings, User, LogOut } from 'lucide-react';
import { Button } from './components/ui/button';
import LoginScreen from './components/LoginScreen';
import MainCashier from './components/MainCashier';
import PaymentScreen from './components/PaymentScreen';
import AdminDashboard from './components/AdminDashboard';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

type Screen = 'login' | 'cashier' | 'payment' | 'admin';

interface UserSession {
  name: string;
  role: 'admin' | 'cashier';
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const handleLogin = (name: string, role: 'admin' | 'cashier') => {
    setUserSession({ name, role });
    setCurrentScreen('cashier');
  };

  const handleLogout = () => {
    setUserSession(null);
    setCartItems([]);
    setTotalAmount(0);
    setCurrentScreen('login');
  };

  const navigateToPayment = (items: CartItem[], total: number) => {
    setCartItems(items);
    setTotalAmount(total);
    setCurrentScreen('payment');
  };

  const handlePaymentComplete = () => {
    setCartItems([]);
    setTotalAmount(0);
    setCurrentScreen('cashier');
  };

  const goBackToCashier = () => {
    setCurrentScreen('cashier');
  };

  const navigateToAdmin = () => {
    if (userSession?.role === 'admin') {
      setCurrentScreen('admin');
    }
  };

  // Show login screen if not authenticated
  if (currentScreen === 'login' || !userSession) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (currentScreen === 'payment') {
    return (
      <PaymentScreen
        cartItems={cartItems}
        total={totalAmount}
        onGoBack={goBackToCashier}
        onPaymentComplete={handlePaymentComplete}
      />
    );
  }

  if (currentScreen === 'admin') {
    return (
      <AdminDashboard onGoBack={goBackToCashier} />
    );
  }

  return (
    <div className="relative">
      {/* Header with user info and controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <div className="bg-white/90 backdrop-blur rounded-lg px-4 py-2 flex items-center gap-2">
          <User className="h-4 w-4 text-green-600" />
          <span className="text-sm">{userSession.name}</span>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full capitalize">
            {userSession.role === 'admin' ? 'Administrador' : 'Cajero'}
          </span>
        </div>
        
        <div className="flex gap-2">
          {userSession.role === 'admin' && (
            <Button
              variant="outline"
              size="sm"
              onClick={navigateToAdmin}
              className="flex items-center gap-2 bg-white/90 backdrop-blur rounded-lg"
            >
              <Settings className="h-4 w-4" />
              Admin
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2 bg-white/90 backdrop-blur rounded-lg text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </Button>
        </div>
      </div>
      
      <MainCashier onNavigateToPayment={navigateToPayment} />
    </div>
  );
}