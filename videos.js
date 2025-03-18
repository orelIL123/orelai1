// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDtCVwSxSP0nLMJDpFx785PdQJuujvp5Ek",
    authDomain: "orelai.firebaseapp.com",
    projectId: "orelai",
    storageBucket: "orelai.firebasestorage.app",
    messagingSenderId: "132056983838",
    appId: "1:132056983838:web:43f64f9ad32bd80266c10f",
    measurementId: "G-BK92WDZVL4"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Get a reference to storage
const storage = firebase.storage();

// Function to load videos
async function loadVideos() {
    console.log('Starting to load videos...');
    
    const videoElements = {
        'luai-video': 'luai/IMG_5177.MOV',
        'mor-video': 'MOR/IMG_5086.MOV',
        'odeya-video': 'ODEYA/IMG_5128.MOV',
        'stefan-video': 'STEFAN/IMG_4989.MOV',
        'yasmin-duda-video': 'YASMIN&DUDA/IMG_5078.MOV'
    };

    try {
        for (const [elementId, path] of Object.entries(videoElements)) {
            const videoElement = document.getElementById(elementId);
            if (!videoElement) {
                console.error(`Could not find video element with id: ${elementId}`);
                continue;
            }

            try {
                console.log(`Trying to load video from path: ${path}`);
                const storageRef = storage.ref();
                const videoRef = storageRef.child(path);
                
                // Add loading indicator
                videoElement.parentElement.classList.add('video-loading');
                
                const url = await videoRef.getDownloadURL();
                console.log(`Successfully got URL for video: ${path}`);
                
                // Set up video element
                videoElement.src = url;
                videoElement.type = 'video/quicktime';
                
                // Add event listeners
                videoElement.addEventListener('loadeddata', () => {
                    console.log(`Video loaded successfully: ${path}`);
                    videoElement.parentElement.classList.remove('video-loading');
                    videoElement.parentElement.classList.add('video-loaded');
                });
                
                videoElement.addEventListener('error', (error) => {
                    console.error(`Error playing video ${path}:`, error);
                    videoElement.parentElement.classList.remove('video-loading');
                    videoElement.parentElement.classList.add('video-error');
                });
                
            } catch (error) {
                console.error(`Error loading video ${path}:`, error);
                console.error('Error code:', error.code);
                console.error('Error message:', error.message);
                videoElement.parentElement.classList.remove('video-loading');
                videoElement.parentElement.classList.add('video-error');
            }
        }
    } catch (error) {
        console.error('Fatal error in video loading:', error);
    }
}

// Load videos when the page is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, initializing video loading...');
    loadVideos().catch(error => {
        console.error('Error in main video loading process:', error);
    });
}); 