// Global variables
let particles = [];
let particleContainer;
let isLoaded = false;
let animatedElements = new Set();

// DOM elements
const loadingScreen = document.getElementById('loading-screen');
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const typewriter = document.getElementById('typewriter');
const backToTopBtn = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const projectModal = document.getElementById('project-modal');

// Data
const projects = [
    {
        title: "PHC Commons - Public Health Center Management",
        description: "Full Stack Web Application built as part of MasaiVerse x platformcommons Hackarena 2.O Hackathon. A comprehensive management system for Medical PHCs, Government, and Private entities.",
        technologies: ["Vite PWA", "Node.js", "Express.js", "Azure"],
        features: [
            "Patient Management System",
            "Inventory Tracking",
            "Appointment Scheduling",
            "Report Generation"
        ],
        challenges: "Completing core modules within a 2-day hackathon timeline while ensuring robust functionality.",
        challenges: "Completing core modules within a 2-day hackathon timeline while ensuring robust functionality.",
        keyLearnings: "Hosting a monorepo on Azure, Docker Networking, Healthcare Data Management, Schema Design",
        liveUrl: "https://phccommons.vercel.app/",
        githubUrl: "https://github.com/p4r1ch4y/phc_hms_platformcommons",
        youtubeEmbed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/ij-khjo1l_8?si=Fp0K8E0ojn-a0rmD" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    },
    {
        title: "LogisTech - Warehouse Orchestration System",
        description: "A centralised warehouse orchestration system built as a backend assignment for Masai School. users : Logistics and Warehousing sectors.",
        technologies: ["Backend", "Node.js", "Express.js", "TypeScript", "PostgreSQL", "Docker"],
        features: [
            "Centralized Inventory Control",
            "Order Processing Logic",
            "Warehouse Optimization",
            "API Documentation"
        ],
        challenges: "Designing a scalable backend architecture for complex logistics operations with the required algorithms and data structures.",
        keyLearnings: "Backend Architecture, API Design, Warehouse Logic Optimization, Data Structures, Algorithms, Optimization Techniques",
        liveUrl: "https://logistech-78pt.onrender.com/",
        githubUrl: "https://github.com/p4r1ch4y/logisTech",
        youtubeEmbed: null
    },
    {
        title: "Smart CRM System",
        description: "Full Stack Web Application built for Masters' Union Hackathon. Designed for Gym Owners & Business Owners to manage customer relationships effectively.",
        technologies: ["Full Stack", "CRM", "Business Tool"],
        features: [
            "Customer Data Management",
            "Lead Tracking",
            "Interaction History",
            "Analytics Dashboard"
        ],
        challenges: "Building a user-friendly CRM interface and backend logic within a tight 1.5-day deadline.",
        keyLearnings: "Customer Relationship Flows, Data Analytics, Frontend-Backend Integration",
        liveUrl: "https://smartcrmsystem.vercel.app/",
        githubUrl: "https://github.com/p4r1ch4y/crm-system",
        youtubeEmbed: null
    },
    {
        title: "Xporter - Universal Gateway CLI",
        description: "Universal Gateway CLI for x402.org protocol by Coinbase. Built during Solana and Base x402 Hackathon. Allows users to add payment gateway to their API using the x402 protocol.",
        technologies: ["Rust", "CLI", "Solana", "x402 Protocol"],
        features: [
            "Create, Manage Payment Gateway via CLI",
            "x402 Protocol Integration",
            "Cryptographic Proof Generation",
            "Payment Handling"
        ],
        challenges: "Implementing the complex x402 payment protocol and cryptographic proofs in a CLI tool.",
        keyLearnings: "Rust CLI Development, Cryptographic Proofs, Payment Protocol Implementation",
        liveUrl: "#",
        githubUrl: "https://github.com/p4r1ch4y/xporter",
        youtubeEmbed: null
    },
    {
        title: "Hangoutly - Event Planning App",
        description: "Full Stack Web Application for planning hangouts and outings. Built for MasaiVerse x Nobroker Hackarena Hackathon.",
        technologies: ["Full Stack", "Event Planning", "Social"],
        features: [
            "Event Creation & Scheduling",
            "Group Coordination",
            "Location Voting",
            "Itinerary Management"
        ],
        challenges: "Creating a seamless social planning experience and real-time coordination features.",
        keyLearnings: "Real-time Coordination, Social Features, Event Scheduling Logic",
        liveUrl: "https://hangoutly.pages.dev/",
        githubUrl: "https://github.com/p4r1ch4y/hangoutly_aryatechies",
        youtubeEmbed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/sm_AVYeH68c?si=fVI_ZGaYtPVLcxlc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    },
    {
        title: "Smart City OS - A Smart City Management OS",
        description: "AI-powered IoT Embedded Smart City Management OS / Application which tracks city wide sensor data and uses those data to predict and take better management decisions, records civil and serious sensor trend data immutably on the blockchain for improved governance and transparency.",
        technologies: ["Supabase", "Next.js 15", "Anchor Program", "IoT", "Blockchain", "LSTM ML"],
        features: [
            "Predictive Analytics - LSTM/ARIMA models",
            "Blockchain Integration - Solana-based logging",
            "Performance Optimization - React Query",
            "Citizen and Governance Services",
            "Incident Alert and Prediction Alerts"
        ],
        challenges: "Building and deploying dapp on Solana, troubled with batch transaction and data handling. Microservices, Containerization, CI/CD.",
        keyLearnings: "Microservices, Containerization, CI/CD, Huggingface Space, IoT data tracking, Data Visualization, Data Storage on Solana",
        liveUrl: "https://smartcityos.vercel.app/",
        githubUrl: "https://github.com/p4r1ch4y/smart_city_os",
        youtubeEmbed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/I6vC8y8_Lfo?si=MiO4OgOeO8L4NwxJ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    },
    {
        title: "Daily Spark Solana - A Dapp on Solana Devnet",
        description: "An interactive web3 application built on Solana Devnet. Built as the program assignment of School Of Solana S7 by Ackee Blockchain Security.",
        technologies: ["Solana Program", "Next.js 15", "Anchor Program", "Web3", "Blockchain"],
        features: [
            "Track Progress - View current streak",
            "Idea Prompt Generator",
            "Transaction Management",
            "Robust blockhash handling"
        ],
        challenges: "First time building and deploying dapp on Solana, troubled with blockhash handling and confirmation.",
        keyLearnings: "Solana, Rust, Anchor, Solana SDK, Solana CLI, Solana Wallet, Solana Validator, Solana Explorer",
        liveUrl: "https://dailysparksolana.vercel.app/",
        githubUrl: "#",
        youtubeEmbed: null
    },
    {
        title: "Stylus SDK Technical Documentation",
        description: "Comprehensive technical articles and smart contract development guides for Stylus SDK during DevRel Uni Cohort 6. Winner of Technical Writing Prize.",
        technologies: ["Stylus SDK", "Smart Contracts", "Technical Writing", "Web3", "Blockchain"],
        features: [
            "Comprehensive SDK documentation",
            "Smart contract development guides",
            "Code examples and tutorials",
            "Developer onboarding materials"
        ],
        challenges: "Breaking down complex blockchain concepts into accessible documentation.",
        challenges: "Breaking down complex blockchain concepts into accessible documentation.",
        keyLearnings: "Stylus SDK, Smart Contracts, Technical Writing, Web3, Blockchain",
        liveUrl: "https://bento.me/parichay",
        githubUrl: "#",
        youtubeEmbed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/GZpl6Bvg0Sw?si=jGWoOEeTQSjBF4Xk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><br><br><iframe width="560" height="315" src="https://www.youtube.com/embed/RCR7OqEXynY?si=0zpRRYXffRLKZ3Sy" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    },
    {
        title: "Job Portal - Full Stack Application",
        description: "Full-stack job portal with React frontend and Node.js backend using Mongoose MongoDB Database. College project at IIT Guwahati.",
        technologies: ["MongoDB", "Mongoose ODM", "Node.js", "React.js"],
        features: [
            "User authentication and authorization",
            "Job posting and management",
            "Application tracking system",
            "Real-time notifications"
        ],
        challenges: "Implementing efficient database queries with Mongoose ODM and creating a seamless user experience.",
        challenges: "Implementing efficient database queries with Mongoose ODM and creating a seamless user experience.",
        keyLearnings: "Mongoose, MongoDB, Node.js, Express.js, JWT, Bcrypt, MVC Architecture",
        liveUrl: "https://job-portal-frontend-parichay.vercel.app/",
        githubUrl: "https://github.com/p4r1ch4y/job-portal",
        youtubeEmbed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/jjY2d929PSk?si=Jhh2lwMNTV9C5mBp" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    },
    {
        title: "LifeWeeks - Your Life in 4,000 Weeks",
        description: "A modern, AI-powered interactive timeline application that visualizes your life week by week. Hackathon winner.",
        technologies: ["Next.js", "React.js", "PostgreSQL", "Tailwind CSS", "AI API"],
        features: [
            "Interactive life timeline visualization",
            "AI-powered insights and analysis",
            "Personal milestone tracking",
            "World events integration"
        ],
        challenges: "Integrating AI APIs for meaningful life insights while maintaining performance.",
        challenges: "Integrating AI APIs for meaningful life insights while maintaining performance.",
        keyLearnings: "Smart Visualization, Data Visualization, Huggingface ML response, DBMS, Wikipedia and History API, Calendar API",
        liveUrl: "https://lifeweeks.vercel.app/",
        githubUrl: "https://github.com/p4r1ch4y/FunctionForce_LifeInWeeks",
        youtubeEmbed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/L3h1uaF1KIs?si=Vo8PFoXwJC2Z_c8v" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    },
    {
        title: "SkillSync - Candidate and Recruiter Matching",
        description: "Candidate and Recruiter matching platform reimagined, built during hackathon xto10x.",
        technologies: ["Node.js", "SQL", "Team Leadership", "Hackathon Development"],
        features: [
            "Intelligent candidate-recruiter matching",
            "Skills-based filtering system",
            "Real-time communication platform",
            "Analytics dashboard"
        ],
        challenges: "Developing effective matching algorithms within hackathon time constraints.",
        challenges: "Developing effective matching algorithms within hackathon time constraints.",
        keyLearnings: "ORMs, Frontend and web app development, JWT",
        liveUrl: "https://skillsynced.vercel.app/",
        githubUrl: "https://github.com/p4r1ch4y/skillsync",
        youtubeEmbed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/wm9ZMgvbrlg?si=HCYXWQ0FVXK3AGau" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    },
    {
        title: "Digital Signal Processing Suite",
        description: "Comprehensive signal processing toolkit for real-time audio and biomedical signal analysis.",
        technologies: ["MATLAB", "Python", "NumPy", "SciPy", "DSP"],
        features: [
            "Real-time audio signal processing",
            "Biomedical signal analysis (ECG, EEG)",
            "Advanced filtering algorithms",
            "Spectral analysis and visualization"
        ],
        challenges: "Implementing real-time processing with minimal latency.",
        challenges: "Implementing real-time processing with minimal latency.",
        keyLearnings: "Signal Processing Algorithms, MATLAB/Python Integration, Real-time Analysis",
        liveUrl: "#",
        githubUrl: "#",
        youtubeEmbed: null
    },
    {
        title: "Fabrication of Inverter",
        description: "Group project on building a homemade AC-DC inverter that can be used as a portable power solution.",
        technologies: ["Electrical Engineering", "Electronics", "Circuit Design"],
        features: [
            "AC to DC power conversion",
            "Portable inverter design",
            "Circuit optimization",
            "Safety implementation"
        ],
        challenges: "Designing efficient power conversion circuits while ensuring safety standards.",
        challenges: "Designing efficient power conversion circuits while ensuring safety standards.",
        keyLearnings: "Power Electronics, Circuit Design, Safety Protocols",
        liveUrl: "#",
        githubUrl: "#",
        youtubeEmbed: null
    },
    {
        title: "Time Delay Relay Circuit using IC555",
        description: "Electronic circuit project implementing time delay functionality using IC555 timer and microcontroller integration.",
        technologies: ["IC555", "Microcontroller", "8051 Microcontroller", "Electronics"],
        features: [
            "Precise timing control",
            "Programmable delay settings",
            "Microcontroller integration",
            "Reliable relay switching"
        ],
        challenges: "Achieving precise timing accuracy with IC555 while integrating microcontroller functionality.",
        challenges: "Achieving precise timing accuracy with IC555 while integrating microcontroller functionality.",
        keyLearnings: "IC555 Timer Applications, Microcontroller Integration, Precision Timing",
        liveUrl: "#",
        githubUrl: "#",
        youtubeEmbed: null
    },
    {
        title: "Android Custom ROMs & Hacks",
        description: "Technical articles and tutorials on Android Custom ROMs and system modifications published on XDA Developers forums since 2017.",
        technologies: ["Android", "Custom ROMs", "Linux", "Technical Writing"],
        features: [
            "Custom ROM installation guides",
            "System modification tutorials",
            "Kernel development articles",
            "Community support and engagement"
        ],
        challenges: "Creating comprehensive guides for complex technical procedures.",
        challenges: "Creating comprehensive guides for complex technical procedures.",
        keyLearnings: "Android System Architecture, Kernel Development, Community Documentation",
        liveUrl: "#",
        githubUrl: "https://bento.me/parichay",
        youtubeEmbed: null
    },
    {
        title: "Gemini Adaptive Planner",
        description: "Your smart learning buddy - an app that actually understands you and your time and goals. Built for Google DeepMind - Vibe Code with Gemini 3 Pro Hackathon.",
        technologies: ["Gemini 3 Pro Preview", "Google AI Studio", "Prompt Engineering", "AI Agent"],
        features: [
            "Adaptive Learning Plans",
            "Smart Goal Understanding",
            "Time Management Integration",
            "Personalized AI Assistant"
        ],
        challenges: "Designing effective prompts for Gemini 3 Pro Preview to act as an adaptive planner.",
        keyLearnings: "Advanced Prompt Engineering, AI Agent Design, Google AI Studio Workflow",
        liveUrl: "https://aistudio.google.com/prompts/1QytT4J2naFCihfKo5N5C_kn_bOptsnfB",
        githubUrl: "#",
        youtubeEmbed: '<iframe width="560" height="315" src="https://www.youtube.com/embed/qY5U1OGoQac?si=feature" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
    },
    {
        title: "CIVIC - Client-side AI Guardian",
        description: "An on-device AI guardian that flags risky content and calls (misinformation, phishing, 'digital arrest' scams) in real time with clear explanations, while preserving user privacy.",
        technologies: ["AI/ML", "Privacy", "Web Extension", "Android", "On-Device"],
        features: [
            "Real-time Scam Detection",
            "On-device Privacy-first Analysis",
            "Web & Call Monitoring",
            "Educational Overlays"
        ],
        challenges: "Optimizing ML models for mobile devices while ensuring zero data leakage.",
        keyLearnings: "On-device ML, Privacy Engineering, Browser Extensions, Android Accessibility Services",
        liveUrl: "posts/civic-ai-guardian.html",
        githubUrl: "#",
        youtubeEmbed: null
    }
];

// Initialize application
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    // Force show loading screen
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        loadingScreen.style.opacity = '1';
    }

    // Show loading screen with progress
    showLoadingScreen();

    // Initialize components with proper timing
    setTimeout(() => {
        initializeTheme(); // Initialize theme first
        initializeParticles();
        initializeNavigation();
        initializeTypewriter();
        initializeSkillBars();
        initializeProjectFilters();
        initializeContactForm();
        initializeBackToTop();
        initializeStatsCounter();
        initializeModalFunctionality();
        initializeScrollAnimations();

        // Hide loading screen after everything is initialized
        setTimeout(() => {
            hideLoadingScreen();
            isLoaded = true;
        }, 500);
    }, 2500);
}

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';

    // Apply saved theme
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);

            // Re-initialize particles with new colors if needed
            if (particles.length > 0) {
                // Optional: Change particle colors based on theme
            }
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark'
            ? '<i class="fas fa-moon"></i>'
            : '<i class="fas fa-sun"></i>';
    }
}

