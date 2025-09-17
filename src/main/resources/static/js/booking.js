// Booking Page Management
class BookingManager {
    constructor() {
        this.selectedDate = null;
        this.selectedTimeSlot = null;
        this.selectedDuration = null;
        this.additionalServices = {
            insurance: false,
            helmet: false,
            delivery: false
        };
        this.basePrice = 500; // Base hourly rate
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDatePicker();
        this.generateTimeSlots();
        this.setupDurationSelection();
        this.setupAdditionalServices();
        this.updatePriceCalculation();
    }

    setupEventListeners() {
        const proceedBtn = document.getElementById('proceedToPayment');
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => this.proceedToPayment());
        }

        const dateInput = document.getElementById('bookingDate');
        if (dateInput) {
            dateInput.addEventListener('change', (e) => {
                this.selectedDate = e.target.value;
                this.generateTimeSlots();
                this.updatePriceCalculation();
            });
        }
    }

    setupDatePicker() {
        const dateInput = document.getElementById('bookingDate');
        if (dateInput) {
            // Set minimum date to today
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            dateInput.min = tomorrow.toISOString().split('T')[0];
            
            // Set default date to tomorrow
            dateInput.value = tomorrow.toISOString().split('T')[0];
            this.selectedDate = dateInput.value;
        }
    }

    generateTimeSlots() {
        const timeSlotsContainer = document.getElementById('timeSlots');
        if (!timeSlotsContainer) return;

        const timeSlots = [
            { time: '06:00', available: true },
            { time: '07:00', available: true },
            { time: '08:00', available: true },
            { time: '09:00', available: true },
            { time: '10:00', available: true },
            { time: '11:00', available: true },
            { time: '12:00', available: true },
            { time: '13:00', available: true },
            { time: '14:00', available: true },
            { time: '15:00', available: true },
            { time: '16:00', available: true },
            { time: '17:00', available: true },
            { time: '18:00', available: true },
            { time: '19:00', available: true },
            { time: '20:00', available: true }
        ];

        // Simulate some unavailable slots
        const unavailableSlots = ['10:00', '14:00', '16:00'];
        timeSlots.forEach(slot => {
            if (unavailableSlots.includes(slot.time)) {
                slot.available = false;
            }
        });

        timeSlotsContainer.innerHTML = '';

        timeSlots.forEach(slot => {
            const slotElement = document.createElement('div');
            slotElement.className = `time-slot ${!slot.available ? 'unavailable' : ''}`;
            slotElement.dataset.time = slot.time;
            slotElement.innerHTML = `
                <div class="fw-bold">${slot.time}</div>
                <small class="text-muted">${slot.available ? 'Available' : 'Booked'}</small>
            `;

            if (slot.available) {
                slotElement.addEventListener('click', () => {
                    this.selectTimeSlot(slotElement, slot.time);
                });
            }

            timeSlotsContainer.appendChild(slotElement);
        });
    }

    selectTimeSlot(element, time) {
        // Remove selected class from all time slots
        document.querySelectorAll('.time-slot').forEach(slot => {
            slot.classList.remove('selected');
        });

        // Add selected class to clicked slot
        element.classList.add('selected');
        this.selectedTimeSlot = time;
        this.updatePriceCalculation();
    }

    setupDurationSelection() {
        const durationOptions = document.querySelectorAll('.duration-option');
        durationOptions.forEach(option => {
            option.addEventListener('click', () => {
                // Remove selected class from all options
                durationOptions.forEach(opt => opt.classList.remove('selected'));
                
                // Add selected class to clicked option
                option.classList.add('selected');
                
                // Store selected duration and price
                this.selectedDuration = parseInt(option.dataset.duration);
                this.updatePriceCalculation();
            });
        });
    }

    setupAdditionalServices() {
        const serviceCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        serviceCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const serviceName = e.target.id;
                this.additionalServices[serviceName] = e.target.checked;
                this.updatePriceCalculation();
            });
        });
    }

    updatePriceCalculation() {
        let basePrice = 0;
        
        if (this.selectedDuration) {
            basePrice = this.basePrice * this.selectedDuration;
        }

        // Update base price display
        const basePriceElement = document.getElementById('basePrice');
        if (basePriceElement) {
            basePriceElement.textContent = `₹${basePrice.toLocaleString()}`;
        }

        // Calculate additional services
        let additionalCost = 0;
        const serviceItems = {
            insurance: { element: document.getElementById('insuranceItem'), price: 500 },
            helmet: { element: document.getElementById('helmetItem'), price: 200 },
            delivery: { element: document.getElementById('deliveryItem'), price: 300 }
        };

        Object.keys(this.additionalServices).forEach(service => {
            const serviceItem = serviceItems[service];
            if (serviceItem) {
                if (this.additionalServices[service]) {
                    serviceItem.element.style.display = 'block';
                    additionalCost += serviceItem.price;
                } else {
                    serviceItem.element.style.display = 'none';
                }
            }
        });

        // Calculate GST (18%)
        const subtotal = basePrice + additionalCost;
        const gstAmount = Math.round(subtotal * 0.18);
        const totalAmount = subtotal + gstAmount;

        // Update GST and total
        const gstElement = document.getElementById('gstAmount');
        const totalElement = document.getElementById('totalAmount');
        
        if (gstElement) {
            gstElement.textContent = `₹${gstAmount.toLocaleString()}`;
        }
        
        if (totalElement) {
            totalElement.textContent = `₹${totalAmount.toLocaleString()}`;
        }

        // Update proceed button
        this.updateProceedButton();
    }

    updateProceedButton() {
        const proceedBtn = document.getElementById('proceedToPayment');
        if (proceedBtn) {
            const isReady = this.selectedDate && this.selectedTimeSlot && this.selectedDuration;
            
            if (isReady) {
                proceedBtn.disabled = false;
                proceedBtn.innerHTML = '<i class="fas fa-arrow-right me-2"></i>Proceed to Payment';
            } else {
                proceedBtn.disabled = true;
                proceedBtn.innerHTML = '<i class="fas fa-exclamation-triangle me-2"></i>Complete Selection';
            }
        }
    }

    validateBooking() {
        if (!this.selectedDate) {
            this.showAlert('Please select a date', 'warning');
            return false;
        }

        if (!this.selectedTimeSlot) {
            this.showAlert('Please select a time slot', 'warning');
            return false;
        }

        if (!this.selectedDuration) {
            this.showAlert('Please select a duration', 'warning');
            return false;
        }

        return true;
    }

    async proceedToPayment() {
        if (!this.validateBooking()) {
            return;
        }

        // Show loading state
        this.showLoading();

        try {
            // Collect booking data
            const bookingData = this.collectBookingData();
            
            // Simulate booking creation
            await this.createBooking(bookingData);
            
            // Store booking data in session storage for payment page
            sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
            
            // Show success message
            this.showAlert('Booking details saved! Redirecting to payment...', 'success');
            
            // Redirect to payment page
            setTimeout(() => {
                window.location.href = 'payment.html';
            }, 1500);

        } catch (error) {
            this.showAlert('Failed to create booking. Please try again.', 'danger');
            console.error('Booking error:', error);
        } finally {
            this.hideLoading();
        }
    }

    collectBookingData() {
        const totalAmount = parseInt(document.getElementById('totalAmount').textContent.replace(/[₹,]/g, ''));
        
        return {
            bike: {
                id: 1,
                name: 'Honda CBR600RR (2023)',
                image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center'
            },
            date: this.selectedDate,
            timeSlot: this.selectedTimeSlot,
            duration: this.selectedDuration,
            additionalServices: this.additionalServices,
            pricing: {
                basePrice: this.basePrice * this.selectedDuration,
                additionalCost: Object.keys(this.additionalServices).reduce((total, service) => {
                    if (this.additionalServices[service]) {
                        const prices = { insurance: 500, helmet: 200, delivery: 300 };
                        return total + prices[service];
                    }
                    return total;
                }, 0),
                gst: Math.round((this.basePrice * this.selectedDuration + Object.keys(this.additionalServices).reduce((total, service) => {
                    if (this.additionalServices[service]) {
                        const prices = { insurance: 500, helmet: 200, delivery: 300 };
                        return total + prices[service];
                    }
                    return total;
                }, 0)) * 0.18),
                total: totalAmount
            },
            bookingId: this.generateBookingId()
        };
    }

    generateBookingId() {
        const date = new Date();
        const timestamp = date.getTime().toString().slice(-6);
        return `SG${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${timestamp}`;
    }

    async createBooking(bookingData) {
        if (window.app && window.app.isConnected && window.authManager && window.authManager.isAuthenticated()) {
            try {
                const token = window.authManager.getAuthToken();
                const user = window.authManager.getCurrentUser();
                
                // Prepare booking request for backend
                const bookingRequest = {
                    userId: user.id,
                    bikeId: bookingData.bike.id,
                    pickupDate: new Date(`${bookingData.date}T${bookingData.timeSlot}`).toISOString(),
                    dropoffDate: new Date(`${bookingData.date}T${bookingData.timeSlot}`).toISOString(),
                    pickupTime: bookingData.timeSlot,
                    dropTime: this.calculateDropTime(bookingData.timeSlot, bookingData.duration)
                };

                const response = await fetch(`${window.app.apiBaseUrl}/bookings`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(bookingRequest)
                });

                if (response.ok) {
                    const createdBooking = await response.json();
                    console.log('✅ Booking created successfully:', createdBooking);
                    return createdBooking;
                } else {
                    const error = await response.json();
                    throw new Error(error.message || 'Booking creation failed');
                }
            } catch (error) {
                console.error('❌ Booking creation failed:', error);
                throw error;
            }
        } else {
            // Simulate API call delay for mock mode
            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('📝 Mock booking created:', bookingData);
        }
    }

    calculateDropTime(pickupTime, duration) {
        const [hours, minutes] = pickupTime.split(':').map(Number);
        const totalMinutes = hours * 60 + minutes + (duration * 60);
        const dropHours = Math.floor(totalMinutes / 60) % 24;
        const dropMinutes = totalMinutes % 60;
        return `${dropHours.toString().padStart(2, '0')}:${dropMinutes.toString().padStart(2, '0')}`;
    }

    showLoading() {
        const proceedBtn = document.getElementById('proceedToPayment');
        if (proceedBtn) {
            proceedBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating Booking...';
            proceedBtn.disabled = true;
        }
    }

    hideLoading() {
        const proceedBtn = document.getElementById('proceedToPayment');
        if (proceedBtn) {
            proceedBtn.innerHTML = '<i class="fas fa-arrow-right me-2"></i>Proceed to Payment';
            proceedBtn.disabled = false;
        }
    }

    showAlert(message, type) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        // Create new alert
        const alertContainer = document.createElement('div');
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'}"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        // Insert alert at the top of the booking body
        const bookingBody = document.querySelector('.booking-body');
        bookingBody.insertBefore(alertContainer, bookingBody.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = bootstrap.Alert.getInstance(alertContainer.firstElementChild);
            if (alert) alert.close();
        }, 5000);
    }
}

// Initialize booking manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.bookingManager = new BookingManager();
});
