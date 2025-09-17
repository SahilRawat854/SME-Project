// Bike Details Page JavaScript
class BikeDetailsPage {
    constructor() {
        this.apiBaseUrl = 'http://localhost:8080/api';
        this.bikeId = this.getBikeIdFromUrl();
        this.bikeData = null;
        this.init();
    }

    init() {
        if (this.bikeId) {
            this.loadBikeDetails();
        } else {
            this.showError();
        }
        this.setupEventListeners();
        this.updateButtonVisibility();
        this.setupAuthListener();
    }

    getBikeIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    async loadBikeDetails() {
        try {
            // Try to load from API first
            const response = await fetch(`${this.apiBaseUrl}/bikes/${this.bikeId}`);
            if (response.ok) {
                this.bikeData = await response.json();
                this.renderBikeDetails();
            } else {
                // Fallback to mock data
                this.loadMockBikeData();
            }
        } catch (error) {
            console.log('API not available, using mock data:', error.message);
            this.loadMockBikeData();
        }
    }

    loadMockBikeData() {
        // Mock bike data based on the bike ID
        const mockBikes = {
            '1': {
                id: 1,
                brand: 'Honda',
                model: 'CBR600RR',
                year: 2023,
                pricePerHour: 500,
                pricePerDay: 3000,
                pricePerMonth: 60000,
                description: 'The Honda CBR600RR is a high-performance sports bike that combines cutting-edge technology with exceptional handling. Perfect for both city rides and weekend adventures, this bike offers an exhilarating riding experience with its powerful 600cc engine and advanced electronics.',
                status: 'AVAILABLE',
                imageUrl: 'images/honda-cbr-600rr.jpg',
                specifications: {
                    engine: '599cc Inline-4',
                    power: '118 HP @ 13,500 RPM',
                    torque: '64 Nm @ 11,250 RPM',
                    transmission: '6-Speed Manual',
                    fuelCapacity: '18.2 L',
                    weight: '194 kg',
                    seatHeight: '820 mm',
                    topSpeed: '260 km/h',
                    acceleration: '0-100 km/h in 3.2s'
                },
                features: [
                    { icon: 'fas fa-bolt', title: 'Quick Shifter', description: 'Seamless gear changes' },
                    { icon: 'fas fa-cog', title: 'Ride Modes', description: 'Multiple riding modes' },
                    { icon: 'fas fa-shield-alt', title: 'ABS', description: 'Anti-lock braking system' },
                    { icon: 'fas fa-tachometer-alt', title: 'Digital Display', description: 'Advanced instrument cluster' },
                    { icon: 'fas fa-wind', title: 'Aerodynamics', description: 'Optimized for performance' },
                    { icon: 'fas fa-lightbulb', title: 'LED Lighting', description: 'Modern LED headlights' }
                ],
                rating: 4.8,
                totalReviews: 127,
                reviews: [
                    {
                        id: 1,
                        user: 'Rajesh Kumar',
                        rating: 5,
                        comment: 'Amazing bike! Perfect for city rides and weekend trips. The handling is superb.',
                        date: '2024-01-15'
                    },
                    {
                        id: 2,
                        user: 'Priya Sharma',
                        rating: 4,
                        comment: 'Great performance and comfortable for long rides. Highly recommended!',
                        date: '2024-01-10'
                    },
                    {
                        id: 3,
                        user: 'Amit Singh',
                        rating: 5,
                        comment: 'Excellent bike with great fuel efficiency. The service from SpinGo was top-notch.',
                        date: '2024-01-08'
                    }
                ]
            },
            '2': {
                id: 2,
                brand: 'Yamaha',
                model: 'R1',
                year: 2023,
                pricePerHour: 600,
                pricePerDay: 3600,
                pricePerMonth: 72000,
                description: 'The Yamaha R1 is a racing-inspired sport bike that delivers track-level performance on the street. With its crossplane crankshaft engine and advanced electronics, it offers an unmatched riding experience for adrenaline seekers.',
                status: 'AVAILABLE',
                imageUrl: 'images/yamaha-r1.jpg',
                specifications: {
                    engine: '998cc Inline-4',
                    power: '200 HP @ 13,500 RPM',
                    torque: '112 Nm @ 11,500 RPM',
                    transmission: '6-Speed Manual',
                    fuelCapacity: '17 L',
                    weight: '201 kg',
                    seatHeight: '855 mm',
                    topSpeed: '299 km/h',
                    acceleration: '0-100 km/h in 2.8s'
                },
                features: [
                    { icon: 'fas fa-bolt', title: 'Crossplane Engine', description: 'Unique firing order' },
                    { icon: 'fas fa-cog', title: 'YCC-T', description: 'Yamaha Chip Controlled Throttle' },
                    { icon: 'fas fa-shield-alt', title: 'TCS', description: 'Traction Control System' },
                    { icon: 'fas fa-tachometer-alt', title: 'TFT Display', description: 'Full-color TFT screen' },
                    { icon: 'fas fa-wind', title: 'Aero Package', description: 'MotoGP-inspired aerodynamics' },
                    { icon: 'fas fa-lightbulb', title: 'LED Cornering', description: 'LED cornering lights' }
                ],
                rating: 4.9,
                totalReviews: 89,
                reviews: [
                    {
                        id: 1,
                        user: 'Vikram Patel',
                        rating: 5,
                        comment: 'Incredible power and handling. This bike is a beast on the road!',
                        date: '2024-01-12'
                    },
                    {
                        id: 2,
                        user: 'Sneha Reddy',
                        rating: 5,
                        comment: 'Perfect for track days and spirited riding. The electronics are amazing.',
                        date: '2024-01-09'
                    }
                ]
            },
            '3': {
                id: 3,
                brand: 'Kawasaki',
                model: 'Ninja ZX-10R',
                year: 2023,
                pricePerHour: 550,
                pricePerDay: 3300,
                pricePerMonth: 66000,
                description: 'The Kawasaki Ninja ZX-10R is a legendary supersport bike that has dominated racetracks worldwide. With its advanced electronics package and race-bred performance, it offers the perfect balance of power and control.',
                status: 'AVAILABLE',
                imageUrl: 'images/kawasaki-ninja.jpg',
                specifications: {
                    engine: '998cc Inline-4',
                    power: '203 HP @ 13,200 RPM',
                    torque: '114 Nm @ 11,400 RPM',
                    transmission: '6-Speed Manual',
                    fuelCapacity: '17 L',
                    weight: '207 kg',
                    seatHeight: '835 mm',
                    topSpeed: '299 km/h',
                    acceleration: '0-100 km/h in 2.9s'
                },
                features: [
                    { icon: 'fas fa-bolt', title: 'KTRC', description: 'Kawasaki Traction Control' },
                    { icon: 'fas fa-cog', title: 'KCMF', description: 'Kawasaki Cornering Management' },
                    { icon: 'fas fa-shield-alt', title: 'KIBS', description: 'Kawasaki Intelligent ABS' },
                    { icon: 'fas fa-tachometer-alt', title: 'TFT Display', description: 'Advanced instrument panel' },
                    { icon: 'fas fa-wind', title: 'Aero Winglets', description: 'Downforce-generating winglets' },
                    { icon: 'fas fa-lightbulb', title: 'LED Headlights', description: 'High-intensity LED lighting' }
                ],
                rating: 4.7,
                totalReviews: 156,
                reviews: [
                    {
                        id: 1,
                        user: 'Arjun Mehta',
                        rating: 5,
                        comment: 'The Ninja is absolutely incredible. Perfect for both street and track.',
                        date: '2024-01-14'
                    },
                    {
                        id: 2,
                        user: 'Kavya Nair',
                        rating: 4,
                        comment: 'Great bike with excellent build quality. The electronics are very advanced.',
                        date: '2024-01-11'
                    },
                    {
                        id: 3,
                        user: 'Rohit Gupta',
                        rating: 5,
                        comment: 'Amazing performance and handling. This bike never disappoints!',
                        date: '2024-01-07'
                    }
                ]
            },
            '4': {
                id: 4,
                brand: 'Honda',
                model: 'Shadow',
                year: 2021,
                pricePerHour: 300,
                pricePerDay: 1800,
                pricePerMonth: 36000,
                description: 'The Honda Shadow is a classic cruiser motorcycle that offers a comfortable riding experience with its relaxed riding position and smooth engine. Perfect for long rides and city cruising.',
                status: 'AVAILABLE',
                imageUrl: 'images/honda-shadow.jpg',
                specifications: {
                    engine: '745cc V-Twin',
                    power: '45 HP @ 5,500 RPM',
                    torque: '60 Nm @ 3,000 RPM',
                    transmission: '5-Speed Manual',
                    fuelCapacity: '11.2 L',
                    weight: '245 kg',
                    seatHeight: '700 mm',
                    topSpeed: '160 km/h',
                    acceleration: '0-100 km/h in 6.5s'
                },
                features: [
                    { icon: 'fas fa-chair', title: 'Comfortable Seat', description: 'Wide, comfortable seating' },
                    { icon: 'fas fa-shield-alt', title: 'ABS', description: 'Anti-lock braking system' },
                    { icon: 'fas fa-wind', title: 'Wind Protection', description: 'Windshield included' },
                    { icon: 'fas fa-cog', title: 'Reliable Engine', description: 'Proven Honda reliability' }
                ],
                rating: 4.5,
                totalReviews: 89,
                reviews: [
                    {
                        id: 1,
                        user: 'Amit Singh',
                        rating: 5,
                        comment: 'Perfect cruiser for long rides. Very comfortable and reliable.',
                        date: '2024-01-12'
                    }
                ]
            },
            '7': {
                id: 7,
                brand: 'Ducati',
                model: 'Monster 821',
                year: 2023,
                pricePerHour: 800,
                pricePerDay: 4800,
                pricePerMonth: 96000,
                description: 'The Ducati Monster 821 is a naked sport bike that combines Italian style with exceptional performance. With its powerful engine and agile handling, it offers an exciting riding experience.',
                status: 'AVAILABLE',
                imageUrl: 'images/ducati-monster-821.jpg',
                specifications: {
                    engine: '821cc L-Twin',
                    power: '109 HP @ 9,250 RPM',
                    torque: '86 Nm @ 7,750 RPM',
                    transmission: '6-Speed Manual',
                    fuelCapacity: '16.5 L',
                    weight: '206 kg',
                    seatHeight: '810 mm',
                    topSpeed: '220 km/h',
                    acceleration: '0-100 km/h in 3.8s'
                },
                features: [
                    { icon: 'fas fa-bolt', title: 'Quick Shifter', description: 'Seamless gear changes' },
                    { icon: 'fas fa-cog', title: 'Ride Modes', description: 'Multiple riding modes' },
                    { icon: 'fas fa-shield-alt', title: 'ABS', description: 'Anti-lock braking system' },
                    { icon: 'fas fa-tachometer-alt', title: 'Digital Display', description: 'Advanced instrument cluster' }
                ],
                rating: 4.7,
                totalReviews: 156,
                reviews: [
                    {
                        id: 1,
                        user: 'Vikram Patel',
                        rating: 5,
                        comment: 'Amazing Italian engineering! The sound and performance are incredible.',
                        date: '2024-01-14'
                    }
                ]
            },
            '8': {
                id: 8,
                brand: 'BMW',
                model: 'G 310 R',
                year: 2023,
                pricePerHour: 400,
                pricePerDay: 2400,
                pricePerMonth: 48000,
                description: 'The BMW G 310 R is a premium entry-level naked bike that offers BMW quality and engineering in an accessible package. Perfect for city riding and weekend adventures.',
                status: 'AVAILABLE',
                imageUrl: 'images/bmw-g310r.jpg',
                specifications: {
                    engine: '313cc Single Cylinder',
                    power: '34 HP @ 9,500 RPM',
                    torque: '28 Nm @ 7,500 RPM',
                    transmission: '6-Speed Manual',
                    fuelCapacity: '11 L',
                    weight: '158 kg',
                    seatHeight: '785 mm',
                    topSpeed: '143 km/h',
                    acceleration: '0-100 km/h in 5.2s'
                },
                features: [
                    { icon: 'fas fa-shield-alt', title: 'ABS', description: 'Anti-lock braking system' },
                    { icon: 'fas fa-tachometer-alt', title: 'Digital Display', description: 'Modern instrument cluster' },
                    { icon: 'fas fa-lightbulb', title: 'LED Lighting', description: 'LED headlights and taillights' },
                    { icon: 'fas fa-cog', title: 'BMW Quality', description: 'Premium build quality' }
                ],
                rating: 4.4,
                totalReviews: 98,
                reviews: [
                    {
                        id: 1,
                        user: 'Sneha Reddy',
                        rating: 4,
                        comment: 'Great bike for beginners. BMW quality at an affordable price.',
                        date: '2024-01-13'
                    }
                ]
            },
            '9': {
                id: 9,
                brand: 'KTM',
                model: 'Duke 390',
                year: 2023,
                pricePerHour: 450,
                pricePerDay: 2700,
                pricePerMonth: 54000,
                description: 'The KTM Duke 390 is a lightweight, agile naked bike that offers exceptional performance and handling. Known for its sharp design and powerful engine, it provides an exciting riding experience.',
                status: 'AVAILABLE',
                imageUrl: 'images/ktm-duke-390.jpg',
                specifications: {
                    engine: '373cc Single Cylinder',
                    power: '44 HP @ 9,000 RPM',
                    torque: '37 Nm @ 7,000 RPM',
                    transmission: '6-Speed Manual',
                    fuelCapacity: '13.4 L',
                    weight: '149 kg',
                    seatHeight: '820 mm',
                    topSpeed: '170 km/h',
                    acceleration: '0-100 km/h in 4.8s'
                },
                features: [
                    { icon: 'fas fa-bolt', title: 'Quick Shifter', description: 'Seamless gear changes' },
                    { icon: 'fas fa-cog', title: 'Ride Modes', description: 'Multiple riding modes' },
                    { icon: 'fas fa-shield-alt', title: 'ABS', description: 'Anti-lock braking system' },
                    { icon: 'fas fa-tachometer-alt', title: 'Digital Display', description: 'Advanced instrument cluster' }
                ],
                rating: 4.6,
                totalReviews: 134,
                reviews: [
                    {
                        id: 1,
                        user: 'Arjun Mehta',
                        rating: 5,
                        comment: 'Incredible performance for its size. Perfect for city and highway riding.',
                        date: '2024-01-16'
                    }
                ]
            },
            '10': {
                id: 10,
                brand: 'Royal Enfield',
                model: 'Classic 350',
                year: 2023,
                pricePerHour: 250,
                pricePerDay: 1500,
                pricePerMonth: 30000,
                description: 'The Royal Enfield Classic 350 is a timeless motorcycle that combines classic design with modern reliability. Perfect for those who appreciate traditional styling and comfortable riding.',
                status: 'AVAILABLE',
                imageUrl: 'images/royal-enfield-classic-350.jpg',
                specifications: {
                    engine: '349cc Single Cylinder',
                    power: '20 HP @ 6,100 RPM',
                    torque: '27 Nm @ 4,000 RPM',
                    transmission: '5-Speed Manual',
                    fuelCapacity: '13 L',
                    weight: '195 kg',
                    seatHeight: '805 mm',
                    topSpeed: '120 km/h',
                    acceleration: '0-100 km/h in 8.5s'
                },
                features: [
                    { icon: 'fas fa-chair', title: 'Comfortable Seat', description: 'Wide, comfortable seating' },
                    { icon: 'fas fa-shield-alt', title: 'ABS', description: 'Anti-lock braking system' },
                    { icon: 'fas fa-cog', title: 'Reliable Engine', description: 'Proven Royal Enfield reliability' },
                    { icon: 'fas fa-palette', title: 'Classic Design', description: 'Timeless styling' }
                ],
                rating: 4.3,
                totalReviews: 167,
                reviews: [
                    {
                        id: 1,
                        user: 'Ravi Kumar',
                        rating: 4,
                        comment: 'Classic looks with modern reliability. Perfect for long rides.',
                        date: '2024-01-09'
                    }
                ]
            },
            '11': {
                id: 11,
                brand: 'Harley-Davidson',
                model: 'Street 750',
                year: 2023,
                pricePerHour: 600,
                pricePerDay: 3600,
                pricePerMonth: 72000,
                description: 'The Harley-Davidson Street 750 is an entry-level cruiser that brings the iconic Harley-Davidson experience to a wider audience. With its distinctive styling and comfortable riding position, it offers the classic American motorcycle experience.',
                status: 'AVAILABLE',
                imageUrl: 'images/harley-street-750.jpg',
                specifications: {
                    engine: '749cc V-Twin',
                    power: '47 HP @ 8,000 RPM',
                    torque: '59 Nm @ 4,000 RPM',
                    transmission: '6-Speed Manual',
                    fuelCapacity: '13.1 L',
                    weight: '233 kg',
                    seatHeight: '709 mm',
                    topSpeed: '160 km/h',
                    acceleration: '0-100 km/h in 6.2s'
                },
                features: [
                    { icon: 'fas fa-chair', title: 'Comfortable Seat', description: 'Low, comfortable seating' },
                    { icon: 'fas fa-shield-alt', title: 'ABS', description: 'Anti-lock braking system' },
                    { icon: 'fas fa-cog', title: 'Harley Heritage', description: 'Iconic American motorcycle' },
                    { icon: 'fas fa-palette', title: 'Classic Styling', description: 'Traditional cruiser design' }
                ],
                rating: 4.5,
                totalReviews: 112,
                reviews: [
                    {
                        id: 1,
                        user: 'Mike Johnson',
                        rating: 5,
                        comment: 'True Harley experience! The sound and feel are amazing.',
                        date: '2024-01-08'
                    }
                ]
            },
            '12': {
                id: 12,
                brand: 'Aprilia',
                model: 'RS 660',
                year: 2023,
                pricePerHour: 700,
                pricePerDay: 4200,
                pricePerMonth: 84000,
                description: 'The Aprilia RS 660 is a mid-displacement sport bike that combines track-ready performance with everyday usability. With its advanced electronics and lightweight design, it offers an exceptional riding experience.',
                status: 'AVAILABLE',
                imageUrl: 'images/aprilia-rs-660.jpg',
                specifications: {
                    engine: '659cc Parallel-Twin',
                    power: '100 HP @ 10,500 RPM',
                    torque: '67 Nm @ 8,500 RPM',
                    transmission: '6-Speed Manual',
                    fuelCapacity: '15 L',
                    weight: '183 kg',
                    seatHeight: '820 mm',
                    topSpeed: '200 km/h',
                    acceleration: '0-100 km/h in 3.5s'
                },
                features: [
                    { icon: 'fas fa-bolt', title: 'Quick Shifter', description: 'Seamless gear changes' },
                    { icon: 'fas fa-cog', title: 'Ride Modes', description: 'Multiple riding modes' },
                    { icon: 'fas fa-shield-alt', title: 'ABS', description: 'Anti-lock braking system' },
                    { icon: 'fas fa-tachometer-alt', title: 'Digital Display', description: 'Advanced instrument cluster' }
                ],
                rating: 4.8,
                totalReviews: 89,
                reviews: [
                    {
                        id: 1,
                        user: 'Luca Rossi',
                        rating: 5,
                        comment: 'Incredible Italian engineering! Perfect balance of performance and comfort.',
                        date: '2024-01-17'
                    }
                ]
            }
        };

        this.bikeData = mockBikes[this.bikeId] || mockBikes['1'];
        this.renderBikeDetails();
    }