// Loading Screen
function showLoadingScreen() {
    const progressBar = document.querySelector('.loading-progress');
    if (progressBar) {
        progressBar.style.width = '0%';

        // Animate progress bar
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 20 + 5;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            progressBar.style.width = progress + '%';
        }, 150);
    }
}

function hideLoadingScreen() {
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Particle System
function initializeParticles() {
    particleContainer = document.getElementById('particles-container');
    if (!particleContainer) return;

    // Create initial particles
    for (let i = 0; i < 30; i++) {
        createParticle();
    }

    // Animate particles
    animateParticles();

    // Add mouse interaction
    document.addEventListener('mousemove', handleMouseMove);
}

function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';

    const size = Math.random() * 3 + 1;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = Math.random() * window.innerWidth + 'px';
    particle.style.top = Math.random() * window.innerHeight + 'px';
    particle.style.opacity = Math.random() * 0.4 + 0.1;

    // Theme-aware colors could be implemented here
    const colors = ['#89b4fa', '#cba6f7', '#94e2d5'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];

    particle.velocity = {
        x: (Math.random() - 0.5) * 1,
        y: (Math.random() - 0.5) * 1
    };

    particles.push(particle);
    particleContainer.appendChild(particle);
}

function animateParticles() {
    particles.forEach((particle) => {
        if (!particle.parentNode) return;

        const rect = particle.getBoundingClientRect();

        // Update position
        particle.velocity.x += (Math.random() - 0.5) * 0.05;
        particle.velocity.y += (Math.random() - 0.5) * 0.05;

        // Limit velocity
        particle.velocity.x = Math.max(-1, Math.min(1, particle.velocity.x));
        particle.velocity.y = Math.max(-1, Math.min(1, particle.velocity.y));

        let newX = rect.left + particle.velocity.x;
        let newY = rect.top + particle.velocity.y;

        // Bounce off edges
        if (newX <= 0 || newX >= window.innerWidth) {
            particle.velocity.x *= -1;
            newX = Math.max(0, Math.min(window.innerWidth - 5, newX));
        }
        if (newY <= 0 || newY >= window.innerHeight) {
            particle.velocity.y *= -1;
            newY = Math.max(0, Math.min(window.innerHeight - 5, newY));
        }

        particle.style.left = newX + 'px';
        particle.style.top = newY + 'px';
    });

    requestAnimationFrame(animateParticles);
}

