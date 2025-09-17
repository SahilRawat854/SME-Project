// Signup Form Validation and Management
class SignupManager {
    constructor() {
        this.selectedUserType = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupUserTypeSelection();
        this.setupPasswordToggle();
        this.setupPasswordStrength();
    }

    setupEventListeners() {
        const form = document.getElementById('signupForm');
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Real-time validation
        const inputs = document.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    setupUserTypeSelection() {
        const userTypeCards = document.querySelectorAll('.user-type-card');
        userTypeCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove selected class from all cards
                userTypeCards.forEach(c => c.classList.remove('selected'));
                
                // Add selected class to clicked card
                card.classList.add('selected');
                
                // Store selected user type
                this.selectedUserType = card.dataset.type;
                
                // Clear any previous error
                this.clearError(document.getElementById('userTypeError'));
            });
        });
    }

    setupPasswordToggle() {
        const toggleBtn = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        
        if (toggleBtn && passwordInput) {
            toggleBtn.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                const icon = toggleBtn.querySelector('i');
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            });
        }
    }

    setupPasswordStrength() {
        const passwordInput = document.getElementById('password');
        const strengthBar = document.getElementById('passwordStrength');
        
        if (passwordInput && strengthBar) {
            passwordInput.addEventListener('input', () => {
                const password = passwordInput.value;
                const strength = this.calculatePasswordStrength(password);
                this.updatePasswordStrength(strength, strengthBar);
            });
        }
    }

    calculatePasswordStrength(password) {
        let score = 0;
        const checks = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        Object.values(checks).forEach(check => {
            if (check) score++;
        });

        if (score < 2) return 'weak';
        if (score < 3) return 'fair';
        if (score < 4) return 'good';
        return 'strong';
    }

    updatePasswordStrength(strength, strengthBar) {
        strengthBar.className = `password-strength strength-${strength}`;
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        switch (fieldName) {
            case 'firstName':
            case 'lastName':
                if (!value) {
                    errorMessage = 'This field is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters long';
                    isValid = false;
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    errorMessage = 'Name can only contain letters and spaces';
                    isValid = false;
                }
                break;

            case 'email':
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                }
                break;

            case 'phone':
                if (!value) {
                    errorMessage = 'Phone number is required';
                    isValid = false;
                } else if (!/^[6-9]\d{9}$/.test(value)) {
                    errorMessage = 'Please enter a valid 10-digit Indian mobile number';
                    isValid = false;
                }
                break;

            case 'dateOfBirth':
                if (!value) {
                    errorMessage = 'Date of birth is required';
                    isValid = false;
                } else {
                    const birthDate = new Date(value);
                    const today = new Date();
                    const age = today.getFullYear() - birthDate.getFullYear();
                    
                    if (age < 18) {
                        errorMessage = 'You must be at least 18 years old';
                        isValid = false;
                    } else if (age > 100) {
                        errorMessage = 'Please enter a valid date of birth';
                        isValid = false;
                    }
                }
                break;

            case 'address':
                if (!value) {
                    errorMessage = 'Address is required';
                    isValid = false;
                } else if (value.length < 10) {
                    errorMessage = 'Please provide a complete address';
                    isValid = false;
                }
                break;

            case 'city':
                if (!value) {
                    errorMessage = 'City is required';
                    isValid = false;
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    errorMessage = 'City name can only contain letters and spaces';
                    isValid = false;
                }
                break;

            case 'pincode':
                if (!value) {
                    errorMessage = 'PIN code is required';
                    isValid = false;
                } else if (!/^[1-9][0-9]{5}$/.test(value)) {
                    errorMessage = 'Please enter a valid 6-digit PIN code';
                    isValid = false;
                }
                break;

            case 'password':
                if (!value) {
                    errorMessage = 'Password is required';
                    isValid = false;
                } else if (value.length < 8) {
                    errorMessage = 'Password must be at least 8 characters long';
                    isValid = false;
                } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    errorMessage = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
                    isValid = false;
                }
                break;

            case 'confirmPassword':
                const password = document.getElementById('password').value;
                if (!value) {
                    errorMessage = 'Please confirm your password';
                    isValid = false;
                } else if (value !== password) {
                    errorMessage = 'Passwords do not match';
                    isValid = false;
                }
                break;
        }

        this.showFieldError(fieldName, errorMessage, isValid);
        return isValid;
    }

    showFieldError(fieldName, message, isValid) {
        const errorElement = document.getElementById(`${fieldName}Error`);
        if (errorElement) {
            if (isValid) {
                errorElement.textContent = '';
                errorElement.className = 'validation-success';
            } else {
                errorElement.textContent = message;
                errorElement.className = 'validation-error';
            }
        }
    }

    clearError(field) {
        const fieldName = field.name || field.id.replace('Error', '');
        const errorElement = document.getElementById(`${fieldName}Error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.className = 'validation-error';
        }
    }

    validateUserType() {
        if (!this.selectedUserType) {
            const errorElement = document.getElementById('userTypeError');
            if (errorElement) {
                errorElement.textContent = 'Please select your user type';
                errorElement.className = 'validation-error';
            }
            return false;
        }
        return true;
    }

    validateTerms() {
        const termsCheckbox = document.getElementById('terms');
        const errorElement = document.getElementById('termsError');
        
        if (!termsCheckbox.checked) {
            if (errorElement) {
                errorElement.textContent = 'You must agree to the terms and conditions';
                errorElement.className = 'validation-error';
            }
            return false;
        }
        return true;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Clear all previous errors
        this.clearAllErrors();
        
        // Validate user type
        if (!this.validateUserType()) {
            return;
        }
        
        // Validate terms
        if (!this.validateTerms()) {
            return;
        }
        
        // Validate all fields
        const form = document.getElementById('signupForm');
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (!isFormValid) {
            this.showAlert('Please fix all validation errors before submitting.', 'danger');
            return;
        }
        
        // Show loading state
        this.showLoading();
        
        try {
            // Collect form data
            const formData = this.collectFormData();
            
            // Simulate API call
            await this.submitSignup(formData);
            
            // Show success message
            this.showAlert('Account created successfully! Redirecting to login...', 'success');
            
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            this.showAlert('Failed to create account. Please try again.', 'danger');
            console.error('Signup error:', error);
        } finally {
            this.hideLoading();
        }
    }

    collectFormData() {
        const form = document.getElementById('signupForm');
        const formData = new FormData(form);
        
        return {
            userType: this.selectedUserType,
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            dateOfBirth: formData.get('dateOfBirth'),
            address: formData.get('address'),
            city: formData.get('city'),
            pincode: formData.get('pincode'),
            password: formData.get('password'),
            terms: formData.get('terms') === 'on'
        };
    }

    async submitSignup(formData) {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real application, you would make an API call here
        // const response = await fetch('/api/auth/signup', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(formData)
        // });
        
        // if (!response.ok) {
        //     throw new Error('Signup failed');
        // }
        
        console.log('Signup data:', formData);
    }

    clearAllErrors() {
        const errorElements = document.querySelectorAll('.validation-error, .validation-success');
        errorElements.forEach(element => {
            element.textContent = '';
            element.className = 'validation-error';
        });
    }

    showLoading() {
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Creating Account...';
            submitBtn.disabled = true;
        }
    }

    hideLoading() {
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-user-plus me-2"></i>Create Account';
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
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        // Insert alert at the top of the form
        const form = document.getElementById('signupForm');
        form.insertBefore(alertContainer, form.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = bootstrap.Alert.getInstance(alertContainer.firstElementChild);
            if (alert) alert.close();
        }, 5000);
    }
}

// Initialize signup manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.signupManager = new SignupManager();
});
