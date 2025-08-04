/**
 * Internationalization (i18n) Module
 * Handles multi-language support following W3C standards
 */

class I18nManager {
    constructor() {
        this.currentLanguage = 'pt-BR';
        this.translations = {};
        this.supportedLanguages = ['pt-BR', 'en-US', 'es-ES'];
        // Não chamar init() aqui pois é async
    }

    async init() {
        // Detect user's preferred language
        this.detectLanguage();
        
        // Load translations
        await this.loadTranslations();
        
        // Apply translations to the page
        this.applyTranslations();
    }

    detectLanguage() {
        // Check localStorage first
        const savedLang = localStorage.getItem('preferred-language');
        if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLanguage = savedLang;
            return;
        }

        // Check browser language
        const browserLang = navigator.language || navigator.userLanguage;
        const shortLang = browserLang.substring(0, 2);
        
        // Find matching supported language
        const matchedLang = this.supportedLanguages.find(lang => 
            lang.startsWith(shortLang)
        );
        
        if (matchedLang) {
            this.currentLanguage = matchedLang;
        }
    }

    async loadTranslations() {
        // For prototype, we'll use inline translations
        // In production, these would be loaded from separate JSON files
        this.translations = {
            'pt-BR': {
                'skip-to-content': 'Pular para o conteúdo principal',
                'app-title': 'SILIC Digital Signer',
                'service-name': 'Assinador Digital',
                'portal-title': 'Portal de Assinatura Digital',
                'portal-description': 'Assine seus documentos de forma segura e digital com certificação válida.',
                'select-document': 'Selecione o documento:',
                'select-documents': 'Selecione os documentos:',
                'doc-help': 'Formatos aceitos: PDF, DOCX, TXT (máximo 10MB por arquivo, até 10 arquivos)',
                'signer-name': 'Nome do signatário:',
                'signers': 'Signatários:',
                'signers-help': 'Adicione todos os signatários que devem assinar os documentos',
                'name-help': 'Digite seu nome completo como aparece no documento',
                'sign-button': 'Assinar Digitalmente',
                'result-title': 'Resultado da Assinatura',
                'download-document': 'Baixar Documento Assinado',
                'new-signature': 'Nova Assinatura',
                'prototype': 'Protótipo',
                'privacy-policy': 'Política de Privacidade',
                'terms-of-use': 'Termos de Uso',
                'help': 'Ajuda',
                'success-message': 'Documento assinado com sucesso por {name}',
                'error-file-required': 'Por favor, selecione um documento',
                'error-name-required': 'Por favor, informe o nome do signatário',
                'error-name-min-length': 'O nome deve ter pelo menos 3 caracteres',
                'error-file-size': 'O arquivo deve ter no máximo 10MB',
                'error-file-type': 'Formato de arquivo não suportado',
                'loading': 'Processando assinatura...',
                'signing': 'Assinando...',
                'document': 'Documento',
                'signature-date': 'Data da Assinatura',
                'certificate': 'Certificado',
                'file-size': 'Tamanho do Arquivo',
                'process-id': 'ID do Processo',
                'start-date': 'Data de Início',
                'signature-type': 'Tipo de Assinatura',
                'sequential': 'Sequencial',
                'parallel': 'Paralela',
                'total-documents': 'Total de Documentos',
                'documents-summary': 'Resumo dos Documentos',
                'signed': 'Assinado',
                'pending': 'Pendente',
                'next-steps': 'Próximos Passos',
                'sequential-info-1': 'Os signatários receberão convites por e-mail na ordem definida',
                'sequential-info-2': 'Cada signatário poderá assinar apenas após o anterior concluir',
                'sequential-info-3': 'Você receberá notificações sobre o progresso',
                'parallel-info-1': 'Todos os signatários receberão convites por e-mail simultaneamente',
                'parallel-info-2': 'Cada um pode assinar independentemente',
                'parallel-info-3': 'Você receberá notificações conforme as assinaturas forem concluídas',
                'download-report': 'Baixar Relatório do Processo',
                'signer-name-placeholder': 'Digite o nome completo do signatário',
                'signer-email-placeholder': 'Digite o e-mail do signatário',
                'signer-role-placeholder': 'Função/Cargo (opcional)',
                'add-signer': 'Adicionar Signatário',
                'remove-signer': 'Remover',
                'signature-options': 'Opções de Assinatura',
                'sequential-signature': 'Assinatura Sequencial',
                'sequential-signature-help': 'Os signatários assinarão na ordem especificada',
                'document-assignment': 'Atribuição de Documentos por Signatário',
                'document-assignment-help': 'Permitir que cada signatário seja responsável por documentos específicos',
                'email': 'E-mail',
                'role': 'Função/Cargo',
                'actions': 'Ações',
                'name-required': 'Nome é obrigatório',
                'name-min-length': 'Nome deve ter pelo menos 3 caracteres',
                'email-required': 'E-mail é obrigatório',
                'email-invalid': 'E-mail inválido',
                'preview': 'Visualizar',
                'remove': 'Remover',
                'file-preview': 'Visualização do Arquivo'
            },
            'en-US': {
                'skip-to-content': 'Skip to main content',
                'app-title': 'SILIC Digital Signer',
                'service-name': 'Digital Signer',
                'portal-title': 'Digital Signature Portal',
                'portal-description': 'Sign your documents securely and digitally with valid certification.',
                'select-document': 'Select document:',
                'select-documents': 'Select documents:',
                'doc-help': 'Accepted formats: PDF, DOCX, TXT (maximum 10MB per file, up to 10 files)',
                'signer-name': 'Signer name:',
                'signers': 'Signers:',
                'signers-help': 'Add all signers who must sign the documents',
                'name-help': 'Enter your full name as it appears in the document',
                'sign-button': 'Sign Digitally',
                'result-title': 'Signature Result',
                'download-document': 'Download Signed Document',
                'new-signature': 'New Signature',
                'prototype': 'Prototype',
                'privacy-policy': 'Privacy Policy',
                'terms-of-use': 'Terms of Use',
                'help': 'Help',
                'success-message': 'Document successfully signed by {name}',
                'error-file-required': 'Please select a document',
                'error-name-required': 'Please enter the signer name',
                'error-name-min-length': 'Name must be at least 3 characters long',
                'error-file-size': 'File must be maximum 10MB',
                'error-file-type': 'File format not supported',
                'loading': 'Processing signature...',
                'signing': 'Signing...',
                'document': 'Document',
                'signature-date': 'Signature Date',
                'certificate': 'Certificate',
                'file-size': 'File Size',
                'process-id': 'Process ID',
                'start-date': 'Start Date',
                'signature-type': 'Signature Type',
                'sequential': 'Sequential',
                'parallel': 'Parallel',
                'total-documents': 'Total Documents',
                'documents-summary': 'Documents Summary',
                'signed': 'Signed',
                'pending': 'Pending',
                'next-steps': 'Next Steps',
                'sequential-info-1': 'Signers will receive email invitations in the defined order',
                'sequential-info-2': 'Each signer can only sign after the previous one completes',
                'sequential-info-3': 'You will receive notifications about the progress',
                'parallel-info-1': 'All signers will receive email invitations simultaneously',
                'parallel-info-2': 'Each one can sign independently',
                'parallel-info-3': 'You will receive notifications as signatures are completed',
                'download-report': 'Download Process Report',
                'signer-name-placeholder': 'Enter the full name of the signer',
                'signer-email-placeholder': 'Enter the signer email',
                'signer-role-placeholder': 'Role/Position (optional)',
                'add-signer': 'Add Signer',
                'remove-signer': 'Remove',
                'signature-options': 'Signature Options',
                'sequential-signature': 'Sequential Signature',
                'sequential-signature-help': 'Signers will sign in the specified order',
                'document-assignment': 'Document Assignment per Signer',
                'document-assignment-help': 'Allow each signer to be responsible for specific documents',
                'email': 'Email',
                'role': 'Role/Position',
                'actions': 'Actions',
                'name-required': 'Name is required',
                'name-min-length': 'Name must be at least 3 characters long',
                'email-required': 'Email is required',
                'email-invalid': 'Invalid email',
                'preview': 'Preview',
                'remove': 'Remove',
                'file-preview': 'File Preview'
            },
            'es-ES': {
                'skip-to-content': 'Saltar al contenido principal',
                'app-title': 'SILIC Digital Signer',
                'service-name': 'Firmador Digital',
                'portal-title': 'Portal de Firma Digital',
                'portal-description': 'Firme sus documentos de forma segura y digital con certificación válida.',
                'select-document': 'Seleccionar documento:',
                'select-documents': 'Seleccionar documentos:',
                'doc-help': 'Formatos aceptados: PDF, DOCX, TXT (máximo 10MB por archivo, hasta 10 archivos)',
                'signer-name': 'Nombre del firmante:',
                'signers': 'Firmantes:',
                'signers-help': 'Agregue todos los firmantes que deben firmar los documentos',
                'name-help': 'Ingrese su nombre completo como aparece en el documento',
                'sign-button': 'Firmar Digitalmente',
                'result-title': 'Resultado de la Firma',
                'download-document': 'Descargar Documento Firmado',
                'new-signature': 'Nueva Firma',
                'prototype': 'Prototipo',
                'privacy-policy': 'Política de Privacidad',
                'terms-of-use': 'Términos de Uso',
                'help': 'Ayuda',
                'success-message': 'Documento firmado exitosamente por {name}',
                'error-file-required': 'Por favor, seleccione un documento',
                'error-name-required': 'Por favor, ingrese el nombre del firmante',
                'error-name-min-length': 'El nombre debe tener al menos 3 caracteres',
                'error-file-size': 'El archivo debe tener máximo 10MB',
                'error-file-type': 'Formato de archivo no soportado',
                'loading': 'Procesando firma...',
                'signing': 'Firmando...',
                'document': 'Documento',
                'signature-date': 'Fecha de Firma',
                'certificate': 'Certificado',
                'file-size': 'Tamaño del Archivo',
                'process-id': 'ID del Proceso',
                'start-date': 'Fecha de Inicio',
                'signature-type': 'Tipo de Firma',
                'sequential': 'Secuencial',
                'parallel': 'Paralela',
                'total-documents': 'Total de Documentos',
                'documents-summary': 'Resumen de Documentos',
                'signed': 'Firmado',
                'pending': 'Pendiente',
                'next-steps': 'Próximos Pasos',
                'sequential-info-1': 'Los firmantes recibirán invitaciones por email en el orden definido',
                'sequential-info-2': 'Cada firmante solo puede firmar después de que el anterior complete',
                'sequential-info-3': 'Recibirás notificaciones sobre el progreso',
                'parallel-info-1': 'Todos los firmantes recibirán invitaciones por email simultáneamente',
                'parallel-info-2': 'Cada uno puede firmar independientemente',
                'parallel-info-3': 'Recibirás notificaciones conforme se completen las firmas',
                'download-report': 'Descargar Reporte del Proceso',
                'signer-name-placeholder': 'Ingrese el nombre completo del firmante',
                'signer-email-placeholder': 'Ingrese el email del firmante',
                'signer-role-placeholder': 'Función/Cargo (opcional)',
                'add-signer': 'Agregar Firmante',
                'remove-signer': 'Remover',
                'signature-options': 'Opciones de Firma',
                'sequential-signature': 'Firma Secuencial',
                'sequential-signature-help': 'Los firmantes firmarán en el orden especificado',
                'document-assignment': 'Asignación de Documentos por Firmante',
                'document-assignment-help': 'Permitir que cada firmante sea responsable de documentos específicos',
                'email': 'Email',
                'role': 'Función/Cargo',
                'actions': 'Acciones',
                'name-required': 'Nombre es obligatorio',
                'name-min-length': 'El nombre debe tener al menos 3 caracteres',
                'email-required': 'Email es obligatorio',
                'email-invalid': 'Email inválido',
                'preview': 'Vista Previa',
                'remove': 'Remover',
                'file-preview': 'Vista Previa del Archivo'
            }
        };
    }

    applyTranslations() {
        const elements = document.querySelectorAll('[data-i18n]');
        
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getTranslation(key);
            
            if (translation && translation !== key) {
                if (element.tagName === 'INPUT' && element.type === 'submit') {
                    element.value = translation;
                } else if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                    element.placeholder = translation;
                } else {
                    element.textContent = translation;
                }
            }
        });

        // Update document language
        document.documentElement.lang = this.currentLanguage;
    }

    getTranslation(key, params = {}) {
        const translations = this.translations[this.currentLanguage];
        
        if (!translations) {
            return key;
        }
        
        let translation = translations[key];
        
        if (!translation) {
            return key;
        }
        
        // Replace parameters in translation
        Object.keys(params).forEach(param => {
            translation = translation.replace(`{${param}}`, params[param]);
        });
        
        return translation;
    }

    setLanguage(language) {
        if (this.supportedLanguages.includes(language)) {
            this.currentLanguage = language;
            localStorage.setItem('preferred-language', language);
            this.applyTranslations();
        }
    }

    getCurrentLanguage() {
        return this.currentLanguage;
    }

    // Method to translate dynamic content
    translateElement(element, key, params = {}) {
        const translation = this.getTranslation(key, params);
        if (translation) {
            if (element.tagName === 'INPUT' && element.type === 'submit') {
                element.value = translation;
            } else if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
        return translation;
    }

    // Method to re-apply translations (useful for dynamic content)
    reapplyTranslations() {
        this.applyTranslations();
    }
}

// Initialize i18n when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    try {
        window.i18n = new I18nManager();
        // Aguardar a inicialização completa
        await window.i18n.init();
    } catch (error) {
        console.error('Failed to initialize i18n:', error);
        // Fallback para português se houver erro
        document.documentElement.lang = 'pt-BR';
    }
});
