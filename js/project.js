(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const gallery = document.querySelector('.media');

if (gallery) {
  const gallery = document.querySelector('.media');
const mqDesktop = window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');

const onWheel = (e) => {
  if (!gallery) return;
  if (e.shiftKey) return;

  gallery.scrollTop += e.deltaY;
  e.preventDefault();
};

const syncWheel = () => {
  window.removeEventListener('wheel', onWheel, { passive: false });

  if (mqDesktop.matches && gallery) {
    window.addEventListener('wheel', onWheel, { passive: false });
  }
};

syncWheel();
mqDesktop.addEventListener('change', syncWheel);

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
