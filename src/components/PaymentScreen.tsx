import { useState } from 'react';
import { ArrowLeft, DollarSign, CreditCard, Smartphone, RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface PaymentScreenProps {
  cartItems: CartItem[];
  total: number;
  onGoBack: () => void;
  onPaymentComplete: () => void;
}

const paymentMethods = [
  { id: 'efectivo', name: 'Efectivo', icon: DollarSign, emoji: '💵' },
  { id: 'tarjeta', name: 'Tarjeta', icon: CreditCard, emoji: '💳' },
  { id: 'qr', name: 'QR / Digital', icon: Smartphone, emoji: '📱' },
  { id: 'transferencia', name: 'Transferencia', icon: RefreshCw, emoji: '🔄' },
];

export default function PaymentScreen({ cartItems, total, onGoBack, onPaymentComplete }: PaymentScreenProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [amountReceived, setAmountReceived] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const change = selectedPaymentMethod === 'efectivo' 
    ? Math.max(0, parseFloat(amountReceived) - total)
    : 0;

  const canCompletePayment = () => {
    if (!selectedPaymentMethod) return false;
    if (selectedPaymentMethod === 'efectivo') {
      return parseFloat(amountReceived) >= total;
    }
    return true;
  };

  const handlePaymentConfirm = async () => {
    setIsProcessing(true);
    
    // Simular procesamiento de pago
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setPaymentCompleted(true);
    
    // Completar pago después de mostrar confirmación
    setTimeout(() => {
      onPaymentComplete();
    }, 2000);
  };

  const formatCurrency = (amount: number) => {
    return `$${amount.toFixed(2)}`;
  };

  if (paymentCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <Card className="p-8 max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-green-600 mb-2">¡Pago Completado!</h2>
          <p className="text-gray-600 mb-4">Transacción realizada exitosamente</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
            {selectedPaymentMethod === 'efectivo' && (
              <>
                <div className="flex justify-between">
                  <span>Recibido:</span>
                  <span>{formatCurrency(parseFloat(amountReceived))}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Cambio:</span>
                  <span>{formatCurrency(change)}</span>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={onGoBack}
            className="flex items-center gap-2 rounded-lg"
          >
            <ArrowLeft className="h-4 w-4" />
            Atrás
          </Button>
          <h1>Procesar Pago</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <div>
            <h3 className="mb-4">Método de Pago</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Button
                    key={method.id}
                    variant={selectedPaymentMethod === method.id ? "default" : "outline"}
                    className="h-24 flex flex-col items-center justify-center space-y-2 rounded-xl transition-all hover:scale-105"
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    disabled={isProcessing}
                  >
                    <span className="text-3xl">{method.emoji}</span>
                    <span className="text-sm text-center">{method.name}</span>
                  </Button>
                );
              })}
            </div>

            {/* Cash Payment Input */}
            {selectedPaymentMethod === 'efectivo' && (
              <Card className="p-6">
                <h4 className="mb-4">Pago en Efectivo</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Monto Recibido</label>
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      className="h-12 text-lg rounded-lg"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  
                  {parseFloat(amountReceived) > 0 && (
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span>Total a pagar:</span>
                        <span>{formatCurrency(total)}</span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span>Recibido:</span>
                        <span>{formatCurrency(parseFloat(amountReceived))}</span>
                      </div>
                      <hr className="my-2" />
                      <div className="flex justify-between items-center text-lg">
                        <span>Cambio:</span>
                        <span className={change >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {formatCurrency(change)}
                        </span>
                      </div>
                      {change < 0 && (
                        <p className="text-red-600 text-sm mt-2">
                          Monto insuficiente
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Digital Payment Info */}
            {selectedPaymentMethod && selectedPaymentMethod !== 'efectivo' && (
              <Card className="p-6">
                <h4 className="mb-4">
                  {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                </h4>
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">
                    {paymentMethods.find(m => m.id === selectedPaymentMethod)?.emoji}
                  </div>
                  <p className="text-gray-600">
                    {selectedPaymentMethod === 'qr' && 'Escanea el código QR para pagar'}
                    {selectedPaymentMethod === 'tarjeta' && 'Inserta o pasa la tarjeta'}
                    {selectedPaymentMethod === 'transferencia' && 'Realiza la transferencia bancaria'}
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="p-6">
              <h3 className="mb-4">Resumen del Pedido</h3>
              
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatCurrency(item.price)} x {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{formatCurrency(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center text-lg">
                  <span>Total a Pagar:</span>
                  <span className="text-green-600">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handlePaymentConfirm}
                  disabled={!canCompletePayment() || isProcessing}
                  className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl disabled:opacity-50"
                >
                  {isProcessing ? 'Procesando...' : 'Confirmar Pago'}
                </Button>
                
                <Button
                  onClick={onGoBack}
                  variant="outline"
                  disabled={isProcessing}
                  className="w-full h-12 rounded-xl"
                >
                  Cancelar
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}