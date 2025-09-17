// Authentication Manager
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadUserFromStorage();
        this.updateNavigation();
    }

    loadUserFromStorage() {
        // Try spinGoUser first, then fallback to user
        let savedUser = localStorage.getItem('spinGoUser');
        if (!savedUser) {
            savedUser = localStorage.getItem('user');
        }
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
        }
    }

    saveUserToStorage(user) {
        this.currentUser = user;
        localStorage.setItem('spinGoUser', JSON.stringify(user));
        this.updateNavigation();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('spinGoUser');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('spinGoCart'); // Clear cart on logout
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('spinGoUser');
        this.updateNavigation();
        window.location.href = 'index.html';
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getUserRole() {
        return this.currentUser ? this.currentUser.role : null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    updateNavigation() {
        // Update cart visibility
        const cartLink = document.querySelector('a[href="cart.html"]');
        if (cartLink) {
            if (this.isAuthenticated()) {
                cartLink.style.display = 'block';
                // Update cart count if user has items
                this.updateCartCount();
            } else {
                cartLink.style.display = 'none';
            }
        }

        // Update login/signup links
        const loginLink = document.querySelector('a[href="login.html"]');
        const signupLink = document.querySelector('a[href="signup.html"]');
        
        if (this.isAuthenticated()) {
            if (loginLink) loginLink.style.display = 'none';
            if (signupLink) signupLink.style.display = 'none';
            
            // Add user menu
            this.addUserMenu();
        } else {
            if (loginLink) loginLink.style.display = 'block';
            if (signupLink) signupLink.style.display = 'block';
            this.removeUserMenu();
        }
    }

    addUserMenu() {
        // Remove existing user menu if any
        this.removeUserMenu();
        
        const navbar = document.querySelector('.navbar-nav');
        if (navbar && this.currentUser) {
            const userMenu = document.createElement('li');
            userMenu.className = 'nav-item dropdown';
            userMenu.innerHTML = `
                <a class="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-bs-toggle="dropdown">
                    <i class="fas fa-user me-1"></i> ${this.currentUser.name}
                </a>
                <ul class="dropdown-menu">
                    <li><a class="dropdown-item" href="${this.getDashboardUrl()}">
                        <i class="fas fa-tachometer-alt me-2"></i>Dashboard
                    </a></li>
                    <li><a class="dropdown-item" href="cart.html">
                        <i class="fas fa-shopping-cart me-2"></i>Cart
                    </a></li>
                    <li><a class="dropdown-item" href="documents.html">
                        <i class="fas fa-file-upload me-2"></i>Documents
                    </a></li>
                    <li><hr class="dropdown-divider"></li>
                    <li><a class="dropdown-item" href="#" onclick="authManager.logout()">
                        <i class="fas fa-sign-out-alt me-2"></i>Logout
                    </a></li>
                </ul>
            `;
            navbar.appendChild(userMenu);
        }
    }

    removeUserMenu() {
        const userMenu = document.querySelector('.nav-item.dropdown');
        if (userMenu) {
            userMenu.remove();
        }
    }

    getDashboardUrl() {
        if (!this.currentUser) return 'dashboard.html';
        
        const role = this.currentUser.role;
        switch (role) {
            case 'ADMIN':
                return 'admin-dashboard.html';
            case 'INDIVIDUAL_OWNER':
                return 'individual-owner-dashboard.html';
            case 'RENTAL_BUSINESS':
                return 'rental-business-dashboard.html';
            case 'DELIVERY_PARTNER':
                return 'delivery-dashboard.html';
            case 'CUSTOMER':
            default:
                return 'dashboard.html';
        }
    }

    updateCartCount() {
        const cartLink = document.querySelector('a[href="cart.html"]');
        if (cartLink) {
            const savedCart = localStorage.getItem('spinGoCart');
            if (savedCart) {
                const cartItems = JSON.parse(savedCart);
                const count = cartItems.length;
                
                // Remove existing badge
                const existingBadge = cartLink.querySelector('.badge');
                if (existingBadge) {
                    existingBadge.remove();
                }
                
                // Add new badge if there are items
                if (count > 0) {
                    cartLink.innerHTML += ` <span class="badge bg-danger">${count}</span>`;
                }
            }
        }
    }

    // Method to simulate login for different roles
    loginUser(email, password, role) {
        // In a real application, this would make an API call
        const users = {
            'admin@spingo.com': { name: 'Admin User', role: 'ADMIN', email: 'admin@spingo.com' },
            'mike@example.com': { name: 'Mike Johnson', role: 'INDIVIDUAL_OWNER', email: 'mike@example.com' },
            'sarah@example.com': { name: 'Sarah Wilson', role: 'RENTAL_BUSINESS', email: 'sarah@example.com' },
            'tom@example.com': { name: 'Tom Brown', role: 'DELIVERY_PARTNER', email: 'tom@example.com' },
            'john@example.com': { name: 'John Doe', role: 'CUSTOMER', email: 'john@example.com' },
            'jane@example.com': { name: 'Jane Smith', role: 'CUSTOMER', email: 'jane@example.com' },
            'alice@example.com': { name: 'Alice Johnson', role: 'CUSTOMER', email: 'alice@example.com' }
        };

        const user = users[email];
        if (user && user.role === role.toUpperCase()) {
            this.saveUserToStorage(user);
            return { success: true, user: user };
        }
        
        return { success: false, message: 'Invalid credentials' };
    }
}

// Initialize auth manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.authManager = new AuthManager();
});
