(function () {
  function noop() {}
  function asyncSuccess(success, payload) {
    if (typeof success === 'function') {
      setTimeout(function () { success(payload || null); }, 0);
    }
  }
  function asyncError(error, payload) {
    if (typeof error === 'function') {
      setTimeout(function () { error(payload || { message: 'Not implemented in Flutter wrapper' }); }, 0);
    }
  }

  var cordova = {
    platformId: /iPhone|iPad|iPod/i.test(navigator.userAgent) ? 'ios' : 'android',
    version: 'shim-1.0.0',
    plugins: {},
    exec: function (success, error, service, action, args) {
      console.warn('[cordova_shim] exec not implemented', service, action, args);
      asyncError(error, { service: service, action: action, args: args, message: 'Cordova native exec is not implemented in this Flutter wrapper.' });
    },
    fireDocumentEvent: function (name, data) {
      document.dispatchEvent(new CustomEvent(name, { detail: data || null }));
    },
    addConstructor: function (fn) {
      if (typeof fn === 'function') {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', fn, { once: true });
        } else {
          setTimeout(fn, 0);
        }
      }
    }
  };

  window.cordova = cordova;
  window.PhoneGap = cordova;
  window.plugins = window.plugins || {};
  cordova.plugins = window.plugins;
  cordova.InAppBrowser = {
    open: function (url, target) {
      if (target === '_system') {
        window.open(url, '_blank');
        return;
      }
      return window.open(url, target || '_blank');
    }
  };
  window.open = window.open || function (url) { location.href = url; };

  window.Camera = {
    DestinationType: { DATA_URL: 0, FILE_URI: 1, NATIVE_URI: 2 },
    EncodingType: { JPEG: 0, PNG: 1 },
    MediaType: { PICTURE: 0, VIDEO: 1, ALLMEDIA: 2 },
    PictureSourceType: { PHOTOLIBRARY: 0, CAMERA: 1, SAVEDPHOTOALBUM: 2 }
  };
  navigator.camera = {
    getPicture: function (success, error) {
      console.warn('[cordova_shim] camera not implemented');
      asyncError(error, { message: 'Camera is not implemented in this Flutter wrapper yet.' });
    },
    cleanup: noop
  };

  cordova.plugins.permissions = new Proxy({}, {
    get: function (_, prop) {
      if (typeof prop === 'string' && prop === prop.toUpperCase()) return prop;
      return function (success) { asyncSuccess(success, { hasPermission: true }); };
    }
  });

  cordova.plugins.Keyboard = {
    hideKeyboardAccessoryBar: noop,
    disableScroll: noop,
    show: noop,
    hide: noop
  };

  cordova.plugins.barcodeScanner = {
    scan: function (success, error) {
      console.warn('[cordova_shim] barcode scanner not implemented');
      asyncError(error, { cancelled: true, text: '', format: '', message: 'Barcode scanner is not implemented in this Flutter wrapper yet.' });
    },
    encode: function (type, data, success) { asyncSuccess(success, { type: type, data: data }); }
  };

  cordova.plugins.printer = {
    isAvailable: function (success) { asyncSuccess(success, true); },
    print: function (content, options, success) {
      console.warn('[cordova_shim] printer invoked; using browser print fallback');
      try { window.print(); asyncSuccess(success, true); } catch (e) { asyncError(success, e); }
    }
  };
  window.printer = cordova.plugins.printer;

  cordova.plugins.fileOpener2 = {
    open: function (path, mimeType, callbacks) {
      console.warn('[cordova_shim] file opener not implemented', path, mimeType);
      if (callbacks && callbacks.error) callbacks.error({ message: 'File opener is not implemented in this Flutter wrapper yet.' });
    }
  };

  cordova.plugins.DownloadManager = {
    download: function (url, success) {
      console.warn('[cordova_shim] download fallback', url);
      if (url) window.open(url, '_blank');
      asyncSuccess(success, url);
    }
  };

  window.BTPrinter = {
    connect: function (name, success, error) { console.warn('[cordova_shim] BTPrinter connect not implemented', name); asyncError(error, { message: 'Bluetooth printing is not implemented.' }); },
    disconnect: function (success) { asyncSuccess(success, true); },
    list: function (success) { asyncSuccess(success, []); },
    printText: function (text, success) { console.warn('[cordova_shim] BTPrinter printText fallback', text); asyncSuccess(success, true); },
    printPOSCommand: function (cmd, success) { console.warn('[cordova_shim] BTPrinter printPOSCommand fallback', cmd); asyncSuccess(success, true); }
  };

  window.FileTransfer = function () {};
  window.FileTransfer.prototype.upload = function (fileURL, server, success, error) {
    console.warn('[cordova_shim] FileTransfer upload not implemented', fileURL, server);
    asyncError(error, { message: 'File upload is not implemented in this Flutter wrapper yet.' });
  };
  window.FileTransfer.prototype.download = function (source, target, success, error) {
    console.warn('[cordova_shim] FileTransfer download fallback', source, target);
    if (source) window.open(source, '_blank');
    asyncSuccess(success, { source: source, target: target });
  };

  document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
      cordova.fireDocumentEvent('deviceready');
      cordova.fireDocumentEvent('resume');
    }, 50);
  });
})();
