// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('Service Worker registered:', reg))
    .catch(err => console.error('Service Worker registration failed:', err));
}

let deferredPrompt = null;

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();           // Prevent default prompt
  deferredPrompt = e;           // Save event for later use
  showCustomInstallBanner();    // Show your custom install UI
});

function showCustomInstallBanner() {
  const banner = document.getElementById('install-banner');
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