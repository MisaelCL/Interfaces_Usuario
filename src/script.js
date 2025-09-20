// Global State
let currentUser = null;
let currentScreen = 'login';
let cart = [];
let selectedCategory = '';
let selectedPaymentMethod = '';
let orderTotal = 0;
let salesChart = null;
let productsChart = null;

// Mock Users
const mockUsers = [
    { username: 'admin', password: 'admin123', role: 'admin', name: 'Administrador' },
    { username: 'cajero1', password: 'caja123', role: 'cashier', name: 'Ana García' },
    { username: 'cajero2', password: 'caja123', role: 'cashier', name: 'Carlos López' },
    { username: 'maria', password: 'maria123', role: 'cashier', name: 'María Rodríguez' }
];

// Categories
const categories = [
    { id: 'bebidas', name: 'Bebidas', emoji: '🥤' },
    { id: 'panaderia', name: 'Panadería', emoji: '🍞' },
    { id: 'dulces', name: 'Dulces', emoji: '🍫' },
    { id: 'carnes', name: 'Carnes', emoji: '🥩' },
    { id: 'verduras', name: 'Verduras', emoji: '🥬' },
    { id: 'limpieza', name: 'Limpieza', emoji: '🧴' },
    { id: 'mascotas', name: 'Mascotas', emoji: '🐶' },
    { id: 'otros', name: 'Otros', emoji: '📦' }
];

// Sample Products
const sampleProducts = {
    bebidas: [
        { id: '1', name: 'Coca Cola 600ml', price: 25.00 },
        { id: '2', name: 'Agua Natural 1L', price: 15.00 },
        { id: '3', name: 'Jugo de Naranja', price: 30.00 }
    ],
    panaderia: [
        { id: '4', name: 'Pan Blanco', price: 28.00 },
        { id: '5', name: 'Croissant', price: 22.00 },
        { id: '6', name: 'Bolillo', price: 3.00 }
    ],
    dulces: [
        { id: '7', name: 'Sabritas Original', price: 18.00 },
        { id: '8', name: 'Chocolate Carlos V', price: 12.00 },
        { id: '9', name: 'Paleta Payaso', price: 8.00 }
    ]
};

// Sales Data for Charts
const salesData = [
    { hora: '9:00', ventas: 450 },
    { hora: '10:00', ventas: 680 },
    { hora: '11:00', ventas: 920 },
    { hora: '12:00', ventas: 1250 },
    { hora: '13:00', ventas: 890 },
    { hora: '14:00', ventas: 1100 },
    { hora: '15:00', ventas: 750 },
    { hora: '16:00', ventas: 580 }
];

const topProductsData = [
    { name: 'Coca Cola', ventas: 45, color: '#16a34a' },
    { name: 'Pan Blanco', ventas: 38, color: '#22c55e' },
    { name: 'Sabritas', ventas: 32, color: '#4ade80' },
    { name: 'Agua', ventas: 28, color: '#86efac' }
];

const lowStockItems = [
    { name: 'Leche Entera 1L', stock: 3, min: 10 },
    { name: 'Huevos Blancos', stock: 5, min: 15 },
    { name: 'Jabón para Trastes', stock: 2, min: 8 },
    { name: 'Papel Higiénico', stock: 4, min: 12 },
    { name: 'Aceite Vegetal', stock: 1, min: 6 }
];

// Utility Functions
function formatCurrency(amount) {
    return `$${amount.toFixed(2)}`;
}

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    document.getElementById(screenId).classList.add('active');
    currentScreen = screenId;
}

function showElement(elementId) {
    document.getElementById(elementId).classList.remove('hidden');
}

function hideElement(elementId) {
    document.getElementById(elementId).classList.add('hidden');
}

