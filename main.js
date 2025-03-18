// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDtOYwSxSPQnLMJDpFx785PQdJuujvp5Ek",
    authDomain: "orelai.firebaseapp.com",
    projectId: "orelai",
    storageBucket: "orelai.firebasestorage.app",
    messagingSenderId: "132856983838",
    appId: "1:132856983838:web:c04bd71a47ad5cbf66c10f",
    measurementId: "G-T6H2Z4VK7R"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

// Load videos from Firebase Storage
async function loadVideos() {
    const videoElements = {
        'luai-video': 'LUAI/IMG_5177.MOV',
        'mor-video': 'MOR/IMG_5086.MOV',
        'odeya-video': 'ODEYA/IMG_5128.MOV',
        'stefan-video': 'STEFAN/IMG_4989.MOV',
        'yasmin-duda-video': 'YASMIN&DUDA/IMG_5078.MOV'
    };

    for (const [elementId, videoPath] of Object.entries(videoElements)) {
        try {
            console.log(`Trying to load video: ${videoPath}`);
            const videoRef = storage.ref(videoPath);
            const videoUrl = await videoRef.getDownloadURL();
            console.log(`Got URL for video: ${videoPath}`);
            const videoElement = document.getElementById(elementId);
            if (videoElement) {
                const sourceElement = videoElement.querySelector('source');
                sourceElement.src = videoUrl;
                videoElement.load();
                videoElement.play().catch(e => console.log('Auto-play failed:', e));
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

// Initialize Three.js background
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('background').appendChild(renderer.domElement);
    
    // Add particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 5000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 5;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.005,
        color: '#9370DB'
    });
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    camera.position.z = 2;
    
    // Animation
    function animate() {
        requestAnimationFrame(animate);
        particlesMesh.rotation.y += 0.001;
        renderer.render(scene, camera);
    }
    
    animate();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Load videos after Three.js is initialized
    console.log('Starting to load videos...');
    loadVideos();
}); 