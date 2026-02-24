document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calcForm');
  const result = document.getElementById('result');

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

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
