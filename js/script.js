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

// Function to check if app is running in standalone mode
function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
}

function showCustomInstallBanner() {
  const banner = document.getElementById('install-banner');
  const installBtn = document.getElementById('install-btn');
  const dismissBtn = document.getElementById('dismiss-btn');

  // If the app is already installed (standalone mode), show "Open in App" button
  if (isAppInstalled()) {
    console.log('App is already installed');
    banner.style.display = 'none'; // Hide the install banner
    // Change button to "Open in App"
    installBtn.textContent = 'Open in App';
    installBtn.onclick = () => {
      // Handle app opening (e.g., direct to the home screen app)
      window.location.href = '/'; // or any entry point for your app
    };
  } else {
    // Only show the banner if the app is not installed
    banner.style.display = 'block';

    // Install button click handler
    installBtn.textContent = 'Install App';
    installBtn.addEventListener('click', async () => {
      banner.style.display = 'none';
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        console.log('User response:', result.outcome);
        deferredPrompt = null;
      }
    });

    // Dismiss button click handler (Maybe Later)
    dismissBtn.addEventListener('click', () => {
      banner.style.display = 'none';
      // Store the current time when "Maybe Later" is clicked
      localStorage.setItem('installBannerDismissTime', Date.now().toString());
    });
  }
}

// Run the check on page load to hide the banner if needed
document.addEventListener('DOMContentLoaded', () => {
  showCustomInstallBanner();
});
