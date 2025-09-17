// Owner Bikes Management
class OwnerBikesManager {
    constructor() {
        this.user = null;
        this.bikes = [];
        this.filteredBikes = [];
        this.init();
    }

    init() {
        this.showPageStatus('Initializing...', 'info');
        this.setupEventListeners();
        this.loadUserData();
        this.loadBikes();
        this.hidePageStatus();
    }

    loadUserData() {
        // Get user from auth manager
        if (window.authManager) {
            this.user = window.authManager.getCurrentUser();
        }

        // Debug logging
        console.log('Current user:', this.user);
        console.log('User role:', this.user?.role);
        console.log('Token:', localStorage.getItem('token'));

        // Check if user is individual owner
        if (!this.user || this.user.role !== 'INDIVIDUAL_OWNER') {
            console.log('User not authenticated or not individual owner, redirecting to login');
            this.showPageStatus('Please login as an individual owner to access this page.', 'warning');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return;
        }

        // Update UI with owner data
        document.getElementById('ownerName').textContent = this.user.name || 'Bike Owner';
    }

    setupEventListeners() {
        // Search functionality
        document.getElementById('searchBikes').addEventListener('input', (e) => {
            this.filterBikes();
        });

        // Filter functionality
        document.getElementById('statusFilter').addEventListener('change', (e) => {
            this.filterBikes();
        });

        document.getElementById('typeFilter').addEventListener('change', (e) => {
            this.filterBikes();
        });

        // Add bike form
        const saveBikeBtn = document.getElementById('saveBikeBtn');
        if (saveBikeBtn) {
            saveBikeBtn.addEventListener('click', () => {
                this.addBike();
            });
        } else {
            console.error('Save bike button not found!');
        }

        // Edit bike form
        const updateBikeBtn = document.getElementById('updateBikeBtn');
        if (updateBikeBtn) {
            updateBikeBtn.addEventListener('click', () => {
                this.updateBike();
            });
        }
    }

    async loadBikes() {
        try {
            this.showLoading(true);
            
            // Try to load from API first
            const response = await fetch('http://localhost:8080/api/bikes/owner', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const apiBikes = await response.json();
                // Transform API bikes to match our frontend format
                this.bikes = apiBikes.map(bike => ({
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
                    imageUrl: bike.imageUrl,
                    status: bike.status,
                    totalBookings: 0, // These would come from separate API calls
                    totalEarnings: 0,
                    rating: 5.0,
                    ownerId: bike.owner ? bike.owner.id : this.user.id
                }));
            } else {
                // Fallback to mock data
                this.loadMockBikes();
            }
        } catch (error) {
            console.log('API not available, using mock data:', error.message);
            this.loadMockBikes();
        }

        this.filteredBikes = [...this.bikes];
        this.renderBikes();
        this.updateStats();
        this.showLoading(false);
    }

    loadMockBikes() {
        // Mock bike data for individual owner
        this.bikes = [
            {
                id: 1,
                brand: 'Honda',
                model: 'CBR600RR',
                year: 2023,
                type: 'SPORT',
                pricePerHour: 500,
                pricePerDay: 3000,
                pricePerMonth: 60000,
                description: 'High-performance sports bike perfect for city rides',
                status: 'AVAILABLE',
                imageUrl: 'images/honda-cbr-600rr.jpg',
                totalBookings: 45,
                totalEarnings: 125000,
                rating: 4.8,
                ownerId: this.user?.id || 1
            },
            {
                id: 2,
                brand: 'Yamaha',
                model: 'R1',
                year: 2023,
                type: 'SPORT',
                pricePerHour: 600,
                pricePerDay: 3600,
                pricePerMonth: 72000,
                description: 'Premium sports bike with advanced electronics',
                status: 'BOOKED',
                imageUrl: 'images/yamaha-r1.jpg',
                totalBookings: 32,
                totalEarnings: 98000,
                rating: 4.9,
                ownerId: this.user?.id || 1
            },
            {
                id: 3,
                brand: 'Royal Enfield',
                model: 'Classic 350',
                year: 2023,
                type: 'CRUISER',
                pricePerHour: 250,
                pricePerDay: 1500,
                pricePerMonth: 30000,
                description: 'Classic cruiser with modern reliability',
                status: 'MAINTENANCE',
                imageUrl: 'images/royal-enfield-classic-350.jpg',
                totalBookings: 67,
                totalEarnings: 89000,
                rating: 4.6,
                ownerId: this.user?.id || 1
            }
        ];
    }

