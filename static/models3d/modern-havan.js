// Modern havan (mortar) — namlu yukarı-öne (+x) açılı.
const tubeCol = '#3a3d40', dark = '#2c2f31', plate = '#33352f', leg = '#5e6347';
const metal = '#7e8378', screen = '#39a08a', lens = '#2a4a6a';
const bombCol = '#4a5132', band = '#b23a2e', wheelblk = '#16181a';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);
const sph = (r) => new THREE.SphereGeometry(r, 16, 12);

// iki nokta arasında silindir (namlu / bacaklar / kollar)
function rodBetween(p1, p2, r, color, name, opts) {
  opts = opts || {};
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), opts.seg || 16), color, { metal: opts.metal || 0.4, rough: 0.5, flat: opts.flat, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
  return m;
}
function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }

// ---- taban plakası ----
const baseplate = mesh(cyl(0.72, 0.72, 0.12, 8), plate, { flat: true, metal: 0.3, name: 'taban_plakasi' });
baseplate.position.set(-0.45, 0.06, 0);
modelGroup.add(baseplate);
const socket = mesh(cyl(0.22, 0.28, 0.16, 12), dark, { metal: 0.4, name: 'mafsal_yuvasi' });
socket.position.set(-0.55, 0.18, 0);
modelGroup.add(socket);

// ---- namlu ----
const breech = [-0.55, 0.24, 0];
const muzzle = [0.7, 3.05, 0];
rodBetween(breech, muzzle, 0.13, tubeCol, 'namlu', { metal: 0.5, flat: true });
const ball = mesh(sph(0.17), dark, { metal: 0.4, name: 'mafsal_topu' });
ball.position.set(breech[0], breech[1], breech[2]);
modelGroup.add(ball);
// namlu ağzı (üstte hafif geniş)
rodBetween(lerp(breech, muzzle, 0.93), muzzle, 0.16, dark, 'namlu_agzi', { metal: 0.5 });

// ---- bipod (A-tipi sehpa) ----
const yoke = lerp(breech, muzzle, 0.62); // namlu üzerinde kelepçe noktası
const feet = [[0.55, 0, 0.95], [0.55, 0, -0.95]];
feet.forEach((f, i) => {
  rodBetween(yoke, f, 0.05, leg, 'bipod_bacak_' + (i + 1), { metal: 0.3 });
  const pad = mesh(cyl(0.1, 0.13, 0.08, 10), dark, { name: 'bipod_ayak_' + (i + 1) });
  pad.position.set(f[0], 0.04, f[2]);
  modelGroup.add(pad);
});
// bacaklar arası çapraz bağ
rodBetween([0.55, 0.5, 0.95], [0.55, 0.5, -0.95], 0.03, leg, 'bipod_capraz', { metal: 0.3 });
// namlu kelepçesi
const clamp = mesh(cyl(0.2, 0.2, 0.16, 14), metal, { metal: 0.4, name: 'namlu_kelepcesi' });
clamp.position.set(yoke[0], yoke[1], yoke[2]);
clamp.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(muzzle[0] - breech[0], muzzle[1] - breech[1], 0).normalize());
modelGroup.add(clamp);

// ---- yükseliş/yön mekanizması + el çarkları ----
const mechBox = mesh(box(0.22, 0.28, 0.5), dark, { flat: true, metal: 0.3, name: 'mekanizma' });
mechBox.position.set(0.12, 1.7, 0);
modelGroup.add(mechBox);
[0.32, -0.32].forEach((z, i) => {
  const shaft = mesh(cyl(0.02, 0.02, 0.16, 8), metal, { metal: 0.5, name: 'cark_mili_' + (i + 1) });
  shaft.rotation.x = Math.PI / 2;
  shaft.position.set(0.12, 1.62, z);
  modelGroup.add(shaft);
  const hw = mesh(new THREE.TorusGeometry(0.11, 0.022, 8, 18), wheelblk, { name: 'el_carki_' + (i + 1) });
  hw.position.set(0.12, 1.62, z + (z > 0 ? 0.1 : -0.1));
  modelGroup.add(hw);
});

// ---- dijital atış kontrol / nişangah ----
rodBetween([0.05, 1.85, 0.18], [-0.18, 2.0, 0.5], 0.025, metal, 'nisangah_kol', { metal: 0.4 });
const sight = mesh(box(0.24, 0.3, 0.18), dark, { flat: true, metal: 0.3, name: 'nisangah' });
sight.position.set(-0.22, 2.06, 0.55);
modelGroup.add(sight);
const sScreen = mesh(box(0.03, 0.2, 0.14), screen, { rough: 0.3, name: 'nisangah_ekran' });
sScreen.position.set(-0.35, 2.08, 0.55);
modelGroup.add(sScreen);
const sLens = mesh(cyl(0.05, 0.05, 0.1, 12), lens, { metal: 0.4, rough: 0.2, name: 'nisangah_optik' });
sLens.rotation.x = Math.PI / 2;
sLens.position.set(-0.22, 2.18, 0.55);
modelGroup.add(sLens);

// ---- havan mermileri (yerde, yanda) ----
function bomb(px, pz, idx) {
  const body = mesh(cyl(0.1, 0.1, 0.42, 14), bombCol, { name: 'mermi' + idx + '_govde' });
  body.rotation.z = Math.PI / 2; body.position.set(px, 0.12, pz);
  modelGroup.add(body);
  const nose = mesh(new THREE.ConeGeometry(0.1, 0.26, 14), bombCol, { name: 'mermi' + idx + '_burun' });
  nose.rotation.z = -Math.PI / 2; nose.position.set(px + 0.34, 0.12, pz);
  modelGroup.add(nose);
  const tail = mesh(cyl(0.06, 0.1, 0.2, 12), dark, { name: 'mermi' + idx + '_kuyruk' });
  tail.rotation.z = Math.PI / 2; tail.position.set(px - 0.3, 0.12, pz);
  modelGroup.add(tail);
  const bnd = mesh(cyl(0.105, 0.105, 0.05, 14), band, { name: 'mermi' + idx + '_bant' });
  bnd.rotation.z = Math.PI / 2; bnd.position.set(px + 0.08, 0.12, pz);
  modelGroup.add(bnd);
}
bomb(-0.15, -1.25, 1);
bomb(0.2, -1.45, 2);
