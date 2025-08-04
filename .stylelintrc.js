module.exports = {
  extends: ['stylelint-config-standard'],
  plugins: [],
  rules: {
    // Accessibility rules
    'color-contrast': null, // Would need additional plugin for full support
    
    // Modern CSS
    'custom-property-empty-line-before': 'never',
    'custom-property-pattern': '^[a-z][a-z0-9]*(-[a-z0-9]+)*$',
    
    // Performance
    'no-duplicate-selectors': true,
    'no-empty-source': null,
    'shorthand-property-no-redundant-values': true,
    
    // Code quality
    'max-nesting-depth': 4,
    'selector-max-compound-selectors': 4,
    'selector-max-specificity': '0,4,0',
    
    // Consistency
    'color-hex-case': 'lower',
    'color-hex-length': 'short',
    'color-named': 'never',
    'declaration-block-trailing-semicolon': 'always',
    'indentation': 2,
    'number-leading-zero': 'never',
    'string-quotes': 'single',
    
    // Modern features
    'property-no-unknown': [true, {
      ignoreProperties: [
        // CSS custom properties
        '/^--/',
        // Webkit specific
        '-webkit-font-smoothing',
        '-moz-osx-font-smoothing'
      ]
    }],
    
    // Vendor prefixes (handled by autoprefixer)
    'property-no-vendor-prefix': true,
    'value-no-vendor-prefix': true,
    'selector-no-vendor-prefix': true,
    'media-feature-name-no-vendor-prefix': true,
    'at-rule-no-vendor-prefix': true,
    
    // Order (optional, can be enforced)
    'order/order': null,
    'order/properties-order': null,
    
    // BEM methodology support
    'selector-class-pattern': '^[a-z]([a-z0-9-]+)?(__([a-z0-9]+-?)+)?(--([a-z0-9]+-?)+){0,2}$',
    'selector-id-pattern': '^[a-z]([a-z0-9-]+)?$',
    
    // Prevent common mistakes
    'declaration-block-no-duplicate-properties': true,
    'font-family-no-duplicate-names': true,
    'keyframe-declaration-no-important': true,
    'no-descending-specificity': null, // Can be too strict
    
    // Performance optimizations
    'declaration-block-no-shorthand-property-overrides': true,
    'selector-max-universal': 1,
    'selector-max-type': 2,
    
    // Accessibility
    'a11y/font-size-is-readable': null, // Would need additional plugin
    'a11y/line-height-is-vertical-rhythmed': null, // Would need additional plugin
    'a11y/media-prefers-reduced-motion': null, // Would need additional plugin
    
    // Comment patterns
    'comment-pattern': '^[\\s\\S]*$',
    'comment-word-disallowed-list': ['todo', 'fixme'],
    
    // URLs
    'function-url-quotes': 'always',
    'function-url-no-scheme-relative': true
  },
  ignoreFiles: [
    'dist/**/*.css',
    'node_modules/**/*.css'
  ]
}