    filterBikes() {
        const searchTerm = document.getElementById('searchBikes').value.toLowerCase();
        const statusFilter = document.getElementById('statusFilter').value;
        const typeFilter = document.getElementById('typeFilter').value;

        this.filteredBikes = this.bikes.filter(bike => {
            const matchesSearch = !searchTerm || 
                bike.brand.toLowerCase().includes(searchTerm) ||
                bike.model.toLowerCase().includes(searchTerm);
            
            const matchesStatus = !statusFilter || bike.status === statusFilter;
            const matchesType = !typeFilter || bike.type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });

        this.renderBikes();
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
        bikesGrid.innerHTML = this.filteredBikes.map(bike => this.createBikeCard(bike)).join('');
    }

    createBikeCard(bike) {
        const statusClass = this.getStatusClass(bike.status);
        const statusText = this.getStatusText(bike.status);
        const typeDisplay = bike.type.replace('_', ' ');

        return `
            <div class="col-lg-4 col-md-6">
                <div class="card bike-card h-100">
                    <img src="${bike.imageUrl || 'images/Bike_1.jpg'}" 
                         class="card-img-top" alt="${bike.brand} ${bike.model}" 
                         style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title">${bike.brand} ${bike.model}</h5>
                            <span class="badge ${statusClass} status-badge">${statusText}</span>
                        </div>
                        <p class="text-muted small mb-2">
                            <i class="fas fa-tag"></i> ${typeDisplay} | <i class="fas fa-calendar"></i> ${bike.year}
                        </p>
                        <p class="card-text text-muted small">${bike.description}</p>
                        
                        <div class="row text-center mb-3">
                            <div class="col-4">
                                <small class="text-muted">Hourly</small>
                                <div class="price-display text-primary">₹${bike.pricePerHour}</div>
                            </div>
                            <div class="col-4">
                                <small class="text-muted">Daily</small>
                                <div class="price-display text-primary">₹${bike.pricePerDay}</div>
                            </div>
                            <div class="col-4">
                                <small class="text-muted">Monthly</small>
                                <div class="price-display text-primary">₹${bike.pricePerMonth}</div>
                            </div>
                        </div>

                        <div class="row text-center mb-3">
                            <div class="col-6">
                                <small class="text-muted">Bookings</small>
                                <div class="fw-bold text-info">${bike.totalBookings}</div>
                            </div>
                            <div class="col-6">
                                <small class="text-muted">Earnings</small>
                                <div class="fw-bold text-success">₹${bike.totalEarnings.toLocaleString()}</div>
                            </div>
                        </div>

                        <div class="text-center mb-2">
                            <div class="rating">
                                ${this.generateStars(bike.rating)}
                                <span class="ms-1 small text-muted">(${bike.rating})</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-footer bg-white border-0">
                        <div class="action-buttons text-center">
                            <button class="btn btn-outline-primary btn-sm" onclick="ownerBikesManager.editBike(${bike.id})">
                                <i class="fas fa-edit"></i> Edit
                            </button>
                            <button class="btn btn-outline-info btn-sm" onclick="ownerBikesManager.viewBikeDetails(${bike.id})">
                                <i class="fas fa-eye"></i> View
                            </button>
                            <button class="btn btn-outline-warning btn-sm" onclick="ownerBikesManager.toggleBikeStatus(${bike.id})">
                                <i class="fas fa-toggle-${bike.status === 'AVAILABLE' ? 'on' : 'off'}"></i> 
                                ${bike.status === 'AVAILABLE' ? 'Disable' : 'Enable'}
                            </button>
                            <button class="btn btn-outline-danger btn-sm" onclick="ownerBikesManager.deleteBike(${bike.id})">
                                <i class="fas fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getStatusClass(status) {
        switch (status) {
            case 'AVAILABLE': return 'bg-success';
            case 'BOOKED': return 'bg-warning';
            case 'MAINTENANCE': return 'bg-info';
            case 'INACTIVE': return 'bg-secondary';
            default: return 'bg-secondary';
        }
    }

    getStatusText(status) {
        switch (status) {
            case 'AVAILABLE': return 'Available';
            case 'BOOKED': return 'Booked';
            case 'MAINTENANCE': return 'Maintenance';
            case 'INACTIVE': return 'Inactive';
            default: return 'Unknown';
        }
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star text-warning"></i>';
        }

        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star text-warning"></i>';
        }

        return stars;
    }

    updateStats() {
        const totalBikes = this.bikes.length;
        const activeBikes = this.bikes.filter(bike => bike.status === 'AVAILABLE').length;
        const totalBookings = this.bikes.reduce((sum, bike) => sum + bike.totalBookings, 0);
        const totalEarnings = this.bikes.reduce((sum, bike) => sum + bike.totalEarnings, 0);

        document.getElementById('totalBikes').textContent = totalBikes;
        document.getElementById('activeBikes').textContent = activeBikes;
        document.getElementById('totalBookings').textContent = totalBookings;
        document.getElementById('totalEarnings').textContent = `₹${totalEarnings.toLocaleString()}`;
    }

    showLoading(show) {
        document.getElementById('loadingSpinner').style.display = show ? 'block' : 'none';
    }

    showPageStatus(message, type = 'info') {
        const statusDiv = document.getElementById('pageStatus');
        const messageSpan = document.getElementById('statusMessage');
        if (statusDiv && messageSpan) {
            statusDiv.className = `alert alert-${type}`;
            messageSpan.textContent = message;
            statusDiv.style.display = 'block';
        }
    }

    hidePageStatus() {
        const statusDiv = document.getElementById('pageStatus');
        if (statusDiv) {
            statusDiv.style.display = 'none';
        }
    }

    async addBike() {
        // Check if user is authenticated
        if (!this.user || this.user.role !== 'INDIVIDUAL_OWNER') {
            this.showAlert('Please login as an individual owner to add bikes.', 'warning');
            return;
        }

        // Validate form data
        const brand = document.getElementById('bikeBrand').value.trim();
        const model = document.getElementById('bikeModel').value.trim();
        const year = parseInt(document.getElementById('bikeYear').value);
        const type = document.getElementById('bikeType').value;
        const city = document.getElementById('bikeCity').value.trim();
        const pricePerHour = parseFloat(document.getElementById('pricePerHour').value);
        const pricePerDay = parseFloat(document.getElementById('pricePerDay').value);
        const pricePerMonth = parseFloat(document.getElementById('pricePerMonth').value);

        // Check required fields
        if (!brand || !model || !year || !type || !city || !pricePerHour || !pricePerDay || !pricePerMonth) {
            this.showAlert('Please fill in all required fields.', 'warning');
            return;
        }

        // Validate numeric values
        if (isNaN(year) || year < 2000 || year > 2024) {
            this.showAlert('Please enter a valid year between 2000 and 2024.', 'warning');
            return;
        }

        if (isNaN(pricePerHour) || pricePerHour <= 0) {
            this.showAlert('Please enter a valid price per hour.', 'warning');
            return;
        }

        if (isNaN(pricePerDay) || pricePerDay <= 0) {
            this.showAlert('Please enter a valid price per day.', 'warning');
            return;
        }

        if (isNaN(pricePerMonth) || pricePerMonth <= 0) {
            this.showAlert('Please enter a valid price per month.', 'warning');
            return;
        }

        // Handle image upload
        const imageFile = document.getElementById('bikeImage').files[0];
        let imageUrl = 'images/Bike_1.jpg'; // Default image
        
        if (imageFile) {
            // Validate image file
            if (!imageFile.type.startsWith('image/')) {
                this.showAlert('Please select a valid image file.', 'warning');
                return;
            }
            
            // Check file size (limit to 5MB)
            if (imageFile.size > 5 * 1024 * 1024) {
                this.showAlert('Image file is too large. Please select an image smaller than 5MB.', 'warning');
                return;
            }
            
            // Show loading state for image processing
            const saveBtn = document.getElementById('saveBikeBtn');
            const originalText = saveBtn.innerHTML;
            saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Image...';
            saveBtn.disabled = true;
            
            // Convert uploaded image to data URL
            const reader = new FileReader();
            reader.onload = (e) => {
                imageUrl = e.target.result;
                // Restore button state
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
                // Continue with form submission after image is loaded
                this.submitBikeForm(brand, model, year, type, city, pricePerHour, pricePerDay, pricePerMonth, document.getElementById('bikeDescription').value.trim(), imageUrl);
            };
            reader.onerror = () => {
                // Restore button state
                saveBtn.innerHTML = originalText;
                saveBtn.disabled = false;
                this.showAlert('Error reading image file. Please try again.', 'warning');
            };
            reader.readAsDataURL(imageFile);
            return; // Exit here, form will be submitted after image loads
        }

        // If no image uploaded, submit with default image
        this.submitBikeForm(brand, model, year, type, city, pricePerHour, pricePerDay, pricePerMonth, document.getElementById('bikeDescription').value.trim(), imageUrl);
    }

    async submitBikeForm(brand, model, year, type, city, pricePerHour, pricePerDay, pricePerMonth, description, imageUrl) {
        const formData = {
            brand: brand,
            model: model,
            year: year,
            type: type,
            city: city,
            pricePerHour: pricePerHour,
            pricePerDay: pricePerDay,
            pricePerMonth: pricePerMonth,
            description: description,
            imageUrl: imageUrl
        };

        console.log('Form data:', formData);
        console.log('Token:', localStorage.getItem('token'));
        console.log('User:', this.user);

        // Show loading state
        const saveBtn = document.getElementById('saveBikeBtn');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
        saveBtn.disabled = true;

        try {
            const response = await fetch('http://localhost:8080/api/bikes/owner', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Add the new bike to the list
                    const newBike = {
                        id: result.id,
                        brand: result.brand,
                        model: result.model,
                        year: result.year,
                        type: result.type,
                        city: result.city,
                        pricePerHour: result.pricePerHour,
                        pricePerDay: result.pricePerDay,
                        pricePerMonth: result.pricePerMonth,
                        description: result.description,
                        imageUrl: result.imageUrl,
                        status: result.status,
                        totalBookings: 0,
                        totalEarnings: 0,
                        rating: 5.0,
                        ownerId: this.user.id
                    };
                    
                    this.bikes.push(newBike);
                    this.filteredBikes = [...this.bikes];
                    this.renderBikes();
                    this.updateStats();
                    
                    // Close modal and reset form
                    bootstrap.Modal.getInstance(document.getElementById('addBikeModal')).hide();
                    document.getElementById('addBikeForm').reset();
                    // Clear image preview
                    document.getElementById('imagePreview').style.display = 'none';
                    
                    this.showAlert(result.message, 'success');
                } else {
                    throw new Error(result.message || 'Failed to add bike');
                }
            } else {
                const errorResult = await response.json();
                throw new Error(errorResult.message || 'Failed to add bike');
            }
        } catch (error) {
            console.error('Error adding bike:', error);
            console.log('API not available, using mock data:', error.message);
            // Add to mock data
            const newBike = {
                id: Date.now(),
                ...formData,
                status: 'AVAILABLE',
                totalBookings: 0,
                totalEarnings: 0,
                rating: 5.0,
                ownerId: this.user.id
            };
            
            this.bikes.push(newBike);
            this.filteredBikes = [...this.bikes];
            this.renderBikes();
            this.updateStats();
            
            // Close modal and reset form
            bootstrap.Modal.getInstance(document.getElementById('addBikeModal')).hide();
            document.getElementById('addBikeForm').reset();
            // Clear image preview
            document.getElementById('imagePreview').style.display = 'none';
            
            this.showAlert('Bike added successfully! (Offline mode)', 'success');
        } finally {
            // Restore button state
            saveBtn.innerHTML = originalText;
            saveBtn.disabled = false;
        }
    }

    editBike(bikeId) {
        const bike = this.bikes.find(b => b.id === bikeId);
        if (!bike) return;

        // Populate edit form
        document.getElementById('editBikeId').value = bike.id;
        document.getElementById('editBikeBrand').value = bike.brand;
        document.getElementById('editBikeModel').value = bike.model;
        document.getElementById('editBikeYear').value = bike.year;
        document.getElementById('editBikeType').value = bike.type;
        document.getElementById('editBikeCity').value = bike.city;
        document.getElementById('editPricePerHour').value = bike.pricePerHour;
        document.getElementById('editPricePerDay').value = bike.pricePerDay;
        document.getElementById('editPricePerMonth').value = bike.pricePerMonth;
        document.getElementById('editBikeDescription').value = bike.description;
        document.getElementById('editBikeStatus').value = bike.status;
        
        // Show current image
        const currentImg = document.getElementById('currentImg');
        const currentImagePreview = document.getElementById('currentImagePreview');
        if (bike.imageUrl) {
            currentImg.src = bike.imageUrl;
            currentImagePreview.style.display = 'block';
        } else {
            currentImagePreview.style.display = 'none';
        }
        
        // Clear new image preview
        document.getElementById('editImagePreview').style.display = 'none';
        document.getElementById('editBikeImage').value = '';

        // Show edit modal
        new bootstrap.Modal(document.getElementById('editBikeModal')).show();
    }

    async updateBike() {
        const bikeId = parseInt(document.getElementById('editBikeId').value);
        const bikeIndex = this.bikes.findIndex(b => b.id === bikeId);
        
        if (bikeIndex === -1) return;

        // Handle image upload
        const imageFile = document.getElementById('editBikeImage').files[0];
        let imageUrl = this.bikes[bikeIndex].imageUrl; // Keep existing image by default
        
        if (imageFile) {
            // Validate image file
            if (!imageFile.type.startsWith('image/')) {
                this.showAlert('Please select a valid image file.', 'warning');
                return;
            }
            
            // Check file size (limit to 5MB)
            if (imageFile.size > 5 * 1024 * 1024) {
                this.showAlert('Image file is too large. Please select an image smaller than 5MB.', 'warning');
                return;
            }
            
            // Show loading state for image processing
            const updateBtn = document.getElementById('updateBikeBtn');
            const originalText = updateBtn.innerHTML;
            updateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing Image...';
            updateBtn.disabled = true;
            
            // Convert uploaded image to data URL
            const reader = new FileReader();
            reader.onload = (e) => {
                imageUrl = e.target.result;
                // Restore button state
                updateBtn.innerHTML = originalText;
                updateBtn.disabled = false;
                // Continue with form submission after image is loaded
                this.submitBikeUpdate(bikeId, bikeIndex, imageUrl);
            };
            reader.onerror = () => {
                // Restore button state
                updateBtn.innerHTML = originalText;
                updateBtn.disabled = false;
                this.showAlert('Error reading image file. Please try again.', 'warning');
            };
            reader.readAsDataURL(imageFile);
            return; // Exit here, form will be submitted after image loads
        }

        // If no new image uploaded, submit with existing image
        this.submitBikeUpdate(bikeId, bikeIndex, imageUrl);
    }

    async submitBikeUpdate(bikeId, bikeIndex, imageUrl) {
        const updatedData = {
            brand: document.getElementById('editBikeBrand').value,
            model: document.getElementById('editBikeModel').value,
            year: parseInt(document.getElementById('editBikeYear').value),
            type: document.getElementById('editBikeType').value,
            city: document.getElementById('editBikeCity').value,
            pricePerHour: parseFloat(document.getElementById('editPricePerHour').value),
            pricePerDay: parseFloat(document.getElementById('editPricePerDay').value),
            pricePerMonth: parseFloat(document.getElementById('editPricePerMonth').value),
            description: document.getElementById('editBikeDescription').value,
            imageUrl: imageUrl
        };

        try {
            const response = await fetch(`http://localhost:8080/api/bikes/${bikeId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    // Update the bike in our list
                    this.bikes[bikeIndex] = { 
                        ...this.bikes[bikeIndex], 
                        ...updatedData,
                        status: result.status
                    };
                    this.filteredBikes = [...this.bikes];
                    this.renderBikes();
                    this.updateStats();
                    
                    // Close modal
                    bootstrap.Modal.getInstance(document.getElementById('editBikeModal')).hide();
                    
                    this.showAlert(result.message, 'success');
                } else {
                    throw new Error(result.message || 'Failed to update bike');
                }
            } else {
                const errorResult = await response.json();
                throw new Error(errorResult.message || 'Failed to update bike');
            }
        } catch (error) {
            console.log('API not available, using mock data:', error.message);
            // Update mock data
            this.bikes[bikeIndex] = { ...this.bikes[bikeIndex], ...updatedData };
            this.filteredBikes = [...this.bikes];
            this.renderBikes();
            this.updateStats();
            
            // Close modal
            bootstrap.Modal.getInstance(document.getElementById('editBikeModal')).hide();
            
            this.showAlert('Bike updated successfully! (Offline mode)', 'success');
        }
    }

    async toggleBikeStatus(bikeId) {
        const bikeIndex = this.bikes.findIndex(b => b.id === bikeId);
        if (bikeIndex === -1) return;

        const bike = this.bikes[bikeIndex];
        const newStatus = bike.status === 'AVAILABLE' ? 'INACTIVE' : 'AVAILABLE';

        try {
            const response = await fetch(`http://localhost:8080/api/bikes/${bikeId}/status`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                this.bikes[bikeIndex].status = newStatus;
                this.filteredBikes = [...this.bikes];
                this.renderBikes();
                this.updateStats();
                
                this.showAlert(`Bike ${newStatus === 'AVAILABLE' ? 'enabled' : 'disabled'} successfully!`, 'success');
            } else {
                throw new Error('Failed to update bike status');
            }
        } catch (error) {
            console.log('API not available, using mock data');
            // Update mock data
            this.bikes[bikeIndex].status = newStatus;
            this.filteredBikes = [...this.bikes];
            this.renderBikes();
            this.updateStats();
            
            this.showAlert(`Bike ${newStatus === 'AVAILABLE' ? 'enabled' : 'disabled'} successfully!`, 'success');
        }
    }

    async deleteBike(bikeId) {
        if (!confirm('Are you sure you want to delete this bike? This action cannot be undone.')) {
            return;
        }

        const bikeIndex = this.bikes.findIndex(b => b.id === bikeId);
        if (bikeIndex === -1) return;

        try {
            const response = await fetch(`http://localhost:8080/api/bikes/${bikeId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                this.bikes.splice(bikeIndex, 1);
                this.filteredBikes = [...this.bikes];
                this.renderBikes();
                this.updateStats();
                
                this.showAlert('Bike deleted successfully!', 'success');
            } else {
                throw new Error('Failed to delete bike');
            }
        } catch (error) {
            console.log('API not available, using mock data');
            // Update mock data
            this.bikes.splice(bikeIndex, 1);
            this.filteredBikes = [...this.bikes];
            this.renderBikes();
            this.updateStats();
            
            this.showAlert('Bike deleted successfully!', 'success');
        }
    }

    viewBikeDetails(bikeId) {
        window.location.href = `bike-details.html?id=${bikeId}`;
    }

    showAlert(message, type = 'info') {
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
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (alertContainer.parentNode) {
                alertContainer.parentNode.removeChild(alertContainer);
            }
        }, 5000);
    }
}

// Initialize owner bikes manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.ownerBikesManager = new OwnerBikesManager();
    
    // Add test function for debugging
    window.testAddBikeButton = function() {
        console.log('Testing Add Bike button...');
        const saveBtn = document.getElementById('saveBikeBtn');
        if (saveBtn) {
            console.log('Save bike button found:', saveBtn);
            console.log('Button text:', saveBtn.innerHTML);
            console.log('Button disabled:', saveBtn.disabled);
            
            // Test click event
            saveBtn.click();
        } else {
            console.error('Save bike button not found!');
        }
    };
    
    // Add test function to check authentication
    window.testAuthentication = function() {
        console.log('Testing authentication...');
        console.log('Auth manager:', window.authManager);
        console.log('Current user:', window.ownerBikesManager?.user);
        console.log('Token:', localStorage.getItem('token'));
        console.log('User role:', window.ownerBikesManager?.user?.role);
    };
    
    // Add image preview function
    window.previewImage = function(input) {
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');
        
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(input.files[0]);
        } else {
            preview.style.display = 'none';
        }
    };
    
    // Add edit image preview function
    window.previewEditImage = function(input) {
        const preview = document.getElementById('editImagePreview');
        const previewImg = document.getElementById('editPreviewImg');
        
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                previewImg.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(input.files[0]);
        } else {
            preview.style.display = 'none';
        }
    };
});
