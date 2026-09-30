// Global variables
const REDUCE_MOTION = !!window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Under reduced motion anime.js runs effectively instantly (loops below are skipped)
if (REDUCE_MOTION && window.anime) window.anime.speed = 1000;
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

// Helpers
function canAnimate() {
    return !!window.anime && !REDUCE_MOTION;
}

function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
}

function isRealUrl(url) {
    return typeof url === 'string' && url.trim() !== '' && url.trim() !== '#';
}

function getNavOffset() {
    return (navbar ? navbar.offsetHeight : 68) + 12;
}

// Initialize application
document.addEventListener('DOMContentLoaded', function () {
    initializeApp();
});

function initializeApp() {
    // The loader is purely cosmetic: every component initialises immediately
    // and one failing init never blocks the others (or the loader).
    try { setupLoader(); } catch (e) { hideLoadingScreenNow(); }

    [
        initializeTheme,
        initializeNavigation,
        initializeSkillBars,
        initializeProjectFilters,
        initializeContactForm,
        initializeBackToTop,
        initializeStatsCounter,
        initializeModalFunctionality,
        initializeScrollAnimations,
        initializeHoverAnimations,
        initializeHeroAnimations
    ].forEach(function (init) {
        try { init(); } catch (e) { /* keep going */ }
    });

    isLoaded = true;
}

// Theme Management
function initializeTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    // The head guard already resolved stored / prefers-color-scheme; data-theme is the source of truth
    const savedTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    updateThemeIcon(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            const apply = () => {
                document.documentElement.setAttribute('data-theme', newTheme);
                try { localStorage.setItem('theme', newTheme); } catch (e) { /* storage blocked */ }
                updateThemeIcon(newTheme);
            };

            // Circular reveal growing from the toggle button (theme-switch.js)
            if (window.themeSwitch) window.themeSwitch(themeToggle, apply);
            else apply();
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

// Loading Screen (cosmetic: min 400ms, capped at 1200ms, once per session)
const LOADER_MIN_MS = 400;
const LOADER_CAP_MS = 1200;
let loaderFinished = false;

function setupLoader() {
    if (!loadingScreen) return;

    let seen = false;
    try { seen = sessionStorage.getItem('loaderSeen') === '1'; } catch (e) { /* storage blocked */ }
    if (seen) {
        hideLoadingScreenNow();
        return;
    }
    try { sessionStorage.setItem('loaderSeen', '1'); } catch (e) { /* storage blocked */ }

    loadingScreen.style.display = 'flex';
    loadingScreen.style.opacity = '1';

    const start = performance.now();
    const finish = () => {
        if (loaderFinished) return;
        loaderFinished = true;
        hideLoadingScreen();
    };

    // Hide-timers are registered before anything that could throw
    setTimeout(finish, LOADER_CAP_MS);
    const onLoaded = () => setTimeout(finish, Math.max(0, LOADER_MIN_MS - (performance.now() - start)));
    if (document.readyState === 'complete') onLoaded();
    else window.addEventListener('load', onLoaded, { once: true });

    try { showLoadingScreen(); } catch (e) { /* decorative only */ }
}

function showLoadingScreen() {
    const progressBar = document.querySelector('.loading-progress');
    const loadingText = document.querySelector('.loading-text');
    const loadingLogo = document.querySelector('.loading-logo');

    if (!window.anime) {
        if (progressBar) progressBar.style.width = '100%';
        return;
    }

    if (progressBar) {
        anime({
            targets: progressBar,
            width: ['0%', '100%'],
            easing: 'easeInOutQuad',
            duration: LOADER_CAP_MS
        });
    }
    if (loadingText && !REDUCE_MOTION) {
        anime({
            targets: loadingText,
            opacity: [0.5, 1],
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
            duration: 800
        });
    }
    if (loadingLogo && !REDUCE_MOTION) {
        anime({
            targets: loadingLogo,
            scale: [0.9, 1.1],
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
            duration: 1000
        });
    }
}

function hideLoadingScreenNow() {
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
        loadingScreen.style.opacity = '0';
    }
}

function hideLoadingScreen() {
    if (!loadingScreen) return;
    if (!canAnimate()) {
        hideLoadingScreenNow();
        return;
    }
    try {
        anime.timeline({
            complete: function () {
                loadingScreen.style.display = 'none';
            }
        })
            .add({
                targets: '.loading-content > *',
                translateY: -50,
                opacity: 0,
                duration: 400,
                delay: anime.stagger(100),
                easing: 'easeInExpo'
            })
            .add({
                targets: loadingScreen,
                opacity: 0,
                duration: 500,
                easing: 'easeOutSine'
            }, '-=200');
        // Safety net: never leave the overlay up if the animation stalls
        setTimeout(hideLoadingScreenNow, 1800);
    } catch (e) {
        hideLoadingScreenNow();
    }
}

