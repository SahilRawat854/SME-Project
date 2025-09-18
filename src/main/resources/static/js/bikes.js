// Bikes page functionality
class BikesManager {
    constructor() {
        this.allBikes = [];
        this.filteredBikes = [];
        this.currentMode = 'filter'; // 'browse' or 'filter'
        this.init();
    }

    init() {
        this.loadBikes();
        this.setupEventListeners();
        this.setupAuthListener();
        this.updateNavbarVisibility();
    }

    async loadBikes() {
        const bikesGrid = document.getElementById('bikesGrid');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const noResults = document.getElementById('noResults');

        try {
            if (loadingSpinner) loadingSpinner.style.display = 'block';
            if (bikesGrid) bikesGrid.innerHTML = '';
            if (noResults) noResults.style.display = 'none';

            console.log('🔍 Checking API connection...');
            console.log('window.app:', window.app);
            console.log('window.app.isConnected:', window.app ? window.app.isConnected : 'app not found');

            // Always try to fetch from API first, regardless of connection status
            console.log('🌐 Attempting to fetch bikes from API...');
            try {
                const apiUrl = window.app ? window.app.apiBaseUrl : 'http://localhost:8080/api';
                const response = await fetch(`${apiUrl}/bikes`);
                console.log('📡 API Response status:', response.status);
                
                if (response.ok) {
                    const apiBikes = await response.json();
                    console.log('📊 Raw API bikes:', apiBikes);
                    
                    // Transform API bikes to match our frontend format
                    this.allBikes = apiBikes.map(bike => ({
                        id: bike.id,
                        brand: bike.brand,
                        model: bike.model,
                        year: bike.year,
                        type: bike.type,
                        city: bike.city,
                        pricePerHour: bike.pricePerHour,
                        pricePerDay: bike.pricePerDay,
                        pricePerMonth: bike.pricePerMonth,
                        description: bike.description,
                        status: bike.status,
                        imageUrl: bike.imageUrl || 'images/Bike_1.jpg',
                        owner: bike.owner ? {
                            id: bike.owner.id,
                            name: bike.owner.name
                        } : null
                    }));
                    console.log('✅ Loaded bikes from API:', this.allBikes.length);
                    console.log('🚲 Transformed bikes:', this.allBikes);
                } else {
                    console.log('❌ API error, using mock data');
                    this.allBikes = this.getMockBikes();
                }
            } catch (error) {
                console.log('❌ API fetch failed:', error.message);
                console.log('❌ Using mock data as fallback');
                this.allBikes = this.getMockBikes();
            }

            this.filteredBikes = [...this.allBikes];
            this.renderBikes();

        } catch (error) {
            console.log('❌ Failed to load bikes from API, using mock data:', error.message);
            this.allBikes = this.getMockBikes();
            this.filteredBikes = [...this.allBikes];
            this.renderBikes();
        } finally {
            if (loadingSpinner) loadingSpinner.style.display = 'none';
        }
    }

