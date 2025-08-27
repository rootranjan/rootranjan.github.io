// RootRanjan Security Configuration
// Additional security measures for production deployment

// Content Security Policy (CSP) - Add this to your server headers
const CSP_POLICY = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com;
    font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com;
    img-src 'self' data: https:;
    connect-src 'self';
    frame-ancestors 'none';
    base-uri 'self';
    form-action 'self';
    upgrade-insecure-requests;
`;

// Security Headers Configuration
const SECURITY_HEADERS = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    'Content-Security-Policy': CSP_POLICY.replace(/\s+/g, ' ').trim(),
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

// Rate Limiting Configuration
const RATE_LIMIT_CONFIG = {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests from this IP, please try again later.'
};

// Input Validation Rules
const VALIDATION_RULES = {
    companyName: {
        minLength: 2,
        maxLength: 100,
        pattern: /^[a-zA-Z0-9\s\-&.()]+$/
    },
    contactName: {
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s\-']+$/
    },
    email: {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    message: {
        minLength: 10,
        maxLength: 1000
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CSP_POLICY,
        SECURITY_HEADERS,
        RATE_LIMIT_CONFIG,
        VALIDATION_RULES
    };
}
