document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calcForm');
  const result = document.getElementById('result');
  const themeToggle = document.getElementById('themeToggle');

  // Function to calculate and update result
  const updateResult = () => {
    const design = parseFloat(form.design.value) || 0;
    const mass = parseFloat(form.mass.value) || 0;
    const printTime = parseFloat(form.printtime.value) || 0;

    let cost = design * 30 + mass * 0.05 + printTime;
    let rounded = Math.round(cost / 5) * 5;
    if (rounded === 0) rounded = 5;
    result.textContent = `$${rounded}`;
  };

  // Update on input change (real-time)
  form.design.addEventListener('input', updateResult);
  form.mass.addEventListener('input', updateResult);
  form.printtime.addEventListener('input', updateResult);

  // Initialize and update live on input
  updateResult();

  // Theme handling: persist in localStorage and toggle `body.dark`
  function applyTheme(t) {
    document.body.classList.toggle('dark', t === 'dark');
    if (themeToggle) themeToggle.textContent = t === 'dark' ? '☀️' : '🌙';
  }

  const saved = localStorage.getItem('theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  applyTheme(saved);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const next = document.body.classList.contains('dark') ? 'light' : 'dark';
      localStorage.setItem('theme', next);
      applyTheme(next);
    });
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