// Navigation with smooth scrolling
function setMobileMenu(open) {
    if (navMenu) navMenu.classList.toggle('active', open);
    if (navToggle) {
        navToggle.classList.toggle('active', open);
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
}

function initializeNavigation() {
    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.preventDefault();
            setMobileMenu(!navMenu.classList.contains('active'));
        });
    }

    // Smooth scroll navigation with offset
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href') || '';
            // Only prevent default for in-page hash links
            if (href.length > 1 && href.startsWith('#')) {
                let targetSection = null;
                try { targetSection = document.querySelector(href); } catch (err) { /* invalid selector */ }
                if (!targetSection) return;

                e.preventDefault();
                const offsetTop = targetSection.getBoundingClientRect().top + window.pageYOffset - getNavOffset();
                smoothScrollTo(offsetTop, 800);
                setMobileMenu(false);
            }
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', updateActiveNavLink);

    // Navbar scroll effect
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

function smoothScrollTo(targetPosition, duration) {
    if (REDUCE_MOTION) {
        window.scrollTo(0, targetPosition);
        return;
    }

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
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const offset = getNavOffset();

    let currentSection = '';
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Section is current once its top has reached the navbar offset
        if (rect.top <= offset + 2 && rect.bottom > offset + 2) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (currentSection && link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
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
            if (!canAnimate()) {
                fillDiv.style.width = level + '%';
                return;
            }
            anime({
                targets: fillDiv,
                width: ['0%', level + '%'],
                easing: 'easeInOutQuart',
                duration: 2000,
                delay: index * 150
            });
        }
    });
}

// Scroll Animations - Enhanced
function initializeScrollAnimations() {
    const elementsToAnimate = document.querySelectorAll('.skill-category, .project-card, .timeline-item, .about-info, .about-interests, .about-stats');
    const animate = canAnimate();
    const hiddenByUs = new Set();

    const trigger = (el) => {
        if (el.classList.contains('skill-category')) {
            setTimeout(() => animateSkillBars(el), 150);
        }
        if (el.classList.contains('about-stats')) {
            setTimeout(() => animateStatsCounter(), 150);
        }
        if (el.classList.contains('timeline-item')) {
            const dot = el.querySelector('.timeline-dot');
            if (dot) {
                if (animate) {
                    anime({
                        targets: dot,
                        scale: [0, 1],
                        opacity: [0, 1],
                        easing: 'easeOutQuart',
                        duration: 1200,
                        delay: 300
                    });
                }
                dot.classList.add('active');
            }
        }
    };

    // Without IntersectionObserver just show/run everything
    if (!('IntersectionObserver' in window)) {
        elementsToAnimate.forEach(trigger);
        return;
    }

    // Hide only what is currently below the fold, so Anime.js can fade it in
    if (animate) {
        elementsToAnimate.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top > window.innerHeight) {
                el.style.opacity = '0';
                hiddenByUs.add(el);
            }
        });
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                // Soft gliding animation for revealing elements
                if (animate && hiddenByUs.has(el)) {
                    anime({
                        targets: el,
                        translateY: [40, 0],
                        opacity: [0, 1],
                        easing: 'easeOutQuart',
                        duration: 1500
                    });
                }

                trigger(el);

                // Stop observing once animated
                observer.unobserve(el);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe elements
    elementsToAnimate.forEach(el => observer.observe(el));
}

// Project Filters - Enhanced
function initializeProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    if (!filterBtns.length) return;

    let pendingTimers = [];

    filterBtns.forEach(b => b.setAttribute('aria-pressed', b.classList.contains('active') ? 'true' : 'false'));

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Remove active class from all buttons
            filterBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-pressed', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');

            const filter = btn.getAttribute('data-filter');

            // Rapid clicks: drop timers from the previous filter
            pendingTimers.forEach(clearTimeout);
            pendingTimers = [];

            projectCards.forEach((card, index) => {
                const category = card.getAttribute('data-category');

                pendingTimers.push(setTimeout(() => {
                    if (filter === 'all' || category === filter) {
                        card.classList.remove('hidden');
                        card.style.display = 'block';
                    } else {
                        card.classList.add('hidden');
                        pendingTimers.push(setTimeout(() => {
                            if (card.classList.contains('hidden')) {
                                card.style.display = 'none';
                            }
                        }, 300));
                    }
                }, index * 50));
            });
        });
    });
}

