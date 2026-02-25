document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calcForm');
  const result = document.getElementById('result');
  const themeToggle = document.getElementById('themeToggle');

  // Function to calculate and update result
  const updateResult = () => {
    const design = parseFloat(form.design.value) || 0;
    const mass = parseFloat(form.mass.value) || 0;
    // Support print hours (decimal) and optional minutes -> combined hours
    const phRaw = form.printHours && form.printHours.value ? form.printHours.value : '';
    const pmRaw = form.printMinutes && form.printMinutes.value ? form.printMinutes.value : '';

    const ph = parseFloat(phRaw);
    const pm = parseFloat(pmRaw);

    const printTime = (Number.isFinite(ph) ? ph : 0) + (Number.isFinite(pm) ? (pm / 60) : 0);

    let cost = design * 30 + mass * 0.05 + printTime;
    let rounded = Math.round(cost / 5) * 5;
    if (rounded === 0) rounded = 5;
    result.textContent = `$${rounded}`;
  };

  // Update on input change (real-time)
  form.design.addEventListener('input', updateResult);
  form.mass.addEventListener('input', updateResult);
  if (form.printHours) form.printHours.addEventListener('input', updateResult);
  if (form.printMinutes) form.printMinutes.addEventListener('input', updateResult);

  // Initialize and update live on input
  updateResult();

  // Clear button: reset fields and update
  const clearBtn = document.getElementById('clear');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      form.design.value = '';
      form.mass.value = '';
      if (form.printHours) form.printHours.value = '';
      if (form.printMinutes) form.printMinutes.value = '';
      updateResult();
      form.design.focus();
    });
  }

  // Theme handling: persist in localStorage and toggle `body.dark`
  function applyTheme(t) {
    document.body.classList.toggle('dark', t === 'dark');
    if (themeToggle) {
      // themeToggle is now a checkbox input acting as a switch
      themeToggle.checked = t === 'dark';
      themeToggle.setAttribute('aria-checked', t === 'dark' ? 'true' : 'false');
    }
  }

  const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);

  if (themeToggle) {
    themeToggle.addEventListener('change', () => {
      const next = themeToggle.checked ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').then(reg => {
      // If there's an already-waiting SW, tell it to skipWaiting
      if (reg.waiting) {
        reg.waiting.postMessage('SKIP_WAITING');
      }

      // Listen for updates found (new SW installing)
      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && reg.waiting) {
            // Ask the new service worker to activate immediately
            reg.waiting.postMessage('SKIP_WAITING');
          }
        });
      });

      // Reload page when the new service worker takes control
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });
    }).catch(() => {});
  }
});
