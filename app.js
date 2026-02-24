document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calcForm');
  const result = document.getElementById('result');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const design = parseFloat(form.design.value) || 0;
    const mass = parseFloat(form.mass.value) || 0;
    const printTime = parseFloat(form.printtime.value) || 0;

    let cost = design * 30 + mass * 0.05 + printTime;
    let rounded = Math.round(cost / 5) * 5;
    if (rounded === 0) rounded = 5;
    result.textContent = `$${rounded}`;
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
});
