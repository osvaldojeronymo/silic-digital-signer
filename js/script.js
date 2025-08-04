/**
 * SILIC Digital Signer - Main Application Script
 * Following international best practices for modern web applications
 */

class DigitalSignerApp {
    constructor() {
        this.formValidator = null;
        this.apiEndpoint = '/api/v1/sign'; // Future API endpoint
        this.maxRetries = 3;
        this.retryDelay = 1000;
        this.init();
    }

    async init() {
        try {
            // Wait for dependencies to load
            await this.waitForDependencies();
            
            // Check browser support
            this.checkBrowserSupport();
            
            // Initialize multiple items manager
            this.multipleItemsManager = new MultipleItemsManager();
            
            // Initialize form validation
            this.initializeFormValidation();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Setup keyboard navigation
            this.setupKeyboardNavigation();
            
            // Initialize performance monitoring
            this.initializePerformanceMonitoring();
            
            Utils.trackEvent('app_initialized', {
                userAgent: navigator.userAgent,
                timestamp: new Date().toISOString()
            });
            
        } catch (error) {
            Utils.logError(error, 'App initialization');
            this.handleCriticalError(error);
        }
    }

    async waitForDependencies() {
        // Wait for i18n to be ready
        let attempts = 0;
        while (!window.i18n && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.i18n) {
            throw new Error('i18n dependency failed to load');
        }
    }

    checkBrowserSupport() {
        const support = Utils.checkBrowserSupport();
        const requiredFeatures = ['fileAPI', 'localStorage', 'addEventListener', 'querySelector'];
        
        const unsupportedFeatures = requiredFeatures.filter(feature => !support[feature]);
        
        if (unsupportedFeatures.length > 0) {
            const message = `Seu navegador não suporta as seguintes funcionalidades necessárias: ${unsupportedFeatures.join(', ')}`;
            Utils.showAlert(message, 'error', 0);
            throw new Error(`Unsupported browser features: ${unsupportedFeatures.join(', ')}`);
        }
    }

    initializeFormValidation() {
        const form = document.getElementById('signForm');
        if (!form) {
            throw new Error('Sign form not found');
        }
        
        this.formValidator = new FormValidator(form);
    }

    setupEventListeners() {
        // Form submission
        const form = document.getElementById('signForm');
        form.addEventListener('submit', this.handleFormSubmit.bind(this));
        
        // File input change for preview
        const fileInput = document.getElementById('docUpload');
        fileInput.addEventListener('change', this.handleFileChange.bind(this));
        
        // New signature button
        const newSignBtn = document.getElementById('newSignBtn');
        if (newSignBtn) {
            newSignBtn.addEventListener('click', this.handleNewSignature.bind(this));
        }
        
        // Download button (will be enabled after successful signing)
        const downloadBtn = document.getElementById('downloadBtn');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', this.handleDownload.bind(this));
        }
        