// Stats Counter - Enhanced
let statsAnimated = false;

function initializeStatsCounter() {
    // This will be triggered by intersection observer
}

function animateStatsCounter() {
    if (statsAnimated) return;
    statsAnimated = true;

    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach((stat, index) => {
        const targetText = (stat.getAttribute('data-target') || stat.textContent || '').trim();
        const match = targetText.match(/^(\d+)(.*)$/);

        if (!match || REDUCE_MOTION) {
            stat.textContent = targetText;
            return;
        }

        const target = parseInt(match[1], 10);
        const suffix = match[2];
        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 60));

        setTimeout(() => {
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    clearInterval(timer);
                    stat.textContent = targetText;
                    return;
                }
                stat.textContent = current + suffix;
            }, 30);
        }, index * 200);
    });
}

// Contact Form - Enhanced
let formMessageTimer = null;

function initializeContactForm() {
    if (!contactForm) return;

    const messageDiv = document.getElementById('form-message');
    if (messageDiv) {
        messageDiv.setAttribute('role', 'status');
        messageDiv.setAttribute('aria-live', 'polite');
    }

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

    // Honeypot: bots fill hidden "botcheck"; pretend success and send nothing
    const honeypot = contactForm.querySelector('[name="botcheck"]');
    if (honeypot && (honeypot.type === 'checkbox' ? honeypot.checked : honeypot.value)) {
        showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
        contactForm.reset();
        return;
    }

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

    // Submit form via Web3Forms API
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
    }

    const formData = new FormData(contactForm);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(async (response) => {
        const json = await response.json();
        if (response.status === 200) {
            showFormMessage('Thank you for your message! I\'ll get back to you soon.', 'success');
            contactForm.reset();
        } else {
            showFormMessage(json.message || 'Something went wrong!', 'error');
        }
    })
    .catch(() => {
        showFormMessage('Something went wrong! Please try again.', 'error');
    })
    .finally(() => {
        if (submitBtn) {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

function showFormMessage(message, type) {
    const messageDiv = document.getElementById('form-message');
    if (messageDiv) {
        messageDiv.style.display = 'block';
        messageDiv.className = `form-message ${type}`;
        messageDiv.textContent = message;

        clearTimeout(formMessageTimer);
        formMessageTimer = setTimeout(() => {
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

// Hover Animations - Anime.js Physics
function initializeHoverAnimations() {
    if (!canAnimate()) return;

    const interactables = document.querySelectorAll('.project-card, .btn, .nav-link, .timeline-item');

    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (!window.anime) return;
            anime.remove(el);
            anime({
                targets: el,
                scale: 1.02,
                translateY: -3,
                duration: 800,
                easing: 'easeOutQuart'
            });
        });

        el.addEventListener('mouseleave', () => {
            if (!window.anime) return;
            anime.remove(el);
            anime({
                targets: el,
                scale: 1,
                translateY: 0,
                duration: 1200,
                easing: 'easeOutQuart'
            });
        });
    });
}

// Hero Animations - Floating Profile
function initializeHeroAnimations() {
    const profile = document.querySelector('.profile-circle');
    if (profile && canAnimate()) {
        anime({
            targets: profile,
            translateY: [-15, 15],
            direction: 'alternate',
            loop: true,
            easing: 'easeInOutSine',
            duration: 4000
        });
    }
}

// Modal Functionality - Enhanced
let modalLastFocus = null;
let modalPrevOverflow = '';
let modalCloseTimer = null;

function isModalOpen() {
    return !!projectModal && projectModal.style.display === 'block';
}

function initializeModalFunctionality() {
    const detailsBtns = document.querySelectorAll('.project-details-btn');
    const modalClose = document.querySelector('.modal-close');
    const downloadResumeBtn = document.getElementById('download-resume');

    // Project detail buttons
    detailsBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const projectIndex = parseInt(btn.getAttribute('data-project'), 10);
            if (projects[projectIndex]) {
                showProjectModal(projects[projectIndex], btn);
            }
        });
    });

    // Modal close functionality
    if (modalClose) {
        if (modalClose.tagName !== 'BUTTON') {
            // Fallback while the markup is still a non-interactive element
            modalClose.setAttribute('role', 'button');
            modalClose.setAttribute('tabindex', '0');
            modalClose.setAttribute('aria-label', 'Close');
            modalClose.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    closeModal();
                }
            });
        }
        modalClose.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal();
        });
    }

    if (projectModal) {
        projectModal.setAttribute('role', 'dialog');
        projectModal.setAttribute('aria-modal', 'true');
        projectModal.setAttribute('aria-labelledby', 'modal-title');

        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                closeModal();
            }
        });
    }

    // Resume download - Simple direct link approach
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', () => {
            // Let the browser handle the direct link download
            const href = downloadResumeBtn.getAttribute('href');
            if (href && href !== '#') {
                showNotification('Resume download started!', 'success');
            }
        });
    }

    // Single keyboard handler: Escape closes, Tab is trapped inside the dialog
    document.addEventListener('keydown', (e) => {
        if (!isModalOpen()) return;
        // The external-link confirmation sits above this modal and owns the keys while open
        if (document.querySelector('.elm-overlay.open')) return;

        if (e.key === 'Escape') {
            closeModal();
        } else if (e.key === 'Tab') {
            trapModalFocus(e);
        }
    });
}

