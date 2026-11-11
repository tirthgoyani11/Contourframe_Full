// Kısa menzilli HSS (Pantsir tarzı, 8x8) — kabin +x, taret merkez. Üstte dönen arama radarı.
const green = '#5e6248', greenDk = '#4c5038', turret = '#535b40', dark = '#1f242a';
const tube = '#101210', gun = '#26282c', tire = '#1b1b1e', rim = '#42453a';
const glass = '#161812', panel = '#26323a', radarW = '#e6e8ea', metal = '#7e8378';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 14);

// ---- şasi + kabin ----
const chassis = mesh(box(6.4, 0.55, 2.0), green, { flat: true, rough: 0.8, name: 'sasi' });
chassis.position.set(0, 1.2, 0);
modelGroup.add(chassis);
const cab = mesh(box(1.4, 1.2, 2.0), green, { flat: true, rough: 0.75, name: 'kabin' });
cab.position.set(2.6, 1.95, 0);
modelGroup.add(cab);
const ws = mesh(box(0.06, 0.48, 1.7), glass, { rough: 0.2, metal: 0.3, name: 'on_cam' });
ws.rotation.z = 0.3; ws.position.set(3.27, 2.12, 0);
modelGroup.add(ws);
[-1, 1].forEach((s, i) => {
  const head = mesh(box(0.1, 0.18, 0.3), '#e6df8a', { rough: 0.4, name: 'far_' + (i + 1) });
  head.position.set(3.33, 1.5, s * 0.7);
  modelGroup.add(head);
});

// ---- tekerlekler (8x8) ----
[2.4, 1.5, -1.6, -2.5].forEach((x, ax) => {
  [-1, 1].forEach((s) => {
    const w = mesh(cyl(0.55, 0.55, 0.38, 18), tire, { rough: 0.9, name: 'teker_' + (ax + 1) + (s > 0 ? 'R' : 'L') });
    w.rotation.x = Math.PI / 2; w.position.set(x, 0.55, s * 1.0);
    modelGroup.add(w);
    const r = mesh(cyl(0.18, 0.18, 0.4, 8), rim, { metal: 0.5, name: 'jant' });
    r.rotation.x = Math.PI / 2; r.position.set(x, 0.55, s * 1.0);
    modelGroup.add(r);
  });
});

// ---- taret ----
const TX = -0.6;
const tBase = mesh(cyl(0.85, 0.95, 0.3, 18), greenDk, { flat: true, name: 'taret_tablasi' });
tBase.position.set(TX, 1.62, 0);
modelGroup.add(tBase);
const tBody = mesh(box(1.7, 0.75, 2.2), turret, { flat: true, rough: 0.8, name: 'taret' });
tBody.position.set(TX, 2.05, 0);
modelGroup.add(tBody);

// ---- önde sabit takip radarı (faz dizinli panel) ----
const trackR = mesh(box(0.14, 0.85, 0.95), panel, { flat: true, metal: 0.2, name: 'takip_radari' });
trackR.rotation.z = -0.12;
trackR.position.set(TX + 0.95, 2.15, 0);
modelGroup.add(trackR);

// ---- füze pod'ları (iki yan, 6'şar tüp, yukarı açılı) ----
function pod(sgn, idx) {
  const g = new THREE.Group();
  const shell = mesh(box(1.1, 0.75, 0.95), greenDk, { flat: true, name: 'fuze_pod_' + idx });
  g.add(shell);
  // 6 tüp ağzı (3 z x 2 y) ön yüzde (+x yerel)
  for (let yy = 0; yy < 2; yy++) {
    for (let zz = 0; zz < 3; zz++) {
      const t = mesh(cyl(0.13, 0.13, 0.16, 12), tube, { name: 'tup' });
      t.rotation.z = Math.PI / 2;
      t.position.set(0.5, -0.18 + yy * 0.36, -0.3 + zz * 0.3);
      g.add(t);
    }
  }
  g.position.set(TX - 0.1, 2.55, sgn * 1.05);
  g.rotation.z = 0.32; // yukarı açılı
  modelGroup.add(g);
}
pod(1, 1);
pod(-1, 2);

// ---- çift namlulu otomatik toplar (iki yan) ----
[-1, 1].forEach((s, i) => {
  const mount = mesh(box(0.4, 0.3, 0.4), gun, { flat: true, name: 'top_yuvasi_' + (i + 1) });
  mount.position.set(TX + 0.5, 1.95, s * 0.95);
  modelGroup.add(mount);
  [-0.07, 0.07].forEach((dz, k) => {
    const barrel = mesh(cyl(0.04, 0.04, 1.2, 10), gun, { metal: 0.4, name: 'namlu_' + (i + 1) + '_' + (k + 1) });
    barrel.rotation.z = Math.PI / 2 - 0.12; // ileri-hafif yukarı
    barrel.position.set(TX + 1.15, 2.05, s * 0.95 + dz);
    modelGroup.add(barrel);
  });
});

// ---- üstte dönen arama radarı ----
const mast = mesh(box(0.18, 0.4, 0.18), turret, { flat: true, name: 'radar_direk' });
mast.position.set(TX - 0.4, 2.6, 0);
modelGroup.add(mast);
const searchR = spin({ pivot: [TX - 0.4, 2.95, 0], axis: 'y', rpm: 16 });
const dish = mesh(box(0.12, 0.7, 1.3), radarW, { flat: true, name: 'arama_radari' });
searchR.add(dish);
const dishBack = mesh(box(0.1, 0.55, 1.1), panel, { name: 'arama_radari_arka' });
dishBack.position.set(-0.08, 0, 0);
searchR.add(dishBack);
