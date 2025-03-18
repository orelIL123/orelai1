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
firebase.initializeApp(firebaseConfig);

// Get a reference to storage
const storage = firebase.storage();

// Function to load videos
async function loadVideos() {
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
            if (videoElement) {
                const videoRef = storage.ref(path);
                try {
                    console.log(`Trying to load video: ${path}`);
                    const url = await videoRef.getDownloadURL();
                    console.log(`Got URL for video: ${path}`);
                    videoElement.src = url;
                    videoElement.parentElement.classList.add('video-loaded');
                    console.log(`Successfully loaded video: ${path}`);
                } catch (error) {
                    console.error(`Error loading video ${path}:`, error);
                    videoElement.parentElement.classList.add('video-error');
                }
            } else {
                console.error(`Could not find element with id: ${elementId}`);
            }
        }
    } catch (error) {
        console.error('Error initializing video loading:', error);
    }
}

// Load videos when the page is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, starting to load videos...');
    loadVideos();
}); 