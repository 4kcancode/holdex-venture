import config, { isBrowser } from '$lib/config';

if (isBrowser) {
  /**
   * @param {string} src
   */
  const addScript = (src) => {
    var s = document.createElement('script');
    s.type = 'text/javascript';
    s.defer = true;
    s.src = src;
    document.head.appendChild(s);
  };

  // remove utm_* query parameters
  (() => {
    /**
     * @param {string} param
     */
    const paramIsNotUtm = (param) => param.slice(0, 4) !== 'utm_';

    if (history && history.replaceState && location.search) {
      var params = location.search.slice(1).split('&');
      var newParams = params.filter(paramIsNotUtm);
      if (newParams.length < params.length) {
        var search = newParams.length ? '?' + newParams.join('&') : '';
        var url = location.pathname + search + location.hash;
        history.replaceState(null, '', url);
      }
    }
  })();

  // HEAP Analytics starts
  (window.heap = window.heap || []),
    /**
     * @param {string} e
     * @param {Record<string, any>} t
     */
    (window.heap.load = function (e, t) {
      (window.heap.appid = e), (window.heap.config = t = t || {});
      var r = document.createElement('script');
      (r.type = 'text/javascript'),
        (r.async = !0),
        (r.src = 'https://cdn.heapanalytics.com/js/heap-' + e + '.js');
      var a = document.getElementsByTagName('script')[0];
      a.parentNode?.insertBefore(r, a);
      for (
        var n = function (/** @type {string} */ e) {
            return function () {
              window.heap.push([e].concat(Array.prototype.slice.call(arguments, 0)));
            };
          },
          p = [
            'addEventProperties',
            'addUserProperties',
            'clearEventProperties',
            'identify',
            'resetIdentity',
            'removeEventProperty',
            'setEventProperties',
            'track',
            'unsetEventProperty',
          ],
          o = 0;
        o < p.length;
        o++
      ) {
        window.heap[p[o]] = n(p[o]);
      }
    });
  window.heap.load(`${config.heapAppKey}`);
  // HEAP Analytics ends

  // GA script starts
  const GA = `https://www.googletagmanager.com/gtag/js?id=${config.gaKey}`;

  const loadGa = () => {
    addScript(GA);
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', `${config.analyticsKey}`, {
      send_page_view: true,
    });
    gtag('config', `${config.gaKey}`, { send_page_view: true });
  };

  setTimeout(loadGa, 1000);
  // GA script ends
}
