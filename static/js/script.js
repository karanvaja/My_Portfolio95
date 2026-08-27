// static/js/script.js

document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // DETECT ENVIRONMENT (Local vs Netlify)
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
    
    // Close menu on link click
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
    // CONTACT FORM - ENVIRONMENT SPECIFIC
    // ========================================
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (contactForm) {
        // If running locally, handle with Flask
        if (isLocal) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                sendEmailViaFlask(this);
            });
            
            // Update form note
            const formNote = document.querySelector('.form-note');
            if (formNote) {
                formNote.textContent = 'Message opens in your default email';
            }
        } else {
            // If on Netlify, let Netlify handle it
            // Just add the netlify attributes if not already present
            if (!contactForm.hasAttribute('data-netlify')) {
                contactForm.setAttribute('data-netlify', 'true');
                // Add hidden form-name input if not present
                if (!contactForm.querySelector('input[name="form-name"]')) {
                    const hiddenInput = document.createElement('input');
                    hiddenInput.type = 'hidden';
                    hiddenInput.name = 'form-name';
                    hiddenInput.value = 'contact';
                    contactForm.prepend(hiddenInput);
                }
            }
            
            // Update form note
            const formNote = document.querySelector('.form-note');
            if (formNote) {
                formNote.textContent = 'Message will be sent to vajakaran95@gmail.com';
            }
        }
    }
    
    // ========================================
    // SEND EMAIL VIA FLASK (Local)
    // ========================================
    function sendEmailViaFlask(form) {
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        // Validate fields
        if (!name || !email || !message) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }
        
        // Show loading
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Send email via Flask
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
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            if (data.success) {
                showMessage('✅ ' + data.message, 'success');
                form.reset();
            } else {
                showMessage('❌ ' + data.message, 'error');
            }
        })
        .catch(error => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            showMessage('❌ Error sending message. Please try again.', 'error');
        });
    }
    
    // ========================================
    // SHOW MESSAGE
    // ========================================
    function showMessage(text, type) {
        if (formMessage) {
            formMessage.textContent = text;
            formMessage.className = 'form-message ' + type;
            formMessage.style.display = 'block';
            
            setTimeout(() => {
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
    
    // Animate progress bars
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
    
    // ========================================
    // SMOOTH SCROLL FOR NAV LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

// ========================================
// DOWNLOAD RESUME FUNCTION
// ========================================
function downloadResume() {
    // Check if running locally or on Netlify
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' ||
                    window.location.hostname === '0.0.0.0';
    
    if (isLocal) {
        // Local: Download via Flask
        fetch('/download_resume')
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error('Resume not found');
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Vaja_Karan_Resume.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(() => {
                // If PDF fails, download as text
                downloadResumeText();
            });
    } else {
        // Netlify: Direct download from static folder
        const resumeUrl = '/static/resume.pdf';
        fetch(resumeUrl)
            .then(response => {
                if (response.ok) {
                    return response.blob();
                }
                throw new Error('Resume not found');
            })
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Vaja_Karan_Resume.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            })
            .catch(() => {
                downloadResumeText();
            });
    }
}

// ========================================
// DOWNLOAD RESUME AS TEXT (Fallback)
// ========================================
function downloadResumeText() {
    const resumeText = `VAJA KARAN
Cybersecurity Professional

Contact:
Email: vajakaran95@gmail.com
Phone: +91 9724427396
Location: Veraval, Gujarat

Summary:
BCA graduate with hands-on training in Cybersecurity, Ethical Hacking, 
VAPT, SOC Operations, and Computer Networking. Experienced in practical 
labs, TryHackMe rooms, and CTF-style environments.

Skills:
• Penetration Testing & VAPT
• Ethical Hacking & SOC Operations
• Nmap, Burp Suite, Wireshark, Metasploit
• Python, HTML, CSS, React.js
• Network Security & Digital Forensics

Education:
Bachelor of Computer Application (BCA)
Shri K.M. Savjani & Smt. K.K. Savjani BBA/BCA College, 2023-2026

Certifications:
• Hackviser Certified Cybersecurity Foundations (CORE)
• Tata-Forage Cybersecurity Analyst Job Simulation
• TryHackMe - Top 6% Ranking

Experience:
MERIN Stack Web Developer (Internship)
Depple Soft Tech, Himatnagar, Ahmedabad - 2025

Projects:
1. FACE DETECTION SYSTEM - Real-time face detection using OpenCV
2. HIDDEN EYE - Steganography detection tool
3. V.K. PASSWORD GENERATOR PRO+ - Password security utility
4. DESI TADKA RESTAURANT - Full-stack restaurant website
5. CYBERSECURITY PORTFOLIO - React-based portfolio

Achievements:
• Top 6% on TryHackMe
• 70+ Rooms Completed
• 15 Badges Earned

VAPT Analyst | Cybersecurity Professional`;
    
    const blob = new Blob([resumeText], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Vaja_Karan_Resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}