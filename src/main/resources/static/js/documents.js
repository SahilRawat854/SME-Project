// Document Upload and Verification Management
class DocumentsManager {
    constructor() {
        this.uploadedDocuments = {
            license: null,
            aadhaar: null,
            pan: null,
            bank: null
        };
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.loadExistingDocuments();
    }

    setupEventListeners() {
        // File input change events
        const fileInputs = {
            license: document.getElementById('licenseFile'),
            aadhaar: document.getElementById('aadhaarFile'),
            pan: document.getElementById('panFile'),
            bank: document.getElementById('bankFile')
        };

        Object.keys(fileInputs).forEach(docType => {
            const input = fileInputs[docType];
            if (input) {
                input.addEventListener('change', (e) => {
                    this.handleFileSelect(e, docType);
                });
            }
        });

        // Upload area click events
        const uploadAreas = {
            license: document.getElementById('licenseUpload'),
            aadhaar: document.getElementById('aadhaarUpload'),
            pan: document.getElementById('panUpload'),
            bank: document.getElementById('bankUpload')
        };

        Object.keys(uploadAreas).forEach(docType => {
            const area = uploadAreas[docType];
            if (area) {
                area.addEventListener('click', () => {
                    fileInputs[docType].click();
                });
            }
        });

        // Submit button
        const submitBtn = document.getElementById('submitDocuments');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => this.submitDocuments());
        }
    }

    setupDragAndDrop() {
        const uploadAreas = {
            license: document.getElementById('licenseUpload'),
            aadhaar: document.getElementById('aadhaarUpload'),
            pan: document.getElementById('panUpload'),
            bank: document.getElementById('bankUpload')
        };

        Object.keys(uploadAreas).forEach(docType => {
            const area = uploadAreas[docType];
            if (area) {
                area.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    area.classList.add('dragover');
                });

                area.addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    area.classList.remove('dragover');
                });

                area.addEventListener('drop', (e) => {
                    e.preventDefault();
                    area.classList.remove('dragover');
                    
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                        this.handleFileSelect({ target: { files: files } }, docType);
                    }
                });
            }
        });
    }

    handleFileSelect(event, docType) {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file
        if (!this.validateFile(file, docType)) {
            return;
        }

        // Store file
        this.uploadedDocuments[docType] = file;

        // Update UI
        this.updateUploadArea(docType, file);
        this.updateProgress();
    }

    validateFile(file, docType) {
        const maxSizes = {
            license: 5 * 1024 * 1024, // 5MB
            aadhaar: 5 * 1024 * 1024, // 5MB
            pan: 5 * 1024 * 1024, // 5MB
            bank: 10 * 1024 * 1024 // 10MB
        };

        const allowedTypes = {
            license: ['image/jpeg', 'image/jpg', 'image/png'],
            aadhaar: ['image/jpeg', 'image/jpg', 'image/png'],
            pan: ['image/jpeg', 'image/jpg', 'image/png'],
            bank: ['application/pdf']
        };

        // Check file size
        if (file.size > maxSizes[docType]) {
            this.showAlert(`File size should be less than ${maxSizes[docType] / (1024 * 1024)}MB`, 'warning');
            return false;
        }

        // Check file type
        if (!allowedTypes[docType].includes(file.type)) {
            const allowedExtensions = docType === 'bank' ? 'PDF' : 'JPG, PNG';
            this.showAlert(`Please upload a ${allowedExtensions} file`, 'warning');
            return false;
        }

        return true;
    }

    updateUploadArea(docType, file) {
        const uploadArea = document.getElementById(`${docType}Upload`);
        const card = document.getElementById(`${docType}Card`);
        const status = document.getElementById(`${docType}Status`);

        if (uploadArea && card && status) {
            // Update upload area
            uploadArea.innerHTML = `
                <div class="file-preview">
                    <div class="file-info">
                        <div class="file-icon">
                            <i class="fas fa-${docType === 'bank' ? 'file-pdf' : 'file-image'}"></i>
                        </div>
                        <div class="file-details">
                            <h6>${file.name}</h6>
                            <small>${this.formatFileSize(file.size)}</small>
                        </div>
                        <button class="btn btn-sm btn-outline-danger" onclick="documentsManager.removeFile('${docType}')">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `;

            // Update card status
            card.classList.add('uploaded');
            uploadArea.classList.add('uploaded');

            // Show status
            status.style.display = 'flex';
            status.innerHTML = `
                <span class="status-badge status-pending">Pending Verification</span>
                <i class="fas fa-clock text-warning"></i>
            `;
        }
    }

    removeFile(docType) {
        this.uploadedDocuments[docType] = null;
        this.resetUploadArea(docType);
        this.updateProgress();
    }

    resetUploadArea(docType) {
        const uploadArea = document.getElementById(`${docType}Upload`);
        const card = document.getElementById(`${docType}Card`);
        const status = document.getElementById(`${docType}Status`);

        if (uploadArea && card && status) {
            // Reset upload area
            uploadArea.innerHTML = `
                <div class="upload-icon">
                    <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <h6>Upload ${this.getDocumentName(docType)}</h6>
                <p class="text-muted mb-3">Drag & drop or click to browse</p>
                <button class="btn btn-outline-primary">Choose File</button>
            `;

            // Reset card status
            card.classList.remove('uploaded', 'verified', 'rejected');
            uploadArea.classList.remove('uploaded');

            // Hide status
            status.style.display = 'none';
        }
    }

    getDocumentName(docType) {
        const names = {
            license: 'Driving License',
            aadhaar: 'Aadhaar Card',
            pan: 'PAN Card',
            bank: 'Bank Statement'
        };
        return names[docType] || docType;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    updateProgress() {
        const uploadedCount = Object.values(this.uploadedDocuments).filter(doc => doc !== null).length;
        const totalCount = Object.keys(this.uploadedDocuments).length;
        const percentage = (uploadedCount / totalCount) * 100;

        // Update progress bar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }

        // Update badge
        const badge = document.querySelector('.badge.bg-primary');
        if (badge) {
            badge.textContent = `${uploadedCount} of ${totalCount} documents uploaded`;
        }

        // Update submit button
        const submitBtn = document.getElementById('submitDocuments');
        if (submitBtn) {
            if (uploadedCount === totalCount) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Submit for Verification';
            } else {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i>Upload ${totalCount - uploadedCount} more documents`;
            }
        }
    }

    async submitDocuments() {
        const uploadedCount = Object.values(this.uploadedDocuments).filter(doc => doc !== null).length;
        
        if (uploadedCount === 0) {
            this.showAlert('Please upload at least one document', 'warning');
            return;
        }

        // Show loading state
        this.showLoading();

        try {
            // Simulate document submission
            await this.submitToVerification();
            
            // Show success message
            this.showAlert('Documents submitted successfully! Verification will be completed within 24 hours.', 'success');
            
            // Update UI to show pending status
            this.updateAllStatuses('pending');
            
            // Redirect to dashboard after 3 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 3000);

        } catch (error) {
            this.showAlert('Failed to submit documents. Please try again.', 'danger');
            console.error('Document submission error:', error);
        } finally {
            this.hideLoading();
        }
    }

    async submitToVerification() {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // In a real application, you would upload files to a server here
        // const formData = new FormData();
        // Object.keys(this.uploadedDocuments).forEach(docType => {
        //     if (this.uploadedDocuments[docType]) {
        //         formData.append(docType, this.uploadedDocuments[docType]);
        //     }
        // });
        
        // const response = await fetch('/api/documents/upload', {
        //     method: 'POST',
        //     body: formData
        // });
        
        // if (!response.ok) {
        //     throw new Error('Document upload failed');
        // }
        
        console.log('Documents submitted for verification:', this.uploadedDocuments);
    }

    updateAllStatuses(status) {
        const statusConfig = {
            pending: {
                badge: 'status-pending',
                text: 'Pending Verification',
                icon: 'fas fa-clock text-warning'
            },
            verified: {
                badge: 'status-verified',
                text: 'Verified',
                icon: 'fas fa-check-circle text-success'
            },
            rejected: {
                badge: 'status-rejected',
                text: 'Rejected',
                icon: 'fas fa-times-circle text-danger'
            }
        };

        Object.keys(this.uploadedDocuments).forEach(docType => {
            if (this.uploadedDocuments[docType]) {
                const statusElement = document.getElementById(`${docType}Status`);
                const card = document.getElementById(`${docType}Card`);
                
                if (statusElement && card) {
                    const config = statusConfig[status];
                    statusElement.innerHTML = `
                        <span class="status-badge ${config.badge}">${config.text}</span>
                        <i class="${config.icon}"></i>
                    `;
                    
                    card.classList.remove('uploaded', 'verified', 'rejected');
                    card.classList.add(status);
                }
            }
        });
    }

    loadExistingDocuments() {
        // Simulate loading existing documents
        // In a real application, you would fetch this from an API
        const existingDocs = {
            license: { name: 'driving_license.jpg', size: 2048576, status: 'verified' },
            aadhaar: { name: 'aadhaar_card.jpg', size: 1536000, status: 'verified' }
        };

        Object.keys(existingDocs).forEach(docType => {
            const doc = existingDocs[docType];
            if (doc) {
                // Create a mock file object
                const mockFile = {
                    name: doc.name,
                    size: doc.size,
                    type: 'image/jpeg'
                };
                
                this.uploadedDocuments[docType] = mockFile;
                this.updateUploadArea(docType, mockFile);
                this.updateStatus(docType, doc.status);
            }
        });

        this.updateProgress();
    }

    updateStatus(docType, status) {
        const statusElement = document.getElementById(`${docType}Status`);
        const card = document.getElementById(`${docType}Card`);
        
        if (statusElement && card) {
            const statusConfig = {
                pending: {
                    badge: 'status-pending',
                    text: 'Pending Verification',
                    icon: 'fas fa-clock text-warning'
                },
                verified: {
                    badge: 'status-verified',
                    text: 'Verified',
                    icon: 'fas fa-check-circle text-success'
                },
                rejected: {
                    badge: 'status-rejected',
                    text: 'Rejected',
                    icon: 'fas fa-times-circle text-danger'
                }
            };

            const config = statusConfig[status];
            statusElement.innerHTML = `
                <span class="status-badge ${config.badge}">${config.text}</span>
                <i class="${config.icon}"></i>
            `;
            
            card.classList.remove('uploaded', 'verified', 'rejected');
            card.classList.add(status);
        }
    }

    showLoading() {
        const submitBtn = document.getElementById('submitDocuments');
        if (submitBtn) {
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Submitting...';
            submitBtn.disabled = true;
        }
    }

    hideLoading() {
        const submitBtn = document.getElementById('submitDocuments');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="fas fa-paper-plane me-2"></i>Submit for Verification';
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
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'times-circle'}"></i>
                ${message}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        // Insert alert at the top of the documents body
        const documentsBody = document.querySelector('.documents-body');
        documentsBody.insertBefore(alertContainer, documentsBody.firstChild);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            const alert = bootstrap.Alert.getInstance(alertContainer.firstElementChild);
            if (alert) alert.close();
        }, 5000);
    }
}

// Initialize documents manager when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth manager first
    if (window.authManager) {
        window.authManager.updateNavigation();
    }
    
    // Initialize documents manager
    window.documentsManager = new DocumentsManager();
});