    renderBikeDetails() {
        if (!this.bikeData) {
            this.showError();
            return;
        }

        // Hide loading, show content
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('bikeDetailsContent').style.display = 'block';

        // Update page title and breadcrumb
        document.title = `${this.bikeData.brand} ${this.bikeData.model} - SpinGo`;
        document.getElementById('bikeBreadcrumb').textContent = `${this.bikeData.brand} ${this.bikeData.model}`;

        // Update header
        document.getElementById('bikeTitle').textContent = `${this.bikeData.brand} ${this.bikeData.model}`;
        document.getElementById('bikeSubtitle').textContent = `${this.bikeData.year} • High-Performance Sports Bike`;

        // Update availability badge
        const availabilityBadge = document.getElementById('availabilityBadge');
        availabilityBadge.textContent = this.bikeData.status === 'AVAILABLE' ? 'Available' : this.bikeData.status;
        availabilityBadge.className = `badge fs-6 ${this.bikeData.status === 'AVAILABLE' ? 'bg-success' : 'bg-danger'}`;

        // Update main image
        document.getElementById('mainBikeImage').src = this.bikeData.imageUrl;
        document.getElementById('mainBikeImage').alt = `${this.bikeData.brand} ${this.bikeData.model}`;

        // Create thumbnails (using same image for now)
        const thumbnailGallery = document.getElementById('thumbnailGallery');
        thumbnailGallery.innerHTML = `
            <img src="${this.bikeData.imageUrl}" alt="Thumbnail 1" class="thumbnail active" onclick="bikeDetailsPage.changeMainImage(this.src)">
            <img src="${this.bikeData.imageUrl}" alt="Thumbnail 2" class="thumbnail" onclick="bikeDetailsPage.changeMainImage(this.src)">
            <img src="${this.bikeData.imageUrl}" alt="Thumbnail 3" class="thumbnail" onclick="bikeDetailsPage.changeMainImage(this.src)">
        `;

        // Update specifications
        this.renderSpecifications();

        // Update features
        this.renderFeatures();

        // Update description
        document.getElementById('bikeDescription').textContent = this.bikeData.description;

        // Update pricing
        document.getElementById('pricePerHour').textContent = `₹${this.bikeData.pricePerHour.toLocaleString()}`;
        document.getElementById('pricePerDay').textContent = `₹${this.bikeData.pricePerDay.toLocaleString()}`;
        document.getElementById('pricePerMonth').textContent = `₹${this.bikeData.pricePerMonth.toLocaleString()}`;

        // Update reviews
        this.renderReviews();

        // Load similar bikes
        this.loadSimilarBikes();
    }

