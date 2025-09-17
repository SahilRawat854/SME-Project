// Delivery Dashboard functionality
class DeliveryDashboardManager {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupCharts();
        this.loadRecentOrders();
        this.setupEventListeners();
    }

    loadUserData() {
        // Get user from auth manager
        if (window.authManager) {
            this.user = window.authManager.getCurrentUser();
        }

        // Check if user is delivery partner
        if (!this.user || this.user.role !== 'DELIVERY') {
            window.location.href = 'login.html';
            return;
        }

        // Update UI with delivery partner data
        document.getElementById('deliveryName').textContent = this.user.name || 'Delivery Partner';
        document.getElementById('welcomeName').textContent = this.user.name || 'Delivery Partner';
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
                    data: [1800, 2200, 1950, 2800, 2400, 3200, 2450],
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

    loadRecentOrders() {
        const container = document.getElementById('recentOrders');
        if (!container) return;

        const mockOrders = [
            {
                id: 'ORD001',
                customer: 'Rajesh Kumar',
                pickup: 'Andheri West',
                delivery: 'Bandra East',
                amount: '₹150',
                status: 'Completed',
                time: '2 hours ago'
            },
            {
                id: 'ORD002',
                customer: 'Priya Sharma',
                pickup: 'Powai',
                delivery: 'Goregaon',
                amount: '₹200',
                status: 'In Progress',
                time: '30 mins ago'
            },
            {
                id: 'ORD003',
                customer: 'Amit Singh',
                pickup: 'Malad',
                delivery: 'Borivali',
                amount: '₹180',
                status: 'Completed',
                time: '4 hours ago'
            }
        ];

        container.innerHTML = '';

        mockOrders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.className = 'list-group-item list-group-item-action border-0 bg-transparent';
            
            const statusClass = order.status === 'Completed' ? 'bg-success' : 'bg-warning';
            
            orderItem.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1 text-white">Order ${order.id}</h6>
                    <span class="badge ${statusClass}">${order.status}</span>
                </div>
                <p class="mb-1 text-muted">${order.customer} • ${order.pickup} → ${order.delivery}</p>
                <div class="d-flex justify-content-between align-items-center">
                    <small class="text-primary fw-bold">${order.amount}</small>
                    <small class="text-muted">${order.time}</small>
                </div>
            `;

            container.appendChild(orderItem);
        });
    }

    setupEventListeners() {
        // Add any delivery dashboard-specific event listeners here
    }

    updateMetrics() {
        // Update delivery metrics
        const metrics = {
            completedDeliveries: 127,
            activeOrders: 5,
            todayEarnings: '₹2,450',
            rating: '4.8'
        };

        document.getElementById('completedDeliveries').textContent = metrics.completedDeliveries;
        document.getElementById('activeOrders').textContent = metrics.activeOrders;
        document.getElementById('todayEarnings').textContent = metrics.todayEarnings;
        document.getElementById('rating').textContent = metrics.rating;
    }
}

// Global functions
function logout() {
    if (window.authManager) {
        window.authManager.logout();
    }
}

function goOnline() {
    const statusElement = document.getElementById('deliveryStatus');
    if (statusElement.textContent === 'Online') {
        statusElement.textContent = 'Offline';
        statusElement.className = 'badge bg-danger';
    } else {
        statusElement.textContent = 'Online';
        statusElement.className = 'badge bg-success';
    }
}

// Initialize delivery dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.deliveryDashboardManager = new DeliveryDashboardManager();
});
