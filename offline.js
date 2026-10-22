(() => {
  const updateStatus = document.getElementById('offline-update-status');
  const updateButton = document.getElementById('offline-update');
  const themeButton = document.querySelector('.theme-btn');
  let registration = null, updating = false;
  function markReady() {
    themeButton.classList.add('offline-ready');
    themeButton.title = '離線資源已備妥';
    themeButton.setAttribute('aria-description', '離線資源已備妥');
  }
  function offerUpdate() {
    if (registration.waiting) updateStatus.hidden = false;
  }
  updateButton.addEventListener('click', () => {
    if (!registration?.waiting) return;
    updating = true;
    registration.waiting.postMessage({type: 'ACTIVATE_UPDATE'});
  });
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (updating) location.reload();
  });
  // Cache quietly in the background. Only an available update needs a control.
  navigator.serviceWorker.register('sw.js', {updateViaCache: 'none'}).then(reg => {
    registration = reg;
    navigator.serviceWorker.ready.then(active => {
      if (active.scope === reg.scope) markReady();
    });
    function watch(worker) {
      worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) offerUpdate();
      });
    }
    if (reg.installing) watch(reg.installing);
    reg.addEventListener('updatefound', () => { if (reg.installing) watch(reg.installing); });
    offerUpdate();
  }).catch(error => console.warn('離線快取未完成', error));
})();