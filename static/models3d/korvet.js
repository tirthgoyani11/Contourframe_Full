// Korvet (modern stealth) — pruva +x.
const grey = '#6b7780', red = '#6e2b25', sup = '#73808a', deckCol = '#4d5760';
const dark = '#1f242a', white = '#dcdfe2', gun = '#525c64', metal = '#9aa0aa', missile = '#9aa0a6';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);

function hullPiece(depth, yBase, color, name) {
  const pts = [[3.5, 0], [2.6, 0.72], [-3.5, 0.72], [-3.5, -0.72], [2.6, -0.72]];
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: depth, bevelEnabled: false, steps: 1 });
  const m = mesh(g, color, { flat: true, rough: 0.75, name: name });
  m.rotation.x = -Math.PI / 2;
  m.position.set(0, yBase, 0);
  modelGroup.add(m);
}
hullPiece(0.3, 0.0, red, 'tekne_alt');
hullPiece(0.48, 0.3, grey, 'tekne_ust'); // güverte ~0.78

// ---- ana top (köşeli stealth kule) ----
const turret = mesh(cyl(0.42, 0.5, 0.4, 6), grey, { flat: true, name: 'top_kulesi' });
turret.rotation.y = Math.PI / 6;
turret.position.set(2.3, 0.98, 0);
modelGroup.add(turret);
const barrel = mesh(cyl(0.05, 0.05, 1.0, 12), gun, { metal: 0.4, name: 'top_namlu' });
barrel.rotation.z = Math.PI / 2;
barrel.position.set(2.95, 1.02, 0);
modelGroup.add(barrel);

// ---- VLS (küçük, 2x2) ----
const vls = mesh(box(0.7, 0.16, 0.8), '#3a4048', { flat: true, name: 'VLS' });
vls.position.set(1.5, 0.86, 0);
modelGroup.add(vls);
for (let cx = 0; cx < 2; cx++) for (let cz = 0; cz < 2; cz++) {
  const lid = mesh(box(0.22, 0.04, 0.22), dark, { name: 'vls_hucre' });
  lid.position.set(1.35 + cx * 0.3, 0.95, cz ? 0.2 : -0.2);
  modelGroup.add(lid);
}

// ---- üst yapı (köşeli, yukarı daralan = stealth) ----
const sup1 = mesh(box(2.3, 0.6, 1.25), sup, { flat: true, rough: 0.7, name: 'ust_yapi' });
sup1.position.set(0.1, 1.08, 0);
modelGroup.add(sup1);
const sup2 = mesh(box(1.5, 0.5, 0.95), sup, { flat: true, name: 'kopru' });
sup2.position.set(0.5, 1.6, 0);
modelGroup.add(sup2);
const winBand = mesh(box(1.0, 0.16, 0.97), dark, { flat: true, name: 'kopru_cam' });
winBand.position.set(0.7, 1.66, 0);
modelGroup.add(winBand);
// açılı baca (entegre)
const funnel = mesh(cyl(0.32, 0.4, 0.7, 6), sup, { flat: true, name: 'baca' });
funnel.position.set(-0.9, 1.5, 0);
modelGroup.add(funnel);
const funnelTop = mesh(cyl(0.2, 0.25, 0.1, 6), dark, { name: 'baca_ust' });
funnelTop.position.set(-0.9, 1.88, 0);
modelGroup.add(funnelTop);

// ---- piramidal kapalı direk + dönen radar ----
const mast = mesh(cyl(0.14, 0.45, 1.1, 4), sup, { flat: true, name: 'direk' });
mast.rotation.y = Math.PI / 4;
mast.position.set(0.4, 2.3, 0);
modelGroup.add(mast);
// sabit faz dizinli panel
const panel = mesh(box(0.08, 0.4, 0.4), '#26323a', { flat: true, name: 'radar_panel' });
panel.position.set(0.78, 1.75, 0);
modelGroup.add(panel);
// dönen radar (direk tepesi)
const radar = spin({ pivot: [0.4, 2.95, 0], axis: 'y', rpm: 16 });
const dish = mesh(box(0.9, 0.14, 0.12), white, { flat: true, name: 'radar_anten' });
radar.add(dish);

// ---- gemisavar füze kanisterleri (amidships, açılı) ----
[-1, 1].forEach((s, i) => {
  const rack = mesh(box(0.9, 0.45, 0.5), missile, { flat: true, name: 'fuze_kanister_' + (i + 1) });
  rack.rotation.z = 0.35; // öne-yukarı açılı
  rack.position.set(-1.7, 1.1, s * 0.4);
  modelGroup.add(rack);
});

// ---- helikopter pisti (kıç) ----
const helipad = mesh(box(1.5, 0.06, 1.3), deckCol, { flat: true, name: 'helipad' });
helipad.position.set(-2.7, 0.82, 0);
modelGroup.add(helipad);
const circle = mesh(cyl(0.4, 0.4, 0.07, 20), '#586a56', { name: 'helipad_daire' });
circle.position.set(-2.7, 0.86, 0);
modelGroup.add(circle);

// ---- CIWS (üst) ----
const ciwsBase = mesh(cyl(0.14, 0.17, 0.14, 12), grey, { name: 'ciws_taban' });
ciwsBase.position.set(-0.2, 1.45, 0);
modelGroup.add(ciwsBase);
const ciwsDome = mesh(new THREE.SphereGeometry(0.15, 14, 12), white, { rough: 0.4, name: 'ciws_kubbe' });
ciwsDome.scale.set(1, 1.2, 1);
ciwsDome.position.set(-0.2, 1.62, 0);
modelGroup.add(ciwsDome);
