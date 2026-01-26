(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealAll = () => document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));

  if (reduceMotion) {
    revealAll();
    return;
  }

  window.addEventListener('load', () => {
    setTimeout(revealAll, 120);
  });
})();
