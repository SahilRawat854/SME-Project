// Cart Management JavaScript
class CartManager {
    constructor() {
        this.cartItems = this.loadCartFromStorage();
        this.serviceFeeRate = 0.1; // 10% service fee
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateCartDisplay();
        this.updateCartBadge();
        this.setupAuthListener();
    }

    setupEventListeners() {
        // Listen for storage changes (cart updates from other tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === 'cartItems') {
                this.cartItems = this.loadCartFromStorage();
                this.updateCartDisplay();
                this.updateCartBadge();
            }
        });

        // Listen for custom cart events
        window.addEventListener('cartUpdated', () => {
            this.cartItems = this.loadCartFromStorage();
            this.updateCartDisplay();
            this.updateCartBadge();
        });
    }

    setupAuthListener() {
        // Listen for authentication state changes
        window.addEventListener('authStateChanged', () => {
            this.updateCartDisplay();
        });
    }

    loadCartFromStorage() {
        try {
            const cartData = localStorage.getItem('cartItems');
            return cartData ? JSON.parse(cartData) : [];
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            return [];
        }
    }

    saveCartToStorage() {
        try {
            localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
            // Dispatch custom event to notify other tabs
            window.dispatchEvent(new CustomEvent('cartUpdated'));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    addToCart(bikeData, duration = 'hourly', quantity = 1) {
        console.log('🛒 Adding to cart:', bikeData, 'Duration:', duration, 'Quantity:', quantity);
        
        // Check if user is authenticated
        if (!window.authManager || !window.authManager.isAuthenticated()) {
            this.showAlert('Please login to add items to cart', 'warning');
            return false;
        }

        // Check if user is a customer
        const userRole = window.authManager.getUserRole();
        if (userRole !== 'CUSTOMER') {
            this.showAlert('Only customers can add items to cart', 'warning');
            return false;
        }

        // Check if bike is already in cart
        const existingItemIndex = this.cartItems.findIndex(item => 
            item.bikeId === bikeData.id && item.duration === duration
        );

        if (existingItemIndex !== -1) {
            // Update quantity
            this.cartItems[existingItemIndex].quantity += quantity;
        } else {
            // Add new item
            const cartItem = {
                id: Date.now(), // Unique cart item ID
                bikeId: bikeData.id,
                brand: bikeData.brand,
                model: bikeData.model,
                year: bikeData.year,
                type: bikeData.type,
                city: bikeData.city,
                imageUrl: bikeData.imageUrl || 'images/Bike_1.jpg',
                duration: duration,
                quantity: quantity,
                pricePerUnit: this.getPriceForDuration(bikeData, duration),
                addedAt: new Date().toISOString()
            };
            this.cartItems.push(cartItem);
        }

        this.saveCartToStorage();
        this.updateCartDisplay();
        this.updateCartBadge();
        this.showAlert(`${bikeData.brand} ${bikeData.model} added to cart!`, 'success');
        return true;
    }

    getPriceForDuration(bikeData, duration) {
        switch (duration) {
            case 'hourly':
                return bikeData.pricePerHour;
            case 'daily':
                return bikeData.pricePerDay;
            case 'monthly':
                return bikeData.pricePerMonth;
            default:
                return bikeData.pricePerHour;
        }
    }

    removeFromCart(cartItemId) {
        console.log('🗑️ Removing from cart:', cartItemId);
        
        this.cartItems = this.cartItems.filter(item => item.id !== cartItemId);
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.updateCartBadge();
        this.showAlert('Item removed from cart', 'info');
    }

    updateQuantity(cartItemId, newQuantity) {
        console.log('📝 Updating quantity:', cartItemId, 'to', newQuantity);
        
        if (newQuantity <= 0) {
            this.removeFromCart(cartItemId);
            return;
        }

        const item = this.cartItems.find(item => item.id === cartItemId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCartToStorage();
            this.updateCartDisplay();
            this.updateCartBadge();
        }
    }

    updateDuration(cartItemId, newDuration) {
        console.log('⏰ Updating duration:', cartItemId, 'to', newDuration);
        
        const item = this.cartItems.find(item => item.id === cartItemId);
        if (item) {
            item.duration = newDuration;
            // Get the bike data to update price
            this.getBikeData(item.bikeId).then(bikeData => {
                if (bikeData) {
                    item.pricePerUnit = this.getPriceForDuration(bikeData, newDuration);
                    this.saveCartToStorage();
                    this.updateCartDisplay();
                    this.updateCartBadge();
                }
            });
        }
    }

    async getBikeData(bikeId) {
        try {
            // Try to get from API first
            const response = await fetch(`http://localhost:8080/api/bikes/${bikeId}`);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('API not available, using mock data');
        }

        // Fallback to mock data
        const mockBikes = {
            1: { id: 1, brand: 'Yamaha', model: 'YZF-R1', year: 2023, type: 'SPORT', city: 'Mumbai', pricePerHour: 500, pricePerDay: 3000, pricePerMonth: 60000, imageUrl: 'images/honda-cbr-600rr.jpg' },
            2: { id: 2, brand: 'Honda', model: 'CBR600RR', year: 2023, type: 'SPORT', city: 'Delhi', pricePerHour: 450, pricePerDay: 2800, pricePerMonth: 55000, imageUrl: 'images/honda-cbr-600rr.jpg' },
            3: { id: 3, brand: 'Kawasaki', model: 'Ninja ZX-10R', year: 2023, type: 'SPORT', city: 'Bangalore', pricePerHour: 600, pricePerDay: 3500, pricePerMonth: 70000, imageUrl: 'images/kawasaki-ninja-zx10r.jpg' },
            4: { id: 4, brand: 'Harley-Davidson', model: 'Street Glide', year: 2023, type: 'CRUISER', city: 'Chennai', pricePerHour: 400, pricePerDay: 2500, pricePerMonth: 50000, imageUrl: 'images/harley-street-glide.jpg' },
            5: { id: 5, brand: 'BMW', model: 'R 1250 GS Adventure', year: 2023, type: 'TOURING', city: 'Pune', pricePerHour: 550, pricePerDay: 3200, pricePerMonth: 65000, imageUrl: 'images/bmw-r1250gs.jpg' }
        };

        return mockBikes[bikeId];
    }

    updateCartDisplay() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCartDiv = document.getElementById('emptyCart');
        const cartSummaryDiv = document.getElementById('cartSummary');

        if (!cartItemsContainer) return;

        if (this.cartItems.length === 0) {
            cartItemsContainer.innerHTML = '';
            if (emptyCartDiv) emptyCartDiv.style.display = 'block';
            if (cartSummaryDiv) cartSummaryDiv.style.display = 'none';
            return;
        }

        if (emptyCartDiv) emptyCartDiv.style.display = 'none';
        if (cartSummaryDiv) cartSummaryDiv.style.display = 'block';

        cartItemsContainer.innerHTML = this.cartItems.map(item => this.createCartItemHTML(item)).join('');
    }

    createCartItemHTML(item) {
        const durationOptions = {
            'hourly': 'Hourly',
            'daily': 'Daily',
            'monthly': 'Monthly'
        };

        const totalPrice = item.pricePerUnit * item.quantity;

        return `
            <div class="cart-item" data-cart-item-id="${item.id}">
                <div class="row align-items-center">
                    <div class="col-md-2">
                        <img src="${item.imageUrl}" alt="${item.brand} ${item.model}" class="cart-item-image">
                    </div>
                    <div class="col-md-4">
                        <div class="cart-item-details">
                            <h5>${item.brand} ${item.model}</h5>
                            <p><i class="fas fa-calendar me-2"></i>${item.year}</p>
                            <p><i class="fas fa-tag me-2"></i>${item.type}</p>
                            <p><i class="fas fa-map-marker-alt me-2"></i>${item.city}</p>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="mb-2">
                            <label class="form-label text-white">Duration:</label>
                            <select class="duration-select" onchange="cartManager.updateDuration(${item.id}, this.value)">
                                <option value="hourly" ${item.duration === 'hourly' ? 'selected' : ''}>Hourly</option>
                                <option value="daily" ${item.duration === 'daily' ? 'selected' : ''}>Daily</option>
                                <option value="monthly" ${item.duration === 'monthly' ? 'selected' : ''}>Monthly</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-2">
                        <div class="mb-2">
                            <label class="form-label text-white">Quantity:</label>
                            <div class="quantity-controls">
                                <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity - 1})">
                                    <i class="fas fa-minus"></i>
                                </button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1" max="10" 
                                       onchange="cartManager.updateQuantity(${item.id}, parseInt(this.value))">
                                <button class="quantity-btn" onclick="cartManager.updateQuantity(${item.id}, ${item.quantity + 1})">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-1">
                        <div class="text-center">
                            <p class="text-white fw-bold">₹${item.pricePerUnit.toLocaleString()}</p>
                            <small class="text-muted">per ${durationOptions[item.duration]}</small>
                        </div>
                    </div>
                    <div class="col-md-1">
                        <div class="text-center">
                            <p class="text-success fw-bold">₹${totalPrice.toLocaleString()}</p>
                            <button class="remove-btn" onclick="cartManager.removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    updateCartBadge() {
        const cartBadge = document.getElementById('cartBadge');
        if (cartBadge) {
            const totalItems = this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
            cartBadge.textContent = totalItems;
            cartBadge.style.display = totalItems > 0 ? 'inline' : 'none';
        }
    }

    calculateTotals() {
        const subtotal = this.cartItems.reduce((sum, item) => {
            return sum + (item.pricePerUnit * item.quantity);
        }, 0);

        const serviceFee = subtotal * this.serviceFeeRate;
        const total = subtotal + serviceFee;

        return { subtotal, serviceFee, total };
    }

    updateCartSummary() {
        const { subtotal, serviceFee, total } = this.calculateTotals();

        const subtotalElement = document.getElementById('subtotal');
        const serviceFeeElement = document.getElementById('serviceFee');
        const totalElement = document.getElementById('total');

        if (subtotalElement) subtotalElement.textContent = `₹${subtotal.toLocaleString()}`;
        if (serviceFeeElement) serviceFeeElement.textContent = `₹${serviceFee.toLocaleString()}`;
        if (totalElement) totalElement.textContent = `₹${total.toLocaleString()}`;
    }

    proceedToCheckout() {
        console.log('💳 Proceeding to checkout...');
        
        // Check if user is authenticated
        if (!window.authManager || !window.authManager.isAuthenticated()) {
            this.showAlert('Please login to proceed to checkout', 'warning');
            return;
        }

        // Check if cart is empty
        if (this.cartItems.length === 0) {
            this.showAlert('Your cart is empty', 'warning');
            return;
        }

        // Store cart data for checkout
        const checkoutData = {
            items: this.cartItems,
            totals: this.calculateTotals(),
            timestamp: new Date().toISOString()
        };

        sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));

        // Navigate to checkout page (you can create this later)
        this.showAlert('Redirecting to checkout...', 'info');
        
        // For now, show a summary
        this.showCheckoutSummary(checkoutData);
    }

    showCheckoutSummary(checkoutData) {
        const summary = `
            <div class="alert alert-info">
                <h5>Checkout Summary</h5>
                <p><strong>Items:</strong> ${checkoutData.items.length}</p>
                <p><strong>Subtotal:</strong> ₹${checkoutData.totals.subtotal.toLocaleString()}</p>
                <p><strong>Service Fee:</strong> ₹${checkoutData.totals.serviceFee.toLocaleString()}</p>
                <p><strong>Total:</strong> ₹${checkoutData.totals.total.toLocaleString()}</p>
                <hr>
                <p class="mb-0">Checkout functionality will be implemented in the next phase.</p>
            </div>
        `;

        // Create a modal or show in a div
        const modal = document.createElement('div');
        modal.className = 'modal fade show';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Checkout Summary</h5>
                        <button type="button" class="btn-close" onclick="this.closest('.modal').remove()"></button>
                    </div>
                    <div class="modal-body">
                        ${summary}
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    clearCart() {
        console.log('🧹 Clearing cart...');
        this.cartItems = [];
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.updateCartBadge();
        this.showAlert('Cart cleared', 'info');
    }

    showAlert(message, type = 'info') {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        document.body.appendChild(alertDiv);

        // Auto remove after 3 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 3000);
    }

    // Public methods for external use
    getCartItems() {
        return this.cartItems;
    }

    getCartItemCount() {
        return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }

    isInCart(bikeId, duration = 'hourly') {
        return this.cartItems.some(item => item.bikeId === bikeId && item.duration === duration);
    }
}

// Global functions for HTML onclick handlers
function proceedToCheckout() {
    if (window.cartManager) {
        window.cartManager.proceedToCheckout();
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛒 Initializing CartManager...');
    try {
        window.cartManager = new CartManager();
        console.log('✅ CartManager initialized:', window.cartManager);
        console.log('🛒 Cart items count:', window.cartManager.cartItems.length);
        
        // Update cart summary after initialization
        if (window.cartManager.cartItems.length > 0) {
            window.cartManager.updateCartSummary();
        }
        
        // Dispatch event to notify other scripts that cart manager is ready
        window.dispatchEvent(new CustomEvent('cartManagerReady'));
    } catch (error) {
        console.error('❌ Error initializing CartManager:', error);
    }
});

// Also initialize immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading, wait for DOMContentLoaded
} else {
    // DOM is already loaded, initialize immediately
    console.log('🛒 DOM already loaded, initializing CartManager immediately...');
    try {
        window.cartManager = new CartManager();
        console.log('✅ CartManager initialized immediately:', window.cartManager);
        window.dispatchEvent(new CustomEvent('cartManagerReady'));
    } catch (error) {
        console.error('❌ Error initializing CartManager immediately:', error);
    }
}