// Login Functions
function fillDemoUser(userType) {
    const user = userType === 'admin' ? mockUsers[0] : mockUsers[1];
    document.getElementById('username').value = user.username;
    document.getElementById('password').value = user.password;
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.eye-icon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.innerHTML = `
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94L6 6l12 12-0.06 0.06z"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
        `;
    } else {
        passwordInput.type = 'password';
        eyeIcon.innerHTML = `
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
        `;
    }
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginButton = document.getElementById('loginButton');
    const loginButtonText = document.getElementById('loginButtonText');
    const errorElement = document.getElementById('loginError');
    
    // Show loading state
    loginButton.disabled = true;
    loginButtonText.innerHTML = `
        <div class="spinner"></div>
        Iniciando sesión...
    `;
    
    // Simulate authentication delay
    setTimeout(() => {
        const user = mockUsers.find(u => u.username === username && u.password === password);
        
        if (user) {
            currentUser = user;
            updateUserInterface();
            showScreen('cashierScreen');
            hideElement('loginError');
        } else {
            showElement('loginError');
        }
        
        // Reset button state
        loginButton.disabled = false;
        loginButtonText.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10,17 15,12 10,7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Iniciar Sesión
        `;
    }, 1000);
}

function updateUserInterface() {
    if (!currentUser) return;
    
    document.getElementById('currentUserName').textContent = currentUser.name;
    document.getElementById('currentUserRole').textContent = 
        currentUser.role === 'admin' ? 'Administrador' : 'Cajero';
    
    const adminButton = document.getElementById('adminButton');
    if (currentUser.role === 'admin') {
        adminButton.classList.remove('hidden');
    } else {
        adminButton.classList.add('hidden');
    }
}

function logout() {
    currentUser = null;
    cart = [];
    selectedCategory = '';
    selectedPaymentMethod = '';
    orderTotal = 0;
    showScreen('loginScreen');
    
    // Reset forms
    document.getElementById('loginForm').reset();
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    hideElement('loginError');
    
    // Reset cashier interface
    updateCartDisplay();
    renderCategories();
}

// Cashier Functions
function renderCategories() {
    const categoriesGrid = document.getElementById('categoriesGrid');
    categoriesGrid.innerHTML = '';
    
    categories.forEach(category => {
        const categoryBtn = document.createElement('button');
        categoryBtn.className = `category-btn ${selectedCategory === category.id ? 'active' : ''}`;
        categoryBtn.onclick = () => selectCategory(category.id);
        
        categoryBtn.innerHTML = `
            <span class="category-emoji">${category.emoji}</span>
            <span class="category-name">${category.name}</span>
        `;
        
        categoriesGrid.appendChild(categoryBtn);
    });
}

function selectCategory(categoryId) {
    if (selectedCategory === categoryId) {
        selectedCategory = '';
        hideElement('productsSection');
    } else {
        selectedCategory = categoryId;
        renderProducts(categoryId);
        showElement('productsSection');
    }
    renderCategories();
}

function renderProducts(categoryId) {
    const products = sampleProducts[categoryId] || [];
    const productsGrid = document.getElementById('productsGrid');
    const productsTitle = document.getElementById('productsTitle');
    
    const categoryName = categories.find(c => c.id === categoryId)?.name || 'Productos';
    productsTitle.textContent = `Productos - ${categoryName}`;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-content">
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="product-price">${formatCurrency(product.price)}</p>
                </div>
                <button class="add-btn" onclick="addToCart('${product.id}', '${product.name}', ${product.price})">
                    +
                </button>
            </div>
        `;
        
        productsGrid.appendChild(productCard);
    });
}

function addToCart(productId, productName, productPrice) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        });
    }
    
    updateCartDisplay();
}

