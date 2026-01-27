(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealAll = () => {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
    const rail = document.querySelector('.rail');
    if (rail) rail.classList.add('is-visible');
  };

  window.addEventListener('load', () => {
    if (reduceMotion) return revealAll();
    setTimeout(revealAll, 120);
  });

  
  // ===== Rail loop (native scroll) + global wheel (works anywhere on page) =====
  (() => {
    const rail = document.querySelector('.rail');         // ✅ lo scroller vero
    const track = document.querySelector('.rail-track');  // ✅ contenitore cards
    if (!rail || !track) return;

    const originals = Array.from(track.children);
    if (originals.length === 0) return;

    const makeClone = (el) => {
      const c = el.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.tabIndex = -1;
      c.dataset.clone = '1';
      return c;
    };

    // Build: [clones][originals][clones]
    const left = originals.map(makeClone);
    const right = originals.map(makeClone);

    track.innerHTML = '';
    left.forEach(n => track.appendChild(n));
    originals.forEach(n => track.appendChild(n));
    right.forEach(n => track.appendChild(n));

    let oneLoopWidth = 0;

    const measure = () => {
      // larghezza di 1 “giro” (il blocco centrale)
      oneLoopWidth = track.scrollWidth / 3;
    };

    const goToCenterBlock = () => {
      measure();
      setPeek();
      rail.scrollLeft = oneLoopWidth + 1;
    };

      const setPeek = () => {
        const first = track.children[originals.length];
        const second = track.children[originals.length + 1];
        if (!first || !second) return;

        const r1 = first.getBoundingClientRect();
        const r2 = second.getBoundingClientRect();

        const cardW = r1.width;
        const gap = Math.max(0, r2.left - r1.right);

        const peekPx = cardW * 0.05 + gap; // <-- 0.25 = 1/4
        rail.style.setProperty('--peek', `${peekPx}px`);
      };


    const wrapIfNeeded = () => {
      if (!oneLoopWidth) return;

      if (rail.scrollLeft < oneLoopWidth * 0.5) {
        rail.scrollLeft += oneLoopWidth;
      } else if (rail.scrollLeft > oneLoopWidth * 1.5) {
        rail.scrollLeft -= oneLoopWidth;
      }
    };

    window.addEventListener('load', () => {
      requestAnimationFrame(() => requestAnimationFrame(goToCenterBlock));
    });

    window.addEventListener('resize', () => {
      requestAnimationFrame(() => {
      measure();
      setPeek();
      });
    });

    rail.addEventListener('scroll', wrapIfNeeded, { passive: true });

    // Scroll globale: funziona anche se il cursore NON è sulla rail
    const onWheel = (e) => {
      const desktop = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
      if (!desktop) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;

      const prev = rail.scrollLeft;
      const SPEED = 1.15;
      const target = prev + delta * SPEED;
      rail.scrollLeft = prev + (target - prev) * 0.6;

      if (rail.scrollLeft !== prev) e.preventDefault();
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
  })();

  // ===== Card → fullscreen transition =====
  const overlay = document.getElementById('card-transition');
  if (!overlay) return;

  function setRect(el) {
    const r = el.getBoundingClientRect();
    overlay.style.top = r.top + 'px';
    overlay.style.left = r.left + 'px';
    overlay.style.width = r.width + 'px';
    overlay.style.height = r.height + 'px';
  }

  document.querySelectorAll('a.card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (reduceMotion) return;
      e.preventDefault();

      const href = card.getAttribute('href');
      const media = card.querySelector('.card-media') || card;
      const bg = getComputedStyle(card).getPropertyValue('--hover-bg').trim() || '#111';

      overlay.style.transition = 'none';
      overlay.style.opacity = '1';
      overlay.style.backgroundColor = bg;
      overlay.classList.add('is-active');

      setRect(media);
      overlay.getBoundingClientRect(); // reflow

      overlay.style.transition = [
        'top 600ms cubic-bezier(.12,.85,.2,1)',
        'left 600ms cubic-bezier(.12,.85,.2,1)',
        'width 600ms cubic-bezier(.12,.85,.2,1)',
        'height 600ms cubic-bezier(.12,.85,.2,1)'
      ].join(', ');

      requestAnimationFrame(() => {
        overlay.style.top = '0px';
        overlay.style.left = '0px';
        overlay.style.width = window.innerWidth + 'px';
        overlay.style.height = window.innerHeight + 'px';
      });

      card.style.opacity = '0';

      const onDone = () => {
        overlay.removeEventListener('transitionend', onDone);
        window.location.href = href;
      };

      overlay.addEventListener('transitionend', onDone, { once: true });
    });
  });

  window.addEventListener('pageshow', () => {
    overlay.classList.remove('is-active');
    overlay.style.transition = '';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '0';
    overlay.style.height = '0';
    overlay.style.opacity = '0';
    document.querySelectorAll('a.card').forEach(card => (card.style.opacity = ''));
  });
})();
