// Rental Business Dashboard functionality
class RentalBusinessDashboardManager {
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
        // Get user from auth manager
        if (window.authManager) {
            this.user = window.authManager.getCurrentUser();
        }

        // Check if user is rental business owner
        if (!this.user || this.user.role !== 'RENTAL_BUSINESS') {
            window.location.href = 'login.html';
            return;
        }

        // Update UI with business owner data
        document.getElementById('businessName').textContent = this.user.name || 'Business Owner';
    }

    setupCharts() {
        this.setupRevenueChart();
        this.setupFleetStatusChart();
    }

    setupRevenueChart() {
        const ctx = document.getElementById('revenueChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Revenue (₹)',
                    data: [180000, 220000, 195000, 280000, 240000, 245000],
                    backgroundColor: 'rgba(99, 102, 241, 0.8)',
                    borderColor: '#6366f1',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#f1f5f9'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: '#94a3b8'
                        },
                        grid: {
                            color: '#475569'
                        }
                    },
                    y: {
                        ticks: {
                            color: '#94a3b8',
                            callback: function(value) {
                                return '₹' + (value / 1000) + 'K';
                            }
                        },
                        grid: {
                            color: '#475569'
                        }
                    }
                }
            }
        });
    }

    setupFleetStatusChart() {
        const ctx = document.getElementById('fleetStatusChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Available', 'Rented', 'Maintenance', 'Offline'],
                datasets: [{
                    data: [12, 28, 3, 2],
                    backgroundColor: [
                        '#10b981',
                        '#6366f1',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#f1f5f9',
                            padding: 15,
                            usePointStyle: true
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
                id: 'BK001',
                customer: 'Rahul Sharma',
                bike: 'Honda CBR600RR',
                duration: '4 hours',
                amount: '₹1,200',
                status: 'Active',
                time: '2 hours ago'
            },
            {
                id: 'BK002',
                customer: 'Priya Patel',
                bike: 'Yamaha MT-07',
                duration: '2 hours',
                amount: '₹600',
                status: 'Completed',
                time: '4 hours ago'
            },
            {
                id: 'BK003',
                customer: 'Amit Kumar',
                bike: 'Kawasaki Ninja 650',
                duration: '6 hours',
                amount: '₹1,800',
                status: 'Active',
                time: '6 hours ago'
            }
        ];

        container.innerHTML = '';

        mockBookings.forEach(booking => {
            const bookingItem = document.createElement('div');
            bookingItem.className = 'list-group-item list-group-item-action border-0 bg-transparent';
            
            const statusClass = booking.status === 'Active' ? 'bg-success' : 'bg-primary';
            
            bookingItem.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1 text-white">Booking ${booking.id}</h6>
                    <span class="badge ${statusClass}">${booking.status}</span>
                </div>
                <p class="mb-1 text-muted">${booking.customer} • ${booking.bike}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-primary fw-bold">${booking.amount} • ${booking.duration}</small>
                    <small class="text-muted">${booking.time}</small>
                </div>
            `;

            container.appendChild(bookingItem);
        });
    }

    setupEventListeners() {
        // Add any business dashboard-specific event listeners here
    }

    updateMetrics() {
        // Update business metrics
        const metrics = {
            totalFleet: 45,
            activeBookings: 28,
            monthlyRevenue: '₹2,45,000',
            activeCustomers: 156
        };

        document.getElementById('totalFleet').textContent = metrics.totalFleet;
        document.getElementById('activeBookings').textContent = metrics.activeBookings;
        document.getElementById('monthlyRevenue').textContent = metrics.monthlyRevenue;
        document.getElementById('activeCustomers').textContent = metrics.activeCustomers;
    }
}

// Global functions
function logout() {
    if (window.authManager) {
        window.authManager.logout();
    }
}

// Initialize business dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.rentalBusinessDashboardManager = new RentalBusinessDashboardManager();
});
