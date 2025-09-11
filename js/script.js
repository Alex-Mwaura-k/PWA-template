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

// Function to check if app has *ever* been installed (persistent flag)
function wasAppInstalledBefore() {
  return localStorage.getItem('pwaInstalled') === 'true';
}

function showCustomInstallBanner() {
  const banner = document.getElementById('install-banner');
  const installBtn = document.getElementById('install-btn');
  const dismissBtn = document.getElementById('dismiss-btn');

  // If the app is installed (standalone now, OR was installed before)
  if (isAppInstalled() || wasAppInstalledBefore()) {
    console.log('installed');
    banner.style.display = 'none';
    // Change button to "Open in App"
    installBtn.textContent = 'Open in App';
    installBtn.onclick = () => {
      // Handle app opening (direct to entry point)
      window.location.href = '/'; 
    };
  } else {
    // Show banner if not installed
    banner.style.display = 'block';

    // Install button click handler
    installBtn.textContent = 'Install App';
    installBtn.addEventListener('click', async () => {
      banner.style.display = 'none';
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        console.log('User response:', result.outcome);
        if (result.outcome === 'accepted') {
          localStorage.setItem('pwaInstalled', 'true'); // Mark installed
        }
        deferredPrompt = null;
      }
    });

    // Dismiss button click handler (Maybe Later)
    dismissBtn.addEventListener('click', () => {
      banner.style.display = 'none';
      localStorage.setItem('installBannerDismissTime', Date.now().toString());
    });
  }
}

// Run the check on page load
document.addEventListener('DOMContentLoaded', () => {
  showCustomInstallBanner();
});

// Persist install state once app is installed
window.addEventListener('appinstalled', () => {
  console.log('PWA installed');
  localStorage.setItem('pwaInstalled', 'true');
  const banner = document.getElementById('install-banner');
  if (banner) banner.style.display = 'none';
});
