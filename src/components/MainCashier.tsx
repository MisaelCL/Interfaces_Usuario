import { useState } from 'react';
import { Search, ShoppingCart, Beef, Carrot, Gamepad2, Dog, Package, Droplets, Sandwich, Candy } from 'lucide-react';
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

interface MainCashierProps {
  onNavigateToPayment: (cartItems: CartItem[], total: number) => void;
}

const categories = [
  { id: 'bebidas', name: 'Bebidas', icon: Droplets, emoji: '🥤' },
  { id: 'panaderia', name: 'Panadería', icon: Sandwich, emoji: '🍞' },
  { id: 'dulces', name: 'Dulces', icon: Candy, emoji: '🍫' },
  { id: 'carnes', name: 'Carnes', icon: Beef, emoji: '🥩' },
  { id: 'verduras', name: 'Verduras', icon: Carrot, emoji: '🥬' },
  { id: 'limpieza', name: 'Limpieza', icon: Droplets, emoji: '🧴' },
  { id: 'mascotas', name: 'Mascotas', icon: Dog, emoji: '🐶' },
  { id: 'otros', name: 'Otros', icon: Package, emoji: '📦' },
];

const sampleProducts = {
  bebidas: [
    { id: '1', name: 'Coca Cola 600ml', price: 25.00 },
    { id: '2', name: 'Agua Natural 1L', price: 15.00 },
    { id: '3', name: 'Jugo de Naranja', price: 30.00 },
  ],
  panaderia: [
    { id: '4', name: 'Pan Blanco', price: 28.00 },
    { id: '5', name: 'Croissant', price: 22.00 },
    { id: '6', name: 'Bolillo', price: 3.00 },
  ],
  dulces: [
    { id: '7', name: 'Sabritas Original', price: 18.00 },
    { id: '8', name: 'Chocolate Carlos V', price: 12.00 },
    { id: '9', name: 'Paleta Payaso', price: 8.00 },
  ],
};

export default function MainCashier({ onNavigateToPayment }: MainCashierProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: { id: string; name: string; price: number }) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map(item =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prevCart.filter(item => item.id !== productId);
    });
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const clearCart = () => {
    setCart([]);
  };

  const proceedToPayment = () => {
    if (cart.length > 0) {
      onNavigateToPayment(cart, getTotalPrice());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="mb-4">Sistema POS - Abarrotes</h1>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg rounded-xl border-2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories and Products */}
          <div className="lg:col-span-2">
            {/* Categories Grid */}
            <div className="mb-6">
              <h3 className="mb-4">Categorías</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className="h-20 flex flex-col items-center justify-center space-y-2 rounded-xl transition-all hover:scale-105"
                      onClick={() => setSelectedCategory(selectedCategory === category.id ? '' : category.id)}
                    >
                      <span className="text-2xl">{category.emoji}</span>
                      <span className="text-sm">{category.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Products */}
            {selectedCategory && sampleProducts[selectedCategory as keyof typeof sampleProducts] && (
              <div>
                <h3 className="mb-4">Productos - {categories.find(c => c.id === selectedCategory)?.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sampleProducts[selectedCategory as keyof typeof sampleProducts].map((product) => (
                    <Card key={product.id} className="p-4 hover:shadow-lg transition-shadow cursor-pointer">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="mb-1">{product.name}</h4>
                          <p className="text-green-600">${product.price.toFixed(2)}</p>
                        </div>
                        <Button
                          onClick={() => addToCart(product)}
                          size="sm"
                          className="rounded-full h-10 w-10 p-0"
                        >
                          +
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Carrito
                </h3>
                {getTotalItems() > 0 && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {getTotalItems()} items
                  </Badge>
                )}
              </div>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">Carrito vacío</p>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="text-sm truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">
                          ${item.price.toFixed(2)} x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-6 w-6 p-0 rounded-full"
                          onClick={() => removeFromCart(item.id)}
                        >
                          -
                        </Button>
                        <span className="text-sm w-6 text-center">{item.quantity}</span>
                        <Button
                          size="sm"
                          className="h-6 w-6 p-0 rounded-full"
                          onClick={() => addToCart(item)}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <>
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg">Total:</span>
                      <span className="text-xl text-green-600">${getTotalPrice().toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={proceedToPayment}
                      className="w-full h-12 bg-green-600 hover:bg-green-700 rounded-xl"
                    >
                      Cobrar
                    </Button>
                    <Button
                      onClick={clearCart}
                      variant="outline"
                      className="w-full h-12 border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                    >
                      Cancelar
                    </Button>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}