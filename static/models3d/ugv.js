// İnsansız kara aracı (paletli UGV) — ön +x. Sensör direği döner.
const body = '#363b42', bodyDk = '#272a30', track = '#1d1f23', rubber = '#15161a';
const sensor = '#15161a', lensC = '#3aa0b8', gun = '#202024', metal = '#7e848c', ant = '#0f1012';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);
const sph = (r) => new THREE.SphereGeometry(r, 16, 12);

function rodBetween(p1, p2, r, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), 8), color, { name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}

// ---- paletler ----
const TZ = 0.7;
[-TZ, TZ].forEach((z, side) => {
  const belt = mesh(box(2.6, 0.52, 0.42), track, { flat: true, rough: 0.95, name: 'palet_' + (side + 1) });
  belt.position.set(0, 0.26, z);
  modelGroup.add(belt);
  [-1.3, 1.3].forEach((cx, e) => {
    const uc = mesh(cyl(0.26, 0.26, 0.42, 20), track, { rough: 0.95, name: 'palet_uc_' + (side + 1) + '_' + (e + 1) });
    uc.rotation.x = Math.PI / 2; uc.position.set(cx, 0.26, z);
    modelGroup.add(uc);
  });
  for (let i = 0; i < 5; i++) {
    const w = mesh(cyl(0.22, 0.22, 0.4, 14), rubber, { name: 'teker_' + (side + 1) + '_' + (i + 1) });
    w.rotation.x = Math.PI / 2; w.position.set(-1.0 + i * 0.5, 0.24, z);
    modelGroup.add(w);
  }
  const fender = mesh(box(2.7, 0.06, 0.5), bodyDk, { flat: true, name: 'camurluk_' + (side + 1) });
  fender.position.set(0, 0.54, z);
  modelGroup.add(fender);
});

// ---- gövde ----
const hull = mesh(box(2.4, 0.5, 1.3), body, { flat: true, rough: 0.7, name: 'govde' });
hull.position.set(0, 0.78, 0); // 0.53 .. 1.03
modelGroup.add(hull);
const glacis = mesh(box(0.45, 0.5, 1.34), bodyDk, { flat: true, name: 'on_zirh' });
glacis.rotation.z = -0.6;
glacis.position.set(1.25, 0.72, 0);
modelGroup.add(glacis);
// ön sensör/farlar
[-0.4, 0.4].forEach((z, i) => {
  const fl = mesh(box(0.08, 0.12, 0.16), lensC, { rough: 0.3, name: 'on_sensor_' + (i + 1) });
  fl.position.set(1.32, 0.85, z);
  modelGroup.add(fl);
});
// ekipman kutuları
[[-0.7, 0.45], [-0.7, -0.45]].forEach((p, i) => {
  const bx = mesh(box(0.6, 0.3, 0.35), bodyDk, { flat: true, name: 'ekipman_' + (i + 1) });
  bx.position.set(p[0], 1.18, p[1]);
  modelGroup.add(bx);
});

// ---- dönen sensör/kamera direği ----
const post = mesh(cyl(0.06, 0.07, 0.8, 10), metal, { metal: 0.4, name: 'sensor_diregi' });
post.position.set(0.55, 1.42, 0.42); // yana kaydırıldı (makineli namlusuyla çakışmasın)
modelGroup.add(post);
const head = spin({ pivot: [0.55, 1.9, 0.42], axis: 'y', rpm: 12 });
const headBox = mesh(box(0.32, 0.26, 0.26), sensor, { flat: true, name: 'sensor_kafa' });
head.add(headBox);
const camLens = mesh(cyl(0.08, 0.08, 0.1, 14), lensC, { metal: 0.3, rough: 0.2, name: 'kamera' });
camLens.rotation.z = Math.PI / 2;
camLens.position.set(0.18, 0.02, 0);
head.add(camLens);
const irLens = mesh(cyl(0.05, 0.05, 0.09, 12), '#1a2a30', { name: 'termal' });
irLens.rotation.z = Math.PI / 2;
irLens.position.set(0.17, -0.06, 0.1);
head.add(irLens);

// ---- uzaktan komutalı silah (RWS) ----
const rwsBase = mesh(cyl(0.24, 0.28, 0.18, 14), bodyDk, { flat: true, name: 'rws_taban' });
rwsBase.position.set(-0.2, 1.12, 0);
modelGroup.add(rwsBase);
const rwsBody = mesh(box(0.4, 0.26, 0.4), gun, { flat: true, name: 'rws_govde' });
rwsBody.position.set(-0.25, 1.34, 0);
modelGroup.add(rwsBody);
const mgBarrel = mesh(cyl(0.035, 0.035, 0.9, 8), gun, { metal: 0.4, name: 'makineli_namlu' });
mgBarrel.rotation.z = Math.PI / 2;
mgBarrel.position.set(0.3, 1.34, 0);
modelGroup.add(mgBarrel);
const rwsOptic = mesh(box(0.18, 0.12, 0.14), sensor, { flat: true, name: 'rws_optik' });
rwsOptic.position.set(-0.42, 1.46, 0.12);
modelGroup.add(rwsOptic);
const ammo = mesh(box(0.24, 0.2, 0.16), bodyDk, { flat: true, name: 'cephane_kutusu' });
ammo.position.set(-0.4, 1.32, -0.22);
modelGroup.add(ammo);

// ---- antenler ----
rodBetween([-1.0, 1.05, 0.45], [-1.2, 1.95, 0.5], 0.015, ant, 'anten_1');
rodBetween([-1.0, 1.05, -0.45], [-1.15, 1.8, -0.48], 0.015, ant, 'anten_2');
