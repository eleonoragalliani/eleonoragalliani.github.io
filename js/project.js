(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const info = document.querySelector('.info');
  const gallery = document.querySelector('.media');
  const mqDesktop = window.matchMedia('(min-width: 901px) and (hover: hover) and (pointer: fine)');

  // ===== Desktop wheel: scrolla prima INFO (se in overflow), poi GALLERY =====
  const canScroll = (el) => el && el.scrollHeight > el.clientHeight + 1;
  const atTop = (el) => el.scrollTop <= 0;
  const atBottom = (el) => el.scrollTop >= (el.scrollHeight - el.clientHeight - 1);

  const onWheel = (e) => {
    if (!info || !gallery) return;
    if (e.shiftKey) return;

    const delta = e.deltaY;
    const goingDown = delta > 0;
    const goingUp = delta < 0;

    // 1) prima INFO finché può scrollare
    if (canScroll(info)) {
      if ((goingDown && !atBottom(info)) || (goingUp && !atTop(info))) {
        info.scrollTop += delta;
        e.preventDefault();
        return;
      }
    }

    // 2) poi GALLERY
    gallery.scrollTop += delta;
    e.preventDefault();
  };

  const syncWheel = () => {
    window.removeEventListener('wheel', onWheel, { passive: false });

    // attivo SOLO su desktop
    if (mqDesktop.matches && info && gallery) {
      window.addEventListener('wheel', onWheel, { passive: false });
    }
  };

  syncWheel();
  mqDesktop.addEventListener('change', syncWheel);

  // ===== Reveal =====
  const revealAll = () => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    if (gallery) gallery.classList.add('is-visible');
  };

  window.addEventListener('load', () => {
    if (reduceMotion) return revealAll();

    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    setTimeout(() => {
      if (gallery) gallery.classList.add('is-visible');
    }, 160);
  });

  // ===== Exit animation back to home =====
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
