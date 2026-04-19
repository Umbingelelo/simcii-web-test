(function () {
  window.SIMCII_CONFIG = window.SIMCII_CONFIG || {};

  window.SIMCII_CONFIG_READY = fetch('/api/config')
    .then(function (response) {
      return response.ok ? response.json() : {};
    })
    .then(function (config) {
      Object.assign(window.SIMCII_CONFIG, config);
      return window.SIMCII_CONFIG;
    })
    .catch(function () {
      return window.SIMCII_CONFIG;
    });

  window.getSimciiConfig = function () {
    return window.SIMCII_CONFIG_READY || Promise.resolve(window.SIMCII_CONFIG);
  };
})();