function getModalFocusables() {
    return Array.prototype.filter.call(
        projectModal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
        el => el.offsetParent !== null
    );
}

function trapModalFocus(e) {
    const focusables = getModalFocusables();
    if (!focusables.length) {
        e.preventDefault();
        return;
    }
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!projectModal.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
}

function projectLinkButton(url, cls, icon, label) {
    if (!isRealUrl(url)) return '';
    return `
            <a href="${escapeHTML(url)}" class="btn ${cls}" target="_blank" rel="noopener noreferrer" style="text-decoration: none;">
                <i class="${icon}" aria-hidden="true"></i> ${label}
            </a>`;
}

function showProjectModal(project, opener) {
    if (!projectModal) return;

    const modalBody = document.getElementById('modal-body');
    if (!modalBody) return;

    clearTimeout(modalCloseTimer);

    modalBody.innerHTML = `
        <h2 id="modal-title" style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">${escapeHTML(project.title)}</h2>
        <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">${escapeHTML(project.description)}</p>
        
        <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.2rem;">Technologies Used</h3>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 2rem;">
            ${project.technologies.map(tech => `<span class="tech-tag">${escapeHTML(tech)}</span>`).join('')}
        </div>
        
        <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.2rem;">Key Features</h3>
        <ul style="color: var(--text-secondary); margin-bottom: 2rem; padding-left: 1.5rem; line-height: 1.6;">
            ${project.features.map(feature => `<li style="margin-bottom: 0.5rem;">${escapeHTML(feature)}</li>`).join('')}
        </ul>
        
        <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.2rem;">Challenges & Solutions</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6;">${escapeHTML(project.challenges)}</p>
        
        ${project.keyLearnings ? `
        <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.2rem;">Key Learnings</h3>
        <p style="color: var(--text-secondary); margin-bottom: 2rem; line-height: 1.6; font-style: italic; border-left: 3px solid var(--primary-color); padding-left: 1rem;">${escapeHTML(project.keyLearnings)}</p>
        ` : ''}

        ${project.youtubeEmbed ? `
        <h3 style="color: var(--text-primary); margin-bottom: 1rem; font-size: 1.2rem;">Demo Video</h3>
        <div class="modal-video-container">
            ${project.youtubeEmbed.replace('<iframe', '<iframe style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"')}
        </div>
        ` : ''}

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">${projectLinkButton(project.liveUrl, 'btn--primary', 'fas fa-external-link-alt', 'Live Demo')}${projectLinkButton(project.githubUrl, 'btn--outline', 'fab fa-github', 'View Code')}
        </div>
    `;

    if (!isModalOpen()) {
        modalPrevOverflow = document.body.style.overflow;
        modalLastFocus = opener || document.activeElement;
    }
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

    // Move focus into the dialog: the close control
    const closeBtn = projectModal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
}

function closeModal() {
    if (!projectModal || !isModalOpen()) return;

    const modalContent = projectModal.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.transform = 'scale(0.9)';
        modalContent.style.opacity = '0';
    }

    clearTimeout(modalCloseTimer);
    modalCloseTimer = setTimeout(() => {
        projectModal.style.display = 'none';
        document.body.style.overflow = modalPrevOverflow;

        // Clear modal content to stop video playback
        const modalBody = document.getElementById('modal-body');
        if (modalBody) modalBody.innerHTML = '';
    }, 200);

    // Return focus to whatever opened the dialog
    if (modalLastFocus && typeof modalLastFocus.focus === 'function' && document.contains(modalLastFocus)) {
        modalLastFocus.focus();
    }
    modalLastFocus = null;
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `form-message ${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'status');
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

// Accessibility improvements
document.addEventListener('keydown', (e) => {
    // Tab navigation improvements
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});
