// Sabit kanat İHA (TB2 tarzı) — burun +x, itici pervane arkada (-x).
const bodyCol = '#cfd0cb', wingCol = '#c3c5c0', sensor = '#23262b', prop = '#2b2b2e';
const muni = '#6b6f55', muniTip = '#7a1f15', metal = '#7e848c', tire = '#1b1b1e';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 14);
const sph = (r) => new THREE.SphereGeometry(r, 16, 12);

function rod(p1, p2, r, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), 8), color, { metal: 0.4, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}
const YC = 1.6; // gövde ekseni — havada (uçar pozisyon)
modelGroup.userData.noGround = true; // zemine oturtma, havada bırak

// ---- gövde ----
const fus = mesh(cyl(0.2, 0.24, 3.2, 16), bodyCol, { flat: false, rough: 0.6, name: 'govde' });
fus.rotation.z = Math.PI / 2;
fus.position.set(0, YC, 0); // x: -1.6 .. 1.6
modelGroup.add(fus);
// burun (yuvarlak)
const nose = mesh(sph(0.24), bodyCol, { rough: 0.5, name: 'burun' });
nose.position.set(1.55, YC, 0);
modelGroup.add(nose);
// SATCOM tümseği (üstte)
const dome = mesh(sph(0.22), bodyCol, { rough: 0.5, name: 'satcom_tumsek' });
dome.scale.set(1.3, 0.7, 0.9);
dome.position.set(1.05, YC + 0.22, 0);
modelGroup.add(dome);
// EO/IR sensör topu (altta)
const eo = mesh(sph(0.18), sensor, { metal: 0.3, rough: 0.3, name: 'sensor_topu' });
eo.scale.set(1, 1.1, 1);
eo.position.set(1.35, YC - 0.22, 0);
modelGroup.add(eo);
const eoLens = mesh(cyl(0.07, 0.07, 0.06, 12), '#2a4a6a', { metal: 0.4, name: 'sensor_lens' });
eoLens.position.set(1.45, YC - 0.32, 0);
eoLens.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0.6, -0.8, 0).normalize());
modelGroup.add(eoLens);

// ---- kanatlar (uzun düz, hafif dihedral) ----
[-1, 1].forEach((s, i) => {
  const wing = mesh(box(0.6, 0.08, 3.0), wingCol, { flat: true, rough: 0.6, name: 'kanat_' + (i + 1) });
  wing.position.set(0.15, YC + 0.18, s * 1.62);
  wing.rotation.x = -s * 0.05; // uçlar hafif yukarı
  modelGroup.add(wing);
  // kanat-gövde bağlantı pilonu
  const pylon = mesh(box(0.3, 0.22, 0.12), bodyCol, { flat: true, name: 'pilon_' + (i + 1) });
  pylon.position.set(0.15, YC + 0.1, s * 0.28);
  modelGroup.add(pylon);
});

// ---- inverted-V kuyruk ----
[-1, 1].forEach((s, i) => {
  const tail = mesh(box(0.7, 0.8, 0.05), wingCol, { flat: true, name: 'kuyruk_' + (i + 1) });
  tail.position.set(-1.2, YC + 0.18, s * 0.28);
  tail.rotation.x = s * 0.6; // V şekli (üstte birleşir gibi)
  modelGroup.add(tail);
});

// ---- itici pervane (arkada, x ekseninde döner) ----
const hub = mesh(cyl(0.1, 0.12, 0.18, 12), prop, { name: 'pervane_gobek' });
hub.rotation.z = Math.PI / 2;
hub.position.set(-1.7, YC, 0);
modelGroup.add(hub);
const propeller = spin({ pivot: [-1.78, YC, 0], axis: 'x', rpm: 800 });
const blade = mesh(box(0.04, 1.2, 0.14), prop, { flat: true, name: 'pervane' });
propeller.add(blade);
const spinner = mesh(cyl(0.0, 0.11, 0.26, 12), prop, { name: 'spinner' });
spinner.rotation.z = Math.PI / 2; // ucu arkaya (-x) sivrilir (pusher)
spinner.position.set(-0.13, 0, 0);
propeller.add(spinner);

// ---- kanat altı mühimmatlar (MAM-L) ----
[[0.85], [1.5]].forEach((zz, k) => {
  [-1, 1].forEach((s) => {
    const z = s * zz[0];
    const mb = mesh(cyl(0.055, 0.055, 0.5, 10), muni, { name: 'mam_' + (s > 0 ? 'R' : 'L') + (k + 1) });
    mb.rotation.z = Math.PI / 2;
    mb.position.set(0.2, YC - 0.02, z);
    modelGroup.add(mb);
    const mn = mesh(new THREE.ConeGeometry(0.055, 0.16, 10), muniTip, { name: 'mam_burun' });
    mn.rotation.z = -Math.PI / 2;
    mn.position.set(0.5, YC - 0.02, z);
    modelGroup.add(mn);
    const fin = mesh(box(0.14, 0.16, 0.02), muni, { name: 'mam_kanat' });
    fin.position.set(0.0, YC - 0.02, z);
    modelGroup.add(fin);
  });
});

// teker/stand yok — İHA havada (modelGroup.userData.noGround = true)
