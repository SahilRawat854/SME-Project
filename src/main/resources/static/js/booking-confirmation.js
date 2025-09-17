// Booking Confirmation Management
class BookingConfirmationManager {
    constructor() {
        this.bookingData = null;
        this.init();
    }

    init() {
        this.loadBookingData();
        this.populateBookingDetails();
        this.setupEventListeners();
    }

    loadBookingData() {
        // Try to load booking data from session storage
        const savedBookingData = sessionStorage.getItem('bookingData');
        if (savedBookingData) {
            this.bookingData = JSON.parse(savedBookingData);
        } else {
            // Fallback to sample data
            this.bookingData = {
                bike: {
                    id: 1,
                    name: 'Honda CBR600RR (2023)',
                    image: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center'
                },
                date: '2024-01-20',
                timeSlot: '10:00',
                duration: 48,
                additionalServices: {
                    insurance: true,
                    helmet: true,
                    delivery: false
                },
                pricing: {
                    basePrice: 17000,
                    additionalCost: 700,
                    gst: 3186,
                    total: 20886
                },
                bookingId: this.generateBookingId()
            };
        }
    }

    generateBookingId() {
        const date = new Date();
        const timestamp = date.getTime().toString().slice(-6);
        return `SG${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}${timestamp}`;
    }

    populateBookingDetails() {
        if (!this.bookingData) return;

        // Update booking ID
        const bookingIdElement = document.getElementById('bookingId');
        if (bookingIdElement) {
            bookingIdElement.textContent = `#${this.bookingData.bookingId}`;
        }

        // Update bike name
        const bikeNameElement = document.getElementById('bikeName');
        if (bikeNameElement) {
            bikeNameElement.textContent = this.bookingData.bike.name;
        }

        // Update pickup date and time
        const pickupDateTimeElement = document.getElementById('pickupDateTime');
        if (pickupDateTimeElement) {
            const pickupDate = new Date(this.bookingData.date);
            const timeSlot = this.bookingData.timeSlot;
            pickupDateTimeElement.textContent = `${pickupDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })} at ${timeSlot}`;
        }

        // Update return date and time
        const returnDateTimeElement = document.getElementById('returnDateTime');
        if (returnDateTimeElement) {
            const pickupDate = new Date(this.bookingData.date);
            const returnDate = new Date(pickupDate.getTime() + (this.bookingData.duration * 60 * 60 * 1000));
            const timeSlot = this.bookingData.timeSlot;
            returnDateTimeElement.textContent = `${returnDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })} at ${timeSlot}`;
        }

        // Update duration
        const durationElement = document.getElementById('duration');
        if (durationElement) {
            const hours = this.bookingData.duration;
            if (hours >= 24) {
                const days = Math.floor(hours / 24);
                const remainingHours = hours % 24;
                if (remainingHours === 0) {
                    durationElement.textContent = `${days} day${days > 1 ? 's' : ''}`;
                } else {
                    durationElement.textContent = `${days} day${days > 1 ? 's' : ''} ${remainingHours} hour${remainingHours > 1 ? 's' : ''}`;
                }
            } else {
                durationElement.textContent = `${hours} hour${hours > 1 ? 's' : ''}`;
            }
        }

        // Update total amount
        const totalAmountElement = document.getElementById('totalAmount');
        if (totalAmountElement) {
            totalAmountElement.textContent = `₹${this.bookingData.pricing.total.toLocaleString()}`;
        }

        // Update pickup location (you can make this dynamic based on user selection)
        const pickupLocationElement = document.getElementById('pickupLocation');
        if (pickupLocationElement) {
            pickupLocationElement.textContent = 'Mumbai Central'; // Default location
        }
    }

    setupEventListeners() {
        // Add any additional event listeners here
        window.downloadBooking = () => this.downloadBookingPDF();
    }

    downloadBookingPDF() {
        // Create a simple PDF-like content
        const bookingContent = this.generateBookingContent();
        
        // Create a new window with the booking content
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Booking Confirmation - ${this.bookingData.bookingId}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { text-align: center; margin-bottom: 30px; }
                    .booking-details { margin-bottom: 30px; }
                    .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
                    .footer { margin-top: 30px; text-align: center; color: #666; }
                </style>
            </head>
            <body>
                ${bookingContent}
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.print();
    }

    generateBookingContent() {
        return `
            <div class="header">
                <h1>SpinGo - Bike Rental Confirmation</h1>
                <h2>Booking ID: ${this.bookingData.bookingId}</h2>
            </div>
            
            <div class="booking-details">
                <h3>Booking Details</h3>
                <div class="detail-row">
                    <span>Bike:</span>
                    <span>${this.bookingData.bike.name}</span>
                </div>
                <div class="detail-row">
                    <span>Pickup Date & Time:</span>
                    <span>${document.getElementById('pickupDateTime').textContent}</span>
                </div>
                <div class="detail-row">
                    <span>Return Date & Time:</span>
                    <span>${document.getElementById('returnDateTime').textContent}</span>
                </div>
                <div class="detail-row">
                    <span>Duration:</span>
                    <span>${document.getElementById('duration').textContent}</span>
                </div>
                <div class="detail-row">
                    <span>Pickup Location:</span>
                    <span>${document.getElementById('pickupLocation').textContent}</span>
                </div>
                <div class="detail-row">
                    <span>Total Amount:</span>
                    <span>${document.getElementById('totalAmount').textContent}</span>
                </div>
            </div>
            
            <div class="footer">
                <p>Thank you for choosing SpinGo!</p>
                <p>For support, contact us at support@spingo.com or call +91-9876543210</p>
            </div>
        `;
    }

    // Method to update timeline status (can be called by other parts of the app)
    updateTimelineStatus(status) {
        const timelineItems = document.querySelectorAll('.timeline-item');
        
        timelineItems.forEach((item, index) => {
            item.classList.remove('completed', 'current', 'pending');
            
            if (index < status) {
                item.classList.add('completed');
            } else if (index === status) {
                item.classList.add('current');
            } else {
                item.classList.add('pending');
            }
        });
    }

    // Method to send booking confirmation email (simulation)
    async sendConfirmationEmail() {
        try {
            // Simulate email sending
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showAlert('Confirmation email sent to your registered email address!', 'success');
        } catch (error) {
            this.showAlert('Failed to send confirmation email. Please try again.', 'danger');
        }
    }

    showAlert(message, type) {
        // Remove existing alerts
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        // Create new alert
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
}

// Initialize booking confirmation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.bookingConfirmationManager = new BookingConfirmationManager();
});
