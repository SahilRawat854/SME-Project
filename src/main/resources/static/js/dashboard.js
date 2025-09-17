// Dashboard functionality
class DashboardManager {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupCharts();
        this.loadRecentBookings();
        this.setupEventListeners();
    }

    loadUserData() {
        // Try to get user from auth manager first
        if (window.authManager) {
            this.user = window.authManager.getCurrentUser();
        }
        
        // Fallback: get user from localStorage directly
        if (!this.user) {
            const savedUser = localStorage.getItem('spinGoUser') || localStorage.getItem('user');
            if (savedUser) {
                this.user = JSON.parse(savedUser);
            }
        }

        // Update UI with user data
        if (this.user) {
            document.getElementById('userName').textContent = this.user.name || 'Customer';
            document.getElementById('welcomeName').textContent = this.user.name || 'Customer';
            console.log('User loaded:', this.user);
        } else {
            // Redirect to login if not authenticated
            console.log('No user found, redirecting to login');
            window.location.href = 'login.html';
        }
    }

    setupCharts() {
        this.setupUsageChart();
    }

    setupUsageChart() {
        const ctx = document.getElementById('usageChart');
        if (!ctx) return;

        // Get theme-aware colors from CSS variables
        const getComputedStyle = window.getComputedStyle(document.documentElement);
        const primaryColor = getComputedStyle.getPropertyValue('--bs-primary').trim() || '#007bff';
        const successColor = getComputedStyle.getPropertyValue('--bs-success').trim() || '#28a745';
        const textColor = getComputedStyle.getPropertyValue('--bs-body-color').trim() || '#ffffff';
        const mutedColor = getComputedStyle.getPropertyValue('--bs-secondary').trim() || '#6c757d';
        const borderColor = getComputedStyle.getPropertyValue('--bs-border-color').trim() || '#dee2e6';

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Hours Ridden',
                    data: [12, 19, 8, 15, 22, 18],
                    borderColor: primaryColor,
                    backgroundColor: primaryColor + '20', // Add transparency
                    tension: 0.4,
                    fill: true
                }, {
                    label: 'Distance (km)',
                    data: [45, 78, 32, 65, 89, 72],
                    borderColor: successColor,
                    backgroundColor: successColor + '20', // Add transparency
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: textColor
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: mutedColor
                        },
                        grid: {
                            color: borderColor
                        }
                    },
                    y: {
                        ticks: {
                            color: mutedColor
                        },
                        grid: {
                            color: borderColor
                        }
                    }
                }
            }
        });
    }

    loadRecentBookings() {
        const container = document.getElementById('recentBookings');
        if (!container) return;

        const mockBookings = [
            {
                id: 1,
                bike: 'Honda CBR600RR',
                date: '2024-01-15',
                duration: '4 hours',
                status: 'Completed',
                amount: '₹8,300'
            },
            {
                id: 2,
                bike: 'Yamaha MT-07',
                date: '2024-01-12',
                duration: '2 hours',
                status: 'Completed',
                amount: '₹3,320'
            },
            {
                id: 3,
                bike: 'Kawasaki Ninja 650',
                date: '2024-01-10',
                duration: '6 hours',
                status: 'Completed',
                amount: '₹10,956'
            }
        ];

        container.innerHTML = '';

        mockBookings.forEach(booking => {
            const bookingItem = document.createElement('div');
            bookingItem.className = 'list-group-item list-group-item-action border-0 bg-transparent';
            
            bookingItem.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1 text-white">${booking.bike}</h6>
                    <small class="text-success">${booking.status}</small>
                </div>
                <p class="mb-1 text-light">${booking.date} • ${booking.duration}</p>
                <small class="text-primary fw-bold">${booking.amount}</small>
            `;

            container.appendChild(bookingItem);
        });
    }

    setupEventListeners() {
        // Add any dashboard-specific event listeners here
    }

    updateStats() {
        // Update dashboard statistics
        // This would typically fetch data from the API
        const stats = {
            totalRides: 12,
            hoursRidden: 48,
            totalSpent: '₹1,04,000',
            loyaltyPoints: 2450
        };

        document.getElementById('totalRides').textContent = stats.totalRides;
        document.getElementById('hoursRidden').textContent = stats.hoursRidden;
        document.getElementById('totalSpent').textContent = stats.totalSpent;
        document.getElementById('loyaltyPoints').textContent = stats.loyaltyPoints;
    }
}

// Global logout function
function logout() {
    // Clear all authentication data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('spinGoUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('spinGoUser');
    
    // Use auth manager if available
    if (window.authManager) {
        window.authManager.logout();
    } else {
        // Fallback redirect
        window.location.href = 'login.html';
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard: DOM loaded, initializing dashboard manager');
    window.dashboardManager = new DashboardManager();
});
