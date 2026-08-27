// static/js/script.js

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // DETECT ENVIRONMENT (Local vs Production)
    // ========================================
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '0.0.0.0';

    // ========================================
    // MOBILE NAVIGATION
    // ========================================
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ========================================
    // ACTIVE NAV LINK ON SCROLL
    // ========================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', function() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ========================================
    // PROJECT FILTERS
    // ========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ========================================
    // CONTACT FORM - MESSAGE SHOW IN FORM
    // ========================================
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    const submitBtn = document.getElementById('submitBtn');
    const formNote = document.getElementById('formNote');

    if (contactForm) {
        // Update form note based on environment
        if (!isLocal) {
            if (formNote) {
                formNote.textContent = 'Message will be sent to vajakaran95@gmail.com';
            }
        }

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Page reload na thay
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            
            // Validation
            if (!name || !email || !message) {
                showMessage('Please fill in all fields.', 'error');
                return;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showMessage('Please enter a valid email address.', 'error');
                return;
            }
            
            // Show loading
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Send email
            fetch('/send_email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    name: name,
                    email: email,
                    message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
                
                if (data.success) {
                    showMessage('✅ ' + data.message, 'success');
                    contactForm.reset(); // Form clear
                } else {
                    showMessage('❌ ' + data.message, 'error');
                }
            })
            .catch(error => {
                submitBtn.textContent = 'Send Message';
                submitBtn.disabled = false;
                showMessage('❌ Error sending message. Please try again.', 'error');
            });
        });
    }

    // ========================================
    // SHOW MESSAGE FUNCTION
    // ========================================
    function showMessage(text, type) {
        if (formMessage) {
            formMessage.textContent = text;
            formMessage.className = 'form-message ' + type;
            formMessage.style.display = 'block';
            
            // Auto hide after 5 seconds
            clearTimeout(window.messageTimeout);
            window.messageTimeout = setTimeout(() => {
                formMessage.style.display = 'none';
            }, 5000);
        }
    }

    // ========================================
    // ANIMATE SKILLS ON SCROLL
    // ========================================
    const skillCards = document.querySelectorAll('.skill-card');
    const progressBars = document.querySelectorAll('.progress');
    
    const observerOptions = {
        threshold: 0.2,
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
    
    skillCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        observer.observe(card);
    });
    
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target;
                const width = progress.style.width;
                progress.style.width = '0';
                setTimeout(() => {
                    progress.style.width = width;
                }, 200);
            }
        });
    }, observerOptions);
    
    progressBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';
        progressObserver.observe(bar);
    });
});

// ========================================
// DOWNLOAD RESUME FUNCTION - PDF ONLY
// ========================================
function downloadResume() {
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '0.0.0.0';
    
    if (isLocal) {
        // Local: Download via Flask
        window.location.href = '/download_resume';
    } else {
        // Vercel/Netlify: Direct PDF download
        const resumeUrl = '/static/resume.pdf';
        const a = document.createElement('a');
        a.href = resumeUrl;
        a.download = 'Vaja_Karan_Resume.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
}
