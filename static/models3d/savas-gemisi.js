// Savaş gemisi (muhrip) — pruva +x, kıç -x, üst +y.
const grey = '#6b7780', deckCol = '#4d5760', redHull = '#6e2b25';
const gunCol = '#525c64', dark = '#1f242a', panelCol = '#26323a';
const white = '#e8e8ea', metal = '#9aa0aa', funnelTopCol = '#1c1f22';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);
const sph = (r) => new THREE.SphereGeometry(r, 16, 12);

// ---- gövde (sivri pruvalı, dikey extrude) ----
function hullPiece(depth, yBase, color, name) {
  const pts = [[4.5, 0], [3.3, 0.9], [-4.5, 0.9], [-4.5, -0.9], [3.3, -0.9]];
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: depth, bevelEnabled: false, steps: 1 });
  const m = mesh(g, color, { flat: true, rough: 0.75, name: name });
  m.rotation.x = -Math.PI / 2;     // extrude Z -> dünya Y (yukarı)
  m.position.set(0, yBase, 0);
  modelGroup.add(m);
}
hullPiece(0.35, 0.0, redHull, 'tekne_alt');   // su altı (kırmızı)
hullPiece(0.55, 0.35, grey, 'tekne_ust');     // su üstü (gri) — güverte 0.90

// ---- ana top kulesi (pruva) ----
const turret = mesh(box(0.95, 0.5, 0.95), grey, { flat: true, name: 'top_kulesi' });
turret.position.set(2.6, 1.15, 0);
modelGroup.add(turret);
const barrel = mesh(cyl(0.07, 0.07, 1.4, 12), gunCol, { metal: 0.4, name: 'top_namlu' });
barrel.rotation.z = Math.PI / 2;
barrel.position.set(3.55, 1.22, 0);
modelGroup.add(barrel);

// ---- dikey füze hücreleri (VLS) ----
const vls = mesh(box(1.0, 0.18, 1.2), '#3a4048', { flat: true, name: 'VLS' });
vls.position.set(1.55, 0.99, 0);
modelGroup.add(vls);
for (let cx = 0; cx < 4; cx++) {
  for (let cz = 0; cz < 2; cz++) {
    const lid = mesh(box(0.18, 0.05, 0.18), dark, { name: 'vls_hucre' });
    lid.position.set(1.25 + cx * 0.25, 1.08, cz ? 0.25 : -0.25);
    modelGroup.add(lid);
  }
}

// ---- üst yapı + köprü ----
const superLo = mesh(box(2.6, 0.8, 1.5), grey, { flat: true, name: 'ust_yapi' });
superLo.position.set(-0.4, 1.3, 0);
modelGroup.add(superLo);
const bridge = mesh(box(1.3, 0.6, 1.1), grey, { flat: true, name: 'kopru' });
bridge.position.set(0.5, 1.95, 0);
modelGroup.add(bridge);

// AEGIS radar panelleri (köşelere eğik)
[[0.92, 1.55, 1, 0.4], [0.92, 1.55, -1, -0.4], [-1.65, 1.55, 1, Math.PI - 0.4], [-1.65, 1.55, -1, Math.PI + 0.4]].forEach((p, i) => {
  const panel = mesh(box(0.07, 0.5, 0.5), panelCol, { flat: true, metal: 0.2, name: 'radar_panel_' + (i + 1) });
  panel.position.set(p[0], p[1], p[2] * 0.5);
  panel.rotation.y = p[3];
  modelGroup.add(panel);
});

// ---- baca ----
const funnel = mesh(box(0.75, 1.0, 0.75), grey, { flat: true, name: 'baca' });
funnel.position.set(-1.45, 1.85, 0);
modelGroup.add(funnel);
const funnelTop = mesh(box(0.6, 0.12, 0.6), funnelTopCol, { name: 'baca_ust' });
funnelTop.position.set(-1.45, 2.4, 0);
modelGroup.add(funnelTop);

// ---- direk + dönen hava arama radarı ----
const mast = mesh(box(0.22, 1.3, 0.22), grey, { flat: true, name: 'direk' });
mast.position.set(-0.1, 2.45, 0);
modelGroup.add(mast);
const yard = mesh(box(0.07, 0.07, 1.2), grey, { name: 'seren' });
yard.position.set(-0.1, 2.85, 0);
modelGroup.add(yard);
const radar = spin({ pivot: [-0.1, 3.18, 0], axis: 'y', rpm: 22 });
const dish = mesh(box(1.1, 0.22, 0.16), white, { flat: true, name: 'radar_anten' });
radar.add(dish);

// ---- hangar + helikopter pisti (kıç) ----
const hangar = mesh(box(1.0, 0.7, 1.3), grey, { flat: true, name: 'hangar' });
hangar.position.set(-2.3, 1.25, 0);
modelGroup.add(hangar);
const helipad = mesh(box(1.9, 0.06, 1.55), deckCol, { flat: true, name: 'helipad' });
helipad.position.set(-3.45, 0.93, 0);
modelGroup.add(helipad);
const heliCircle = mesh(cyl(0.5, 0.5, 0.07, 24), '#586a56', { name: 'helipad_daire' });
heliCircle.position.set(-3.45, 0.97, 0);
modelGroup.add(heliCircle);

// ---- CIWS Phalanx (hangar üstü) ----
const ciwsBase = mesh(cyl(0.18, 0.22, 0.18, 14), grey, { name: 'ciws_taban' });
ciwsBase.position.set(-2.3, 1.7, 0);
modelGroup.add(ciwsBase);
const ciwsDome = mesh(sph(0.2), white, { rough: 0.4, name: 'ciws_kubbe' });
ciwsDome.scale.set(1, 1.25, 1);
ciwsDome.position.set(-2.3, 1.92, 0);
modelGroup.add(ciwsDome);
const ciwsGun = mesh(cyl(0.04, 0.04, 0.32, 8), gunCol, { metal: 0.4, name: 'ciws_namlu' });
ciwsGun.rotation.z = Math.PI / 2;
ciwsGun.position.set(-2.05, 1.78, 0);
modelGroup.add(ciwsGun);