    renderSpecifications() {
        const specsContainer = document.getElementById('bikeSpecs');
        specsContainer.innerHTML = '';

        Object.entries(this.bikeData.specifications).forEach(([key, value]) => {
            const specItem = document.createElement('div');
            specItem.className = 'spec-item';
            specItem.innerHTML = `
                <span class="spec-label">${this.formatSpecLabel(key)}</span>
                <span class="spec-value">${value}</span>
            `;
            specsContainer.appendChild(specItem);
        });
    }

    renderFeatures() {
        const featuresContainer = document.getElementById('bikeFeatures');
        featuresContainer.innerHTML = '';

        this.bikeData.features.forEach(feature => {
            const featureCol = document.createElement('div');
            featureCol.className = 'col-md-6 mb-3';
            featureCol.innerHTML = `
                <div class="d-flex align-items-start">
                    <div class="feature-icon me-3">
                        <i class="${feature.icon}"></i>
                    </div>
                    <div>
                        <h6 class="mb-1">${feature.title}</h6>
                        <p class="text-muted mb-0 small">${feature.description}</p>
                    </div>
                </div>
            `;
            featuresContainer.appendChild(featureCol);
        });
    }

    renderReviews() {
        // Update rating summary
        document.getElementById('averageRating').textContent = this.bikeData.rating;
        
        // Update rating stars
        const ratingStars = document.getElementById('ratingStars');
        ratingStars.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = `fas fa-star ${i <= Math.floor(this.bikeData.rating) ? 'text-warning' : 'text-muted'}`;
            ratingStars.appendChild(star);
        }