function handleMouseMove(e) {
    if (!isLoaded || Math.random() > 0.05) return;

    // Create trail effect
    const trail = document.createElement('div');
    trail.style.position = 'fixed';
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
    trail.style.width = '2px';
    trail.style.height = '2px';
    trail.style.background = '#89b4fa';
    trail.style.borderRadius = '50%';
    trail.style.pointerEvents = 'none';
    trail.style.zIndex = '1';
    trail.style.opacity = '0.6';
    trail.style.transition = 'all 0.5s ease-out';

    particleContainer.appendChild(trail);

    setTimeout(() => {
        trail.style.opacity = '0';
        trail.style.transform = 'scale(0)';
        setTimeout(() => {
            if (trail.parentNode) trail.remove();
        }, 500);
    }, 100);
}

// Navigation with smooth scrolling
function initializeNavigation() {
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth scroll navigation with offset
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only prevent default for hash links
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    smoothScrollTo(offsetTop, 800);
                }

                // Close mobile menu
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

function smoothScrollTo(targetPosition, duration) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// Typewriter Effect
function initializeTypewriter() {
    if (!typewriter) return;

    const text = "Subrata Choudhury";
    let index = 0;

    typewriter.textContent = '';

    function typeText() {
        if (index < text.length) {
            typewriter.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 120);
        }
    }

    setTimeout(typeText, 1500);
}

