// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
let particles;

// טיפול בהטמעות אינסטגרם ובתיק העבודות
function initInstagramPosts() {
    console.log("Initializing Instagram posts");
    
    // פונקציית עזר לעיבוד הטמעות אינסטגרם
    function processEmbeds() {
        if (window.instgrm) {
            console.log("Processing Instagram embeds");
            window.instgrm.Embeds.process();
        }
    }
    
    // נסה לעבד את ההטמעות כעת
    processEmbeds();
    
    // נסה לעבד שוב אחרי שניה, למקרה שה-SDK טרם נטען
    setTimeout(processEmbeds, 1000);
    
    // נסה לעבד שוב אחרי 3 שניות
    setTimeout(processEmbeds, 3000);
    
    // נסה לעבד שוב אחרי 5 שניות
    setTimeout(processEmbeds, 5000);
    
    // בדוק אם צריך לטעון מחדש את ה-SDK
    setTimeout(() => {
        const iframes = document.querySelectorAll('.instagram-media iframe');
        const allLoaded = Array.from(iframes).every(iframe => iframe.contentDocument || iframe.contentWindow);
        
        if (!allLoaded) {
            console.log("Some Instagram embeds still not loaded, reloading SDK");
            
            // טען מחדש את סקריפט אינסטגרם
            const oldScript = document.querySelector('script[src*="instagram.com/embed.js"]');
            if (oldScript) {
                oldScript.remove();
            }
            
            const newScript = document.createElement('script');
            newScript.async = true;
            newScript.src = "//www.instagram.com/embed.js";
            document.body.appendChild(newScript);
            
            // נסה לעבד שוב אחרי טעינת הסקריפט החדש
            newScript.onload = processEmbeds;
        }
    }, 6000);
    
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
        const overlay = item.querySelector('.overlay');
        
        // הוספת אינטראקציה
        if (overlay) {
            item.addEventListener('mouseenter', () => {
                overlay.style.opacity = '1';
            });
            
            item.addEventListener('mouseleave', () => {
                overlay.style.opacity = '0';
            });
        }
    });
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth - 0.5;
    mouseY = e.clientY / window.innerHeight - 0.5;
});

function setupThreeJS() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('hero-3d').appendChild(renderer.domElement);

    camera.position.z = 5;

    // Particle setup
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < 2000; i++) {
        vertices.push(
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 10
        );
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    const material = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x9b59b6,
        transparent: true,
        opacity: 0.8,
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Resize handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (particles) {
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;

        // Move based on mouse position
        particles.rotation.x += mouseY * 0.01;
        particles.rotation.y += mouseX * 0.01;
    }

    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

function initPortfolio() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    portfolioItems.forEach(item => {
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

function revealSections() {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (sectionTop < windowHeight * 0.75) {
            section.classList.add('visible');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setupThreeJS();
    animate();
    initPortfolio();
    initInstagramPosts();
    
    // Add reveal on scroll
    window.addEventListener('scroll', revealSections);
    revealSections(); // Initial check
    
    // Wait a bit and process Instagram embeds again to ensure they load
    setTimeout(() => {
        if (window.instgrm) {
            window.instgrm.Embeds.process();
        }
    }, 3000);
}); 