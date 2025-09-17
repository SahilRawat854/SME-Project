// Authentication functionality for SpinGo Frontend
class AuthManager {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8080/api';
        this.tokenKey = 'spingo_token';
        this.userKey = 'spingo_user';
        this.init();
    }

    init() {
        this.setupLoginForm();
        this.setupPasswordToggle();
        this.checkExistingAuth();
    }

    setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }
    }

    setupPasswordToggle() {
        const togglePassword = document.getElementById('togglePassword');
        const passwordField = document.getElementById('password');
        
        if (togglePassword && passwordField) {
            togglePassword.addEventListener('click', function() {
                const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordField.setAttribute('type', type);
                
                const icon = this.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        }
    }

    async handleLogin(event) {
        const form = event.target;
        const formData = new FormData(form);
        
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
            role: formData.get('userRole'),
            remember: formData.get('remember') === 'on'
        };

        try {
            this.showLoading(form);
            this.hideMessages();

            if (window.app && window.app.isConnected) {
                // Try to authenticate with backend
                const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(loginData)
                });

                if (response.ok) {
                    const result = await response.json();
                    this.handleSuccessfulLogin(result, loginData.remember);
                } else {
                    const error = await response.json();
                    this.showError(error.message || 'Login failed');
                }
            } else {
                // Fallback to mock authentication
                this.handleMockLogin(loginData);
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showError('Network error. Please check your connection.');
        } finally {
            this.hideLoading(form);
        }
    }

    handleMockLogin(loginData) {
        // Mock authentication for demo purposes
        const mockUsers = {
            'admin@spingo.com': { role: 'ADMIN', name: 'Admin User' },
            'john@example.com': { role: 'CUSTOMER', name: 'John Doe' },
            'jane@example.com': { role: 'CUSTOMER', name: 'Jane Smith' },
            'alice@example.com': { role: 'CUSTOMER', name: 'Alice Johnson' },
            'tom@example.com': { role: 'DELIVERY_PARTNER', name: 'Tom Brown' },
            'sarah@example.com': { role: 'RENTAL_BUSINESS', name: 'Sarah Wilson' },
            'mike@example.com': { role: 'INDIVIDUAL_OWNER', name: 'Mike Johnson' }
        };

        // Use the new auth manager for role-based login
        if (window.authManager) {
            const result = window.authManager.loginUser(loginData.email, loginData.password, loginData.role);
            if (result.success) {
                const mockResult = {
                    token: 'mock_token_' + Date.now(),
                    user: result.user
                };
                this.handleSuccessfulLogin(mockResult, loginData.remember);
            } else {
                this.showError(result.message || 'Invalid credentials');
            }
        } else {
            // Fallback to old mock authentication
            if (loginData.password === 'password123' && mockUsers[loginData.email]) {
                const user = mockUsers[loginData.email];
                const mockResult = {
                    token: 'mock_token_' + Date.now(),
                    user: {
                        id: 1,
                        email: loginData.email,
                        name: user.name,
                        role: user.role
                    }
                };
                this.handleSuccessfulLogin(mockResult, loginData.remember);
            } else {
                this.showError('Invalid credentials. Please try again.');
            }
        }
    }

    handleSuccessfulLogin(result, remember) {
        // Store authentication data
        if (remember) {
            localStorage.setItem(this.tokenKey, result.token);
            localStorage.setItem(this.userKey, JSON.stringify(result.user));
        } else {
            sessionStorage.setItem(this.tokenKey, result.token);
            sessionStorage.setItem(this.userKey, JSON.stringify(result.user));
        }

        // Also update the auth manager if available
        if (window.authManager) {
            window.authManager.saveUserToStorage(result.user);
        }

        this.showSuccess('Login successful! Redirecting...');
        
        // Redirect based on user role (handle both backend and mock roles)
        setTimeout(() => {
            const role = result.user.role?.toLowerCase();
            switch (role) {
                case 'admin':
                    window.location.href = 'admin-dashboard.html';
                    break;
                case 'delivery_partner':
                case 'delivery-partner':
                    window.location.href = 'delivery-dashboard.html';
                    break;
                case 'rental_business':
                case 'rental-business':
                    window.location.href = 'rental-business-dashboard.html';
                    break;
                case 'individual_owner':
                case 'individual-owner':
                    window.location.href = 'individual-owner-dashboard.html';
                    break;
                case 'customer':
                default:
                    window.location.href = 'dashboard.html';
            }
        }, 1500);
    }

    checkExistingAuth() {
        const token = localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
        const user = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
        
        if (token && user) {
            // User is already logged in, redirect to appropriate dashboard
            const userData = JSON.parse(user);
            console.log('User already authenticated:', userData);
        }
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        sessionStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem(this.userKey);
        
        window.location.href = 'index.html';
    }

    getCurrentUser() {
        const user = localStorage.getItem(this.userKey) || sessionStorage.getItem(this.userKey);
        return user ? JSON.parse(user) : null;
    }

    getAuthToken() {
        return localStorage.getItem(this.tokenKey) || sessionStorage.getItem(this.tokenKey);
    }

    isAuthenticated() {
        return !!(this.getAuthToken() && this.getCurrentUser());
    }

    // UI Helper Methods
    showLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.setAttribute('data-original-text', submitBtn.innerHTML);
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Signing In...';
            submitBtn.disabled = true;
        }
    }

    hideLoading(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || '<i class="fas fa-sign-in-alt"></i> Sign In';
            submitBtn.disabled = false;
        }
    }

    showError(message) {
        const errorDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        
        if (errorDiv && errorText) {
            errorText.textContent = message;
            errorDiv.classList.remove('d-none');
        }
    }

    showSuccess(message) {
        const successDiv = document.getElementById('successMessage');
        const successText = document.getElementById('successText');
        
        if (successDiv && successText) {
            successText.textContent = message;
            successDiv.classList.remove('d-none');
        }
    }

    hideMessages() {
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');
        
        if (errorDiv) errorDiv.classList.add('d-none');
        if (successDiv) successDiv.classList.add('d-none');
    }
}

// Global functions for quick login
function quickLogin(email, password) {
    const emailField = document.getElementById('email');
    const passwordField = document.getElementById('password');
    
    if (emailField && passwordField) {
        emailField.value = email;
        passwordField.value = password;
        
        // Trigger form submission
        const form = document.getElementById('loginForm');
        if (form) {
            form.dispatchEvent(new Event('submit'));
        }
    }
}

// Initialize authentication manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.authManager = new AuthManager();
});
