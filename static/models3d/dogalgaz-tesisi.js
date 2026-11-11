// Doğalgaz / LNG tesisi.
const sphereC = '#dfe2e4', leg = '#7e848c', columnC = '#9aa0a6', colTop = '#7c8084';
const pipeS = '#8a8f96', pipeY = '#d2a93a', pipeB = '#34617f', bldg = '#8a8f8a', dark = '#34383c';
const flameO = '#e8622a', flameY = '#ffd24a', ground = '#6b6f6a';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 14);
const sph = (r) => new THREE.SphereGeometry(r, 18, 12);
function rod(p1, p2, r, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]), b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), 8), color, { metal: 0.3, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}

// ---- zemin ----
const g0 = mesh(box(18, 0.1, 14), ground, { flat: true, rough: 0.95, name: 'zemin' });
g0.position.set(0, 0.05, 0); modelGroup.add(g0);

// ---- küresel LNG tankları (ayaklı) ----
function sphereTank(px, pz, R, idx) {
  const cy = R + 0.9;
  const s = mesh(sph(R), sphereC, { flat: false, rough: 0.45, metal: 0.1, name: 'lng_kure_' + idx });
  s.position.set(px, cy, pz); modelGroup.add(s);
  const band = mesh(cyl(R * 1.01, R * 1.01, 0.12, 18), '#c4c7c9', { name: 'kure_band_' + idx });
  band.position.set(px, cy, pz); modelGroup.add(band);
  for (let k = 0; k < 8; k++) {
    const a = k * Math.PI / 4;
    rod([px + Math.cos(a) * R * 1.15, 0.1, pz + Math.sin(a) * R * 1.15],
      [px + Math.cos(a) * R * 0.62, cy - R * 0.45, pz + Math.sin(a) * R * 0.62], 0.06, leg, 'kure_ayak_' + idx);
  }
}
sphereTank(-4.5, -2.5, 1.4, 1);
sphereTank(-4.5, 2.2, 1.3, 2);

// ---- damıtma kuleleri (platformlu) ----
function column(px, pz, h, r, idx) {
  const c = mesh(cyl(r, r, h, 16), columnC, { flat: false, rough: 0.6, name: 'kule_' + idx });
  c.position.set(px, h / 2 + 0.1, pz); modelGroup.add(c);
  const top = mesh(cyl(r, r * 0.6, r * 1.2, 16), colTop, { flat: false, name: 'kule_tepe_' + idx });
  top.position.set(px, h + 0.1 + r * 0.6, pz); modelGroup.add(top);
  // platformlar
  for (let p = 1; p <= 2; p++) {
    const plat = mesh(cyl(r + 0.25, r + 0.25, 0.06, 16), dark, { name: 'platform_' + idx + '_' + p });
    plat.position.set(px, 0.1 + h * p / 3, pz); modelGroup.add(plat);
  }
  // dikey merdiven
  const lad = mesh(box(0.06, h, 0.15), dark, { name: 'merdiven_' + idx });
  lad.position.set(px + r + 0.05, h / 2 + 0.1, pz); modelGroup.add(lad);
}
column(1.0, -3.5, 5.0, 0.45, 1);
column(2.6, -3.2, 3.8, 0.35, 2);
column(0.2, -1.5, 4.2, 0.4, 3);

// ---- flare bacası (alevli) ----
const FX = 7.0, FZ = 3.0;
const stack = mesh(cyl(0.16, 0.2, 5.5, 10), pipeS, { flat: false, metal: 0.3, name: 'flare_baca' });
stack.position.set(FX, 2.85, FZ); modelGroup.add(stack);
const flame1 = mesh(cyl(0.0, 0.34, 1.1, 10), flameO, { flat: false, name: 'alev' });
flame1.position.set(FX, 6.2, FZ); modelGroup.add(flame1);
const flame2 = mesh(cyl(0.0, 0.17, 0.65, 10), flameY, { name: 'alev_uc' });
flame2.position.set(FX, 6.6, FZ); modelGroup.add(flame2);

// ---- boru rafı (renkli borular) ----
for (let i = 0; i < 5; i++) {
  const post = mesh(box(0.12, 1.2, 0.12), leg, { name: 'raf_direk_' + (i + 1) });
  post.position.set(-5 + i * 2.5, 0.6, 5.0); modelGroup.add(post);
}
[[pipeS, 0.95], [pipeY, 1.1], [pipeB, 1.25]].forEach((p, i) => {
  const pp = mesh(cyl(0.11, 0.11, 11.5, 8), p[0], { metal: 0.2, name: 'boru_' + (i + 1) });
  pp.rotation.z = Math.PI / 2; pp.position.set(0, p[1], 5.0 + (i - 1) * 0.28);
  modelGroup.add(pp);
});

// ---- kompresör / kontrol binası ----
const cmp = mesh(box(2.6, 1.4, 1.8), bldg, { flat: true, rough: 0.85, name: 'kompresor_binasi' });
cmp.position.set(5.0, 0.8, -3.5); modelGroup.add(cmp);
const cmpRoof = mesh(box(2.8, 0.16, 2.0), '#6e6e66', { flat: true, name: 'bina_cati' });
cmpRoof.position.set(5.0, 1.6, -3.5); modelGroup.add(cmpRoof);
[-0.7, 0, 0.7].forEach((dx) => {
  const vent = mesh(cyl(0.1, 0.1, 0.4, 8), dark, { name: 'bina_baca' });
  vent.position.set(5.0 + dx, 1.85, -3.5); modelGroup.add(vent);
});
