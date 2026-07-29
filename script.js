document.addEventListener('DOMContentLoaded', () => {
  // Mobile Navigation Menu Toggle
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('#nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Scroll Intersection Reveal
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  } else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // Interactive Lightbox Modal for Project Screenshots & QR Codes
  const lightboxOverlay = document.createElement('div');
  lightboxOverlay.className = 'lightbox-overlay';
  lightboxOverlay.setAttribute('role', 'dialog');
  lightboxOverlay.setAttribute('aria-modal', 'true');
  lightboxOverlay.setAttribute('aria-label', 'Image preview');

  lightboxOverlay.innerHTML = `
    <div class="lightbox-container">
      <button class="lightbox-close" aria-label="Close image preview">&times;</button>
      <img class="lightbox-image" src="" alt="">
    </div>
  `;
  document.body.appendChild(lightboxOverlay);

  const lightboxImg = lightboxOverlay.querySelector('.lightbox-image');
  const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');

  const openLightbox = (src, alt, isQr = false) => {
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Enlarged view';
    if (isQr) {
      lightboxImg.classList.add('is-qr');
    } else {
      lightboxImg.classList.remove('is-qr');
    }
    lightboxOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightboxOverlay.classList.remove('active');
    document.body.style.overflow = '';
  };

  lightboxClose.addEventListener('click', closeLightbox);
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
      closeLightbox();
    }
  });

  // Attach Lightbox click triggers to all project screenshots and QR codes
  const expandableTargets = document.querySelectorAll(
    '.project-screenshot, img.standalone-qr, img.inline-qr-btn'
  );

  expandableTargets.forEach(img => {
    img.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isQr = img.classList.contains('standalone-qr') || img.classList.contains('inline-qr-btn');
      openLightbox(img.src, img.alt, isQr);
    });
  });
});
