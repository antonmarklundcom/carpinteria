(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobilePanel = document.querySelector('.mobile-panel');
  const navGroups = Array.from(document.querySelectorAll('.nav-group'));

  const closeMobileMenu = () => {
    if (!menuButton || !mobilePanel) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    mobilePanel.classList.remove('is-open');
    document.body.classList.remove('menu-open');
  };

  menuButton?.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    mobilePanel?.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  });

  mobilePanel?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileMenu));

  navGroups.forEach((group) => {
    const trigger = group.querySelector('.nav-trigger');
    trigger?.addEventListener('click', (event) => {
      // The trigger is a real link to its category's landing page so the menu
      // still works with JS disabled; with JS running, intercept the click
      // and open the dropdown instead of navigating away.
      event.preventDefault();
      const open = !group.classList.contains('is-open');
      navGroups.forEach((item) => {
        item.classList.remove('is-open');
        item.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
      });
      group.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', String(open));
    });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.nav-group')) {
      navGroups.forEach((group) => {
        group.classList.remove('is-open');
        group.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const mobileWasOpen = menuButton?.getAttribute('aria-expanded') === 'true';
    closeMobileMenu();
    navGroups.forEach((group) => {
      group.classList.remove('is-open');
      group.querySelector('.nav-trigger')?.setAttribute('aria-expanded', 'false');
    });
    if (mobileWasOpen) menuButton?.focus();
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const revealItems = Array.from(document.querySelectorAll('.reveal'));
  if (reduceMotion.matches || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: .08 });
    revealItems.forEach((item) => observer.observe(item));
  }

  const videos = Array.from(document.querySelectorAll('.hero-video'));
  const tabs = Array.from(document.querySelectorAll('.video-tabs button'));
  const videoTitle = document.querySelector('#video-title');
  const videoCopy = document.querySelector('#video-copy');
  const labels = [
    ['Diseño a medida', 'Referencias visuales de madera, preparación y detalle para planificar cada espacio.'],
    ['Cocinas a medida', 'Distribución, guardado y terminaciones para conversar según las medidas de tu cocina.'],
    ['Placares y vestidores', 'Módulos, cajones y espacio interior como punto de partida para tu proyecto.'],
    ['Aluminio y blindex', 'Ventanas, mamparas, divisiones y cerramientos como referencias para tu consulta.']
  ];
  let activeVideo = 0;

  // Each tab's video only downloads once the visitor actually clicks it —
  // loading all 4 automatically (via a timer or an idle-time preload) meant
  // every visitor paid for ~4 full video downloads even if they never looked
  // past the first one. That matters on Paraguayan mobile data plans.
  const loadVideo = (index) => {
    const video = videos[index];
    if (!video || video.src) return;
    video.src = video.dataset.src || '';
    video.load();
  };

  const showVideo = (index) => {
    if (!videos.length) return;
    activeVideo = index;
    loadVideo(index);
    videos.forEach((video, videoIndex) => {
      const selected = videoIndex === index;
      video.classList.toggle('is-active', selected);
      if (selected && !reduceMotion.matches && !document.hidden) video.play().catch(() => {});
      else video.pause();
    });
    tabs.forEach((tab, tabIndex) => tab.setAttribute('aria-selected', String(tabIndex === index)));
    if (videoTitle) videoTitle.textContent = labels[index][0];
    if (videoCopy) videoCopy.textContent = labels[index][1];
  };

  if (videos.length) {
    showVideo(0);
    tabs.forEach((tab) => tab.addEventListener('click', () => showVideo(Number(tab.dataset.tab))));
    const syncPlayback = () => {
      if (reduceMotion.matches || document.hidden) videos.forEach((video) => video.pause());
      else videos[activeVideo]?.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', syncPlayback);
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', syncPlayback);
    else reduceMotion.addListener(syncPlayback);
  }

  const quoteForm = document.querySelector('#quote-form');
  quoteForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const project = quoteForm.querySelector('[name="proyecto"]')?.value || 'carpintería a medida';
    const zone = quoteForm.querySelector('[name="zona"]')?.value.trim() || 'Asunción o Gran Asunción';
    const details = quoteForm.querySelector('[name="detalle"]')?.value.trim();
    const parts = [
      'Hola, vi Carpinteria.com.py y quiero cotizar un proyecto.',
      `Tipo: ${project}.`,
      `Zona: ${zone}.`,
      details ? `Detalles: ${details}.` : '',
      'Voy a adjuntar fotos y medidas por WhatsApp.'
    ].filter(Boolean);
    window.open(`https://wa.me/595995628862?text=${encodeURIComponent(parts.join(' '))}`, '_blank', 'noopener');
  });

  const privacyNote = document.querySelector('.privacy-note');
  const privacyClose = document.querySelector('[data-privacy-close]');
  try {
    if (privacyNote && sessionStorage.getItem('privacy-note-seen') !== '1') privacyNote.classList.add('is-visible');
    privacyClose?.addEventListener('click', () => {
      privacyNote?.classList.remove('is-visible');
      sessionStorage.setItem('privacy-note-seen', '1');
    });
  } catch (_) {
    privacyNote?.classList.remove('is-visible');
  }
})();
