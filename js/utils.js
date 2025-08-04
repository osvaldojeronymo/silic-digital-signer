/**
 * Utility Functions
 * Common helper functions following best practices
 */

const Utils = {
    /**
     * Sanitize HTML to prevent XSS attacks
     * @param {string} str - String to sanitize
     * @returns {string} Sanitized string
     */
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    },

    /**
     * Debounce function to limit function calls
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} Debounced function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Format file size for display
     * @param {number} bytes - File size in bytes
     * @returns {string} Formatted file size
     */
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Check if file type is allowed
     * @param {string} fileName - Name of the file
     * @param {Array} allowedTypes - Array of allowed file extensions
     * @returns {boolean} True if file type is allowed
     */
    isFileTypeAllowed(fileName, allowedTypes = ['.pdf', '.docx', '.txt']) {
        const fileExtension = '.' + fileName.split('.').pop().toLowerCase();
        return allowedTypes.includes(fileExtension);
    },

    /**
     * Get file size from File object
     * @param {File} file - File object
     * @returns {number} File size in bytes
     */
    getFileSize(file) {
        return file ? file.size : 0;
    },

    /**
     * Show alert message
     * @param {string} message - Message to display
     * @param {string} type - Alert type (success, error, warning, info)
     * @param {number} duration - Duration to show alert (0 = permanent)
     */
    showAlert(message, type = 'info', duration = 5000) {
        const container = document.getElementById('alert-container');
        if (!container) return;

        const alertId = 'alert-' + Date.now();
        const alertElement = document.createElement('div');
        alertElement.id = alertId;
        alertElement.className = `alert alert-${type}`;
        alertElement.setAttribute('role', 'alert');
        alertElement.innerHTML = `
            <span>${this.sanitizeHTML(message)}</span>
            <button type="button" class="alert-close" aria-label="Fechar alerta" onclick="Utils.closeAlert('${alertId}')">
                &times;
            </button>
        `;

        container.appendChild(alertElement);

        // Auto-remove alert after duration
        if (duration > 0) {
            setTimeout(() => {
                this.closeAlert(alertId);
            }, duration);
        }

        // Focus management for screen readers
        alertElement.focus();
    },

    /**
     * Close alert message
     * @param {string} alertId - ID of alert to close
     */
    closeAlert(alertId) {
        const alert = document.getElementById(alertId);
        if (alert) {
            alert.style.transition = 'opacity 0.3s ease-out';
            alert.style.opacity = '0';
            setTimeout(() => {
                alert.remove();
            }, 300);
        }
    },

    /**
     * Clear all alerts
     */
    clearAlerts() {
        const container = document.getElementById('alert-container');
        if (container) {
            container.innerHTML = '';
        }
    },

    /**
     * Show loading state
     * @param {boolean} show - Whether to show or hide loading
     */
    showLoading(show = true) {
        const loading = document.getElementById('loading');
        const submitBtn = document.querySelector('#signForm button[type="submit"]');
        
        if (loading) {
            if (show) {
                loading.classList.remove('hidden');
                loading.setAttribute('aria-hidden', 'false');
            } else {
                loading.classList.add('hidden');
                loading.setAttribute('aria-hidden', 'true');
            }
        }
        
        if (submitBtn) {
            const btnText = submitBtn.querySelector('.btn-text');
            const btnSpinner = submitBtn.querySelector('.btn-spinner');
            
            if (show) {
                submitBtn.disabled = true;
                if (btnText) btnText.textContent = window.i18n?.getTranslation('signing') || 'Assinando...';
                if (btnSpinner) btnSpinner.classList.remove('hidden');
            } else {
                submitBtn.disabled = false;
                if (btnText) btnText.textContent = window.i18n?.getTranslation('sign-button') || 'Assinar Digitalmente';
                if (btnSpinner) btnSpinner.classList.add('hidden');
            }
        }
    },

    /**
     * Generate unique ID
     * @returns {string} Unique ID
     */
    generateId() {
        return 'id-' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Scroll to element smoothly
     * @param {string} elementId - ID of element to scroll to
     * @param {number} offset - Offset from top in pixels
     */
    scrollToElement(elementId, offset = 0) {
        const element = document.getElementById(elementId);
        if (element) {
            const elementPosition = element.offsetTop - offset;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    },

    /**
     * Set focus to element
     * @param {string} elementId - ID of element to focus
     */
    setFocus(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.focus();
        }
    },

    /**
     * Log error to console and potentially send to monitoring service
     * @param {Error} error - Error object
     * @param {string} context - Context where error occurred
     */
    logError(error, context = '') {
        console.error(`[SILIC Digital Signer] ${context}:`, error);
        
        // In production, you would send this to a monitoring service
        // Example: Analytics.track('error', { message: error.message, context });
    },

    /**
     * Track user interaction for analytics
     * @param {string} action - Action performed
     * @param {Object} properties - Additional properties
     */
    trackEvent(action, properties = {}) {
        // In production, integrate with analytics service
        console.log(`[Analytics] ${action}:`, properties);
        
        // Example integrations:
        // gtag('event', action, properties);
        // analytics.track(action, properties);
    },

    /**
     * Check if device is mobile
     * @returns {boolean} True if mobile device
     */
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    /**
     * Check if browser supports required features
     * @returns {Object} Object with supported features
     */
    checkBrowserSupport() {
        return {
            fileAPI: !!(window.File && window.FileReader && window.FileList && window.Blob),
            localStorage: !!window.localStorage,
            sessionStorage: !!window.sessionStorage,
            addEventListener: !!window.addEventListener,
            querySelector: !!document.querySelector,
            fetch: !!window.fetch
        };
    },

    /**
     * Format date for display
     * @param {Date} date - Date to format
     * @param {string} locale - Locale for formatting
     * @returns {string} Formatted date
     */
    formatDate(date, locale = 'pt-BR') {
        return new Intl.DateTimeFormat(locale, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
};

// Make Utils available globally
window.Utils = Utils;
