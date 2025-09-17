// Admin Dashboard functionality
class AdminDashboardManager {
    constructor() {
        this.user = null;
        this.init();
    }

    init() {
        this.loadUserData();
        this.setupCharts();
        this.loadRecentActivity();
        this.setupEventListeners();
    }

    loadUserData() {
        // Get user from auth manager
        if (window.authManager) {
            this.user = window.authManager.getCurrentUser();
        }

        // Check if user is admin
        if (!this.user || this.user.role !== 'ADMIN') {
            window.location.href = 'login.html';
            return;
        }

        // Update UI with admin data
        document.getElementById('adminName').textContent = this.user.name || 'Admin';
    }

    setupCharts() {
        this.setupRevenueChart();
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
                    data: [12000, 19000, 15000, 25000, 22000, 30000],
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

    loadRecentActivity() {
        this.loadRecentBookings();
        this.loadNewUsers();
    }

    loadRecentBookings() {
        const container = document.getElementById('recentBookings');
        if (!container) return;

        const mockBookings = [
            {
                id: 1,
                user: 'John Smith',
                bike: 'Honda CBR600RR',
                startTime: '2024-01-15 10:30',
                duration: '4 hours',
                amount: '₹6,600',
                status: 'Active'
            },
            {
                id: 2,
                user: 'Sarah Johnson',
                bike: 'Yamaha MT-07',
                startTime: '2024-01-15 09:15',
                duration: '2 hours',
                amount: '₹2,640',
                status: 'Completed'
            },
            {
                id: 3,
                user: 'Mike Davis',
                bike: 'Kawasaki Ninja 650',
                startTime: '2024-01-15 08:00',
                duration: '6 hours',
                amount: '₹8,712',
                status: 'Active'
            }
        ];

        container.innerHTML = '';

        mockBookings.forEach(booking => {
            const bookingItem = document.createElement('div');
            bookingItem.className = 'list-group-item list-group-item-action border-0 bg-transparent';
            
            const statusClass = booking.status === 'Active' ? 'bg-success' : 'bg-primary';
            
            bookingItem.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1 text-white">${booking.user}</h6>
                    <span class="badge ${statusClass}">${booking.status}</span>
                </div>
                <p class="mb-1 text-muted">${booking.bike} • ${booking.startTime}</p>
                <small class="text-primary fw-bold">${booking.amount} • ${booking.duration}</small>
            `;

            container.appendChild(bookingItem);
        });
    }

    loadNewUsers() {
        const container = document.getElementById('newUsers');
        if (!container) return;

        const mockUsers = [
            {
                id: 1,
                name: 'Alex Wilson',
                email: 'alex.wilson@email.com',
                joinDate: '2024-01-15',
                status: 'Verified'
            },
            {
                id: 2,
                name: 'Emma Brown',
                email: 'emma.brown@email.com',
                joinDate: '2024-01-14',
                status: 'Pending'
            },
            {
                id: 3,
                name: 'David Lee',
                email: 'david.lee@email.com',
                joinDate: '2024-01-14',
                status: 'Verified'
            }
        ];

        container.innerHTML = '';

        mockUsers.forEach(user => {
            const userItem = document.createElement('div');
            userItem.className = 'list-group-item list-group-item-action border-0 bg-transparent';
            
            const statusClass = user.status === 'Verified' ? 'bg-success' : 'bg-warning';
            
            userItem.innerHTML = `
                <div class="d-flex w-100 justify-content-between">
                    <h6 class="mb-1 text-white">${user.name}</h6>
                    <span class="badge ${statusClass}">${user.status}</span>
                </div>
                <p class="mb-1 text-muted">${user.email}</p>
                <small class="text-muted">Joined: ${user.joinDate}</small>
            `;

            container.appendChild(userItem);
        });
    }

    setupEventListeners() {
        // Add any admin dashboard-specific event listeners here
    }

    updateMetrics() {
        // Update admin metrics
        const metrics = {
            totalBikes: 156,
            activeUsers: 2847,
            activeBookings: 89,
            revenue: '₹29,85,180'
        };

        document.getElementById('totalBikes').textContent = metrics.totalBikes;
        document.getElementById('activeUsers').textContent = metrics.activeUsers;
        document.getElementById('activeBookings').textContent = metrics.activeBookings;
        document.getElementById('revenue').textContent = metrics.revenue;
    }
}

// Global logout function
function logout() {
    if (window.authManager) {
        window.authManager.logout();
    }
}

// Initialize admin dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.adminDashboardManager = new AdminDashboardManager();
});
