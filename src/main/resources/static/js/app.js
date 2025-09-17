// SpinGo Frontend Application
class SpinGoApp {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8080/api';
        this.isConnected = false;
        this.init();
    }

    init() {
        this.checkApiConnection();
        this.loadPopularBikes();
        this.setupEventListeners();
        this.updateApiStatus();
    }

    // API Connection Management
    async checkApiConnection() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/auth/health`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (response.ok) {
                this.isConnected = true;
                console.log('✅ Backend API connected');
            } else {
                this.isConnected = false;
                console.log('❌ Backend API not responding');
            }
        } catch (error) {
            this.isConnected = false;
            console.log('❌ Backend API connection failed:', error.message);
        }
        
        this.updateApiStatus();
    }

    updateApiStatus() {
        // API status indicator removed for cleaner UI
        // Connection status is now handled silently in the background
        console.log(this.isConnected ? '✅ Backend connected' : '❌ Backend disconnected');
    }

    // Load Popular Bikes
    async loadPopularBikes() {
        const bikesContainer = document.getElementById('popularBikes');
        if (!bikesContainer) return;

        try {
            if (this.isConnected) {
                const response = await fetch(`${this.apiBaseUrl}/bikes/popular`);
                if (response.ok) {
                    const bikes = await response.json();
                    this.renderBikes(bikes, bikesContainer);
                } else {
                    console.log('API returned error, using mock data');
                    this.renderMockBikes(bikesContainer);
                }
            } else {
                this.renderMockBikes(bikesContainer);
            }
        } catch (error) {
            console.log('Failed to load bikes from API, using mock data:', error.message);
            this.renderMockBikes(bikesContainer);
        }
    }

    renderBikes(bikes, container) {
        container.innerHTML = '';
        
        bikes.slice(0, 3).forEach(bike => {
            const bikeCard = this.createBikeCard(bike);
            container.appendChild(bikeCard);
        });
    }

    renderMockBikes(container) {
        const mockBikes = [
            {
                id: 1,
                brand: 'Honda',
                model: 'CBR600RR',
                year: 2023,
                pricePerHour: 500,
                pricePerDay: 3000,
                pricePerMonth: 60000,
                description: 'High-performance sports bike perfect for city rides',
                status: 'AVAILABLE',
                imageUrl: 'images/honda-cbr-600rr.jpg'
            },
            {
                id: 2,
                brand: 'Yamaha',
                model: 'R1',
                year: 2023,
                pricePerHour: 600,
                pricePerDay: 3600,
                pricePerMonth: 72000,
                description: 'Racing-inspired sport bike with advanced technology',
                status: 'AVAILABLE',
                imageUrl: 'images/yamaha-r1.jpg'
            },
            {
                id: 3,
                brand: 'Kawasaki',
                model: 'Ninja',
                year: 2023,
                pricePerHour: 550,
                pricePerDay: 3300,
                pricePerMonth: 66000,
                description: 'Legendary Ninja series for adrenaline seekers',
                status: 'AVAILABLE',
                imageUrl: 'images/kawasaki-ninja.jpg'
            },
            {
                id: 4,
                brand: 'Kawasaki',
                model: 'Ninja',
                year: 2023,
                pricePerHour: 550,
                pricePerDay: 3300,
                pricePerMonth: 66000,
                description: 'Legendary Ninja series for adrenaline seekers',
                status: 'AVAILABLE',
                imageUrl: 'images/gsx 750.avif'
            },
            {
                id: 5,
                brand: 'Kawasaki',
                model: 'Ninja',
                year: 2023,
                pricePerHour: 550,
                pricePerDay: 3300,
                pricePerMonth: 66000,
                description: 'Legendary Ninja series for adrenaline seekers',
                status: 'AVAILABLE',
                imageUrl: 'images/kawasaki-ninja.jpg'
            }
        ];

        this.renderBikes(mockBikes, container);
    }

    createBikeCard(bike) {
        const col = document.createElement('div');
        col.className = 'col-md-4';

        col.innerHTML = `
            <div class="card bike-card h-100">
                <div class="position-relative">
                    <img src="${bike.imageUrl || 'images/bike_1.jpg'}" 
                         class="card-img-top" alt="${bike.brand} ${bike.model}" style="height: 200px; object-fit: cover;">
                    <div class="position-absolute top-0 end-0 m-2">
                        <span class="badge bg-success status-badge">${bike.status === 'AVAILABLE' ? 'Available' : bike.status}</span>
                    </div>
                </div>
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title text-white"> ${bike.brand} ${bike.model}</h5>
                    </div>
                    <p class="card-text text-muted">${bike.description}</p>
                    <div class="row text-center">
                        <div class="col-4">
                            <small class="text-muted">Hourly</small>
                            <div class="fw-bold text-primary">₹${bike.pricePerHour.toLocaleString()}</div>
                        </div>
                        <div class="col-4">
                            <small class="text-muted">Daily</small>
                            <div class="fw-bold text-primary">₹${bike.pricePerDay.toLocaleString()}</div>
                        </div>
                        <div class="col-4">
                            <small class="text-muted">Monthly</small>
                            <div class="fw-bold text-primary">₹${bike.pricePerMonth.toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div class="card-footer bg-transparent border-0">
                    <div class="d-grid">
                        <button class="btn btn-primary" onclick="app.viewBikeDetails(${bike.id})">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                    </div>
                </div>
            </div>
        `;

        return col;
    }

    // Event Handlers
    setupEventListeners() {
        // Check API connection every 30 seconds
        setInterval(() => {
            this.checkApiConnection();
        }, 30000);

        // Add loading states to forms
        document.addEventListener('submit', (e) => {
            if (e.target.tagName === 'FORM') {
                this.showLoading(e.target);
            }
        });
    }

    showLoading(element) {
        element.classList.add('loading');
        const submitBtn = element.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
            submitBtn.disabled = true;
        }
    }

    hideLoading(element) {
        element.classList.remove('loading');
        const submitBtn = element.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = submitBtn.getAttribute('data-original-text') || 'Submit';
            submitBtn.disabled = false;
        }
    }

    // Utility Methods
    showAlert(message, type = 'info') {
        const alertContainer = document.createElement('div');
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="fas fa-info-circle"></i> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const container = document.querySelector('.container');
        if (container) {
            container.insertBefore(alertContainer, container.firstChild);
            
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                const alert = bootstrap.Alert.getInstance(alertContainer.firstElementChild);
                if (alert) alert.close();
            }, 5000);
        }
    }

    formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }

    formatDateTime(dateTime) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateTime));
    }

    // Navigation Methods
    viewBikeDetails(bikeId) {
        if (this.isConnected) {
            window.location.href = `bike-details.html?id=${bikeId}`;
        } else {
            this.showAlert('Backend is not connected. Please check the API connection.', 'warning');
        }
    }

    // API Methods
    async makeApiCall(endpoint, options = {}) {
        if (!this.isConnected) {
            throw new Error('Backend API is not connected');
        }

        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const response = await fetch(`${this.apiBaseUrl}${endpoint}`, {
            ...defaultOptions,
            ...options
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.status} ${response.statusText}`);
        }

        return response.json();
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth manager first
    if (window.authManager) {
        window.authManager.updateNavigation();
    }
    
    // Initialize app
    window.app = new SpinGoApp();
    
    // Add fade-in animation to main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
});

// Global utility functions
window.SpinGo = {
    showAlert: (message, type) => window.app?.showAlert(message, type),
    formatCurrency: (amount) => window.app?.formatCurrency(amount),
    formatDateTime: (dateTime) => window.app?.formatDateTime(dateTime)
};
