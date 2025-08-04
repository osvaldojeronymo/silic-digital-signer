/**
 * Form Validation Module
 * Handles client-side validation following W3C standards and accessibility guidelines
 */

class FormValidator {
    constructor(formElement) {
        this.form = formElement;
        this.rules = new Map();
        this.errors = new Map();
        this.isValid = false;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.defineValidationRules();
    }

    setupEventListeners() {
        // Real-time validation on input
        this.form.addEventListener('input', this.handleInput.bind(this));
        this.form.addEventListener('blur', this.handleBlur.bind(this), true);
        this.form.addEventListener('change', this.handleChange.bind(this));
    }

    defineValidationRules() {
        // Document upload validation
        this.addRule('docUpload', {
            required: true,
            fileSize: 10 * 1024 * 1024, // 10MB
            fileTypes: ['.pdf', '.docx', '.txt'],
            validate: (value, file) => {
                if (!file) {
                    return window.i18n?.getTranslation('error-file-required') || 'Por favor, selecione um documento';
                }

                if (!Utils.isFileTypeAllowed(file.name)) {
                    return window.i18n?.getTranslation('error-file-type') || 'Formato de arquivo não suportado';
                }

                if (file.size > this.rules.get('docUpload').fileSize) {
                    return window.i18n?.getTranslation('error-file-size') || 'O arquivo deve ter no máximo 10MB';
                }

                return null; // Valid
            }
        });

        // Signer name validation
        this.addRule('signerName', {
            required: true,
            minLength: 3,
            maxLength: 100,
            pattern: /^[a-zA-ZÀ-ÿ\s]{3,100}$/,
            validate: (value) => {
                value = value.trim();

                if (!value) {
                    return window.i18n?.getTranslation('error-name-required') || 'Por favor, informe o nome do signatário';
                }

                if (value.length < 3) {
                    return window.i18n?.getTranslation('error-name-min-length') || 'O nome deve ter pelo menos 3 caracteres';
                }

                if (value.length > 100) {
                    return 'O nome deve ter no máximo 100 caracteres';
                }

                if (!/^[a-zA-ZÀ-ÿ\s]{3,100}$/.test(value)) {
                    return 'O nome deve conter apenas letras e espaços';
                }

                return null; // Valid
            }
        });
    }

    addRule(fieldName, rule) {
        this.rules.set(fieldName, rule);
    }

    handleInput(event) {
        const field = event.target;
        if (this.rules.has(field.name)) {
            // Debounced validation for better UX
            clearTimeout(field.validationTimeout);
            field.validationTimeout = setTimeout(() => {
                this.validateField(field);
            }, 300);
        }
    }

    handleBlur(event) {
        const field = event.target;
        if (this.rules.has(field.name)) {
            this.validateField(field);
        }
    }

    handleChange(event) {
        const field = event.target;
        if (field.type === 'file' && this.rules.has(field.name)) {
            this.validateField(field);
        }
    }

    validateField(field) {
        const rule = this.rules.get(field.name);
        if (!rule) return true;

        let value = field.value;
        let file = field.files ? field.files[0] : null;

        // Clear previous error
        this.clearFieldError(field);

        // Run custom validation
        const error = rule.validate(value, file);
        
        if (error) {
            this.setFieldError(field, error);
            return false;
        }

        this.setFieldValid(field);
        return true;
    }

    validateForm() {
        this.errors.clear();
        let isFormValid = true;

        // Validate all fields
        for (let [fieldName, rule] of this.rules) {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                const isFieldValid = this.validateField(field);
                if (!isFieldValid) {
                    isFormValid = false;
                }
            }
        }

        this.isValid = isFormValid;
        return isFormValid;
    }

    setFieldError(field, message) {
        this.errors.set(field.name, message);
        
        // Set ARIA attributes
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', `${field.name}-error`);
        
        // Show error message
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }

        // Add error styling
        field.classList.add('field-error');
        
        // Track validation error
        Utils.trackEvent('validation_error', {
            field: field.name,
            error: message
        });
    }

    clearFieldError(field) {
        this.errors.delete(field.name);
        
        // Remove ARIA attributes
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        
        // Hide error message
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }

        // Remove error styling
        field.classList.remove('field-error');
    }

    setFieldValid(field) {
        this.clearFieldError(field);
        field.setAttribute('aria-invalid', 'false');
        field.classList.add('field-valid');
        
        // Remove valid class after a delay for better UX
        setTimeout(() => {
            field.classList.remove('field-valid');
        }, 2000);
    }

    getFormData() {
        if (!this.isValid) {
            throw new Error('Form is not valid');
        }

        const formData = new FormData();
        const data = {};

        // Collect form data
        for (let [fieldName] of this.rules) {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                if (field.type === 'file') {
                    const file = field.files[0];
                    if (file) {
                        formData.append(fieldName, file);
                        data[fieldName] = {
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            lastModified: file.lastModified
                        };
                    }
                } else {
                    const value = field.value.trim();
                    formData.append(fieldName, value);
                    data[fieldName] = value;
                }
            }
        }

        return { formData, data };
    }

    getErrors() {
        return Array.from(this.errors.entries());
    }

    hasErrors() {
        return this.errors.size > 0;
    }

    reset() {
        this.errors.clear();
        this.isValid = false;
        
        // Clear all field errors
        for (let [fieldName] of this.rules) {
            const field = this.form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                this.clearFieldError(field);
            }
        }
    }

    focusFirstError() {
        if (this.errors.size > 0) {
            const firstErrorField = this.errors.keys().next().value;
            const field = this.form.querySelector(`[name="${firstErrorField}"]`);
            if (field) {
                field.focus();
                Utils.scrollToElement(field.id);
            }
        }
    }
}

// Export for use in other modules
window.FormValidator = FormValidator;
