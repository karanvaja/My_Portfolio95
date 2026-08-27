import os
import logging
from pathlib import Path
from flask import Flask, render_template, request, jsonify, send_file
from flask_mail import Mail, Message
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Create Flask app with explicit configuration
app = Flask(
    __name__,
    template_folder='templates',
    static_folder='static',
    instance_relative_config=False
)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key-2026')

# Email Configuration
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT', 587))
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS', 'True').lower() == 'true'
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME', 'vajakaran95@gmail.com')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD', '')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_USERNAME', 'vajakaran95@gmail.com')

# Initialize mail
mail = Mail(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ==================== DATA ====================

# Skills Data
SKILLS_DATA = {
    'technical': [
        {'name': 'Penetration Testing', 'icon': 'fa-shield-halved'},
        {'name': 'VAPT Analyst', 'icon': 'fa-bug'},
        {'name': 'Bug Bounty', 'icon': 'fa-bug'},
        {'name': 'Network Security', 'icon': 'fa-network-wired'},
        {'name': 'Ethical Hacking', 'icon': 'fa-user-secret'},
        {'name': 'Digital Forensics', 'icon': 'fa-microscope'},
        {'name': 'SOC Operations', 'icon': 'fa-server'},
        {'name': 'SQL Injection', 'icon': 'fa-database'},
        {'name': 'Front-End Web Developer', 'icon': 'fa-code'},
    ],
    'tools': [
        {'name': 'Nmap', 'level': 85},
        {'name': 'Burp Suite', 'level': 80},
        {'name': 'Wireshark', 'level': 75},
        {'name': 'Metasploit', 'level': 70},
        {'name': 'Python', 'level': 80},
        {'name': 'React.js', 'level': 75},
        {'name': 'Bootstrap', 'level': 85},
        {'name': 'JavaScript', 'level': 80},
        {'name': 'Gobuster', 'level': 70},
        {'name': 'Nikto', 'level': 65},
    ]
}

# Projects Data
PROJECTS_DATA = [
    {
        'id': 1,
        'title': 'FACE DETECTION SYSTEM',
        'category': 'AI/ML',
        'year': '2023',
        'type': 'Freelance',
        'description': 'Developed a real-time face detection system using OpenCV and Python. Implemented Haar Cascade classifiers for detecting faces in images and video streams.',
        'features': [
            'Real-time face detection using webcam with OpenCV library',
            'Haar Cascade classifier for accurate facial recognition',
            'Live video feed with highlighted face regions using bounding boxes',
            'AI-powered detection using pre-trained machine learning models'
        ],
        'tools': ['Computer Vision', 'Python', 'OpenCV', 'AI/ML'],
        'image': 'face-detection.jpg'
    },
    {
        'id': 2,
        'title': 'HIDDEN EYE',
        'category': 'Security Tools',
        'year': '2028',
        'type': 'VSecurity Labs',
        'description': 'Developed a Python-based tool for detecting and analysing hidden data in image files. Designed a dark-themed GUI with keyboard shortcuts for security analysis.',
        'features': [
            'Python-based steganography detection and analysis',
            'Dark-themed GUI with keyboard shortcuts for security analysis',
            'Custom and predefined wordlist support for steghide CTF exercises'
        ],
        'tools': ['Python', 'Steganography', 'Security Analysis', 'Tkinter'],
        'image': 'hidden-eye.png'
    },
    {
        'id': 3,
        'title': 'V.K. PASSWORD GENERATOR PRO+',
        'category': 'Security Tools',
        'year': '2028',
        'type': 'VSecurity Labs',
        'description': 'Developed a Python-based password generation and security utility with multiple password-generation approaches.',
        'features': [
            'Multiple password generation algorithms for varied security needs',
            'Fernet encryption for secure credential storage and management',
            'Password strength analyzer with entropy and pattern detection',
            'User-friendly security recommendations for stronger passwords'
        ],
        'tools': ['Password Security', 'Cryptography', 'Python', 'Fernet Encryption'],
        'image': 'password-generator.png'
    },
    {
        'id': 4,
        'title': 'DESI TADKA RESTAURANT',
        'category': 'Web Development',
        'year': '2025',
        'type': 'Freeze',
        'description': 'A modern, fully responsive restaurant website designed to provide an immersive online dining experience.',
        'features': [
            'Fully responsive design for all devices',
            'Dynamic menu with category-based filtering',
            'Online table booking system',
            'Email/SMS contact form',
            'AOS animations for smooth user experience',
            'Modern, clean UI with restaurant-themed color scheme'
        ],
        'tools': ['React', 'Bootstrap', 'JavaScript', 'CSS3'],
        'image': 'desi-tadka.png'
    },
    {
        'id': 5,
        'title': 'CYBERSECURITY PORTFOLIO',
        'category': 'Web Development',
        'year': '2026',
        'type': 'Personal Project',
        'description': 'A modern, responsive cybersecurity portfolio website built with React.js. Features a dark theme with cyber/neo aesthetic.',
        'features': [
            'Dark theme with cyber/neo aesthetic (#2affb6 accent color)',
            'Responsive design for all devices',
            'Smooth scroll navigation with active section highlighting',
            'Category filtering for projects',
            'Contact form with direct email integration',
            'WhatsApp booking integration'
        ],
        'tools': ['React', 'CSS3', 'JavaScript', 'Framer Motion'],
        'image': 'portfolio.png'
    }
]

# Certifications Data
CERTIFICATIONS_DATA = [
    {
        'title': 'Hackviser Certified Cybersecurity Foundations (CORE)',
        'issuer': 'HACKVISER',
        'year': '2020',
        'verified': True,
        'icon': 'fa-certificate'
    },
    {
        'title': 'Tata-Forage Cybersecurity Analyst Job Simulation',
        'issuer': 'TATA-FORAGE',
        'year': '2020',
        'verified': True,
        'icon': 'fa-certificate'
    },
    {
        'title': 'TryHackMe Hands-on Cybersecurity Labs and CTF Practice',
        'issuer': 'TRYHACKME',
        'year': '2025',
        'verified': True,
        'icon': 'fa-shield-halved'
    }
]

# Experience Data
EXPERIENCE_DATA = [
    {
        'title': 'MERIN Stack Web Developer (Internship)',
        'company': 'Depple Soft Tech',
        'location': 'Himatnagar, Ahmedabad',
        'duration': '2025 - 11 Month',
        'description': 'Completed a one-month intensive Internship as a MERIN Stack Web Developer. Gained hands-on experience in full-stack web development using modern technologies and best practices.',
        'responsibilities': [
            'Developed full-stack web applications using MongoDB, Express.js, React.js, and Node.js',
            'Built responsive user interfaces using HTML, Bootstrap, CSS, and JavaScript',
            'Created RESTful APIs and integrated frontend with backend services',
            'Implemented database schemas and queries using MongoDB',
            'Worked with Express.js to build server-side applications and middleware',
            'Collaborated with team members on real-world projects',
            'Learned industry-standard development practices and workflows'
        ],
        'technologies': ['HTML', 'Bootstrap', 'CSS', 'JavaScript', 'React.js', 'Node.js', 'Express.js', 'MongoDB']
    }
]

# Services Data
SERVICES_DATA = [
    {
        'title': 'Penetration Testing',
        'icon': 'fa-shield-halved',
        'description': 'Comprehensive security assessments to identify and exploit vulnerabilities in your systems and applications. I simulate real-world cyberattacks to uncover weaknesses and provide detailed remediation strategies.'
    },
    {
        'title': 'Bug Bounty Programs',
        'icon': 'fa-bug',
        'description': 'Manage and participate in bug bounty programs to find and fix security issues before attackers do. I help organizations set up effective bug bounty programs and actively hunt for vulnerabilities.'
    },
    {
        'title': 'Cyber Security',
        'icon': 'fa-user-secret',
        'description': 'Customized training programs for organizations to build security awareness and technical skills. I provide hands-on training to empower your team to identify and respond to cyber threats effectively.'
    },
    {
        'title': 'Networking',
        'icon': 'fa-network-wired',
        'description': 'Expert advice on security architecture, compliance, and best practices for your organization. I help design and implement robust network security strategies to protect your infrastructure.'
    },
    {
        'title': 'Digital Forensics',
        'icon': 'fa-microscope',
        'description': 'Investigate and analyze security incidents to identify root causes and prevent future breaches. I use advanced forensic techniques to recover evidence and provide detailed reports.'
    },
    {
        'title': 'Secure Code Review',
        'icon': 'fa-code',
        'description': 'Review source code for security vulnerabilities and provide remediation guidance. I analyze your codebase to identify security flaws and insecure patterns before they reach production.'
    },
    {
        'title': 'Front-End Web Developer',
        'icon': 'fa-laptop-code',
        'description': 'Build modern, responsive, and visually stunning websites using React.js, Python, CSS, and HTML.'
    }
]

# ==================== ROUTES ====================

@app.route('/')
def home():
    """Home page route"""
    return render_template('index.html',
                         skills=SKILLS_DATA,
                         projects=PROJECTS_DATA,
                         certifications=CERTIFICATIONS_DATA,
                         experience=EXPERIENCE_DATA,
                         services=SERVICES_DATA)

@app.route('/send_email', methods=['POST'])
def send_email():
    """Handle email sending from contact form"""
    try:
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip()
        message = request.form.get('message', '').strip()
        
        if not name or not email or not message:
            return jsonify({'success': False, 'message': 'All fields are required.'})
        
        if '@' not in email or '.' not in email:
            return jsonify({'success': False, 'message': 'Please enter a valid email address.'})
        
        msg = Message(
            subject=f'New Contact Form Submission from {name}',
            sender=app.config['MAIL_USERNAME'],
            recipients=['vajakaran95@gmail.com'],
            body=f"""
You have received a new message from your portfolio website:

Name: {name}
Email: {email}

Message:
{message}

---
This message was sent from your cybersecurity portfolio website.
            """
        )
        
        mail.send(msg)
        logger.info(f"Email sent successfully from {email}")
        
        return jsonify({'success': True, 'message': 'Your message has been sent successfully!'})
        
    except Exception as e:
        logger.error(f"Error sending email: {str(e)}")
        return jsonify({'success': False, 'message': f'Failed to send message: {str(e)}'})

# ========================================
# RESUME DOWNLOAD - FIXED
# ========================================

@app.route('/download_resume')
def download_resume():
    """Download resume PDF - Direct PDF Download"""
    try:
        # Check all possible locations
        resume_paths = [
            'static/images/resume/cybersecurity0.pdf',
            'static/images/cyber security/Resume.pdf',
            'static/images/cyber security/Vaja_Karan_Resume.pdf',
            'static/resume.pdf',
            'static/Resume.pdf',
            'static/images/resume.pdf',
            'static/files/resume.pdf',
            'resume.pdf'
        ]
        
        for path in resume_paths:
            if os.path.exists(path):
                logger.info(f"Resume found at: {path}")
                return send_file(
                    path,
                    as_attachment=True,
                    download_name='Vaja_Karan_Resume.pdf',
                    mimetype='application/pdf'
                )
        
        # If no PDF found, return error
        return jsonify({'error': 'Resume file not found. Please upload your resume PDF.'}), 404
        
    except Exception as e:
        logger.error(f"Error downloading resume: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.errorhandler(404)
def page_not_found(e):
    """Handle 404 errors"""
    return render_template('index.html'), 404

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    return render_template('index.html'), 500

# ==================== RUN APP ====================

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'True').lower() == 'true'
    app.run(host='0.0.0.0', port=port, debug=debug)