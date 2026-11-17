document.querySelectorAll('[data-embed-src]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();

    const iframe = document.createElement('iframe');
    iframe.src = link.dataset.embedSrc;
    iframe.title = link.dataset.embedTitle || link.textContent.trim();
    iframe.loading = 'eager';
    iframe.allowFullscreen = true;

    if (link.dataset.embedAllow) {
      iframe.allow = link.dataset.embedAllow;
    }

    if (link.dataset.embedReferrerpolicy) {
      iframe.referrerPolicy = link.dataset.embedReferrerpolicy;
    }

    link.replaceWith(iframe);
  });
});