        document.getElementById('totalReviews').textContent = `Based on ${this.bikeData.totalReviews} reviews`;

        // Render rating breakdown
        this.renderRatingBreakdown();

        // Render recent reviews
        this.renderRecentReviews();
    }

    renderRatingBreakdown() {
        const breakdownContainer = document.getElementById('ratingBreakdown');
        const breakdown = [5, 4, 3, 2, 1];
        const percentages = [85, 12, 2, 1, 0]; // Mock percentages

        breakdownContainer.innerHTML = '';
        breakdown.forEach((rating, index) => {
            const breakdownItem = document.createElement('div');
            breakdownItem.className = 'd-flex align-items-center mb-2';
            breakdownItem.innerHTML = `
                <span class="me-2" style="min-width: 20px;">${rating}★</span>
                <div class="progress flex-grow-1 me-2" style="height: 8px;">
                    <div class="progress-bar bg-warning" style="width: ${percentages[index]}%"></div>
                </div>
                <span class="text-muted small">${percentages[index]}%</span>
            `;
            breakdownContainer.appendChild(breakdownItem);
        });
    }

    renderRecentReviews() {
        const reviewsContainer = document.getElementById('recentReviews');
        reviewsContainer.innerHTML = '';

        this.bikeData.reviews.slice(0, 3).forEach(review => {
            const reviewItem = document.createElement('div');
            reviewItem.className = 'review-item';
            reviewItem.innerHTML = `
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        ${review.user.charAt(0)}
                    </div>
                    <div>
                        <h6 class="mb-1">${review.user}</h6>
                        <div class="rating-stars">
                            ${this.generateStars(review.rating)}
                        </div>
                    </div>
                    <small class="text-muted ms-auto">${this.formatDate(review.date)}</small>
                </div>
                <p class="mb-0">${review.comment}</p>
            `;
            reviewsContainer.appendChild(reviewItem);
        });
    }

    loadSimilarBikes() {
        const similarBikesContainer = document.getElementById('similarBikes');
        const similarBikes = [
            {
                id: 2,
                brand: 'Yamaha',
                model: 'R1',
                imageUrl: 'images/yamaha-r1.jpg',
                pricePerDay: 3600
            },
            {
                id: 3,
                brand: 'Kawasaki',
                model: 'Ninja ZX-10R',
                imageUrl: 'images/kawasaki-ninja.jpg',
                pricePerDay: 3300
            }
        ].filter(bike => bike.id !== this.bikeData.id);

        similarBikesContainer.innerHTML = '';
        similarBikes.forEach(bike => {
            const bikeCard = document.createElement('div');
            bikeCard.className = 'similar-bike-card';
            bikeCard.onclick = () => window.location.href = `bike-details.html?id=${bike.id}`;
            bikeCard.innerHTML = `
                <img src="${bike.imageUrl}" alt="${bike.brand} ${bike.model}" class="similar-bike-image mb-2">
                <h6 class="mb-1">${bike.brand} ${bike.model}</h6>
                <p class="text-muted mb-0">₹${bike.pricePerDay.toLocaleString()}/day</p>
            `;
            similarBikesContainer.appendChild(bikeCard);
        });
    }

    setupEventListeners() {
        // Rent Now button
        document.getElementById('rentNowBtn').addEventListener('click', () => {
            this.rentBike();
        });

        // Add to Cart button
        document.getElementById('addToCartBtn').addEventListener('click', () => {
            this.addToCart();
        });

        // Save for Later button
        document.getElementById('saveForLaterBtn').addEventListener('click', () => {
            this.saveForLater();
        });
    }

    changeMainImage(imageSrc) {
        document.getElementById('mainBikeImage').src = imageSrc;
        
        // Update active thumbnail
        document.querySelectorAll('.thumbnail').forEach(thumb => {
            thumb.classList.remove('active');
        });
        event.target.classList.add('active');
    }

    rentBike() {
        // Check if user is authenticated
        if (window.authManager && window.authManager.isAuthenticated()) {
            // Store bike data in sessionStorage for booking page
            sessionStorage.setItem('selectedBike', JSON.stringify(this.bikeData));
            window.location.href = 'booking.html';
        } else {
            this.showAlert('Please login to rent a bike. <a href="login.html" class="alert-link">Click here to login</a>', 'warning');
        }
    }

    addToCart() {
        // Check if user is authenticated
        if (window.authManager && window.authManager.isAuthenticated()) {
            // Add bike to cart (implement cart functionality)
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingItem = cart.find(item => item.id === this.bikeData.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: this.bikeData.id,
                    brand: this.bikeData.brand,
                    model: this.bikeData.model,
                    pricePerDay: this.bikeData.pricePerDay,
                    imageUrl: this.bikeData.imageUrl,
                    quantity: 1
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Show success message
            this.showAlert('Bike added to cart successfully!', 'success');
        } else {
            this.showAlert('Please login to add items to cart. <a href="login.html" class="alert-link">Click here to login</a>', 'warning');
        }
    }

    saveForLater() {
        // Check if user is authenticated
        if (window.authManager && window.authManager.isAuthenticated()) {
            // Save bike for later (implement wishlist functionality)
            const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            const existingItem = wishlist.find(item => item.id === this.bikeData.id);
            
            if (!existingItem) {
                wishlist.push({
                    id: this.bikeData.id,
                    brand: this.bikeData.brand,
                    model: this.bikeData.model,
                    pricePerDay: this.bikeData.pricePerDay,
                    imageUrl: this.bikeData.imageUrl,
                    savedAt: new Date().toISOString()
                });
                
                localStorage.setItem('wishlist', JSON.stringify(wishlist));
                this.showAlert('Bike saved for later!', 'success');
            } else {
                this.showAlert('Bike is already in your wishlist!', 'info');
            }
        } else {
            this.showAlert('Please login to save bikes for later. <a href="login.html" class="alert-link">Click here to login</a>', 'warning');
        }
    }

    updateButtonVisibility() {
        const rentBtn = document.getElementById('rentNowBtn');
        const cartBtn = document.getElementById('addToCartBtn');
        const saveBtn = document.getElementById('saveForLaterBtn');
        
        if (window.authManager && window.authManager.isAuthenticated()) {
            // User is logged in - show all buttons
            if (rentBtn) rentBtn.style.display = 'block';
            if (cartBtn) cartBtn.style.display = 'block';
            if (saveBtn) saveBtn.style.display = 'block';
        } else {
            // User is not logged in - show buttons but they will show login prompts when clicked
            if (rentBtn) rentBtn.style.display = 'block';
            if (cartBtn) cartBtn.style.display = 'block';
            if (saveBtn) saveBtn.style.display = 'block';
        }
    }

    setupAuthListener() {
        // Listen for authentication changes and update button visibility
        window.addEventListener('authStateChanged', () => {
            this.updateButtonVisibility();
        });

        // Also listen for storage changes (login/logout from other tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === 'spinGoUser' || e.key === 'user') {
                this.updateButtonVisibility();
            }
        });
    }

    showError() {
        document.getElementById('loadingState').style.display = 'none';
        document.getElementById('errorState').style.display = 'block';
    }

    showAlert(message, type = 'info') {
        const alertContainer = document.createElement('div');
        alertContainer.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="fas fa-info-circle"></i> ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        const container = document.querySelector('.bike-body');
        if (container) {
            container.insertBefore(alertContainer, container.firstChild);
            
            // Auto-dismiss after 5 seconds
            setTimeout(() => {
                const alert = bootstrap.Alert.getInstance(alertContainer.firstElementChild);
                if (alert) alert.close();
            }, 5000);
        }
    }

    // Utility methods
    formatSpecLabel(key) {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    generateStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fas fa-star ${i <= rating ? 'text-warning' : 'text-muted'}"></i>`;
        }
        return stars;
    }

    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    shareBike() {
        if (navigator.share) {
            navigator.share({
                title: `${this.bikeData.brand} ${this.bikeData.model} - SpinGo`,
                text: `Check out this amazing ${this.bikeData.brand} ${this.bikeData.model} available for rent on SpinGo!`,
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showAlert('Link copied to clipboard!', 'success');
            }).catch(() => {
                this.showAlert('Unable to copy link. Please copy manually.', 'warning');
            });
        }
    }

    reportIssue() {
        const issue = prompt('Please describe the issue you found with this bike:');
        if (issue && issue.trim()) {
            // In a real application, this would send the issue to the backend
            console.log('Issue reported:', issue);
            this.showAlert('Thank you for reporting the issue. We will look into it.', 'success');
        }
    }
}

// Initialize the bike details page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.bikeDetailsPage = new BikeDetailsPage();
});