// Skills Animation - Enhanced
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        // Only create progress elements if they don't exist
        if (!bar.querySelector('.skill-progress')) {
            const progressDiv = document.createElement('div');
            progressDiv.className = 'skill-progress';

            const fillDiv = document.createElement('div');
            fillDiv.className = 'skill-fill';

            progressDiv.appendChild(fillDiv);
            bar.appendChild(progressDiv);
        }
    });
}

function animateSkillBars(container) {
    const skillBars = container.querySelectorAll('.skill-bar');
    skillBars.forEach((bar, index) => {
        const level = bar.getAttribute('data-level');
        const fillDiv = bar.querySelector('.skill-fill');

        if (fillDiv) {
            // Reset width first
            fillDiv.style.width = '0%';

            setTimeout(() => {
                fillDiv.style.width = level + '%';
            }, index * 150 + 200);
        }
    });
}

// Scroll Animations - Enhanced
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const elementId = entry.target.id || entry.target.className;

                if (!animatedElements.has(elementId)) {
                    entry.target.classList.add('animate-up');
                    animatedElements.add(elementId);

                    // Trigger specific animations
                    if (entry.target.classList.contains('skill-category')) {
                        setTimeout(() => animateSkillBars(entry.target), 300);
                    }
                    if (entry.target.classList.contains('about-stats')) {
                        setTimeout(() => animateStatsCounter(), 300);
                    }
                    if (entry.target.classList.contains('timeline-item')) {
                        const dot = entry.target.querySelector('.timeline-dot');
                        if (dot) {
                            setTimeout(() => dot.classList.add('active'), 200);
                        }
                    }
                }
            }
        });
    }, observerOptions);

    // Observe elements
    const elementsToAnimate = document.querySelectorAll('.skill-category, .project-card, .timeline-item, .about-info, .about-interests, .about-stats');
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Project Filters - Enhanced
function initializeProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');

                setTimeout(() => {
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                        card.style.display = 'block';
                    } else {
                        card.classList.add('hidden');
                        setTimeout(() => {
                            if (card.classList.contains('hidden')) {
                                card.style.display = 'none';
                            }
                        }, 300);
                    }
                }, index * 50);
            });
        });
    });
}