function removeFromCart(productId) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem && existingItem.quantity > 1) {
        existingItem.quantity -= 1;
    } else {
        cart = cart.filter(item => item.id !== productId);
    }
    
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartItemCount = document.getElementById('cartItemCount');
    const cartTotal = document.getElementById('cartTotal');
    const cartActions = document.getElementById('cartActions');
    const totalAmount = document.getElementById('totalAmount');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Carrito vacío</p>';
        hideElement('cartItemCount');
        hideElement('cartTotal');
        hideElement('cartActions');
        return;
    }
    
    // Update item count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartItemCount.textContent = `${totalItems} items`;
    showElement('cartItemCount');
    
    // Render cart items
    cartItems.innerHTML = '';
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <p class="cart-item-name">${item.name}</p>
                <p class="cart-item-details">${formatCurrency(item.price)} x ${item.quantity}</p>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" onclick="removeFromCart('${item.id}')">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn primary" onclick="addToCart('${item.id}', '${item.name}', ${item.price})">+</button>
            </div>
        `;
        
        cartItems.appendChild(cartItem);
    });
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmount.textContent = formatCurrency(total);
    showElement('cartTotal');
    showElement('cartActions');
}

function clearCart() {
    cart = [];
    updateCartDisplay();
}

function proceedToCheckout() {
    if (cart.length === 0) return;
    
    orderTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    renderPaymentScreen();
    showScreen('paymentScreen');
}

// Payment Functions
function renderPaymentScreen() {
    const orderItems = document.getElementById('orderItems');
    const orderTotalAmount = document.getElementById('orderTotalAmount');
    const paymentTotal = document.getElementById('paymentTotal');
    
    // Render order items
    orderItems.innerHTML = '';
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        
        orderItem.innerHTML = `
            <div class="order-item-info">
                <p class="order-item-name">${item.name}</p>
                <p class="order-item-details">${formatCurrency(item.price)} x ${item.quantity}</p>
            </div>
            <div class="order-item-total">${formatCurrency(item.price * item.quantity)}</div>
        `;
        
        orderItems.appendChild(orderItem);
    });
    
    // Update totals
    orderTotalAmount.textContent = formatCurrency(orderTotal);
    paymentTotal.textContent = formatCurrency(orderTotal);
    
    // Reset payment method
    selectedPaymentMethod = '';
    updatePaymentMethodDisplay();
    hideElement('cashPaymentSection');
    hideElement('digitalPaymentSection');
    updatePaymentButton();
}

function selectPaymentMethod(method) {
    selectedPaymentMethod = method;
    updatePaymentMethodDisplay();
    
    if (method === 'efectivo') {
        showElement('cashPaymentSection');
        hideElement('digitalPaymentSection');
        document.getElementById('amountReceived').value = '';
        hideElement('changeCalculation');
    } else {
        hideElement('cashPaymentSection');
        showElement('digitalPaymentSection');
        updateDigitalPaymentDisplay(method);
    }
    
    updatePaymentButton();
}

function updatePaymentMethodDisplay() {
    document.querySelectorAll('.payment-method').forEach(btn => {
        btn.classList.remove('active');
    });
    
    const selectedBtn = document.querySelector(`[data-method="${selectedPaymentMethod}"]`);
    if (selectedBtn) {
        selectedBtn.classList.add('active');
    }
}

function updateDigitalPaymentDisplay(method) {
    const title = document.getElementById('digitalPaymentTitle');
    const emoji = document.getElementById('digitalPaymentEmoji');
    const text = document.getElementById('digitalPaymentText');
    
    const methodData = {
        tarjeta: { name: 'Tarjeta', emoji: '💳', text: 'Inserta o pasa la tarjeta' },
        qr: { name: 'QR / Digital', emoji: '📱', text: 'Escanea el código QR para pagar' },
        transferencia: { name: 'Transferencia', emoji: '🔄', text: 'Realiza la transferencia bancaria' }
    };
    
    const data = methodData[method];
    if (data) {
        title.textContent = data.name;
        emoji.textContent = data.emoji;
        text.textContent = data.text;
    }
}

function handleCashInput() {
    const amountReceived = parseFloat(document.getElementById('amountReceived').value) || 0;
    const changeCalculation = document.getElementById('changeCalculation');
    const receivedAmount = document.getElementById('receivedAmount');
    const changeAmount = document.getElementById('changeAmount');
    const insufficientAmount = document.getElementById('insufficientAmount');
    
    if (amountReceived > 0) {
        showElement('changeCalculation');
        receivedAmount.textContent = formatCurrency(amountReceived);
        
        const change = amountReceived - orderTotal;
        changeAmount.textContent = formatCurrency(Math.abs(change));
        
        if (change >= 0) {
            changeAmount.className = 'change-amount';
            hideElement('insufficientAmount');
        } else {
            changeAmount.className = 'change-amount negative';
            showElement('insufficientAmount');
        }
    } else {
        hideElement('changeCalculation');
    }
    
    updatePaymentButton();
}

function updatePaymentButton() {
    const confirmButton = document.getElementById('confirmPaymentButton');
    let canPay = false;
    
    if (selectedPaymentMethod === 'efectivo') {
        const amountReceived = parseFloat(document.getElementById('amountReceived').value) || 0;
        canPay = amountReceived >= orderTotal;
    } else if (selectedPaymentMethod) {
        canPay = true;
    }
    
    confirmButton.disabled = !canPay;
}

function confirmPayment() {
    const confirmButton = document.getElementById('confirmPaymentButton');
    
    // Show processing state
    confirmButton.disabled = true;
    confirmButton.innerHTML = `
        <div class="spinner"></div>
        Procesando...
    `;
    
    // Simulate payment processing
    setTimeout(() => {
        showPaymentSuccess();
    }, 2000);
}

function showPaymentSuccess() {
    const paymentSummary = document.getElementById('paymentSummary');
    let summaryHTML = `
        <div class="calculation-row">
            <span>Total:</span>
            <span>${formatCurrency(orderTotal)}</span>
        </div>
    `;
    
    if (selectedPaymentMethod === 'efectivo') {
        const amountReceived = parseFloat(document.getElementById('amountReceived').value);
        const change = amountReceived - orderTotal;
        
        summaryHTML += `
            <div class="calculation-row">
                <span>Recibido:</span>
                <span>${formatCurrency(amountReceived)}</span>
            </div>
            <div class="calculation-row">
                <span>Cambio:</span>
                <span>${formatCurrency(change)}</span>
            </div>
        `;
    }
    
    paymentSummary.innerHTML = summaryHTML;
    showScreen('paymentSuccessScreen');
    
    // Auto return to cashier after 3 seconds
    setTimeout(() => {
        cart = [];
        orderTotal = 0;
        selectedPaymentMethod = '';
        updateCartDisplay();
        showScreen('cashierScreen');
        
        // Reset payment screen
        const confirmButton = document.getElementById('confirmPaymentButton');
        confirmButton.disabled = false;
        confirmButton.innerHTML = 'Confirmar Pago';
    }, 3000);
}

function goBackToCashier() {
    showScreen('cashierScreen');
}

// Admin Functions
function goToAdmin() {
    if (currentUser?.role !== 'admin') return;
    
    renderAdminDashboard();
    showScreen('adminScreen');
}

function renderAdminDashboard() {
    renderTopProducts();
    renderLowStockItems();
    initializeCharts();
}

function renderTopProducts() {
    const topProductsList = document.getElementById('topProductsList');
    topProductsList.innerHTML = '';
    
    topProductsData.slice(0, 3).forEach((product, index) => {
        const productItem = document.createElement('div');
        productItem.className = 'top-product-item';
        
        const percentage = (product.ventas / topProductsData[0].ventas) * 100;
        
        productItem.innerHTML = `
            <div class="product-rank">${index + 1}</div>
            <div class="product-details">
                <p class="product-name">${product.name}</p>
                <p class="product-sales">${product.ventas} vendidos</p>
            </div>
            <div class="product-progress">
                <div class="product-progress-bar" style="width: ${percentage}%"></div>
            </div>
        `;
        
        topProductsList.appendChild(productItem);
    });
}

function renderLowStockItems() {
    const lowStockGrid = document.getElementById('lowStockGrid');
    lowStockGrid.innerHTML = '';
    
    lowStockItems.forEach(item => {
        const stockItem = document.createElement('div');
        stockItem.className = 'low-stock-item';
        
        const percentage = (item.stock / item.min) * 100;
        
        stockItem.innerHTML = `
            <div class="low-stock-item-header">
                <p class="low-stock-item-name">${item.name}</p>
                <span class="stock-badge">Stock bajo</span>
            </div>
            <div class="stock-details">
                <span>Stock actual: ${item.stock}</span>
                <span>Mínimo: ${item.min}</span>
            </div>
            <div class="stock-progress">
                <div class="stock-progress-bar" style="width: ${percentage}%"></div>
            </div>
        `;
        
        lowStockGrid.appendChild(stockItem);
    });
}

function initializeCharts() {
    // Destroy existing charts
    if (salesChart) {
        salesChart.destroy();
    }
    if (productsChart) {
        productsChart.destroy();
    }
    
    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    salesChart = new Chart(salesCtx, {
        type: 'bar',
        data: {
            labels: salesData.map(d => d.hora),
            datasets: [{
                label: 'Ventas',
                data: salesData.map(d => d.ventas),
                backgroundColor: '#16a34a',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: true
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
    
    // Products Chart
    const productsCtx = document.getElementById('productsChart').getContext('2d');
    productsChart = new Chart(productsCtx, {
        type: 'pie',
        data: {
            labels: topProductsData.map(d => d.name),
            datasets: [{
                data: topProductsData.map(d => d.ventas),
                backgroundColor: topProductsData.map(d => d.color),
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

function selectPeriod(period) {
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
    
    // Here you would typically fetch new data for the selected period
    console.log('Selected period:', period);
}

function exportReport(type) {
    const filename = type === 'pdf' ? 'reporte-ventas.pdf' : 'reporte-ventas.xlsx';
    const content = `Reporte de ventas ${type.toUpperCase()} simulado`;
    const mimeType = type === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel';
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('togglePassword').addEventListener('click', togglePassword);
    
    // Cashier screen
    document.getElementById('logoutButton').addEventListener('click', logout);
    document.getElementById('adminButton').addEventListener('click', goToAdmin);
    document.getElementById('checkoutButton').addEventListener('click', proceedToCheckout);
    document.getElementById('clearCartButton').addEventListener('click', clearCart);
    
    // Payment screen
    document.getElementById('paymentBackButton').addEventListener('click', goBackToCashier);
    document.getElementById('cancelPaymentButton').addEventListener('click', goBackToCashier);
    document.getElementById('confirmPaymentButton').addEventListener('click', confirmPayment);
    document.getElementById('amountReceived').addEventListener('input', handleCashInput);
    
    // Payment methods
    document.querySelectorAll('.payment-method').forEach(btn => {
        btn.addEventListener('click', () => selectPaymentMethod(btn.dataset.method));
    });
    
    // Admin screen
    document.getElementById('adminBackButton').addEventListener('click', goBackToCashier);
    
    // Period selector
    document.querySelectorAll('.period-btn').forEach(btn => {
        btn.addEventListener('click', () => selectPeriod(btn.dataset.period));
    });
    
    // Initialize
    renderCategories();
    updateCartDisplay();
});

// Global functions for onclick handlers
window.fillDemoUser = fillDemoUser;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.selectCategory = selectCategory;
window.selectPaymentMethod = selectPaymentMethod;
window.selectPeriod = selectPeriod;
window.exportReport = exportReport;