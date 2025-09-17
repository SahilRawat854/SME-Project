// Shopping Cart Management
class CartManager {
    constructor() {
        this.cartItems = [];
        this.coupons = {
            'WELCOME10': { discount: 10, type: 'percentage', name: 'Welcome Discount' },
            'SAVE500': { discount: 500, type: 'fixed', name: 'Save ₹500' },
            'BIKE20': { discount: 20, type: 'percentage', name: 'Bike Lover Special' }
        };
        this.appliedCoupon = null;
        this.init();
    }

    init() {
        this.loadCartItems();
        this.setupEventListeners();
        this.renderCartItems();
        this.updatePriceSummary();
        this.loadRecommendations();
    }

    setupEventListeners() {
        // Coupon input click
        const couponInput = document.getElementById('couponInput');
        if (couponInput) {
            couponInput.addEventListener('click', () => {
                this.showCouponForm();
            });
        }

        // Apply coupon button
        const applyCouponBtn = document.getElementById('applyCoupon');
        if (applyCouponBtn) {
            applyCouponBtn.addEventListener('click', () => {
                this.applyCoupon();
            });
        }

        // Remove coupon button
        const removeCouponBtn = document.getElementById('removeCoupon');
        if (removeCouponBtn) {
            removeCouponBtn.addEventListener('click', () => {
                this.removeCoupon();
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.proceedToCheckout();
            });
        }

        // Coupon code input enter key
        const couponCodeInput = document.getElementById('couponCode');
        if (couponCodeInput) {
            couponCodeInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyCoupon();
                }
            });
        }
    }

    loadCartItems() {
        // Load cart items from localStorage or session storage
        const savedCart = localStorage.getItem('spinGoCart');
        if (savedCart) {
            this.cartItems = JSON.parse(savedCart);
        } else {
            // Sample cart items for demo
            this.cartItems = [
                {
                    id: 1,
                    name: 'Honda CBR600RR (2023)',
                    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center',
                    price: 1660,
                    duration: 8,
                    quantity: 1,
                    totalPrice: 13280,
                    features: ['High Performance', 'ABS', 'LED Lights']
                },
                {
                    id: 2,
                    name: 'Yamaha MT-07 (2023)',
                    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center',
                    price: 1660,
                    duration: 4,
                    quantity: 1,
                    totalPrice: 6640,
                    features: ['Naked Bike', 'Comfortable', 'Fuel Efficient']
                }
            ];
            this.saveCartItems();
        }
    }

    saveCartItems() {
        localStorage.setItem('spinGoCart', JSON.stringify(this.cartItems));
    }

    renderCartItems() {
        const cartItemsContainer = document.getElementById('cartItems');
        const emptyCartContainer = document.getElementById('emptyCart');
        const recommendationsContainer = document.getElementById('recommendations');

        if (this.cartItems.length === 0) {
            cartItemsContainer.style.display = 'none';
            emptyCartContainer.style.display = 'block';
            recommendationsContainer.style.display = 'none';
            return;
        }

        cartItemsContainer.style.display = 'block';
        emptyCartContainer.style.display = 'none';
        recommendationsContainer.style.display = 'block';

        cartItemsContainer.innerHTML = '';

        this.cartItems.forEach((item, index) => {
            const cartItemElement = this.createCartItemElement(item, index);
            cartItemsContainer.appendChild(cartItemElement);
        });
    }

    createCartItemElement(item, index) {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="row">
                <div class="col-md-3">
                    <img src="${item.image}" alt="${item.name}" class="bike-image">
                </div>
                <div class="col-md-6">
                    <h5 class="mb-2">${item.name}</h5>
                    <div class="mb-2">
                        <span class="badge bg-primary me-2">${item.duration} Hours</span>
                        <span class="text-muted">₹${item.price.toLocaleString()}/hour</span>
                    </div>
                    <div class="mb-2">
                        <small class="text-muted">Features: ${item.features.join(', ')}</small>
                    </div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="cartManager.updateQuantity(${index}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               min="1" max="5" onchange="cartManager.updateQuantity(${index}, 0, this.value)">
                        <button class="quantity-btn" onclick="cartManager.updateQuantity(${index}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <div class="col-md-3 text-end">
                    <div class="mb-2">
                        <h5 class="text-primary">₹${item.totalPrice.toLocaleString()}</h5>
                    </div>
                    <button class="btn btn-outline-danger btn-sm" onclick="cartManager.removeItem(${index})">
                        <i class="fas fa-trash me-1"></i>Remove
                    </button>
                </div>
            </div>
        `;
        return div;
    }

    updateQuantity(index, change, newValue = null) {
        const item = this.cartItems[index];
        
        if (newValue !== null) {
            item.quantity = Math.max(1, Math.min(5, parseInt(newValue)));
        } else {
            item.quantity = Math.max(1, Math.min(5, item.quantity + change));
        }
        
        item.totalPrice = item.price * item.duration * item.quantity;
        
        this.saveCartItems();
        this.renderCartItems();
        this.updatePriceSummary();
    }

    removeItem(index) {
        this.cartItems.splice(index, 1);
        this.saveCartItems();
        this.renderCartItems();
        this.updatePriceSummary();
    }

    updatePriceSummary() {
        const subtotal = this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
        const serviceFee = 500;
        const discount = this.calculateDiscount(subtotal);
        const gstAmount = Math.round((subtotal - discount + serviceFee) * 0.18);
        const totalAmount = subtotal - discount + serviceFee + gstAmount;

        // Update price elements
        document.getElementById('subtotal').textContent = `₹${subtotal.toLocaleString()}`;
        document.getElementById('gstAmount').textContent = `₹${gstAmount.toLocaleString()}`;
        document.getElementById('totalAmount').textContent = `₹${totalAmount.toLocaleString()}`;

        // Update discount display
        const discountItem = document.getElementById('discountItem');
        const discountAmount = document.getElementById('discountAmount');
        
        if (discount > 0) {
            discountItem.style.display = 'flex';
            discountAmount.textContent = `-₹${discount.toLocaleString()}`;
        } else {
            discountItem.style.display = 'none';
        }

        // Update checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            if (this.cartItems.length === 0) {
                checkoutBtn.disabled = true;
                checkoutBtn.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Cart is Empty';
            } else {
                checkoutBtn.disabled = false;
                checkoutBtn.innerHTML = `<i class="fas fa-credit-card me-2"></i>Proceed to Checkout (₹${totalAmount.toLocaleString()})`;
            }
        }
    }

    calculateDiscount(subtotal) {
        if (!this.appliedCoupon) return 0;

        const coupon = this.coupons[this.appliedCoupon];
        if (!coupon) return 0;

        if (coupon.type === 'percentage') {
            return Math.round(subtotal * (coupon.discount / 100));
        } else {
            return Math.min(coupon.discount, subtotal);
        }
    }

    showCouponForm() {
        const couponInput = document.getElementById('couponInput');
        const couponForm = document.getElementById('couponForm');
        
        couponInput.style.display = 'none';
        couponForm.style.display = 'block';
        
        // Focus on input
        document.getElementById('couponCode').focus();
    }

    applyCoupon() {
        const couponCode = document.getElementById('couponCode').value.trim().toUpperCase();
        
        if (!couponCode) {
            this.showAlert('Please enter a coupon code', 'warning');
            return;
        }

        if (!this.coupons[couponCode]) {
            this.showAlert('Invalid coupon code', 'danger');
            return;
        }

        this.appliedCoupon = couponCode;
        this.updateCouponDisplay();
        this.updatePriceSummary();
        this.showAlert(`Coupon "${this.coupons[couponCode].name}" applied successfully!`, 'success');
    }

    removeCoupon() {
        this.appliedCoupon = null;
        this.updateCouponDisplay();
        this.updatePriceSummary();
        this.showAlert('Coupon removed', 'info');
    }

    updateCouponDisplay() {
        const couponInput = document.getElementById('couponInput');
        const couponForm = document.getElementById('couponForm');
        const appliedCoupon = document.getElementById('appliedCoupon');
        const couponName = document.getElementById('couponName');

        if (this.appliedCoupon) {
            couponInput.style.display = 'none';
            couponForm.style.display = 'none';
            appliedCoupon.style.display = 'block';
            couponName.textContent = this.coupons[this.appliedCoupon].name;
        } else {
            couponInput.style.display = 'block';
            couponForm.style.display = 'none';
            appliedCoupon.style.display = 'none';
            document.getElementById('couponCode').value = '';
        }
    }

    loadRecommendations() {
        const recommendations = [
            {
                id: 3,
                name: 'Kawasaki Ninja 650',
                image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=150&fit=crop&crop=center',
                price: 1826,
                duration: 4,
                features: ['Sport Touring', 'Comfortable', 'Reliable']
            },
            {
                id: 4,
                name: 'Ducati Monster 821',
                image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=200&h=150&fit=crop&crop=center',
                price: 2490,
                duration: 2,
                features: ['Premium', 'Italian Design', 'High Performance']
            }
        ];

        const recommendationItems = document.getElementById('recommendationItems');
        recommendationItems.innerHTML = '';

        recommendations.forEach(bike => {
            const recommendationElement = document.createElement('div');
            recommendationElement.className = 'recommendation-item';
            recommendationElement.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-3">
                        <img src="${bike.image}" alt="${bike.name}" class="recommendation-image">
                    </div>
                    <div class="col-6">
                        <h6 class="mb-1">${bike.name}</h6>
                        <small class="text-muted">${bike.features.join(', ')}</small>
                        <div class="mt-1">
                            <span class="text-primary fw-bold">₹${bike.price.toLocaleString()}/hour</span>
                        </div>
                    </div>
                    <div class="col-3 text-end">
                        <button class="btn btn-sm btn-primary" onclick="cartManager.addToCart(${bike.id})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
            `;
            recommendationItems.appendChild(recommendationElement);
        });
    }

    addToCart(bikeId) {
        // In a real application, you would fetch bike details from an API
        const bikeDetails = {
            id: bikeId,
            name: 'Kawasaki Ninja 650',
            image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center',
            price: 1826,
            duration: 4,
            quantity: 1,
            totalPrice: 7304,
            features: ['Sport Touring', 'Comfortable', 'Reliable']
        };

        // Check if bike already exists in cart
        const existingItem = this.cartItems.find(item => item.id === bikeId);
        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.totalPrice = existingItem.price * existingItem.duration * existingItem.quantity;
        } else {
            this.cartItems.push(bikeDetails);
        }

        this.saveCartItems();
        this.renderCartItems();
        this.updatePriceSummary();
        this.showAlert('Bike added to cart!', 'success');
    }

    async proceedToCheckout() {
        if (this.cartItems.length === 0) {
            this.showAlert('Your cart is empty', 'warning');
            return;
        }

        // Show loading state
        this.showLoading();

        try {
            // Prepare checkout data
            const checkoutData = {
                items: this.cartItems,
                appliedCoupon: this.appliedCoupon,
                pricing: this.calculatePricing()
            };

            // Store checkout data in session storage
            sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));

            // Simulate processing
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Redirect to booking page
            window.location.href = 'booking.html';

        } catch (error) {
            this.showAlert('Failed to proceed to checkout. Please try again.', 'danger');
            console.error('Checkout error:', error);
        } finally {
            this.hideLoading();
        }
    }

    calculatePricing() {
        const subtotal = this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
        const serviceFee = 500;
        const discount = this.calculateDiscount(subtotal);
        const gstAmount = Math.round((subtotal - discount + serviceFee) * 0.18);
        const totalAmount = subtotal - discount + serviceFee + gstAmount;

        return {
            subtotal,
            serviceFee,
            discount,
            gstAmount,
            totalAmount
        };
    }

    showLoading() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
            checkoutBtn.disabled = true;
        }
    }

    hideLoading() {
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.innerHTML = '<i class="fas fa-credit-card me-2"></i>Proceed to Checkout';
            checkoutBtn.disabled = false;
        }
    }

    showAlert(message, type) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        // Create new alert
        const alertContainer = document.createElement('div');
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'}"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        // Insert alert at the top of the cart body
        const cartBody = document.querySelector('.cart-body');
        cartBody.insertBefore(alertContainer, cartBody.firstChild);
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            const alert = bootstrap.Alert.getInstance(alertContainer.firstElementChild);
            if (alert) alert.close();
        }, 3000);
    }
}

// Initialize cart manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.cartManager = new CartManager();
});