// Stats Counter - Enhanced
function initializeStatsCounter() {
    // This will be triggered by intersection observer
}

function animateStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach((stat, index) => {
        const target = parseInt(stat.getAttribute('data-target'));
        let current = 0;
        const increment = Math.ceil(target / 60);

        setTimeout(() => {
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                stat.textContent = current;
            }, 30);
        }, index * 200);
    });
}

// Contact Form - Enhanced
function initializeContactForm() {
    if (!contactForm) return;

    contactForm.addEventListener('submit', handleFormSubmit);

    // Add input validation styling
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', validateInput);
        input.addEventListener('focus', clearValidation);
    });
}

function validateInput(e) {
    const input = e.target;
    const value = input.value.trim();

    if (input.required && !value) {
        input.style.borderColor = '#ff0000';
    } else if (input.type === 'email' && value && !isValidEmail(value)) {
        input.style.borderColor = '#ff0000';
    } else {
        input.style.borderColor = 'var(--border-glass)';
    }
}

function clearValidation(e) {
    e.target.style.borderColor = 'var(--primary-color)';
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function handleFormSubmit(e) {
    e.preventDefault();

    // Validate all required fields
    const requiredFields = contactForm.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.style.borderColor = '#ff0000';
        }
    });

    if (!isValid) {
        showFormMessage('Please fill in all required fields.', 'error');
        return;
    }

    // Simulate form submission with loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    setTimeout(() => {
        showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function showFormMessage(message, type) {
    const messageDiv = document.getElementById('form-message');
    if (messageDiv) {
        messageDiv.style.display = 'block';
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;

        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

// Back to Top Button - Enhanced
function initializeBackToTop() {
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        smoothScrollTo(0, 800);
    });
}

