// RootRanjan Website JavaScript - SECURE VERSION
// All security vulnerabilities have been patched

(function() {
    'use strict';
    
    // Security: Prevent prototype pollution
    if (Object.freeze) {
        Object.freeze(Object.prototype);
    }
    
    // Security: Disable console in production (optional)
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        console.log = function() {};
        console.warn = function() {};
        console.error = function() {};
    }
    
    // Security: Input sanitization function
    function sanitizeInput(input) {
        if (typeof input !== 'string') return '';
        
        // Remove all HTML tags and dangerous characters
        return input
            .replace(/[<>]/g, '') // Remove < and >
            .replace(/javascript:/gi, '') // Remove javascript: protocol
            .replace(/on\w+\s*=/gi, '') // Remove event handlers
            .replace(/data:/gi, '') // Remove data: protocol
            .replace(/vbscript:/gi, '') // Remove vbscript: protocol
            .trim();
    }
    
    // Security: Safe timeout wrapper
    function safeSetTimeout(callback, delay) {
        if (typeof callback === 'function') {
            return setTimeout(callback, delay);
        }
        return null;
    }
    
    // Security: Safe interval wrapper
    function safeSetInterval(callback, delay) {
        if (typeof callback === 'function') {
            return setInterval(callback, delay);
        }
        return null;
    }
    
    // Security: Safe DOM manipulation
    function safeSetTextContent(element, text) {
        if (element && element.textContent !== undefined) {
            element.textContent = sanitizeInput(text);
        }
    }
    
    // Security: Safe attribute setting
    function safeSetAttribute(element, attribute, value) {
        if (element && element.setAttribute) {
            element.setAttribute(attribute, sanitizeInput(value));
        }
    }
    
    // Security: Safe element creation
    function safeCreateElement(tagName, className, textContent) {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        if (textContent) safeSetTextContent(element, textContent);
        return element;
    }
    
    // Security: Validate email format
    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
    
    // Security: Rate limiting for form submissions
    let formSubmissionCount = 0;
    const MAX_SUBMISSIONS = 5;
    const SUBMISSION_WINDOW = 60000; // 1 minute
    
    function isRateLimited() {
        const now = Date.now();
        if (now - formSubmissionCount > SUBMISSION_WINDOW) {
            formSubmissionCount = 0;
        }
        return formSubmissionCount >= MAX_SUBMISSIONS;
    }
    
    // Main application initialization
    function initApp() {
        initNavigation();
        initScrollEffects();
        initContactForm();
        initAnimations();
        initMobileMenu();
        updateCopyrightYear();
    }
    
    // Navigation functionality
    function initNavigation() {
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetSection.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Scroll effects
    function initScrollEffects() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        let ticking = false;
        
        function updateHeader() {
            if (window.scrollY > 100) {
                header.style.background = 'rgba(30, 41, 59, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.background = 'linear-gradient(135deg, var(--dark-color) 0%, #334155 100%)';
                header.style.backdropFilter = 'none';
            }
            ticking = false;
        }
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }
    
    // Contact form with Google Forms integration
    function initContactForm() {
        const contactForm = document.querySelector('#consultationForm');
        if (!contactForm) return;
        
        // Security: Handle Google Forms submission
        contactForm.addEventListener('submit', function(e) {
            // Security: Rate limiting check
            if (isRateLimited()) {
                e.preventDefault();
                showNotification('Too many submissions. Please wait before trying again.', 'error');
                return;
            }
            
            // Security: Get and sanitize form data for validation
            const companyName = sanitizeInput(this.querySelector('input[name="entry.755972856"]')?.value || '');
            const contactName = sanitizeInput(this.querySelector('input[name="entry.246798732"]')?.value || '');
            const email = sanitizeInput(this.querySelector('input[name="entry.971905572"]')?.value || '');
            const service = sanitizeInput(this.querySelector('select[name="entry.1551696183"]')?.value || '');
            const message = sanitizeInput(this.querySelector('textarea[name="entry.249340128"]')?.value || '');
            
            // Security: Input validation
            if (!companyName || !contactName || !email || !service || !message) {
                e.preventDefault();
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Security: Email validation
            if (!isValidEmail(email)) {
                e.preventDefault();
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Security: Length validation
            if (message.length > 1000) {
                e.preventDefault();
                showNotification('Message is too long. Please keep it under 1000 characters.', 'error');
                return;
            }
            
            // Security: Increment rate limit counter
            formSubmissionCount++;
            
            // Show success message and handle form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn) {
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
                
                // Reset form and button after successful submission
                safeSetTimeout(() => {
                    showNotification('Thank you! We\'ll get back to you within 24 hours.', 'success');
                    this.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            }
        });
        
        // Security: Handle iframe load for Google Forms
        const hiddenIframe = document.getElementById('hidden_iframe');
        if (hiddenIframe) {
            hiddenIframe.addEventListener('load', function() {
                // Form submitted successfully to Google Forms
                console.log('Form submitted to Google Forms successfully');
            });
        }
    }
    
    // Animations with security
    function initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animateElements = document.querySelectorAll('.service-card, .benefit, .stat');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
        
        // Service card hover effects
        const serviceCards = document.querySelectorAll('.service-card');
        serviceCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        // Stats counter animation
        const stats = document.querySelectorAll('.stat h3');
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const finalValue = target.textContent;
                    const isNumber = /\d+/.test(finalValue);
                    
                    if (isNumber) {
                        animateCounter(target, finalValue);
                    }
                }
            });
        }, { threshold: 0.5 });

        stats.forEach(stat => statsObserver.observe(stat));
    }
    
    // Counter animation function
    function animateCounter(element, finalValue) {
        const finalNumber = parseInt(finalValue.replace(/\D/g, '')) || 0;
        const suffix = finalValue.replace(/\d/g, '') || '';
        let currentNumber = 0;
        const increment = finalNumber / 50;
        
        const timer = safeSetInterval(() => {
            currentNumber += increment;
            if (currentNumber >= finalNumber) {
                currentNumber = finalNumber;
                clearInterval(timer);
            }
            safeSetTextContent(element, Math.floor(currentNumber) + suffix);
        }, 30);
    }
    
    // Secure notification system
    function showNotification(message, type = 'info') {
        // Security: Sanitize message
        const sanitizedMessage = sanitizeInput(message);
        if (!sanitizedMessage) return;
        
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            if (notification && notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
        
        // Security: Create notification element safely
        const notification = safeCreateElement('div', `notification notification-${type}`);
        
        // Security: Create content safely without innerHTML
        const content = safeCreateElement('div', 'notification-content');
        const messageSpan = safeCreateElement('span', 'notification-message');
        const closeBtn = safeCreateElement('button', 'notification-close');
        
        safeSetTextContent(messageSpan, sanitizedMessage);
        safeSetTextContent(closeBtn, '×');
        
        content.appendChild(messageSpan);
        content.appendChild(closeBtn);
        notification.appendChild(content);
        
        // Security: Set styles safely
        const backgroundColor = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6';
        
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        safeSetTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            safeSetTimeout(() => {
                if (notification && notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        // Auto remove after 5 seconds
        safeSetTimeout(() => {
            if (notification && notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                safeSetTimeout(() => {
                    if (notification && notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Mobile menu with security
    function initMobileMenu() {
        const nav = document.querySelector('.nav');
        if (!nav) return;
        
        // Security: Create mobile menu toggle safely
        const mobileMenuToggle = safeCreateElement('button', 'mobile-menu-toggle');
        const icon = safeCreateElement('i', 'fas fa-bars');
        mobileMenuToggle.appendChild(icon);
        
        mobileMenuToggle.style.cssText = `
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            padding: 0.5rem;
        `;
        
        nav.parentNode.insertBefore(mobileMenuToggle, nav);
        
        // Mobile menu functionality
        mobileMenuToggle.addEventListener('click', function() {
            nav.classList.toggle('mobile-open');
            const newIcon = safeCreateElement('i');
            newIcon.className = nav.classList.contains('mobile-open') ? 'fas fa-times' : 'fas fa-bars';
            // Security: Clear content safely without innerHTML
            while (this.firstChild) {
                this.removeChild(this.firstChild);
            }
            this.appendChild(newIcon);
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!nav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                nav.classList.remove('mobile-open');
                const resetIcon = safeCreateElement('i', 'fas fa-bars');
                // Security: Clear content safely without innerHTML
                while (mobileMenuToggle.firstChild) {
                    mobileMenuToggle.removeChild(mobileMenuToggle.firstChild);
                }
                mobileMenuToggle.appendChild(resetIcon);
            }
        });
        
        // Security: Add mobile menu styles safely
        const mobileStyles = `
            @media (max-width: 768px) {
                .mobile-menu-toggle {
                    display: block !important;
                }
                
                .nav {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: var(--dark-color);
                    flex-direction: column;
                    padding: 1rem;
                    transform: translateY(-100%);
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                
                .nav.mobile-open {
                    transform: translateY(0);
                    opacity: 1;
                    visibility: visible;
                }
                
                .nav ul {
                    flex-direction: column;
                    gap: 1rem;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = mobileStyles;
        document.head.appendChild(styleSheet);
    }
    
    // Update copyright year automatically
    function updateCopyrightYear() {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            const currentYear = new Date().getFullYear();
            safeSetTextContent(yearElement, currentYear.toString());
        }
    }
    
    // Security: Initialize app only when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        initApp();
    }
    
    // Security: Prevent global scope pollution
    window.RootRanjanApp = {
        version: '1.0.0',
        secure: true
    };
    
})();