    getMockBikes() {
        return [
            {
                id: 1,
                brand: 'Honda',
                model: 'CBR600RR',
                year: 2023,
                type: 'SPORT',
                city: 'Mumbai',
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
                year: 2025,
                type: 'SPORT',
                city: 'Delhi',
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
                year: 2024,
                type: 'SPORT',
                city: 'Mumbai',
                pricePerHour: 550,
                pricePerDay: 3300,
                pricePerMonth: 66000,
                description: 'Legendary Ninja series for adrenaline seekers',
                status: 'AVAILABLE',
                imageUrl: 'images/kawasaki-ninja.jpg'
            },
            {
                id: 4,
                brand: 'Honda',
                model: 'Shadow',
                year: 2021,
                type: 'CRUISER',
                city: 'Chennai',
                pricePerHour: 400,
                pricePerDay: 2400,
                pricePerMonth: 48000,
                description: 'Classic cruiser for comfortable long rides',
                status: 'AVAILABLE',
                imageUrl: 'images/honda-shadow.jpg'
            },
            // {
            //     id: 5,
            //     brand: 'Suzuki',
            //     model: 'GSX-R750',
            //     year: 2023,
            //     type: 'SPORT',
            //     city: 'Mumbai',
            //     pricePerHour: 30,
            //     pricePerDay: 180,
            //     pricePerMonth: 3500,
            //     description: 'Track-ready sport bike with advanced technology',
            //     status: 'Available',
            //     imageUrl: 'images/gsx-750.avif'
            // },
            // {
            //     id: 6,
            //     brand: 'Yamaha',
            //     model: 'FJR1300',
            //     year: 2023,
            //     type: 'TOURING',
            //     city: 'Kolkata',
            //     pricePerHour: 30,
            //     pricePerDay: 180,
            //     pricePerMonth: 3500,
            //     description: 'Premium touring bike for long-distance comfort',
            //     status:'Available',
            //     imageUrl: 'images/fjr-1300.jpg'
            // },
            {
                id: 7,
                make: 'Ducati',
                model: 'Monster 821',
                year: 2023,
                type: 'SPORT',
                city: 'Hyderabad',
                basePriceHourly: 3320,
                basePriceDaily: 19920,
                basePriceMonthly: 398400,
                description: 'Italian masterpiece with exceptional performance',
                status: { displayName: 'Available' },
                imageUrl: 'images/Bike_1.jpg'
            },
            {
                id: 8,
                make: 'BMW',
                model: 'G 310 R',
                year: 2023,
                type: 'STANDARD',
                city: 'Pune',
                basePriceHourly: 1490,
                basePriceDaily: 8940,
                basePriceMonthly: 178800,
                description: 'German engineering meets urban mobility',
                status: { displayName: 'Available' },
                imageUrl: 'images/Bike_1.jpg'
            },
            {
                id: 9,
                make: 'KTM',
                model: 'Duke 390',
                year: 2023,
                type: 'STANDARD',
                city: 'Ahmedabad',
                basePriceHourly: 1660,
                basePriceDaily: 9960,
                basePriceMonthly: 199200,
                description: 'Ready to Race - Austrian precision and power',
                status: { displayName: 'Available' },
                imageUrl: 'images/Bike_1.jpg'
            },
            {
                id: 10,
                make: 'Royal Enfield',
                model: 'Classic 350',
                year: 2023,
                type: 'CRUISER',
                city: 'Delhi',
                basePriceHourly: 830,
                basePriceDaily: 4980,
                basePriceMonthly: 99600,
                description: 'Timeless classic with modern reliability',
                status: { displayName: 'Available' },
                imageUrl: 'images/Bike_1.jpg'
            },
            {
                id: 11,
                make: 'Harley-Davidson',
                model: 'Street 750',
                year: 2023,
                type: 'CRUISER',
                city: 'Bangalore',
                basePriceHourly: 2490,
                basePriceDaily: 14940,
                basePriceMonthly: 298800,
                description: 'Classic cruiser with iconic Harley-Davidson styling',
                status: { displayName: 'Available' },
                imageUrl: 'images/Bike_1.jpg'
            },
            {
                id: 12,
                make: 'Aprilia',
                model: 'RS 660',
                year: 2023,
                type: 'SPORT',
                city: 'Mumbai',
                basePriceHourly: 2900,
                basePriceDaily: 17400,
                basePriceMonthly: 348000,
                description: 'Italian racing heritage meets modern technology',
                status: { displayName: 'Available' },
                imageUrl: 'images/Bike_1.jpg'
            }
        ];
    }

