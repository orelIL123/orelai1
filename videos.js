// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "orelai.firebaseapp.com",
    projectId: "orelai",
    storageBucket: "orelai.appspot.com",
    messagingSenderId: "XXXXXXXXXXXX",
    appId: "1:XXXXXXXXXXXX:web:XXXXXXXXXXXX"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const storage = firebase.storage();

// Load videos from Firebase Storage
async function loadVideos() {
    try {
        const videoElements = {
            'luai-video': 'luai/IMG_5177.MOV',
            'mor-video': 'MOR/IMG_5086.MOV',
            'odeya-video': 'ODEYA/IMG_5128.MOV',
            'stefan-video': 'STEFAN/IMG_4989.MOV',
            'yasmin-duda-video': 'MOR/YASMIN&DUDA/IMG_5078.MOV'
        };

        for (const [elementId, videoPath] of Object.entries(videoElements)) {
            try {
                const videoRef = storage.ref(videoPath);
                console.log(`Trying to load video: ${videoPath}`);
                const videoUrl = await videoRef.getDownloadURL();
                console.log(`Got URL for video: ${videoPath}`);
                const videoElement = document.getElementById(elementId);
                if (videoElement) {
                    videoElement.src = videoUrl;
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
    } catch (error) {
        console.error('Error initializing video loading:', error);
    }
}

// Load videos when the page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded, starting to load videos...');
    loadVideos();
}); 