        // Window events
        window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
        window.addEventListener('online', this.handleOnline.bind(this));
        window.addEventListener('offline', this.handleOffline.bind(this));
    }

    setupKeyboardNavigation() {
        // Escape key to close alerts
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                Utils.clearAlerts();
            }
        });
    }

    initializePerformanceMonitoring() {
        // Monitor performance metrics
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.entryType === 'navigation') {
                            Utils.trackEvent('page_load_performance', {
                                loadTime: entry.loadEventEnd - entry.loadEventStart,
                                domContentLoaded: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
                                firstContentfulPaint: entry.firstContentfulPaint
                            });
                        }
                    }
                });
                
                observer.observe({ entryTypes: ['navigation', 'paint'] });
            } catch (error) {
                Utils.logError(error, 'Performance monitoring setup');
            }
        }
    }

    async handleFormSubmit(event) {
        event.preventDefault();
        
        try {
            Utils.clearAlerts();
            
            // Validate multiple items
            if (!this.multipleItemsManager.validateAll()) {
                return;
            }
            
            // Get form data including multiple items
            const multipleItemsData = this.multipleItemsManager.getFormData();
            
            // Show loading state
            Utils.showLoading(true);
            
            // Track signing attempt
            Utils.trackEvent('signature_attempt', {
                fileCount: multipleItemsData.files.length,
                signerCount: multipleItemsData.signers.length,
                sequentialSigning: multipleItemsData.sequentialSigning,
                hasDocumentAssignment: !!multipleItemsData.documentAssignments
            });
            
            // Simulate signing process
            const result = await this.signMultipleDocuments(multipleItemsData);
            
            // Show success
            this.showMultipleSigningResult(result);
            
            Utils.trackEvent('signature_success', {
                fileCount: multipleItemsData.files.length,
                signerCount: multipleItemsData.signers.length,
                duration: result.duration
            });
            
        } catch (error) {
            Utils.logError(error, 'Form submission');
            this.handleSigningError(error);
        } finally {
            Utils.showLoading(false);
        }
    }

    async signDocument(formData, data) {
        const startTime = Date.now();
        
        // Simulate API call with proper error handling
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random failures for testing error handling
                if (Math.random() < 0.1) { // 10% failure rate
                    reject(new Error('Falha na comunicação com o servidor'));
                    return;
                }
                
                const endTime = Date.now();
                const duration = endTime - startTime;
                
                resolve({
                    success: true,
                    message: window.i18n.getTranslation('success-message', { name: data.signerName }),
                    signedDocument: {
                        originalName: data.docUpload.name,
                        signedName: `signed_${data.docUpload.name}`,
                        size: data.docUpload.size * 1.1, // Slightly larger due to signature
                        signatureDate: new Date().toISOString(),
                        signerName: data.signerName,
                        certificateId: 'CERT-' + Utils.generateId().toUpperCase()
                    },
                    duration
                });
            }, 2000 + Math.random() * 1000); // 2-3 second delay
        });
    }

    async signMultipleDocuments(multipleItemsData) {
        const startTime = Date.now();
        
        // Simulate API call for multiple documents and signers
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random failures for testing error handling
                if (Math.random() < 0.05) { // 5% failure rate
                    reject(new Error('Falha na comunicação com o servidor'));
                    return;
                }
                
                const endTime = Date.now();
                const duration = endTime - startTime;
                
                // Generate signing results for each document and signer combination
                const signingResults = multipleItemsData.files.map(file => {
                    const fileSigners = multipleItemsData.documentAssignments 
                        ? multipleItemsData.signers.filter((signer, index) => 
                            multipleItemsData.documentAssignments[index]?.includes(file.id))
                        : multipleItemsData.signers;
                    
                    return {
                        document: {
                            id: file.id,
                            originalName: file.name,
                            signedName: `signed_${file.name}`,
                            size: file.size * 1.1,
                            type: file.type
                        },
                        signers: fileSigners.map(signer => ({
                            name: signer.name,
                            email: signer.email,
                            role: signer.role,
                            signatureDate: new Date().toISOString(),
                            certificateId: 'CERT-' + Utils.generateId().toUpperCase(),
                            status: multipleItemsData.sequentialSigning && signer.index > 0 ? 'pending' : 'signed'
                        }))
                    };
                });
                
                resolve({
                    success: true,
                    message: `Processo de assinatura iniciado para ${multipleItemsData.files.length} documento(s) e ${multipleItemsData.signers.length} signatário(s)`,
                    signingResults,
                    sequentialSigning: multipleItemsData.sequentialSigning,
                    duration,
                    processId: 'PROC-' + Utils.generateId().toUpperCase()
                });
            }, 3000 + Math.random() * 2000); // 3-5 second delay
        });
    }

    showSigningResult(result) {
        const resultSection = document.getElementById('result');
        const resultMessage = document.getElementById('resultMessage');
        const downloadBtn = document.getElementById('downloadBtn');
        
        if (resultSection && resultMessage) {
            // Create detailed result message
            const resultHTML = `
                <div class="signature-success">
                    <h4>✅ ${result.message}</h4>
                    <div class="signature-details">
                        <p><strong>Documento:</strong> ${Utils.sanitizeHTML(result.signedDocument.originalName)}</p>
                        <p><strong>Data da Assinatura:</strong> ${Utils.formatDate(new Date(result.signedDocument.signatureDate))}</p>
                        <p><strong>Certificado:</strong> ${Utils.sanitizeHTML(result.signedDocument.certificateId)}</p>
                        <p><strong>Tamanho do Arquivo:</strong> ${Utils.formatFileSize(result.signedDocument.size)}</p>
                    </div>
                </div>
            `;
            
            resultMessage.innerHTML = resultHTML;
            resultSection.classList.remove('hidden');
            
            // Enable download button
            if (downloadBtn) {
                downloadBtn.classList.remove('hidden');
                downloadBtn.disabled = false;
                downloadBtn.setAttribute('data-signed-doc', JSON.stringify(result.signedDocument));
            }
            
            // Scroll to result
            Utils.scrollToElement('result', 80);
            
            // Show success alert
            Utils.showAlert('Documento assinado com sucesso!', 'success');
        }
    }

    showMultipleSigningResult(result) {
        const resultSection = document.getElementById('result');
        const resultMessage = document.getElementById('resultMessage');
        const downloadBtn = document.getElementById('downloadBtn');
        
        if (resultSection && resultMessage) {
            // Create detailed result message for multiple documents
            const resultHTML = `
                <div class="signature-success">
                    <h4>✅ ${result.message}</h4>
                    <div class="signature-details">
                        <p><strong>ID do Processo:</strong> ${Utils.sanitizeHTML(result.processId)}</p>
                        <p><strong>Data de Início:</strong> ${Utils.formatDate(new Date())}</p>
                        <p><strong>Tipo de Assinatura:</strong> ${result.sequentialSigning ? 'Sequencial' : 'Paralela'}</p>
                        <p><strong>Total de Documentos:</strong> ${result.signingResults.length}</p>
                    </div>
                    
                    <div class="documents-summary">
                        <h5>Resumo dos Documentos:</h5>
                        ${result.signingResults.map(docResult => `
                            <div class="document-result-item">
                                <div class="document-info">
                                    <strong>${Utils.sanitizeHTML(docResult.document.originalName)}</strong>
                                    <span class="file-size">(${Utils.formatFileSize(docResult.document.size)})</span>
                                </div>
                                <div class="signers-status">
                                    ${docResult.signers.map(signer => `
                                        <div class="signer-status ${signer.status}">
                                            <i class="fas fa-${signer.status === 'signed' ? 'check-circle' : 'clock'}"></i>
                                            ${Utils.sanitizeHTML(signer.name)} (${Utils.sanitizeHTML(signer.role)})
                                            ${signer.status === 'signed' ? '- Assinado' : '- Pendente'}
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    
                    ${result.sequentialSigning ? `
                        <div class="sequential-info">
                            <p><strong>Próximos Passos:</strong></p>
                            <ul>
                                <li>Os signatários receberão convites por e-mail na ordem definida</li>
                                <li>Cada signatário poderá assinar apenas após o anterior concluir</li>
                                <li>Você receberá notificações sobre o progresso</li>
                            </ul>
                        </div>
                    ` : `
                        <div class="parallel-info">
                            <p><strong>Próximos Passos:</strong></p>
                            <ul>
                                <li>Todos os signatários receberão convites por e-mail simultaneamente</li>
                                <li>Cada um pode assinar independentemente</li>
                                <li>Você receberá notificações conforme as assinaturas forem concluídas</li>
                            </ul>
                        </div>
                    `}
                </div>
            `;
            
            resultMessage.innerHTML = resultHTML;
            resultSection.classList.remove('hidden');
            
            // Enable download button
            if (downloadBtn) {
                downloadBtn.classList.remove('hidden');
                downloadBtn.disabled = false;
                downloadBtn.textContent = 'Baixar Relatório do Processo';
                downloadBtn.setAttribute('data-process-data', JSON.stringify(result));
            }
            
            // Scroll to result
            Utils.scrollToElement('result', 80);
            
            // Show success alert
            Utils.showAlert('Processo de assinatura iniciado com sucesso!', 'success');
        }
    }

    handleSigningError(error) {
        Utils.showAlert(
            `Erro ao assinar o documento: ${error.message}`, 
            'error', 
            0
        );
        
        Utils.trackEvent('signature_error', {
            error: error.message,
            stack: error.stack
        });
    }

    handleFileChange(event) {
        const file = event.target.files[0];
        if (file) {
            // Show file information
            const fileInfo = `
                Arquivo selecionado: ${Utils.sanitizeHTML(file.name)} 
                (${Utils.formatFileSize(file.size)})
            `;
            
            Utils.showAlert(fileInfo, 'info', 3000);
            
            Utils.trackEvent('file_selected', {
                fileName: file.name,
                fileSize: file.size,
                fileType: file.type
            });
        }
    }

    handleNewSignature() {
        // Reset form
        const form = document.getElementById('signForm');
        form.reset();
        
        // Clear multiple items
        this.multipleItemsManager.clearAllFiles();
        
        // Reset signers to just one
        const signersContainer = document.getElementById('signersContainer');
        const signers = Array.from(signersContainer.children);
        signers.slice(1).forEach(signer => signer.remove()); // Keep only first signer
        
        // Reset first signer
        const firstSigner = signersContainer.children[0];
        const inputs = firstSigner.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.value = '';
            input.classList.remove('field-error');
        });
        firstSigner.querySelector('.error-message').textContent = '';
        
        // Reset checkboxes
        document.getElementById('sequentialSigning').checked = false;
        document.getElementById('enableDocumentAssignment').checked = false;
        document.getElementById('documentAssignmentContainer').classList.add('hidden');
        
        // Hide result section
        const resultSection = document.getElementById('result');
        resultSection.classList.add('hidden');
        
        // Clear alerts
        Utils.clearAlerts();
        
        // Focus first field
        const firstField = form.querySelector('input');
        if (firstField) {
            firstField.focus();
        }
        
        Utils.trackEvent('new_signature_started');
    }

    handleDownload() {
        const downloadBtn = document.getElementById('downloadBtn');
        const processData = downloadBtn.getAttribute('data-process-data');
        
        if (processData) {
            try {
                const result = JSON.parse(processData);
                this.simulateProcessReportDownload(result);
                
                Utils.trackEvent('process_report_downloaded', {
                    processId: result.processId,
                    documentCount: result.signingResults.length
                });
                
            } catch (error) {
                Utils.logError(error, 'Process report download');
                Utils.showAlert('Erro ao baixar o relatório do processo', 'error');
            }
        }
    }

    simulateDownload(doc) {
        // Create a blob with some sample content
        const content = `
DOCUMENTO ASSINADO DIGITALMENTE
================================

Documento Original: ${doc.originalName}
Signatário: ${doc.signerName}
Data da Assinatura: ${Utils.formatDate(new Date(doc.signatureDate))}
Certificado: ${doc.certificateId}

Este é um arquivo de demonstração do protótipo SILIC Digital Signer.
Em um ambiente de produção, este seria o documento real assinado digitalmente.
        `;
        
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.signedName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        Utils.showAlert('Download iniciado!', 'success', 3000);
    }

    simulateProcessReportDownload(result) {
        // Create a detailed process report
        const content = `
RELATÓRIO DO PROCESSO DE ASSINATURA DIGITAL
==========================================

ID do Processo: ${result.processId}
Data de Início: ${Utils.formatDate(new Date())}
Tipo de Assinatura: ${result.sequentialSigning ? 'Sequencial' : 'Paralela'}
Total de Documentos: ${result.signingResults.length}

DOCUMENTOS E SIGNATÁRIOS
========================

${result.signingResults.map((docResult, index) => `
${index + 1}. Documento: ${docResult.document.originalName}
   Tamanho: ${Utils.formatFileSize(docResult.document.size)}
   Signatários:
${docResult.signers.map(signer => `   - ${signer.name} (${signer.email}) - ${signer.role}
     Status: ${signer.status === 'signed' ? 'Assinado' : 'Pendente'}
     ${signer.status === 'signed' ? `Certificado: ${signer.certificateId}` : ''}
     ${signer.status === 'signed' ? `Data: ${Utils.formatDate(new Date(signer.signatureDate))}` : ''}`).join('\n')}
`).join('\n')}

PRÓXIMOS PASSOS
===============

${result.sequentialSigning ? `
- Os signatários receberão convites por e-mail na ordem definida
- Cada signatário poderá assinar apenas após o anterior concluir
- Notificações serão enviadas sobre o progresso
` : `
- Todos os signatários receberão convites por e-mail simultaneamente
- Cada um pode assinar independentemente
- Notificações serão enviadas conforme as assinaturas forem concluídas
`}

Este é um relatório de demonstração do protótipo SILIC Digital Signer.
Em um ambiente de produção, este seria o relatório real do processo de assinatura.
        `;
        
        const blob = new Blob([content], { type: 'text/plain; charset=utf-8' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `relatorio_processo_${result.processId}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        Utils.showAlert('Download do relatório iniciado!', 'success', 3000);
    }

    handleBeforeUnload(event) {
        // Warn user if form has unsaved data
        const form = document.getElementById('signForm');
        const formData = new FormData(form);
        
        let hasData = false;
        for (let [key, value] of formData.entries()) {
            if (value && value.toString().trim()) {
                hasData = true;
                break;
            }
        }
        
        if (hasData) {
            event.preventDefault();
            event.returnValue = 'Você tem dados não salvos. Tem certeza que deseja sair?';
            return event.returnValue;
        }
    }

    handleOnline() {
        Utils.showAlert('Conexão restaurada', 'success', 3000);
    }

    handleOffline() {
        Utils.showAlert('Você está offline. Algumas funcionalidades podem não estar disponíveis.', 'warning', 0);
    }

    handleCriticalError(error) {
        const errorMessage = `
            Ocorreu um erro crítico na aplicação. Por favor, recarregue a página.
            Se o problema persistir, entre em contato com o suporte técnico.
            
            Erro: ${error.message}
        `;
        
        Utils.showAlert(errorMessage, 'error', 0);
    }
}

/**
 * Navigation function for portal return
 */
function voltarAoPortal() {
    // Track the navigation event
    Utils.trackEvent('voltar_portal_clicked', {
        timestamp: new Date().toISOString(),
        currentPage: window.location.href
    });
    
    // In production, this would navigate to the actual portal
    // For now, we'll show a confirmation dialog
    const confirmReturn = confirm('Deseja realmente voltar ao Portal SILIC 2.0?');
    
    if (confirmReturn) {
        // Simulate navigation to portal
        // In production: window.location.href = '/portal';
        Utils.showAlert('Redirecionando para o Portal SILIC 2.0...', 'info', 2000);
        
        setTimeout(() => {
            // In a real scenario, this would be a redirect
            console.log('Navegando para: /portal/silic');
        }, 2000);
    }
}

/**
 * Multiple Documents and Signers Manager
 */
class MultipleItemsManager {
    constructor() {
        this.selectedFiles = [];
        this.signers = [];
        this.maxFiles = 10;
        this.maxSigners = 10;
        this.maxFileSize = 10 * 1024 * 1024; // 10MB
        this.init();
    }

    init() {
        this.setupFileHandling();
        this.setupSignerManagement();
        this.setupDocumentAssignment();
    }

    setupFileHandling() {
        const fileInput = document.getElementById('docUpload');
        const selectedFilesContainer = document.getElementById('selectedFiles');
        const filesList = document.getElementById('filesList');
        const clearFilesBtn = document.getElementById('clearFiles');

        fileInput.addEventListener('change', (event) => {
            this.handleFileSelection(event.target.files);
        });

        clearFilesBtn.addEventListener('click', () => {
            this.clearAllFiles();
        });
    }

    handleFileSelection(files) {
        const fileArray = Array.from(files);
        
        // Validate file count
        if (this.selectedFiles.length + fileArray.length > this.maxFiles) {
            Utils.showAlert(`Máximo de ${this.maxFiles} arquivos permitidos`, 'error');
            return;
        }

        // Validate and add files
        fileArray.forEach(file => {
            if (this.validateFile(file)) {
                this.addFile(file);
            }
        });

        this.updateFileDisplay();
        this.updateDocumentAssignmentMatrix();
    }

    validateFile(file) {
        // Check file size
        if (file.size > this.maxFileSize) {
            Utils.showAlert(`Arquivo "${file.name}" excede o tamanho máximo de ${Utils.formatFileSize(this.maxFileSize)}`, 'error');
            return false;
        }

        // Check file type
        const allowedTypes = ['.pdf', '.docx', '.txt'];
        if (!Utils.isFileTypeAllowed(file.name, allowedTypes)) {
            Utils.showAlert(`Formato do arquivo "${file.name}" não é suportado`, 'error');
            return false;
        }

        // Check for duplicates
        if (this.selectedFiles.some(existingFile => existingFile.name === file.name && existingFile.size === file.size)) {
            Utils.showAlert(`Arquivo "${file.name}" já foi selecionado`, 'warning');
            return false;
        }

        return true;
    }

    addFile(file) {
        const fileObj = {
            id: Utils.generateId(),
            file: file,
            name: file.name,
            size: file.size,
            type: file.type
        };
        
        this.selectedFiles.push(fileObj);
        Utils.trackEvent('file_added', {
            fileName: file.name,
            fileSize: file.size,
            totalFiles: this.selectedFiles.length
        });
    }

    removeFile(fileId) {
        const index = this.selectedFiles.findIndex(f => f.id === fileId);
        if (index > -1) {
            const removedFile = this.selectedFiles.splice(index, 1)[0];
            Utils.trackEvent('file_removed', {
                fileName: removedFile.name,
                totalFiles: this.selectedFiles.length
            });
            this.updateFileDisplay();
            this.updateDocumentAssignmentMatrix();
        }
    }

    clearAllFiles() {
        this.selectedFiles = [];
        this.updateFileDisplay();
        this.updateDocumentAssignmentMatrix();
        document.getElementById('docUpload').value = '';
        Utils.trackEvent('all_files_cleared');
    }

    updateFileDisplay() {
        const selectedFilesContainer = document.getElementById('selectedFiles');
        const filesList = document.getElementById('filesList');

        if (this.selectedFiles.length === 0) {
            selectedFilesContainer.classList.add('hidden');
            return;
        }

        selectedFilesContainer.classList.remove('hidden');
        filesList.innerHTML = this.selectedFiles.map(fileObj => `
            <li class="file-item">
                <div class="file-info">
                    <div class="file-icon">
                        <i class="fas fa-file-${this.getFileIcon(fileObj.name)}"></i>
                    </div>
                    <div class="file-details">
                        <p class="file-name">${Utils.sanitizeHTML(fileObj.name)}</p>
                        <p class="file-size">${Utils.formatFileSize(fileObj.size)}</p>
                    </div>
                </div>
                <button type="button" class="btn-remove-file" onclick="multipleItemsManager.removeFile('${fileObj.id}')" title="${window.i18n ? window.i18n.getTranslation('remove') : 'Remover'} arquivo">
                    <i class="fas fa-times"></i>
                </button>
            </li>
        `).join('');
    }

    getFileIcon(fileName) {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'pdf': return 'pdf';
            case 'docx': case 'doc': return 'word';
            case 'txt': return 'text';
            default: return 'alt';
        }
    }

    setupSignerManagement() {
        const addSignerBtn = document.getElementById('addSigner');
        addSignerBtn.addEventListener('click', () => {
            this.addSigner();
        });

        // Initialize with first signer
        this.initializeFirstSigner();
    }

    initializeFirstSigner() {
        const firstSigner = document.querySelector('.signer-item[data-signer-index="0"]');
        this.setupSignerEventListeners(firstSigner, 0);
    }

    addSigner() {
        const signersContainer = document.getElementById('signersContainer');
        const signerCount = signersContainer.children.length;

        if (signerCount >= this.maxSigners) {
            Utils.showAlert(`Máximo de ${this.maxSigners} signatários permitidos`, 'error');
            return;
        }

        const signerIndex = signerCount;
        const signerHTML = `
            <div class="signer-item" data-signer-index="${signerIndex}">
                <div class="signer-input-group">
                    <input 
                        type="text" 
                        name="signerName[]" 
                        required 
                        minlength="3"
                        maxlength="100"
                        autocomplete="name"
                        placeholder: window.i18n ? window.i18n.getTranslation('signer-name-placeholder') : "Digite o nome completo do signatário"
                        class="signer-name-input"
                    >
                    <input 
                        type="email" 
                        name="signerEmail[]" 
                        required 
                        autocomplete="email"
                        placeholder: window.i18n ? window.i18n.getTranslation('signer-email-placeholder') : "Digite o e-mail do signatário"
                        class="signer-email-input"
                    >
                    <select name="signerRole[]" class="signer-role-select" required>
                        <option value="">Selecione o papel</option>
                        <option value="assinante">Assinante</option>
                        <option value="testemunha">Testemunha</option>
                        <option value="aprovador">Aprovador</option>
                        <option value="revisor">Revisor</option>
                    </select>
                    <button type="button" class="btn-remove-signer" title="${window.i18n ? window.i18n.getTranslation('remove-signer') : 'Remover signatário'}">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="signer-errors">
                    <div class="error-message" role="alert"></div>
                </div>
            </div>
        `;

        signersContainer.insertAdjacentHTML('beforeend', signerHTML);
        const newSigner = signersContainer.lastElementChild;
        this.setupSignerEventListeners(newSigner, signerIndex);
        this.updateRemoveButtons();
        this.updateDocumentAssignmentMatrix();

        Utils.trackEvent('signer_added', {
            signerIndex: signerIndex,
            totalSigners: signerCount + 1
        });
    }

    setupSignerEventListeners(signerElement, index) {
        const removeBtn = signerElement.querySelector('.btn-remove-signer');
        removeBtn.addEventListener('click', () => {
            this.removeSigner(signerElement);
        });

        // Add validation listeners
        const inputs = signerElement.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateSignerField(input);
            });
            input.addEventListener('input', () => {
                this.clearSignerError(input);
            });
        });
    }

    removeSigner(signerElement) {
        const signersContainer = document.getElementById('signersContainer');
        if (signersContainer.children.length <= 1) {
            Utils.showAlert('Pelo menos um signatário é obrigatório', 'error');
            return;
        }

        signerElement.remove();
        this.updateRemoveButtons();
        this.updateDocumentAssignmentMatrix();
        
        Utils.trackEvent('signer_removed', {
            totalSigners: signersContainer.children.length
        });
    }

    updateRemoveButtons() {
        const signersContainer = document.getElementById('signersContainer');
        const removeButtons = signersContainer.querySelectorAll('.btn-remove-signer');
        
        removeButtons.forEach(btn => {
            btn.disabled = signersContainer.children.length <= 1;
        });
    }

    validateSignerField(input) {
        const signerItem = input.closest('.signer-item');
        const errorContainer = signerItem.querySelector('.error-message');
        
        let error = '';
        
        if (input.type === 'text' && input.name === 'signerName[]') {
            if (!input.value.trim()) {
                error = window.i18n ? window.i18n.getTranslation('name-required') : 'Nome é obrigatório';
            } else if (input.value.trim().length < 3) {
                error = window.i18n ? window.i18n.getTranslation('name-min-length') : 'Nome deve ter pelo menos 3 caracteres';
            }
        } else if (input.type === 'email') {
            if (!input.value.trim()) {
                error = 'E-mail é obrigatório';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                error = 'E-mail inválido';
            }
        } else if (input.tagName === 'SELECT') {
            if (!input.value) {
                error = 'Papel é obrigatório';
            }
        }
        
        if (error) {
            errorContainer.textContent = error;
            input.classList.add('field-error');
        } else {
            errorContainer.textContent = '';
            input.classList.remove('field-error');
        }
        
        return !error;
    }

    clearSignerError(input) {
        input.classList.remove('field-error');
    }

    setupDocumentAssignment() {
        const enableCheckbox = document.getElementById('enableDocumentAssignment');
        const container = document.getElementById('documentAssignmentContainer');
        
        enableCheckbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                container.classList.remove('hidden');
                this.updateDocumentAssignmentMatrix();
            } else {
                container.classList.add('hidden');
            }
        });
    }

    updateDocumentAssignmentMatrix() {
        const enableCheckbox = document.getElementById('enableDocumentAssignment');
        if (!enableCheckbox.checked) return;

        const matrixContainer = document.getElementById('assignmentMatrix');
        const signersContainer = document.getElementById('signersContainer');
        const signers = Array.from(signersContainer.children);
        
        if (this.selectedFiles.length === 0 || signers.length === 0) {
            matrixContainer.innerHTML = '<p>Adicione documentos e signatários para configurar as atribuições.</p>';
            return;
        }

        // Create matrix header
        const headerCols = ['Signatário', ...this.selectedFiles.map(f => f.name)];
        const matrixHTML = `
            <div class="matrix-header" style="grid-template-columns: 200px repeat(${this.selectedFiles.length}, 1fr);">
                ${headerCols.map(col => `<div>${Utils.sanitizeHTML(col)}</div>`).join('')}
            </div>
            ${signers.map((signer, signerIndex) => {
                const nameInput = signer.querySelector('.signer-name-input');
                const signerName = nameInput.value || `Signatário ${signerIndex + 1}`;
                return `
                    <div class="matrix-row" style="grid-template-columns: 200px repeat(${this.selectedFiles.length}, 1fr);">
                        <div class="signer-label">${Utils.sanitizeHTML(signerName)}</div>
                        ${this.selectedFiles.map(file => `
                            <div class="document-checkbox">
                                <input type="checkbox" 
                                       name="assignment[${signerIndex}][${file.id}]" 
                                       checked 
                                       title="Assinar ${file.name}">
                            </div>
                        `).join('')}
                    </div>
                `;
            }).join('')}
        `;
        
        matrixContainer.innerHTML = matrixHTML;
    }

    getFormData() {
        const signersContainer = document.getElementById('signersContainer');
        const signers = Array.from(signersContainer.children).map((signer, index) => {
            const name = signer.querySelector('.signer-name-input').value.trim();
            const email = signer.querySelector('.signer-email-input').value.trim();
            const role = signer.querySelector('.signer-role-select').value;
            
            return { name, email, role, index };
        });

        const sequentialSigning = document.getElementById('sequentialSigning').checked;
        const enableDocumentAssignment = document.getElementById('enableDocumentAssignment').checked;
        
        let documentAssignments = {};
        if (enableDocumentAssignment) {
            const assignmentInputs = document.querySelectorAll('input[name^="assignment["]');
            assignmentInputs.forEach(input => {
                if (input.checked) {
                    const match = input.name.match(/assignment\[(\d+)\]\[(.+)\]/);
                    if (match) {
                        const signerIndex = match[1];
                        const fileId = match[2];
                        if (!documentAssignments[signerIndex]) {
                            documentAssignments[signerIndex] = [];
                        }
                        documentAssignments[signerIndex].push(fileId);
                    }
                }
            });
        }

        return {
            files: this.selectedFiles,
            signers,
            sequentialSigning,
            documentAssignments: enableDocumentAssignment ? documentAssignments : null
        };
    }

    validateAll() {
        let isValid = true;

        // Validate files
        if (this.selectedFiles.length === 0) {
            Utils.showAlert('Pelo menos um documento deve ser selecionado', 'error');
            isValid = false;
        }

        // Validate signers
        const signersContainer = document.getElementById('signersContainer');
        const signers = Array.from(signersContainer.children);
        
        signers.forEach(signer => {
            const inputs = signer.querySelectorAll('input, select');
            inputs.forEach(input => {
                if (!this.validateSignerField(input)) {
                    isValid = false;
                }
            });
        });

        return isValid;
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Aguardar o i18n estar disponível
        let attempts = 0;
        while (!window.i18n && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!window.i18n) {
            console.warn('i18n not loaded after 5 seconds, continuing without it');
        }
        
        window.digitalSignerApp = new DigitalSignerApp();
        window.multipleItemsManager = window.digitalSignerApp.multipleItemsManager;
    } catch (error) {
        console.error('Failed to initialize SILIC Digital Signer:', error);
        
        // Fallback error display
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-error">
                    <h3>Erro de Inicialização</h3>
                    <p>Não foi possível inicializar a aplicação. Por favor, recarregue a página ou verifique se seu navegador suporta as funcionalidades necessárias.</p>
                    <button onclick="location.reload()" class="btn-primary">Recarregar Página</button>
                </div>
            `;
        }
    }
});
