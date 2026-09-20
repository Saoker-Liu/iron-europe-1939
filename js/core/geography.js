/* Shared spherical Lambert conformal conic projection, kilometres.
 * Standard parallels 43° / 62° N; central meridian 18° E. Hex centres 45 km apart.
 * Cities, coastlines, borders, rivers and deployments use this ONE transform.
 */
(function () {
  'use strict';
  const rad = Math.PI / 180, R = 6371.0088;
  const p1 = 43 * rad, p2 = 62 * rad, p0 = 52 * rad;
  const n = Math.log(Math.cos(p1) / Math.cos(p2)) /
    Math.log(Math.tan(Math.PI / 4 + p2 / 2) / Math.tan(Math.PI / 4 + p1 / 2));
  const F = Math.cos(p1) * Math.pow(Math.tan(Math.PI / 4 + p1 / 2), n) / n;
  const rho0 = R * F / Math.pow(Math.tan(Math.PI / 4 + p0 / 2), n);
  const spec = { width: 128, height: 112, dx: 45, dy: 45 * Math.sqrt(3) / 2,
    left: -2850, top: 2350, version: 'europe-1939-geographic-v7', date: '1939-08-31' };
  function project(lon, lat) {
    const rho = R * F / Math.pow(Math.tan(Math.PI / 4 + lat * rad / 2), n);
    const theta = n * (lon - 18) * rad;
    return [rho * Math.sin(theta), rho0 - rho * Math.cos(theta)];
  }
  function unproject(x, y) {
    const rho = Math.hypot(x, rho0 - y);
    return [18 + Math.atan2(x, rho0 - y) / n / rad,
      (2 * Math.atan(Math.pow(R * F / rho, 1 / n)) - Math.PI / 2) / rad];
  }
  function hexToGeo(c, r) {
    return unproject(spec.left + spec.dx * (c + 0.5 * (r & 1)), spec.top - spec.dy * r);
  }
  function geoToGrid(lon, lat) {
    const [x, y] = project(lon, lat);
    return [(x - spec.left) / spec.dx, (spec.top - y) / spec.dy];
  }
  function geoToHex(lon, lat) {
    const [x, r] = geoToGrid(lon, lat), q = x - r / 2;
    let a = Math.round(q), b = Math.round(-q - r), c = Math.round(r);
    const da = Math.abs(a - q), db = Math.abs(b + q + r), dc = Math.abs(c - r);
    if (da > db && da > dc) a = -b - c; else if (dc > db) c = -a - b;
    return [a + Math.floor(c / 2) || 0, c || 0];
  }
  const api = { spec, project, unproject, hexToGeo, geoToGrid, geoToHex };
  (typeof window === 'undefined' ? globalThis : window).Geography = api;
  if (typeof module !== 'undefined') module.exports = api;
})();
