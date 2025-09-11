// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('Service Worker registered:', reg))
    .catch(err => console.error('Service Worker registration failed:', err));
}

let deferredPrompt = null;

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt event fired');
  e.preventDefault();           // Prevent default prompt
  deferredPrompt = e;           // Save event for later use
  showCustomInstallBanner();    // Show your custom install UI
});

// Check if the app is already installed (running in standalone mode)
if (window.matchMedia('(display-mode: standalone)').matches) {
  console.log('App is installed');
  // If the app is installed, hide the install banner
  const banner = document.getElementById('install-banner');
  banner.style.display = 'none';
}

function showCustomInstallBanner() {
  const banner = document.getElementById('install-banner');
  
  // Only show the banner if the app is not installed
  if (!window.matchMedia('(display-mode: standalone)').matches) {
    banner.style.display = 'block';

    // Install button click handler
    document.getElementById('install-btn').addEventListener('click', async () => {
      banner.style.display = 'none';
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        console.log('User response:', result.outcome);
        deferredPrompt = null;
      }
    });

    // Dismiss button click handler
    document.getElementById('dismiss-btn').addEventListener('click', () => {
      banner.style.display = 'none';
    });
  }
}
