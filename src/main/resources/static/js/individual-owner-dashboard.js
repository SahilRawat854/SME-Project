// Individual Owner Dashboard functionality
class IndividualOwnerDashboardManager {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupCharts();
        this.loadBikeStatus();
        this.loadRecentBookings();
        this.setupEventListeners();
    }

    loadUserData() {
        // Get user from auth manager
        if (window.authManager) {
            this.user = window.authManager.getCurrentUser();
        }

        // Check if user is individual owner
        if (!this.user || this.user.role !== 'INDIVIDUAL_OWNER') {
            window.location.href = 'login.html';
            return;
        }

        // Update UI with owner data
        document.getElementById('ownerName').textContent = this.user.name || 'Bike Owner';
        document.getElementById('welcomeName').textContent = this.user.name || 'Bike Owner';
    }

    setupCharts() {
        this.setupEarningsChart();
    }

    setupEarningsChart() {
        const ctx = document.getElementById('earningsChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Daily Earnings (₹)',
                    data: [1200, 1800, 1500, 2200, 1900, 2800, 1850],
                    borderColor: '#6366f1',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
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
                                return '₹' + value.toLocaleString();
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

    loadBikeStatus() {
        const container = document.getElementById('bikeStatus');
        if (!container) return;

        const mockBikes = [
            {
                name: 'Honda CBR600RR',
                status: 'Rented',
                earnings: '₹2,400',
                nextAvailable: '2 hours'
            },
            {
                name: 'Yamaha MT-07',
                status: 'Available',
                earnings: '₹1,800',
                nextAvailable: 'Now'
            },
            {
                name: 'Kawasaki Ninja 650',
                status: 'Rented',
                earnings: '₹2,100',
                nextAvailable: '4 hours'
            }
        ];

        container.innerHTML = '';

        mockBikes.forEach(bike => {
            const bikeItem = document.createElement('div');
            bikeItem.className = 'list-group-item list-group-item-action border-0 bg-transparent';
            
            const statusClass = bike.status === 'Available' ? 'bg-success' : 'bg-warning';
            
            bikeItem.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1 text-white">${bike.name}</h6>
                    <span class="badge ${statusClass}">${bike.status}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-primary fw-bold">${bike.earnings} earned</small>
                    <small class="text-muted">Next: ${bike.nextAvailable}</small>
                </div>
            `;

            container.appendChild(bikeItem);
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
        // Add any owner dashboard-specific event listeners here
    }

    updateMetrics() {
        // Update owner metrics
        const metrics = {
            myBikes: 3,
            activeRentals: 2,
            monthlyEarnings: '₹18,500',
            averageRating: '4.6'
        };

        document.getElementById('myBikes').textContent = metrics.myBikes;
        document.getElementById('activeRentals').textContent = metrics.activeRentals;
        document.getElementById('monthlyEarnings').textContent = metrics.monthlyEarnings;
        document.getElementById('averageRating').textContent = metrics.averageRating;
    }
}

// Global functions
function logout() {
    if (window.authManager) {
        window.authManager.logout();
    }
}

// Initialize owner dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.individualOwnerDashboardManager = new IndividualOwnerDashboardManager();
});