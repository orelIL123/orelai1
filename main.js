// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
let particles;

// Load videos from Firebase Storage
async function loadVideos() {
    console.log("Starting to load videos");
    
    // קישורים ישירים לסרטונים
    const videoElements = {
        'luai-video': '/videos/LUAI/IMG_5177.MOV',
        'mor-video': '/videos/MOR/IMG_5086.MOV',
        'odeya-video': '/videos/ODEYA/IMG_5128.MOV',
        'stefan-video': '/videos/STEFAN/IMG_4989.MOV',
        'yasmin-duda-video': '/videos/YASMIN&DUDA/IMG_5078.MOV'
    };

    for (const [elementId, videoPath] of Object.entries(videoElements)) {
        try {
            console.log(`Setting video path: ${videoPath}`);
            const videoElement = document.getElementById(elementId);
            if (videoElement) {
                // הגדרת ה-src ישירות על אלמנט הווידאו
                videoElement.src = videoPath;
                
                // הוספת טיפול בשגיאה - אם יש שגיאה, ננסה להגדיר את ה-src שוב
                videoElement.onerror = function() {
                    console.log(`Error loading video: ${videoPath}, trying alternative...`);
                    const altPath = videoPath.replace('.MOV', '.mp4');
                    videoElement.src = altPath;
                    videoElement.load();
                };
                
                videoElement.load();
                const playPromise = videoElement.play();
                
                if (playPromise !== undefined) {
                    playPromise.catch(e => {
                        console.log('Auto-play failed:', e);
                        // הסר את השימוש באוטו-פליי אם צריך
                        videoElement.setAttribute('autoplay', false);
                        videoElement.setAttribute('controls', true);
                    });
                }
                
                videoElement.parentElement.classList.add('video-loaded');
                console.log(`Successfully loaded video: ${videoPath}`);
            } else {
                console.error(`Could not find element with id: ${elementId}`);
            }
        } catch (error) {
            console.error(`Error loading video ${videoPath}:`, error);
            const videoElement = document.getElementById(elementId);
            if (videoElement) {
                videoElement.parentElement.classList.add('video-error');
            }
        }
    }
}

let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let particleCount = 1000;
let particleGeometry, particleMaterial;
let cursorParticles = [];
const CURSOR_PARTICLE_COUNT = 50;

function init() {
    // Scene setup
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('hero-3d').appendChild(renderer.domElement);
    
    // Create purple particles
    particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 10;
        positions[i + 1] = (Math.random() - 0.5) * 10;
        positions[i + 2] = (Math.random() - 0.5) * 10;

        // Purple color with some variation
        colors[i] = 0.5 + Math.random() * 0.5;     // R
        colors[i + 1] = 0.2 + Math.random() * 0.3; // G
        colors[i + 2] = 0.8 + Math.random() * 0.2; // B
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    particleMaterial = new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Create cursor particles
    for (let i = 0; i < CURSOR_PARTICLE_COUNT; i++) {
        const particle = {
            x: 0,
            y: 0,
            age: 0,
            vx: 0,
            vy: 0,
            size: Math.random() * 5 + 2,
            color: `hsla(${280 + Math.random() * 40}, 80%, 60%, ${Math.random() * 0.5 + 0.5})`
        };
        cursorParticles.push(particle);
    }

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add point lights
    const pointLight1 = new THREE.PointLight(0x9b59b6, 1, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8e44ad, 1, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    camera.position.z = 5;

    // Initialize cursor
    initCursor();
    
    // Initialize portfolio items
    initPortfolio();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize section transitions
    initSectionTransitions();
    
    // Load videos from Firebase Storage
    loadVideos();
}

function initCursor() {
    const cursor = document.createElement('div');
    const cursorDot = document.createElement('div');
    cursor.className = 'cursor';
    cursorDot.className = 'cursor-dot';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorDot);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });

    // Hover effects for links and buttons
    const links = document.querySelectorAll('a, button');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.borderColor = '#8e44ad';
        });
        link.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.borderColor = '#9b59b6';
        });
    });
}

function initPortfolio() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const video = item.querySelector('video');
        if (!video) return;
        
        item.addEventListener('mouseenter', () => {
            video.play().catch(() => {
                console.log('Video autoplay failed');
            });
        });
        
        item.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });

        // 3D Tilt effect
        item.addEventListener('mousemove', (e) => {
            const rect = item.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            
            const dx = x - xc;
            const dy = y - yc;
            
            const tiltX = -(dy / yc) * 10;
            const tiltY = (dx / xc) * 10;
            
            item.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initSectionTransitions() {
    const sections = document.querySelectorAll('section');
    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (particles) {
        // Rotate particles
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.001;

        // Update particle positions
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] += Math.sin(Date.now() * 0.001 + positions[i]) * 0.001;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Handle form submission
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    alert('תודה! נחזור אליך בהקדם.');
    this.reset();
});

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    init();
    animate();
}); 