// Modal Functionality - Enhanced
function initializeModalFunctionality() {
    const detailsBtns = document.querySelectorAll('.project-details-btn');
    const modalClose = document.querySelector('.modal-close');
    const downloadResumeBtn = document.getElementById('download-resume');

    // Project detail buttons
    detailsBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const projectIndex = parseInt(btn.getAttribute('data-project'));
            if (projects[projectIndex]) {
                showProjectModal(projects[projectIndex]);
            }
        });
    });

    // Modal close functionality
    if (modalClose) {
        modalClose.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    }

    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeModal();
            }
        });
    }

    // Resume download - Simple direct link approach
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', (e) => {
            // Let the browser handle the direct link download
            showNotification('Resume download started!', 'success');
        });
    }

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.style.display === 'block') {
            closeModal();
        }
    });
}

function showProjectModal(project) {
    if (!projectModal) return;

    const modalBody = document.getElementById('modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
        <h2 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">${project.title}</h2>
        <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">${project.description}</p>
        
        <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.2rem;">Technologies Used</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
        </div>
        
        <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.2rem;">Key Features</h3>
        <ul style="color: var(--text-secondary); margin-bottom: 2rem; padding-left: 1.5rem; line-height: 1.6;">
            ${project.features.map(feature => `<li style="margin-bottom: 0.5rem;">${feature}</li>`).join('')}
        </ul>
        
        <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.2rem;">Challenges & Solutions</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">${project.challenges}</p>
        
        ${project.keyLearnings ? `
        <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.2rem;">Key Learnings</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6; font-style: italic; border-left: 3px solid var(--primary-color); padding-left: 1rem;">${project.keyLearnings}</p>
        ` : ''}

        ${project.youtubeEmbed ? `
        <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.2rem;">Demo Video</h3>
        <div class="modal-video-container">
            ${project.youtubeEmbed.replace('<iframe', '<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"')}
        </div>
        ` : ''}

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
            <a href="${project.liveUrl}" class="btn btn--primary" target="_blank" style="text-decoration: none;">
                <i class="fas fa-external-link-alt"></i> Live Demo
            </a>
            <a href="${project.githubUrl}" class="btn btn--outline" target="_blank" style="text-decoration: none;">
                <i class="fab fa-github"></i> View Code
            </a>
        </div>
    `;

    projectModal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // Add animation
    setTimeout(() => {
        const modalContent = projectModal.querySelector('.modal-content');
        if (modalContent) {
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }
    }, 10);
}

function closeModal() {
    if (!projectModal) return;

    const modalContent = projectModal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.transform = 'scale(0.9)';
        modalContent.style.opacity = '0';
    }

    setTimeout(() => {
        projectModal.style.display = 'none';
        document.body.style.overflow = 'auto';

        // Clear modal content to stop video playback
        const modalBody = document.getElementById('modal-body');
        if (modalBody) modalBody.innerHTML = '';
    }, 200);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `form-message ${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '10001';
    notification.style.display = 'block';
    notification.style.minWidth = '200px';
    notification.style.maxWidth = '400px';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Window resize handler
window.addEventListener('resize', debounce(() => {
    // Recreate particles for new screen size
    if (particleContainer && particles.length > 0) {
        particles.forEach(particle => {
            if (particle.parentNode) {
                particle.remove();
            }
        });
        particles = [];

        // Create new particles for new screen size
        for (let i = 0; i < 30; i++) {
            createParticle();
        }
    }
}, 250));

// Initialize on page load
window.addEventListener('load', () => {
    // Performance monitoring
    if ('performance' in window && performance.mark) {
        performance.mark('portfolio-loaded');

        // Use modern Performance Observer API
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry) => {
                    if (entry.entryType === 'navigation') {
                        console.log(`Portfolio loaded in ${entry.loadEventEnd - entry.fetchStart}ms`);
                    }
                });
            });
            observer.observe({ entryTypes: ['navigation'] });
        }
    }

    console.log('Portfolio website loaded successfully!');
});

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Escape key closes modals
    if (e.key === 'Escape') {
        const modal = document.getElementById('project-modal');
        if (modal && modal.style.display === 'block') {
            closeModal();
        }
    }

    // Tab navigation improvements
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});
