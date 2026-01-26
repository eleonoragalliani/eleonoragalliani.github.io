(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const gallery = document.querySelector('.media');

if (gallery) {
  window.addEventListener(
    'wheel',
    (e) => {
      // ignora scroll orizzontale
      if (e.shiftKey) return;

      gallery.scrollTop += e.deltaY;
      e.preventDefault();
    },
    { passive: false }
  );
}

  const revealAll = () => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    const media = document.querySelector('.media');
    if (media) media.classList.add('is-visible');
  };

  window.addEventListener('load', () => {
    if (reduceMotion) return revealAll();

    // Reveal text, then fade in the gallery (so it doesn't pop)
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    setTimeout(() => {
      const media = document.querySelector('.media');
      if (media) media.classList.add('is-visible');
    }, 160);
  });

  // Exit animation back to home (opacity only)
  document.querySelectorAll('[data-exit="home"]').forEach(link => {
    link.addEventListener('click', (e) => {
      if (reduceMotion) return;
      e.preventDefault();
      document.body.classList.add('is-fading-out');
      setTimeout(() => {
        window.location.href = link.getAttribute('href');
      }, 180);
    });
  });
})();
