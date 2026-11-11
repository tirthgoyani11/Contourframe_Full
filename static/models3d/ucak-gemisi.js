// Uçak gemisi — pruva +x, kıç -x, ada starboard (+z) tarafta.
const hullCol = '#6b7780', hullLow = '#454c53', deckCol = '#5b6168';
const island = '#737e87', dark = '#1f242a', white = '#dcdfe2';
const yellow = '#d2a93a', jetCol = '#3a4048', cockpit = '#16242a';
const radarW = '#e8e8ea', gunCol = '#525c64', metal = '#9aa0aa';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);
const sph = (r) => new THREE.SphereGeometry(r, 16, 12);

// ---- gövde (sivri pruvalı dikey extrude) ----
function hullPiece(depth, yBase, color, name) {
  const pts = [[5.0, 0], [3.6, 1.0], [-5.0, 1.0], [-5.0, -1.0], [3.6, -1.0]];
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: depth, bevelEnabled: false, steps: 1 });
  const m = mesh(g, color, { flat: true, rough: 0.78, name: name });
  m.rotation.x = -Math.PI / 2;
  m.position.set(0, yBase, 0);
  modelGroup.add(m);
}
hullPiece(0.4, 0.0, hullLow, 'tekne_alt');
hullPiece(0.6, 0.4, hullCol, 'tekne_ust'); // gövde üstü 1.0

// ---- uçuş güvertesi ----
const deck = mesh(box(9.8, 0.16, 2.8), deckCol, { flat: true, rough: 0.85, name: 'ucus_guvertesi' });
deck.position.set(0, 1.08, 0); // üst yüzey ~1.16
modelGroup.add(deck);

// açılı iniş güvertesi (port tarafa ~10° eğik uzanan ek)
const angled = mesh(box(5.6, 0.16, 1.0), deckCol, { flat: true, rough: 0.85, name: 'acili_guverte' });
angled.position.set(0.4, 1.08, -1.5);
angled.rotation.y = 0.17;
modelGroup.add(angled);

// ---- güverte işaretleri ----
const dy = 1.17;
// açılı pist (koyu şerit + beyaz orta çizgi)
const strip = mesh(box(6.0, 0.02, 0.8), '#2c333a', { name: 'pist_acili' });
strip.position.set(0.3, dy, -0.7); strip.rotation.y = 0.17;
modelGroup.add(strip);
const cl = mesh(box(5.4, 0.03, 0.07), white, { name: 'orta_cizgi' });
cl.position.set(0.3, dy + 0.01, -0.7); cl.rotation.y = 0.17;
modelGroup.add(cl);
// eksenel katapult çizgileri (pruva)
[0.15, 0.6].forEach((z, i) => {
  const cat = mesh(box(4.2, 0.03, 0.06), white, { name: 'katapult_' + (i + 1) });
  cat.position.set(2.2, dy, z);
  modelGroup.add(cat);
});
// uçak asansörleri (starboard kenar, koyu dikdörtgenler)
[1.6, -2.0].forEach((x, i) => {
  const elv = mesh(box(1.0, 0.03, 0.9), '#3a4149', { name: 'asansor_' + (i + 1) });
  elv.position.set(x, dy, 1.25);
  modelGroup.add(elv);
});

// ---- ada (island) üst yapısı, starboard ----
const isle1 = mesh(box(1.7, 1.0, 0.6), island, { flat: true, name: 'ada' });
isle1.position.set(-0.8, 1.66, 1.05);
modelGroup.add(isle1);
const isle2 = mesh(box(1.0, 0.55, 0.5), island, { flat: true, name: 'kopru' });
isle2.position.set(-0.6, 2.4, 1.05);
modelGroup.add(isle2);
const winBand = mesh(box(0.85, 0.16, 0.52), cockpit, { flat: true, name: 'kopru_cam' });
winBand.position.set(-0.45, 2.5, 1.05);
modelGroup.add(winBand);
const isleTop = mesh(box(0.6, 0.12, 0.5), dark, { name: 'ada_ust' });
isleTop.position.set(-0.7, 2.74, 1.05);
modelGroup.add(isleTop);
// AEGIS panelleri
[[0.0, 1, 0.3], [-1.55, 1, -0.3]].forEach((p, i) => {
  const panel = mesh(box(0.06, 0.42, 0.42), '#26323a', { flat: true, name: 'ada_radar_' + (i + 1) });
  panel.position.set(p[0], 1.7, 1.36);
  panel.rotation.y = p[2];
  modelGroup.add(panel);
});

// ---- direk + dönen radar (ada üstünde) ----
const mast = mesh(box(0.16, 1.0, 0.16), island, { flat: true, name: 'direk' });
mast.position.set(-1.05, 3.0, 1.05);
modelGroup.add(mast);
const radar = spin({ pivot: [-1.05, 3.55, 1.05], axis: 'y', rpm: 20 });
const dish = mesh(box(0.95, 0.18, 0.14), radarW, { flat: true, name: 'radar_anten' });
radar.add(dish);

// ---- CIWS Phalanx (sponsonlar) ----
function ciws(x, z, name) {
  const b = mesh(cyl(0.14, 0.18, 0.16, 12), island, { name: name + '_taban' });
  b.position.set(x, 1.28, z);
  modelGroup.add(b);
  const d = mesh(sph(0.16), white, { rough: 0.4, name: name + '_kubbe' });
  d.scale.set(1, 1.25, 1); d.position.set(x, 1.46, z);
  modelGroup.add(d);
}
ciws(4.2, -0.6, 'ciws_pruva');
ciws(-4.4, 0.7, 'ciws_kic');

// ---- park etmiş mini jetler ----
function miniJet(px, pz, ry, idx) {
  const g = new THREE.Group();
  const fus = mesh(box(1.25, 0.16, 0.2), jetCol, { flat: true, name: 'jet' + idx + '_govde' });
  g.add(fus);
  const nose = mesh(new THREE.ConeGeometry(0.1, 0.42, 5), jetCol, { flat: true, name: 'jet' + idx + '_burun' });
  nose.rotation.z = -Math.PI / 2; nose.position.x = 0.78; g.add(nose);
  const wing = mesh(box(0.66, 0.05, 1.5), jetCol, { flat: true, name: 'jet' + idx + '_kanat' });
  wing.position.x = -0.05; g.add(wing);
  const tailp = mesh(box(0.36, 0.05, 0.7), jetCol, { flat: true, name: 'jet' + idx + '_kuyruk' });
  tailp.position.x = -0.58; g.add(tailp);
  [-1, 1].forEach((s) => {
    const vt = mesh(box(0.28, 0.26, 0.04), jetCol, { flat: true, name: 'jet' + idx + '_dikey' });
    vt.position.set(-0.52, 0.16, s * 0.16); vt.rotation.z = -0.18; g.add(vt);
  });
  const can = mesh(box(0.26, 0.12, 0.15), cockpit, { flat: true, name: 'jet' + idx + '_kanopi' });
  can.position.set(0.28, 0.13, 0); g.add(can);
  g.position.set(px, 1.27, pz);
  g.rotation.y = ry;
  g.scale.set(0.92, 0.92, 0.92);
  modelGroup.add(g);
}
miniJet(3.6, 0.55, 0.35, 1);
miniJet(2.7, -0.35, -0.25, 2);
miniJet(-1.6, -1.0, 2.7, 3);
miniJet(-3.2, 0.4, 3.05, 4);