    renderBikes() {
        const bikesGrid = document.getElementById('bikesGrid');
        const noResults = document.getElementById('noResults');

        if (this.filteredBikes.length === 0) {
            bikesGrid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        bikesGrid.innerHTML = '';

        this.filteredBikes.forEach(bike => {
            const bikeCard = this.createBikeCard(bike);
            bikesGrid.appendChild(bikeCard);
        });
    }

    createBikeCard(bike) {
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-6 mb-4';

        const statusClass = this.getStatusClass(bike.status);
        const statusDisplay = this.getStatusDisplay(bike.status);
        const typeDisplay = this.getTypeDisplayName(bike.type);

        col.innerHTML = `
            <div class="card bike-card h-100" data-bike-id="${bike.id}">
                <img src="${bike.imageUrl || 'images/Bike_1.jpg'}" 
                     class="card-img-top" alt="${bike.brand} ${bike.model}" style="height: 250px; object-fit: cover;">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title">${bike.brand} ${bike.model}</h5>
                        <span class="badge ${statusClass} status-badge">${statusDisplay}</span>
                    </div>
                    <p class="text-muted small mb-2">
                        <i class="fas fa-tag"></i> ${typeDisplay} | <i class="fas fa-map-marker-alt"></i> ${bike.city}
                        ${bike.owner ? ` | <i class="fas fa-user"></i> ${bike.owner.name}` : ''}
                    </p>
                    <p class="card-text text-muted">${bike.description}</p>
                    <div class="row text-center mb-3">
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
                    <div class="text-center mt-3" id="totalPrice-${bike.id}" style="display: none;">
                        <small class="text-muted">Total for selected duration</small>
                        <div class="fw-bold text-success total-price">₹0</div>
                    </div>
                </div>
                <div class="card-footer bg-white border-0">
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary" onclick="if(window.bikesManager) { window.bikesManager.viewBikeDetails(${bike.id}); } else { console.error('bikesManager not available'); }">
                            <i class="fas fa-eye"></i> View Details
                        </button>
                        ${this.shouldShowRentButtons() ? `
                        <div class="row g-2">
                            <div class="col-6">
                                <button class="btn btn-outline-primary w-100" onclick="bikesManager.rentBike(${bike.id})">
                                    <i class="fas fa-calendar-plus"></i> Rent Now
                                </button>
                            </div>
                            <div class="col-6">
                                <button class="btn btn-outline-success w-100" onclick="if(window.bikesManager) { window.bikesManager.addToCart(${bike.id}); } else { console.error('bikesManager not available'); }">
                                    <i class="fas fa-cart-plus"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                        ` : `
                        <div class="text-center">
                            <small class="text-muted">
                                <i class="fas fa-lock me-1"></i>
                                Login as customer to rent or add to cart
                            </small>
                        </div>
                        `}
                    </div>
                </div>
            </div>
        `;

        return col;
    }

    getTypeDisplayName(type) {
        const typeMap = {
            'SPORT': 'Sport',
            'CRUISER': 'Cruiser',
            'TOURING': 'Touring',
            'STANDARD': 'Standard'
        };
        return typeMap[type] || type;
    }

    getStatusClass(status) {
        const statusMap = {
            'AVAILABLE': 'bg-success',
            'BOOKED': 'bg-warning',
            'RENTED': 'bg-danger',
            'MAINTENANCE': 'bg-secondary',
            'UNAVAILABLE': 'bg-dark'
        };
        return statusMap[status] || 'bg-warning';
    }

    getStatusDisplay(status) {
        const statusMap = {
            'AVAILABLE': 'Available',
            'BOOKED': 'Booked',
            'RENTED': 'Rented',
            'MAINTENANCE': 'Maintenance',
            'UNAVAILABLE': 'Unavailable'
        };
        return statusMap[status] || status;
    }

    shouldShowRentButtons() {
        // Check if user is authenticated and has CUSTOMER role
        console.log('🔍 Checking if should show rent buttons...');
        console.log('🔍 Auth manager available:', !!window.authManager);
        
        if (window.authManager && window.authManager.isAuthenticated()) {
            const userRole = window.authManager.getUserRole();
            console.log('👤 User role:', userRole);
            const shouldShow = userRole === 'CUSTOMER';
            console.log('✅ Should show rent buttons:', shouldShow);
            return shouldShow;
        }
        console.log('❌ User not authenticated, not showing rent buttons');
        return false;
    }

    setupAuthListener() {
        // Listen for authentication changes and refresh bike cards
        window.addEventListener('authStateChanged', () => {
            this.renderBikes();
            this.updateNavbarVisibility();
        });
        
        // Also listen for storage changes (login/logout from other tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === 'spinGoUser' || e.key === 'user') {
                this.renderBikes();
                this.updateNavbarVisibility();
            }
        });
    }

    updateNavbarVisibility() {
        const loginNavItem = document.getElementById('loginNavItem');
        const signupNavItem = document.getElementById('signupNavItem');
        const userDropdown = document.getElementById('userDropdown');
        const userName = document.getElementById('userName');
        const dashboardLink = document.getElementById('dashboardLink');

        if (window.authManager && window.authManager.isAuthenticated()) {
            // User is logged in
            if (loginNavItem) loginNavItem.style.display = 'none';
            if (signupNavItem) signupNavItem.style.display = 'none';
            if (userDropdown) userDropdown.style.display = 'block';
            
            const user = window.authManager.getCurrentUser();
            if (userName && user) {
                userName.textContent = user.name || user.email || 'User';
            }
            
            // Update dashboard link based on user role
            if (dashboardLink && user) {
                const role = user.role;
                switch (role) {
                    case 'CUSTOMER':
                        dashboardLink.href = 'dashboard.html';
                        dashboardLink.textContent = 'Dashboard';
                        break;
                    case 'INDIVIDUAL_OWNER':
                        dashboardLink.href = 'individual-owner-dashboard.html';
                        dashboardLink.textContent = 'Owner Dashboard';
                        break;
                    case 'RENTAL_BUSINESS':
                        dashboardLink.href = 'rental-business-dashboard.html';
                        dashboardLink.textContent = 'Business Dashboard';
                        break;
                    case 'ADMIN':
                        dashboardLink.href = 'admin-dashboard.html';
                        dashboardLink.textContent = 'Admin Dashboard';
                        break;
                    case 'DELIVERY_PERSON':
                        dashboardLink.href = 'delivery-dashboard.html';
                        dashboardLink.textContent = 'Delivery Dashboard';
                        break;
                    default:
                        dashboardLink.href = 'dashboard.html';
                        dashboardLink.textContent = 'Dashboard';
                }
            }
        } else {
            // User is not logged in
            if (loginNavItem) loginNavItem.style.display = 'block';
            if (signupNavItem) signupNavItem.style.display = 'block';
            if (userDropdown) userDropdown.style.display = 'none';
        }
    }

    filterBikes() {
        const cityFilter = document.getElementById('cityFilter').value;
        const ownerFilter = document.getElementById('ownerFilter').value;

        this.filteredBikes = this.allBikes.filter(bike => {
            const matchesCity = !cityFilter || bike.city === cityFilter;
            
            let matchesOwner = true;
            if (ownerFilter) {
                if (ownerFilter === 'individual') {
                    matchesOwner = bike.owner && bike.owner.name; // Has an individual owner
                } else if (ownerFilter === 'business') {
                    matchesOwner = bike.owner && bike.owner.name; // Has a business owner (same as individual for now)
                } else if (ownerFilter === 'platform') {
                    matchesOwner = !bike.owner; // No owner means platform bike
                }
            }
            
            return matchesCity && matchesOwner;
        });

        this.renderBikes();
    }

    viewBikeDetails(bikeId) {
        console.log('🔍 View Details clicked for bike ID:', bikeId);
        console.log('🌐 Navigating to:', `bike-details.html?id=${bikeId}`);
        
        // Always navigate to bike details page, even if backend is not connected
        // The bike details page will handle loading mock data if needed
        window.location.href = `bike-details.html?id=${bikeId}`;
    }

    rentBike(bikeId) {
        if (window.authManager && window.authManager.isAuthenticated()) {
            // Get booking details from the form
            const pickupDate = document.getElementById('pickupDate').value;
            const pickTime = document.getElementById('pickTime').value;
            const dropOffDate = document.getElementById('dropOffDate').value;
            const dropTime = document.getElementById('dropTime').value;
            
            if (!pickupDate || !pickTime || !dropOffDate || !dropTime) {
                this.showAlert('Please select pickup date, pick time, drop off date, and drop time', 'warning');
                return;
            }
            
            // Calculate duration
            const pickupDateTime = new Date(`${pickupDate}T${pickTime}`);
            const dropDateTime = new Date(`${dropOffDate}T${dropTime}`);
            const hours = Math.ceil((dropDateTime - pickupDateTime) / (1000 * 60 * 60));
            
            // Store booking details in session storage
            const bookingDetails = {
                bikeId: bikeId,
                pickupDate: pickupDate,
                pickTime: pickTime,
                dropOffDate: dropOffDate,
                dropTime: dropTime,
                duration: hours
            };
            sessionStorage.setItem('bookingDetails', JSON.stringify(bookingDetails));
            
            window.location.href = `booking.html?id=${bikeId}`;
        } else {
            this.showAlert('Please login to rent a bike.', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }

    addToCart(bikeId) {
        console.log('🛒 Add to cart clicked for bike ID:', bikeId);
        console.log('🔍 Auth manager available:', !!window.authManager);
        console.log('🔍 Cart manager available:', !!window.cartManager);
        console.log('🔍 User authenticated:', window.authManager ? window.authManager.isAuthenticated() : 'No auth manager');
        
        if (window.authManager && window.authManager.isAuthenticated()) {
            const userRole = window.authManager.getUserRole();
            console.log('👤 User role:', userRole);
            
            if (userRole === 'CUSTOMER') {
                // Get bike data
                const bike = this.allBikes.find(b => b.id === bikeId);
                console.log('🚲 Bike found:', bike);
                
                if (bike) {
                    // Show duration selection modal
                    console.log('📱 Showing duration selection modal...');
                    this.showDurationSelectionModal(bike);
                } else {
                    console.error('❌ Bike not found in allBikes array');
                    this.showAlert('Bike not found', 'error');
                }
            } else {
                console.log('❌ User is not a customer, role:', userRole);
                this.showAlert('Only customers can add items to cart', 'warning');
            }
        } else {
            console.log('❌ User not authenticated');
            this.showAlert('Please login to add items to cart', 'warning');
        }
    }

    showDurationSelectionModal(bike) {
        console.log('📱 Creating duration selection modal for bike:', bike);
        
        // Create modal HTML
        const modalHTML = `
            <div class="modal fade" id="durationModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Select Rental Duration</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center mb-4">
                                <img src="${bike.imageUrl || 'images/Bike_1.jpg'}" alt="${bike.brand} ${bike.model}" 
                                     style="width: 200px; height: 150px; object-fit: cover; border-radius: 10px;">
                                <h5 class="mt-3">${bike.brand} ${bike.model}</h5>
                                <p class="text-muted">${bike.year} • ${bike.type} • ${bike.city}</p>
                            </div>
                            
                            <div class="row g-3">
                                <div class="col-4">
                                    <div class="card duration-option" data-duration="hourly">
                                        <div class="card-body text-center">
                                            <i class="fas fa-clock fa-2x text-primary mb-2"></i>
                                            <h6>Hourly</h6>
                                            <p class="text-success fw-bold">₹${bike.pricePerHour.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="card duration-option" data-duration="daily">
                                        <div class="card-body text-center">
                                            <i class="fas fa-calendar-day fa-2x text-primary mb-2"></i>
                                            <h6>Daily</h6>
                                            <p class="text-success fw-bold">₹${bike.pricePerDay.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <div class="card duration-option" data-duration="monthly">
                                        <div class="card-body text-center">
                                            <i class="fas fa-calendar-alt fa-2x text-primary mb-2"></i>
                                            <h6>Monthly</h6>
                                            <p class="text-success fw-bold">₹${bike.pricePerMonth.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="mt-4">
                                <label for="quantity" class="form-label">Quantity:</label>
                                <div class="input-group">
                                    <button class="btn btn-outline-secondary" type="button" onclick="changeQuantity(-1)">-</button>
                                    <input type="number" class="form-control text-center" id="quantity" value="1" min="1" max="10">
                                    <button class="btn btn-outline-secondary" type="button" onclick="changeQuantity(1)">+</button>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button type="button" class="btn btn-primary" id="addToCartBtn" onclick="addSelectedToCart(${bike.id})">
                                <i class="fas fa-cart-plus me-2"></i>Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('durationModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);

        // Add CSS for duration options
        const style = document.createElement('style');
        style.textContent = `
            .duration-option {
                cursor: pointer;
                transition: all 0.3s ease;
                border: 2px solid transparent;
            }
            .duration-option:hover {
                border-color: #007bff;
                transform: translateY(-2px);
            }
            .duration-option.selected {
                border-color: #007bff;
                background-color: rgba(0, 123, 255, 0.1);
            }
        `;
        document.head.appendChild(style);

        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('durationModal'));
        modal.show();

        // Add click handlers for duration options
        document.querySelectorAll('.duration-option').forEach(option => {
            option.addEventListener('click', function() {
                document.querySelectorAll('.duration-option').forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
            });
        });

        // Set default selection
        document.querySelector('.duration-option[data-duration="hourly"]').classList.add('selected');
    }

    updateCartCount(count) {
        // Update cart count in navigation
        const cartLink = document.querySelector('a[href="cart.html"]');
        if (cartLink) {
            const existingBadge = cartLink.querySelector('.badge');
            if (existingBadge) {
                existingBadge.textContent = count;
            } else if (count > 0) {
                cartLink.innerHTML += ` <span class="badge bg-danger">${count}</span>`;
            }
        }
    }

    showAlert(message, type) {
        // Create alert element
        const alertContainer = document.createElement('div');
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show position-fixed" 
                 style="top: 80px; right: 20px; z-index: 9999; min-width: 300px;" role="alert">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        document.body.appendChild(alertContainer);
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
            const alert = bootstrap.Alert.getInstance(alertContainer.firstElementChild);
            if (alert) alert.close();
        }, 3000);
    }

    setupEventListeners() {
        // Auto-filter when dropdowns change
        document.getElementById('cityFilter')?.addEventListener('change', () => this.filterBikes());
        document.getElementById('ownerFilter')?.addEventListener('change', () => this.filterBikes());
        
        // Date and time change listeners
        document.getElementById('pickupDate')?.addEventListener('change', () => this.calculateTimeAndUpdatePricing());
        document.getElementById('pickTime')?.addEventListener('change', () => this.calculateTimeAndUpdatePricing());
        document.getElementById('dropOffDate')?.addEventListener('change', () => this.calculateTimeAndUpdatePricing());
        document.getElementById('dropTime')?.addEventListener('change', () => this.calculateTimeAndUpdatePricing());
        
        // Set minimum date to today
        this.setMinDate();
        
        // Initialize mode
        this.updateModeDisplay();
    }

    toggleMode(mode) {
        this.currentMode = mode;
        this.updateModeDisplay();
        
        if (mode === 'browse') {
            this.loadAllBikes();
        } else {
            this.filterBikes();
        }
    }

    updateModeDisplay() {
        const browseBtn = document.getElementById('browseModeBtn');
        const filterBtn = document.getElementById('filterModeBtn');
        const filterSection = document.getElementById('filterSection');
        
        if (this.currentMode === 'browse') {
            browseBtn.className = 'btn btn-primary';
            filterBtn.className = 'btn btn-outline-primary';
            filterSection.style.display = 'none';
        } else {
            browseBtn.className = 'btn btn-outline-primary';
            filterBtn.className = 'btn btn-primary';
            filterSection.style.display = 'block';
        }
    }

    loadAllBikes() {
        this.filteredBikes = [...this.allBikes];
        this.renderBikes();
    }

    setMinDate() {
        const pickupDateInput = document.getElementById('pickupDate');
        const dropOffDateInput = document.getElementById('dropOffDate');
        
        if (pickupDateInput) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            pickupDateInput.min = tomorrow.toISOString().split('T')[0];
        }
        
        if (dropOffDateInput) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            dropOffDateInput.min = tomorrow.toISOString().split('T')[0];
        }
    }

    calculateTimeAndUpdatePricing() {
        const pickTime = document.getElementById('pickTime').value;
        const dropTime = document.getElementById('dropTime').value;
        const pickupDate = document.getElementById('pickupDate').value;
        const dropOffDate = document.getElementById('dropOffDate').value;
        
        if (!pickTime || !dropTime || !pickupDate || !dropOffDate) {
            this.hideTimeCalculation();
            return;
        }

        // Calculate time difference
        const pickupDateTime = new Date(`${pickupDate}T${pickTime}`);
        const dropDateTime = new Date(`${dropOffDate}T${dropTime}`);
        
        const timeDiffMs = dropDateTime - pickupDateTime;
        const hours = Math.ceil(timeDiffMs / (1000 * 60 * 60));
        
        this.displayTimeCalculation(hours, pickTime, dropTime, pickupDate, dropOffDate);
        this.updateBikePricing(hours);
    }

    displayTimeCalculation(hours, pickTime, dropTime, pickupDate, dropOffDate) {
        const timeCalculation = document.getElementById('timeCalculation');
        const calculatedTime = document.getElementById('calculatedTime');
        const durationBadge = document.getElementById('durationBadge');
        
        if (timeCalculation && calculatedTime && durationBadge) {
            const pickupDateFormatted = new Date(pickupDate).toLocaleDateString();
            const dropOffDateFormatted = new Date(dropOffDate).toLocaleDateString();
            
            if (pickupDate === dropOffDate) {
                calculatedTime.textContent = `From ${pickTime} to ${dropTime} on ${pickupDateFormatted} - Total rental duration`;
            } else {
                calculatedTime.textContent = `From ${pickTime} on ${pickupDateFormatted} to ${dropTime} on ${dropOffDateFormatted} - Total rental duration`;
            }
            durationBadge.textContent = `${hours} hour${hours > 1 ? 's' : ''}`;
            timeCalculation.style.display = 'block';
        }
    }

    hideTimeCalculation() {
        const timeCalculation = document.getElementById('timeCalculation');
        if (timeCalculation) {
            timeCalculation.style.display = 'none';
        }
    }

    updateBikePricing(hours) {
        // Update pricing for all displayed bikes based on calculated hours
        const bikeCards = document.querySelectorAll('.bike-card');
        bikeCards.forEach(card => {
            const bikeId = parseInt(card.dataset.bikeId);
            const bike = this.allBikes.find(b => b.id === bikeId);
            
            if (bike) {
                const totalPrice = bike.pricePerHour * hours;
                const priceElement = card.querySelector('.total-price');
                const totalPriceSection = document.getElementById(`totalPrice-${bikeId}`);
                
                if (priceElement && totalPriceSection) {
                    priceElement.textContent = `₹${totalPrice.toLocaleString()}`;
                    totalPriceSection.style.display = 'block';
                }
            }
        });
    }
}

// Global functions for modal functionality
function changeQuantity(delta) {
    const quantityInput = document.getElementById('quantity');
    if (quantityInput) {
        const currentValue = parseInt(quantityInput.value) || 1;
        const newValue = Math.max(1, Math.min(10, currentValue + delta));
        quantityInput.value = newValue;
    }
}

function logout() {
    if (window.authManager) {
        window.authManager.logout();
        // Redirect to home page
        window.location.href = 'index.html';
    }
}

function addSelectedToCart(bikeId) {
    console.log('🛒 addSelectedToCart called with bikeId:', bikeId);
    
    const selectedDuration = document.querySelector('.duration-option.selected');
    const quantityInput = document.getElementById('quantity');
    
    console.log('🔍 Selected duration element:', selectedDuration);
    console.log('🔍 Quantity input element:', quantityInput);
    
    if (!selectedDuration || !quantityInput) {
        console.error('❌ Missing duration or quantity selection');
        console.error('Selected duration:', selectedDuration);
        console.error('Quantity input:', quantityInput);
        return;
    }
    
    const duration = selectedDuration.getAttribute('data-duration');
    const quantity = parseInt(quantityInput.value) || 1;
    
    console.log('📊 Cart data:', { bikeId, duration, quantity });
    
    // Get bike data
    const bike = window.bikesManager.allBikes.find(b => b.id === bikeId);
    console.log('🚲 Bike data found:', bike);
    
    if (!bike) {
        console.error('❌ Bike not found in bikesManager.allBikes');
        console.log('Available bikes:', window.bikesManager.allBikes);
        return;
    }
    
    // Add to cart using cart manager
    console.log('🛒 Cart manager available:', !!window.cartManager);
    if (window.cartManager) {
        console.log('📝 Calling cartManager.addToCart...');
        const success = window.cartManager.addToCart(bike, duration, quantity);
        console.log('✅ Add to cart result:', success);
        
        if (success) {
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('durationModal'));
            if (modal) {
                console.log('🚪 Closing modal...');
                modal.hide();
            }
        }
    } else {
        console.error('❌ Cart manager not available');
        console.log('Available window objects:', Object.keys(window).filter(key => key.includes('Manager')));
    }
}

// Initialize bikes manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing BikesManager...');
    window.bikesManager = new BikesManager();
    console.log('✅ BikesManager initialized:', window.bikesManager);
});

// Listen for cart manager ready event
window.addEventListener('cartManagerReady', function() {
    console.log('🛒 Cart manager is ready!');
    if (window.bikesManager) {
        console.log('🔄 Re-rendering bikes to ensure cart integration works...');
        window.bikesManager.renderBikes();
    }
});
