// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(reg => console.log('Service Worker registered:', reg))
    .catch(err => console.error('Service Worker registration failed:', err));
}

let deferredPrompt = null;
let installable = false;

// Listen for beforeinstallprompt event
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('beforeinstallprompt event fired');
  e.preventDefault();           // Prevent default prompt
  deferredPrompt = e;           // Save event for later use
  installable = true;
  showCustomInstallBanner();
});

// Function to check if app is running in standalone mode
function isAppInstalled() {
  return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone;
}

function showCustomInstallBanner() {
  const banner = document.getElementById('install-banner');
  const installBtn = document.getElementById('install-btn');
  const dismissBtn = document.getElementById('dismiss-btn');

  if (!banner || !installBtn || !dismissBtn) return;

  // Case 1: App is already running in standalone (installed and opened)
  if (isAppInstalled()) {
    console.log('App running in standalone');
    banner.style.display = 'none';
    installBtn.textContent = 'Open in App';
    installBtn.onclick = () => {
      window.location.href = '/'; // or entry point
    };
  }
  // Case 2: App is not installed but installable
  else if (installable) {
    console.log('App is installable');
    banner.style.display = 'block';
    installBtn.textContent = 'Install App';
    installBtn.onclick = async () => {
      banner.style.display = 'none';
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;
        console.log('User response:', result.outcome);
        deferredPrompt = null;
      }
    };

    dismissBtn.onclick = () => {
      banner.style.display = 'none';
    };
  }
  // Case 3: App is not installable (already installed in Chrome’s view)
  else {
    console.log('App already installed (no beforeinstallprompt)');
    banner.style.display = 'none';
    installBtn.textContent = 'Open in App';
    installBtn.onclick = () => {
      window.location.href = '/'; // fallback entry point
    };
  }
}

// Run the check on page load
document.addEventListener('DOMContentLoaded', () => {
  showCustomInstallBanner();
});

// Hide banner once app is installed
window.addEventListener('appinstalled', () => {
  console.log('PWA installed');
  const banner = document.getElementById('install-banner');
  if (banner) banner.style.display = 'none';
});
