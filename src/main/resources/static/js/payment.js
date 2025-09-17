// Payment Page Management
class PaymentManager {
    constructor() {
        this.selectedPaymentMethod = null;
        this.selectedUpiApp = null;
        this.selectedWallet = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupPaymentMethodSelection();
        this.setupCardInputFormatting();
    }

    setupEventListeners() {
        const payNowBtn = document.getElementById('payNowBtn');
        if (payNowBtn) {
            payNowBtn.addEventListener('click', () => this.handlePayment());
        }
    }

    setupPaymentMethodSelection() {
        const paymentCards = document.querySelectorAll('.payment-method-card');
        paymentCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selected class from all cards
                paymentCards.forEach(c => c.classList.remove('selected'));
                
                // Add selected class to clicked card
                card.classList.add('selected');
                
                // Store selected payment method
                this.selectedPaymentMethod = card.dataset.method;
                
                // Show/hide payment details
                this.showPaymentDetails(this.selectedPaymentMethod);
            });
        });

        // UPI App selection
        const upiApps = document.querySelectorAll('.upi-app[data-app]');
        upiApps.forEach(app => {
            app.addEventListener('click', () => {
                upiApps.forEach(a => a.classList.remove('selected'));
                app.classList.add('selected');
                this.selectedUpiApp = app.dataset.app;
            });
        });

        // Wallet selection
        const wallets = document.querySelectorAll('.upi-app[data-wallet]');
        wallets.forEach(wallet => {
            wallet.addEventListener('click', () => {
                wallets.forEach(w => w.classList.remove('selected'));
                wallet.classList.add('selected');
                this.selectedWallet = wallet.dataset.wallet;
            });
        });
    }

    setupCardInputFormatting() {
        const cardNumberInput = document.getElementById('cardNumber');
        const expiryInput = document.getElementById('expiryDate');
        const cvvInput = document.getElementById('cvv');

        // Format card number
        if (cardNumberInput) {
            cardNumberInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
                e.target.value = formattedValue;
            });
        }

        // Format expiry date
        if (expiryInput) {
            expiryInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }

        // Format CVV (numbers only)
        if (cvvInput) {
            cvvInput.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        }
    }

    showPaymentDetails(method) {
        // Hide all payment details
        const allDetails = document.querySelectorAll('.upi-payment-details, .card-payment-details, .netbanking-details, .wallet-details');
        allDetails.forEach(detail => {
            detail.style.display = 'none';
        });

        // Show selected payment method details
        switch (method) {
            case 'upi':
                document.querySelector('.upi-payment-details').style.display = 'block';
                break;
            case 'card':
                document.querySelector('.card-payment-details').style.display = 'block';
                break;
            case 'netbanking':
                document.querySelector('.netbanking-details').style.display = 'block';
                break;
            case 'wallet':
                document.querySelector('.wallet-details').style.display = 'block';
                break;
        }
    }

    validatePaymentDetails() {
        if (!this.selectedPaymentMethod) {
            this.showAlert('Please select a payment method', 'warning');
            return false;
        }

        switch (this.selectedPaymentMethod) {
            case 'upi':
                return this.validateUpiPayment();
            case 'card':
                return this.validateCardPayment();
            case 'netbanking':
                return this.validateNetBanking();
            case 'wallet':
                return this.validateWalletPayment();
            default:
                return false;
        }
    }

    validateUpiPayment() {
        if (!this.selectedUpiApp) {
            this.showAlert('Please select a UPI app', 'warning');
            return false;
        }

        const upiId = document.getElementById('upiId').value.trim();
        if (!upiId) {
            this.showAlert('Please enter your UPI ID', 'warning');
            return false;
        }

        const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/;
        if (!upiRegex.test(upiId)) {
            this.showAlert('Please enter a valid UPI ID', 'warning');
            return false;
        }

        return true;
    }

    validateCardPayment() {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;
        const cardName = document.getElementById('cardName').value.trim();

        if (!cardNumber || cardNumber.length < 16) {
            this.showAlert('Please enter a valid card number', 'warning');
            return false;
        }

        if (!this.validateCardNumber(cardNumber)) {
            this.showAlert('Please enter a valid card number', 'warning');
            return false;
        }

        if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
            this.showAlert('Please enter a valid expiry date (MM/YY)', 'warning');
            return false;
        }

        if (!this.validateExpiryDate(expiryDate)) {
            this.showAlert('Card has expired', 'warning');
            return false;
        }

        if (!cvv || cvv.length < 3) {
            this.showAlert('Please enter a valid CVV', 'warning');
            return false;
        }

        if (!cardName) {
            this.showAlert('Please enter cardholder name', 'warning');
            return false;
        }

        return true;
    }

    validateNetBanking() {
        const bankSelect = document.getElementById('bankSelect');
        if (!bankSelect.value) {
            this.showAlert('Please select your bank', 'warning');
            return false;
        }
        return true;
    }

    validateWalletPayment() {
        if (!this.selectedWallet) {
            this.showAlert('Please select a wallet', 'warning');
            return false;
        }
        return true;
    }

    validateCardNumber(cardNumber) {
        // Luhn algorithm for card validation
        let sum = 0;
        let isEven = false;

        for (let i = cardNumber.length - 1; i >= 0; i--) {
            let digit = parseInt(cardNumber[i]);

            if (isEven) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            isEven = !isEven;
        }

        return sum % 10 === 0;
    }

    validateExpiryDate(expiryDate) {
        const [month, year] = expiryDate.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const now = new Date();
        return expiry > now;
    }

    async handlePayment() {
        if (!this.validatePaymentDetails()) {
            return;
        }

        // Show loading state
        this.showLoading();

        try {
            // Simulate payment processing
            await this.processPayment();
            
            // Show success message
            this.showAlert('Payment successful! Redirecting to booking confirmation...', 'success');
            
            // Redirect to booking confirmation
            setTimeout(() => {
                window.location.href = 'booking-confirmation.html';
            }, 2000);

        } catch (error) {
            this.showAlert('Payment failed. Please try again.', 'danger');
            console.error('Payment error:', error);
        } finally {
            this.hideLoading();
        }
    }

    async processPayment() {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 3000));

        // In a real application, you would integrate with payment gateways here
        // Example for different payment methods:
        
        switch (this.selectedPaymentMethod) {
            case 'upi':
                // Integrate with UPI payment gateway
                console.log('Processing UPI payment...');
                break;
            case 'card':
                // Integrate with card payment gateway (Razorpay, Stripe, etc.)
                console.log('Processing card payment...');
                break;
            case 'netbanking':
                // Integrate with net banking gateway
                console.log('Processing net banking payment...');
                break;
            case 'wallet':
                // Integrate with wallet payment gateway
                console.log('Processing wallet payment...');
                break;
        }

        // Simulate random success/failure for demo
        const isSuccess = Math.random() > 0.1; // 90% success rate
        
        if (!isSuccess) {
            throw new Error('Payment processing failed');
        }
    }

    showLoading() {
        const payBtn = document.getElementById('payNowBtn');
        if (payBtn) {
            payBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing Payment...';
            payBtn.disabled = true;
        }
    }

    hideLoading() {
        const payBtn = document.getElementById('payNowBtn');
        if (payBtn) {
            payBtn.innerHTML = '<i class="fas fa-lock me-2"></i>Pay ₹25,830';
            payBtn.disabled = false;
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
        
        // Insert alert at the top of the payment body
        const paymentBody = document.querySelector('.payment-body');
        paymentBody.insertBefore(alertContainer, paymentBody.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = bootstrap.Alert.getInstance(alertContainer.firstElementChild);
            if (alert) alert.close();
        }, 5000);
    }
}

// Initialize payment manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.paymentManager = new PaymentManager();
});
