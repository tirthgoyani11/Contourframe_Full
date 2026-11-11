// Çıkarma gemisi / LHD — pruva +x (kayak rampası), ada starboard (+z).
const hullC = '#6b7780', hullLow = '#454c53', deckCol = '#5b6168';
const island = '#737e87', dark = '#1f242a', white = '#dcdfe2', mark = '#d2a93a';
const heliC = '#4b5340', heliDk = '#3a4030', glass = '#16201f', blade = '#26271f', radarW = '#e8e8ea';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);
const sph = (r) => new THREE.SphereGeometry(r, 14, 12);

// ---- gövde ----
function hullPiece(depth, yBase, color, name) {
  const pts = [[4.5, 0], [3.3, 1.0], [-4.5, 1.0], [-4.5, -1.0], [3.3, -1.0]];
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: depth, bevelEnabled: false, steps: 1 });
  const m = mesh(g, color, { flat: true, rough: 0.78, name: name });
  m.rotation.x = -Math.PI / 2; m.position.set(0, yBase, 0);
  modelGroup.add(m);
}
hullPiece(0.4, 0.0, hullLow, 'tekne_alt');
hullPiece(0.6, 0.4, hullC, 'tekne_ust'); // güverte 1.0

// ---- uçuş güvertesi ----
const deck = mesh(box(8.6, 0.16, 2.8), deckCol, { flat: true, rough: 0.85, name: 'ucus_guvertesi' });
deck.position.set(-0.2, 1.08, 0);
modelGroup.add(deck);
// kayak rampası (pruva, yukarı kıvrık)
const ski = mesh(box(1.7, 0.18, 2.7), deckCol, { flat: true, name: 'kayak_rampasi' });
ski.rotation.z = 0.26; // pruva ucu yukarı
ski.position.set(4.0, 1.28, 0);
modelGroup.add(ski);

// ---- helikopter iniş daireleri ----
[2.0, 0.2, -1.6, -3.0].forEach((x, i) => {
  const ring = mesh(new THREE.TorusGeometry(0.42, 0.04, 8, 20), mark, { name: 'inis_dairesi_' + (i + 1) });
  ring.rotation.x = Math.PI / 2;
  ring.position.set(x, 1.17, -0.3);
  modelGroup.add(ring);
});

// ---- ada (starboard) + direk + dönen radar ----
const isle = mesh(box(1.8, 1.0, 0.55), island, { flat: true, name: 'ada' });
isle.position.set(-1.5, 1.66, 1.05);
modelGroup.add(isle);
const bridge = mesh(box(1.1, 0.5, 0.5), island, { flat: true, name: 'kopru' });
bridge.position.set(-1.2, 2.4, 1.05);
modelGroup.add(bridge);
const win = mesh(box(0.9, 0.16, 0.52), dark, { flat: true, name: 'kopru_cam' });
win.position.set(-1.0, 2.5, 1.05);
modelGroup.add(win);
const mast = mesh(box(0.16, 1.0, 0.16), island, { flat: true, name: 'direk' });
mast.position.set(-1.8, 3.0, 1.05);
modelGroup.add(mast);
const radar = spin({ pivot: [-1.8, 3.55, 1.05], axis: 'y', rpm: 18 });
const dish = mesh(box(0.9, 0.16, 0.13), radarW, { flat: true, name: 'radar_anten' });
radar.add(dish);

// ---- kıç havuz güvertesi rampası ----
const ramp = mesh(box(1.0, 0.5, 1.8), hullLow, { flat: true, name: 'havuz_rampasi' });
ramp.rotation.z = 0.5;
ramp.position.set(-4.5, 0.75, 0);
modelGroup.add(ramp);

// ---- CIWS sponsonları ----
[[4.0, -0.7], [-4.2, 0.7]].forEach((p, i) => {
  const b = mesh(cyl(0.13, 0.16, 0.16, 12), island, { name: 'ciws_taban_' + (i + 1) });
  b.position.set(p[0], 1.28, p[1]);
  modelGroup.add(b);
  const d = mesh(sph(0.15), white, { rough: 0.4, name: 'ciws_kubbe_' + (i + 1) });
  d.scale.set(1, 1.25, 1); d.position.set(p[0], 1.45, p[1]);
  modelGroup.add(d);
});

// ---- park etmiş mini helikopterler ----
function miniHeli(px, pz, ry, idx) {
  const g = new THREE.Group();
  const body = mesh(box(1.0, 0.34, 0.42), heliC, { flat: true, name: 'heli' + idx + '_govde' });
  g.add(body);
  const cab = mesh(sph(0.22), glass, { rough: 0.2, name: 'heli' + idx + '_kabin' });
  cab.scale.set(1.1, 0.8, 0.9); cab.position.set(0.5, 0.04, 0); g.add(cab);
  const boom = mesh(box(0.9, 0.1, 0.1), heliC, { flat: true, name: 'heli' + idx + '_kuyruk' });
  boom.position.set(-0.85, 0.06, 0); g.add(boom);
  const fin = mesh(box(0.12, 0.32, 0.04), heliDk, { flat: true, name: 'heli' + idx + '_dikey' });
  fin.position.set(-1.25, 0.18, 0); g.add(fin);
  const hub = mesh(cyl(0.05, 0.05, 0.1, 8), dark, { name: 'heli' + idx + '_gobek' });
  hub.position.set(0.05, 0.24, 0); g.add(hub);
  [0, Math.PI / 2].forEach((a, k) => {
    const bl = mesh(box(1.7, 0.02, 0.1), blade, { flat: true, name: 'heli' + idx + '_pal_' + (k + 1) });
    bl.position.set(0.05, 0.27, 0); bl.rotation.y = a; g.add(bl);
  });
  [-1, 1].forEach((s) => {
    const skid = mesh(box(0.7, 0.04, 0.05), dark, { name: 'heli' + idx + '_kizak' });
    skid.position.set(0.1, -0.22, s * 0.22); g.add(skid);
  });
  g.position.set(px, 1.34, pz);
  g.rotation.y = ry; g.scale.set(0.92, 0.92, 0.92);
  modelGroup.add(g);
}
miniHeli(0.3, 0.55, 0.4, 1);
miniHeli(-2.4, -0.4, 2.6, 2);
