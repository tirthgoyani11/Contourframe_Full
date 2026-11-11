// Güneş tarlası (GES) — sıra sıra eğimli paneller.
const frameC = '#3a3d42', glassC = '#16314a', metal = '#7e848c', ground = '#6b6048';
const inverter = '#8a8f8a', xfmr = '#7c8084', accentY = '#d2a93a', road = '#5a5444', fence = '#9aa0a6';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 10);

// ---- zemin ----
const g0 = mesh(box(18, 0.1, 14), ground, { flat: true, rough: 1, name: 'zemin' });
g0.position.set(0, 0.05, 0);
modelGroup.add(g0);
// erişim yolu
const rd = mesh(box(18, 0.04, 1.2), road, { name: 'yol' });
rd.position.set(0, 0.12, 6.0);
modelGroup.add(rd);

// ---- panel dizisi (eğimli sıra) ----
function panelRow(px, pz, len, idx) {
  const nP = 3;
  for (let i = 0; i < nP; i++) {
    const post = mesh(box(0.1, 0.9, 0.1), metal, { metal: 0.4, name: 'direk' });
    post.position.set(px - len / 2 + i * (len / (nP - 1)), 0.5, pz);
    modelGroup.add(post);
  }
  const pg = new THREE.Group();
  const frame = mesh(box(len, 0.06, 1.4), frameC, { flat: true, name: 'sira' + idx + '_cerceve' });
  pg.add(frame);
  const glass = mesh(box(len - 0.08, 0.04, 1.32), glassC, { flat: true, rough: 0.2, metal: 0.3, name: 'sira' + idx + '_cam' });
  glass.position.set(0, 0.05, 0); pg.add(glass);
  // modül ayrım çizgileri (dikey)
  const nMod = Math.round(len / 1.0);
  for (let m = 1; m < nMod; m++) {
    const sep = mesh(box(0.04, 0.06, 1.34), frameC, { name: 'ayrim' });
    sep.position.set(-len / 2 + m * (len / nMod), 0.06, 0); pg.add(sep);
  }
  // yatay orta çizgi
  const hl = mesh(box(len - 0.08, 0.06, 0.04), frameC, { name: 'orta_cizgi' });
  hl.position.set(0, 0.06, 0); pg.add(hl);
  pg.position.set(px, 1.0, pz);
  pg.rotation.x = -0.5;
  modelGroup.add(pg);
}
[-4.5, -2.0, 0.5, 3.0].forEach((z, i) => {
  panelRow(-1.5, z, 11, i + 1);
});

// ---- inverter / trafo istasyonu ----
const inv = mesh(box(1.6, 1.0, 1.0), inverter, { flat: true, name: 'inverter' });
inv.position.set(6.5, 0.6, -4.0);
modelGroup.add(inv);
const invDoor = mesh(box(0.5, 0.6, 0.06), '#34383c', { name: 'inverter_kapi' });
invDoor.position.set(6.5, 0.45, -3.45);
modelGroup.add(invDoor);
const tx = mesh(box(0.9, 0.85, 0.8), xfmr, { flat: true, name: 'trafo' });
tx.position.set(7.0, 0.53, -2.6);
modelGroup.add(tx);
[-0.25, 0, 0.25].forEach((dx) => {
  const bush = mesh(cyl(0.05, 0.07, 0.32, 8), accentY, { name: 'busing' });
  bush.position.set(7.0 + dx, 1.1, -2.6); modelGroup.add(bush);
});

// ---- çevre çiti ----
function fenceLine(x0, z0, x1, z1, n, name) {
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const post = mesh(box(0.06, 0.7, 0.06), fence, { name: name + '_direk' });
    post.position.set(x0 + (x1 - x0) * t, 0.45, z0 + (z1 - z0) * t);
    modelGroup.add(post);
  }
  const rail = new THREE.Vector3(x1 - x0, 0, z1 - z0);
  const rl = mesh(cyl(0.015, 0.015, rail.length(), 5), fence, { name: name + '_ray' });
  rl.position.set((x0 + x1) / 2, 0.7, (z0 + z1) / 2);
  rl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), rail.normalize());
  modelGroup.add(rl);
}
fenceLine(-8.5, -6.5, 8.5, -6.5, 8, 'cit_arka');
fenceLine(-8.5, 5.2, -8.5, -6.5, 6, 'cit_sol');
fenceLine(8.5, 5.2, 8.5, -6.5, 6, 'cit_sag');
