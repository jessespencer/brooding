const canvas = document.getElementById("rive-canvas");
const fallback = document.getElementById("rive-fallback");
var themeInput = null;

function showFallback() {
  canvas.style.display = "none";
  fallback.style.display = "block";
}

// Guard against CDN failure
if (typeof rive === "undefined") {
  showFallback();
} else {
  const dpr = window.devicePixelRatio || 1;
  const baseWidth = Math.min(350, window.innerWidth * 0.9);
  const baseHeight = Math.round(baseWidth * (500 / 350));

  // Set canvas resolution for high-DPI screens
  canvas.width = baseWidth * dpr;
  canvas.height = baseHeight * dpr;
  canvas.style.width = `${baseWidth}px`;
  canvas.style.height = `${baseHeight}px`;

  const riveInstance = new rive.Rive({
    src: "assets/hopster-v2.riv",
    canvas: canvas,
    autoplay: true,
    stateMachines: ['HopsterMachine'],
    onLoad: () => {
      const inputs = riveInstance.stateMachineInputs('HopsterMachine');
      const eyesOpenInput = inputs.find(i => i.name === 'EyesOpen');
      themeInput = inputs.find(i => i.name === 'Theme');

      let eyesAreOpen = false;

      // Start with eyes closed
      if (eyesOpenInput && 'value' in eyesOpenInput) {
        eyesOpenInput.value = false;
      }

      // Sync Rive dark mode with current page theme
      if (themeInput) {
        themeInput.value = document.documentElement.classList.contains('dark');
      }

      function openEyes() {
        if (eyesOpenInput && 'value' in eyesOpenInput && !eyesAreOpen) {
          eyesOpenInput.value = true;
          eyesAreOpen = true;
        }
      }

      function closeEyes() {
        if (eyesOpenInput && 'value' in eyesOpenInput && eyesAreOpen) {
          eyesOpenInput.value = false;
          eyesAreOpen = false;
        }
      }

      // Desktop: hover to open eyes
      canvas.addEventListener('mouseenter', openEyes);
      canvas.addEventListener('mouseleave', closeEyes);

      // Mobile: tap to toggle eyes
      canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (eyesAreOpen) {
          closeEyes();
        } else {
          openEyes();
        }
      }, { passive: false });
    },
    onLoadError: showFallback
  });
}

// Dark mode toggle
const toggle = document.getElementById('theme-toggle');

function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark);
  toggle.classList.toggle('is-dark', dark);
  toggle.setAttribute('aria-checked', String(dark));
  if (themeInput) {
    themeInput.value = dark;
  }
}

applyTheme(document.documentElement.classList.contains('dark'));

// Manual toggle — saves explicit preference
toggle.addEventListener('click', () => {
  var isDark = !document.documentElement.classList.contains('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  applyTheme(isDark);
});

// Follow system changes when no manual preference is set
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (!localStorage.getItem('theme')) {
    applyTheme(e.matches);
  }
});
