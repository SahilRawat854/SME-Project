// Reviews and Ratings Management
class ReviewsManager {
    constructor() {
        this.currentRating = 0;
        this.currentFilter = 'all';
        this.reviews = [];
        this.displayedReviews = 0;
        this.reviewsPerPage = 5;
        this.init();
    }

    init() {
        this.loadReviews();
        this.setupEventListeners();
        this.renderReviews();
        this.updateRatingSummary();
    }

    setupEventListeners() {
        // Star rating
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                this.setRating(index + 1);
            });
            
            star.addEventListener('mouseenter', () => {
                this.highlightStars(index + 1);
            });
        });

        document.getElementById('starRating').addEventListener('mouseleave', () => {
            this.highlightStars(this.currentRating);
        });

        // Filter tabs
        const filterTabs = document.querySelectorAll('.filter-tab');
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                this.setFilter(tab.dataset.filter);
            });
        });

        // Submit review
        const submitBtn = document.getElementById('submitReview');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitReview();
            });
        }

        // Load more reviews
        const loadMoreBtn = document.getElementById('loadMoreReviews');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreReviews();
            });
        }
    }

    loadReviews() {
        // Sample reviews data
        this.reviews = [
            {
                id: 1,
                user: {
                    name: 'Rajesh Kumar',
                    avatar: 'RK',
                    location: 'Mumbai'
                },
                rating: 5,
                title: 'Excellent bike and service!',
                content: 'The Honda CBR600RR was in perfect condition. The pickup and drop-off process was smooth, and the customer service was outstanding. Highly recommended for anyone looking for a premium bike rental experience.',
                date: '2024-01-15',
                tags: ['Great Service', 'Well Maintained', 'Fast Delivery'],
                helpful: 12,
                verified: true
            },
            {
                id: 2,
                user: {
                    name: 'Priya Sharma',
                    avatar: 'PS',
                    location: 'Delhi'
                },
                rating: 5,
                title: 'Amazing performance!',
                content: 'This bike is a beast! The acceleration and handling are incredible. Perfect for weekend rides. The team at SpinGo made the entire process hassle-free.',
                date: '2024-01-12',
                tags: ['High Performance', 'Smooth Ride', 'Professional'],
                helpful: 8,
                verified: true
            },
            {
                id: 3,
                user: {
                    name: 'Amit Singh',
                    avatar: 'AS',
                    location: 'Bangalore'
                },
                rating: 4,
                title: 'Good bike, minor issues',
                content: 'The bike was generally good, but there were some minor scratches that weren\'t mentioned in the description. However, the overall experience was positive and the bike performed well.',
                date: '2024-01-10',
                tags: ['Good Condition', 'Minor Issues'],
                helpful: 5,
                verified: true
            },
            {
                id: 4,
                user: {
                    name: 'Sneha Patel',
                    avatar: 'SP',
                    location: 'Pune'
                },
                rating: 5,
                title: 'Perfect for city rides',
                content: 'Used this bike for a day trip around Pune. The bike was comfortable for long rides and fuel efficient. The booking process was simple and the support team was very helpful.',
                date: '2024-01-08',
                tags: ['Comfortable', 'Fuel Efficient', 'Easy Booking'],
                helpful: 15,
                verified: true
            },
            {
                id: 5,
                user: {
                    name: 'Vikram Reddy',
                    avatar: 'VR',
                    location: 'Hyderabad'
                },
                rating: 4,
                title: 'Great bike, could be better',
                content: 'The bike itself is excellent, but the pickup location was a bit far from the city center. Other than that, everything was perfect. Would definitely rent again.',
                date: '2024-01-05',
                tags: ['Great Bike', 'Location Issue'],
                helpful: 7,
                verified: true
            },
            {
                id: 6,
                user: {
                    name: 'Anita Desai',
                    avatar: 'AD',
                    location: 'Chennai'
                },
                rating: 5,
                title: 'Outstanding experience!',
                content: 'From booking to return, everything was seamless. The bike was spotless and performed flawlessly. The team was professional and punctual. Highly recommend SpinGo!',
                date: '2024-01-03',
                tags: ['Seamless', 'Professional', 'Punctual'],
                helpful: 20,
                verified: true
            },
            {
                id: 7,
                user: {
                    name: 'Rohit Gupta',
                    avatar: 'RG',
                    location: 'Kolkata'
                },
                rating: 3,
                title: 'Average experience',
                content: 'The bike was okay, but not as clean as expected. The pickup was delayed by 30 minutes. However, the bike ran well during the rental period.',
                date: '2024-01-01',
                tags: ['Average', 'Delayed Pickup'],
                helpful: 3,
                verified: true
            }
        ];
    }

    setRating(rating) {
        this.currentRating = rating;
        this.highlightStars(rating);
    }

    highlightStars(rating) {
        const stars = document.querySelectorAll('.star');
        stars.forEach((star, index) => {
            if (index < rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    setFilter(filter) {
        this.currentFilter = filter;
        
        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        // Reset displayed reviews count
        this.displayedReviews = 0;
        
        // Render filtered reviews
        this.renderReviews();
    }

    renderReviews() {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;

        // Filter reviews based on current filter
        let filteredReviews = this.reviews;
        if (this.currentFilter !== 'all') {
            filteredReviews = this.reviews.filter(review => review.rating === parseInt(this.currentFilter));
        }

        // Sort by date (newest first)
        filteredReviews.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Clear existing reviews
        reviewsList.innerHTML = '';

        // Display reviews
        const reviewsToShow = filteredReviews.slice(0, this.displayedReviews + this.reviewsPerPage);
        this.displayedReviews = reviewsToShow.length;

        reviewsToShow.forEach(review => {
            const reviewElement = this.createReviewElement(review);
            reviewsList.appendChild(reviewElement);
        });

        // Update load more button
        this.updateLoadMoreButton(filteredReviews.length);
    }

    createReviewElement(review) {
        const div = document.createElement('div');
        div.className = 'review-card';
        div.innerHTML = `
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">${review.user.avatar}</div>
                    <div class="reviewer-details">
                        <h6>${review.user.name} ${review.verified ? '<i class="fas fa-check-circle text-success ms-1" title="Verified"></i>' : ''}</h6>
                        <small>${review.user.location} • ${this.formatDate(review.date)}</small>
                    </div>
                </div>
                <div class="review-rating">
                    ${this.generateStars(review.rating)}
                </div>
            </div>
            
            <div class="review-content">
                <h6 class="mb-2">${review.title}</h6>
                <p class="mb-3">${review.content}</p>
                
                <div class="review-tags">
                    ${review.tags.map(tag => `<span class="review-tag">${tag}</span>`).join('')}
                </div>
            </div>
            
            <div class="review-actions">
                <div class="review-action" onclick="reviewsManager.markHelpful(${review.id})">
                    <i class="fas fa-thumbs-up"></i>
                    <span>Helpful (${review.helpful})</span>
                </div>
                <div class="review-action">
                    <i class="fas fa-flag"></i>
                    <span>Report</span>
                </div>
            </div>
        `;
        return div;
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars += '<i class="fas fa-star"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    updateLoadMoreButton(totalReviews) {
        const loadMoreBtn = document.getElementById('loadMoreReviews');
        if (loadMoreBtn) {
            if (this.displayedReviews >= totalReviews) {
                loadMoreBtn.style.display = 'none';
            } else {
                loadMoreBtn.style.display = 'inline-block';
                loadMoreBtn.innerHTML = `<i class="fas fa-plus me-2"></i>Load More Reviews (${totalReviews - this.displayedReviews} remaining)`;
            }
        }
    }

    loadMoreReviews() {
        this.renderReviews();
    }

    markHelpful(reviewId) {
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
            review.helpful += 1;
            this.renderReviews();
            this.showAlert('Thank you for your feedback!', 'success');
        }
    }

    async submitReview() {
        const title = document.getElementById('reviewTitle').value.trim();
        const content = document.getElementById('reviewText').value.trim();

        if (this.currentRating === 0) {
            this.showAlert('Please select a rating', 'warning');
            return;
        }

        if (!title) {
            this.showAlert('Please enter a review title', 'warning');
            return;
        }

        if (!content) {
            this.showAlert('Please write your review', 'warning');
            return;
        }

        // Show loading state
        this.showLoading();

        try {
            // Create new review
            const newReview = {
                id: this.reviews.length + 1,
                user: {
                    name: 'You',
                    avatar: 'U',
                    location: 'Current Location'
                },
                rating: this.currentRating,
                title: title,
                content: content,
                date: new Date().toISOString().split('T')[0],
                tags: this.generateTags(content),
                helpful: 0,
                verified: false
            };

            // Add to reviews array
            this.reviews.unshift(newReview);

            // Clear form
            this.clearForm();

            // Re-render reviews
            this.renderReviews();
            this.updateRatingSummary();

            // Show success message
            this.showAlert('Thank you for your review! It will be published after moderation.', 'success');

        } catch (error) {
            this.showAlert('Failed to submit review. Please try again.', 'danger');
            console.error('Review submission error:', error);
        } finally {
            this.hideLoading();
        }
    }

    generateTags(content) {
        const tags = [];
        const contentLower = content.toLowerCase();
        
        if (contentLower.includes('excellent') || contentLower.includes('amazing') || contentLower.includes('perfect')) {
            tags.push('Excellent');
        }
        if (contentLower.includes('service') || contentLower.includes('support')) {
            tags.push('Great Service');
        }
        if (contentLower.includes('clean') || contentLower.includes('maintained')) {
            tags.push('Well Maintained');
        }
        if (contentLower.includes('fast') || contentLower.includes('quick')) {
            tags.push('Fast Delivery');
        }
        if (contentLower.includes('comfortable') || contentLower.includes('smooth')) {
            tags.push('Comfortable');
        }
        
        return tags.slice(0, 3); // Limit to 3 tags
    }

    clearForm() {
        document.getElementById('reviewTitle').value = '';
        document.getElementById('reviewText').value = '';
        this.currentRating = 0;
        this.highlightStars(0);
    }

    updateRatingSummary() {
        const totalReviews = this.reviews.length;
        if (totalReviews === 0) return;

        const averageRating = this.reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        const ratingCounts = [0, 0, 0, 0, 0]; // 1-5 stars

        this.reviews.forEach(review => {
            ratingCounts[review.rating - 1]++;
        });

        // Update overall rating
        document.querySelector('.rating-number').textContent = averageRating.toFixed(1);
        document.querySelector('.overall-rating p').textContent = `Based on ${totalReviews} reviews`;

        // Update rating breakdown
        const ratingBars = document.querySelectorAll('.rating-bar');
        ratingBars.forEach((bar, index) => {
            const percentage = totalReviews > 0 ? (ratingCounts[4 - index] / totalReviews) * 100 : 0;
            const fill = bar.querySelector('.rating-fill');
            const count = bar.querySelector('.rating-count');
            
            if (fill) fill.style.width = `${percentage}%`;
            if (count) count.textContent = ratingCounts[4 - index];
        });
    }

    showLoading() {
        const submitBtn = document.getElementById('submitReview');
        if (submitBtn) {
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
            submitBtn.disabled = true;
        }
    }

    hideLoading() {
        const submitBtn = document.getElementById('submitReview');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Submit Review';
            submitBtn.disabled = false;
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
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'}"></i>
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

// Initialize reviews manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.reviewsManager = new ReviewsManager();
});
