import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { DollarSign, TrendingUp, Package, AlertTriangle, FileText, Download, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';

interface AdminDashboardProps {
  onGoBack: () => void;
}

const salesData = [
  { hora: '9:00', ventas: 450 },
  { hora: '10:00', ventas: 680 },
  { hora: '11:00', ventas: 920 },
  { hora: '12:00', ventas: 1250 },
  { hora: '13:00', ventas: 890 },
  { hora: '14:00', ventas: 1100 },
  { hora: '15:00', ventas: 750 },
  { hora: '16:00', ventas: 580 },
];

const topProductsData = [
  { name: 'Coca Cola', ventas: 45, color: '#16a34a' },
  { name: 'Pan Blanco', ventas: 38, color: '#22c55e' },
  { name: 'Sabritas', ventas: 32, color: '#4ade80' },
  { name: 'Agua', ventas: 28, color: '#86efac' },
];

const lowStockItems = [
  { name: 'Leche Entera 1L', stock: 3, min: 10 },
  { name: 'Huevos Blancos', stock: 5, min: 15 },
  { name: 'Jabón para Trastes', stock: 2, min: 8 },
  { name: 'Papel Higiénico', stock: 4, min: 12 },
  { name: 'Aceite Vegetal', stock: 1, min: 6 },
];

export default function AdminDashboard({ onGoBack }: AdminDashboardProps) {
  const [selectedPeriod, setSelectedPeriod] = useState('hoy');

  const handleExportPDF = () => {
    // Simular exportación a PDF
    const blob = new Blob(['Reporte de ventas PDF simulado'], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte-ventas.pdf';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportExcel = () => {
    // Simular exportación a Excel
    const blob = new Blob(['Reporte de ventas Excel simulado'], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'reporte-ventas.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onGoBack}
              className="flex items-center gap-2 rounded-lg"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <h1>Panel de Administración</h1>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-lg"
              onClick={handleExportPDF}
            >
              <FileText className="h-4 w-4" />
              Exportar PDF
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 rounded-lg"
              onClick={handleExportExcel}
            >
              <Download className="h-4 w-4" />
              Exportar Excel
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {['hoy', 'semana', 'mes'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
              className="rounded-lg capitalize"
            >
              {period}
            </Button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Ventas del Día</p>
                <p className="text-2xl text-green-600">$4,350</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% vs ayer
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Transacciones</p>
                <p className="text-2xl">184</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +8% vs ayer
                </p>
              </div>
              <BarChart className="h-8 w-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Productos Vendidos</p>
                <p className="text-2xl">342</p>
                <p className="text-xs text-green-500 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +15% vs ayer
                </p>
              </div>
              <Package className="h-8 w-8 text-purple-600" />
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Stock Bajo</p>
                <p className="text-2xl text-orange-600">25</p>
                <p className="text-xs text-orange-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Requiere atención
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sales Chart */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h3 className="mb-4">Ventas por Hora</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hora" />
                    <YAxis />
                    <Bar dataKey="ventas" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Top Products */}
          <Card className="p-6">
            <h3 className="mb-4">Top 3 Productos</h3>
            <div className="space-y-4">
              {topProductsData.slice(0, 3).map((product, index) => (
                <div key={product.name} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.ventas} vendidos</p>
                  </div>
                  <div className="w-12 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-green-600 rounded-full transition-all"
                      style={{ width: `${(product.ventas / topProductsData[0].ventas) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-sm mb-3">Distribución de Ventas</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={topProductsData}
                      dataKey="ventas"
                      cx="50%"
                      cy="50%"
                      innerRadius={20}
                      outerRadius={50}
                    >
                      {topProductsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </Card>
        </div>

        {/* Low Stock Alert */}
        <Card className="p-6 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <h3>Alertas de Stock Bajo</h3>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              {lowStockItems.length} productos
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lowStockItems.map((item) => (
              <div key={item.name} className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm">{item.name}</p>
                  <Badge variant="destructive" className="bg-orange-600">
                    Stock bajo
                  </Badge>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Stock actual: {item.stock}</span>
                  <span>Mínimo: {item.min}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                  <div 
                    className="h-full bg-orange-600 rounded-full"
                    style={{ width: `${(item.stock / item.min) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}