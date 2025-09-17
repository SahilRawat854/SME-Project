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
    }

    async loadBikes() {
        const bikesGrid = document.getElementById('bikesGrid');
        const loadingSpinner = document.getElementById('loadingSpinner');
        const noResults = document.getElementById('noResults');

        try {
            if (loadingSpinner) loadingSpinner.style.display = 'block';
            if (bikesGrid) bikesGrid.innerHTML = '';
            if (noResults) noResults.style.display = 'none';

            if (window.app && window.app.isConnected) {
                // Try to load from API
                const response = await fetch(`${window.app.apiBaseUrl}/bikes`);
                if (response.ok) {
                    this.allBikes = await response.json();
                    console.log('✅ Loaded bikes from API:', this.allBikes.length);
                } else {
                    console.log('❌ API error, using mock data');
                    this.allBikes = this.getMockBikes();
                }
            } else {
                console.log('❌ Backend not connected, using mock data');
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

        const statusClass = bike.status === 'AVAILABLE' ? 'bg-success' : 'bg-warning';
        const typeDisplay = this.getTypeDisplayName(bike.type);

        col.innerHTML = `
            <div class="card bike-card h-100" data-bike-id="${bike.id}">
                <img src="${bike.imageUrl || 'images/Bike_1.jpg'}" 
                     class="card-img-top" alt="${bike.brand} ${bike.model}" style="height: 250px; object-fit: cover;">
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title">${bike.brand} ${bike.model}</h5>
                        <span class="badge ${statusClass} status-badge">${bike.status === 'AVAILABLE' ? 'Available' : bike.status}</span>
                    </div>
                    <p class="text-muted small mb-2">
                        <i class="fas fa-tag"></i> ${typeDisplay} | <i class="fas fa-map-marker-alt"></i> ${bike.city}
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
                        <button class="btn btn-primary" onclick="bikesManager.viewBikeDetails(${bike.id})">
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
                                <button class="btn btn-outline-success w-100" onclick="bikesManager.addToCart(${bike.id})">
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

    shouldShowRentButtons() {
        // Check if user is authenticated and has CUSTOMER role
        if (window.authManager && window.authManager.isAuthenticated()) {
            const userRole = window.authManager.getUserRole();
            return userRole === 'CUSTOMER';
        }
        return false;
    }

    setupAuthListener() {
        // Listen for authentication changes and refresh bike cards
        window.addEventListener('authStateChanged', () => {
            this.renderBikes();
        });
        
        // Also listen for storage changes (login/logout from other tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === 'spinGoUser' || e.key === 'user') {
                this.renderBikes();
            }
        });
    }

    filterBikes() {
        const cityFilter = document.getElementById('cityFilter').value;

        this.filteredBikes = this.allBikes.filter(bike => {
            const matchesCity = !cityFilter || bike.city === cityFilter;
            return matchesCity;
        });

        this.renderBikes();
    }

    viewBikeDetails(bikeId) {
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
        // Check if user is authenticated
        if (!window.authManager || !window.authManager.isAuthenticated()) {
            this.showAlert('Please login to add items to cart', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }

        // Find the bike in the current list
        const bike = this.allBikes.find(b => b.id === bikeId);
        if (!bike) {
            this.showAlert('Bike not found', 'danger');
            return;
        }

        // Create cart item
        const cartItem = {
            id: bike.id,
            name: `${bike.year} ${bike.brand} ${bike.model}`,
            image: bike.imageUrl || 'images/Bike_1.jpg',
            price: bike.pricePerHour,
            duration: 4, // Default 4 hours
            quantity: 1,
            totalPrice: bike.pricePerHour * 4,
            features: [bike.type, 'Premium', 'Well Maintained']
        };

        // Get existing cart items
        let cartItems = [];
        const savedCart = localStorage.getItem('spinGoCart');
        if (savedCart) {
            cartItems = JSON.parse(savedCart);
        }

        // Check if bike already exists in cart
        const existingItem = cartItems.find(item => item.id === bikeId);
        if (existingItem) {
            existingItem.quantity += 1;
            existingItem.totalPrice = existingItem.price * existingItem.duration * existingItem.quantity;
        } else {
            cartItems.push(cartItem);
        }

        // Save to localStorage
        localStorage.setItem('spinGoCart', JSON.stringify(cartItems));

        // Show success message
        this.showAlert(`${bike.brand} ${bike.model} added to cart!`, 'success');

        // Update cart count in navigation (if exists)
        this.updateCartCount(cartItems.length);
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

// Initialize bikes manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.bikesManager = new BikesManager();
});
