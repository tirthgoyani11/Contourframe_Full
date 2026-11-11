// Tanksavar füze (tripod ATGM) — kanister ileri-yukarı (+x), tripod altta.
const green = '#5b6147', tubeG = '#52573f', dark = '#23261d', sightCol = '#2a2d33';
const metal = '#6a6f63', lens = '#2a4a6a', thermal = '#15222a', screen = '#39a08a', band = '#b23a2e';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);
const sph = (r) => new THREE.SphereGeometry(r, 14, 12);

function rodBetween(p1, p2, r, color, name, opts) {
  opts = opts || {};
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), opts.seg || 14), color, { metal: opts.metal || 0.3, rough: 0.6, flat: opts.flat, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return m;
}
function add(m) { modelGroup.add(m); return m; }
function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }

// ---- tripod ----
const hub = [0, 0.92, 0];
const feet = [[0.85, 0, 0], [-0.6, 0, 0.72], [-0.6, 0, -0.72]];
feet.forEach((f, i) => {
  add(rodBetween(hub, f, 0.04, metal, 'bacak_' + (i + 1), { metal: 0.4 }));
  const pad = mesh(cyl(0.08, 0.1, 0.06, 8), dark, { name: 'ayak_' + (i + 1) });
  pad.position.set(f[0], 0.03, f[2]);
  add(pad);
});
const hubBlock = mesh(box(0.26, 0.22, 0.26), dark, { flat: true, metal: 0.3, name: 'kundak_govde' });
hubBlock.position.set(0, 0.95, 0);
add(hubBlock);
const traverse = mesh(cyl(0.18, 0.2, 0.12, 14), metal, { metal: 0.4, name: 'doner_yatak' });
traverse.position.set(0, 1.06, 0);
add(traverse);
// yükseliş kundağı (yoke)
[-1, 1].forEach((s, i) => {
  const up = mesh(box(0.1, 0.3, 0.08), metal, { flat: true, metal: 0.3, name: 'kundak_kol_' + (i + 1) });
  up.position.set(-0.05, 1.22, s * 0.22);
  add(up);
});

// ---- fırlatma kanisteri (ileri-yukarı) ----
const back = [-0.75, 1.12, 0], front = [1.0, 1.34, 0];
add(rodBetween(back, front, 0.16, tubeG, 'kanister', { metal: 0.2, flat: true, seg: 18 }));
const rearCap = mesh(cyl(0.19, 0.19, 0.12, 16), dark, { name: 'arka_kapak' });
const rc = rodBetween([-0.82, 1.11, 0], back, 0.19, dark, 'arka_kapak', { seg: 16 }); add(rc);
const frontCap = rodBetween(front, lerp(back, front, 1.07), 0.18, dark, 'agiz', { seg: 16 }); add(frontCap);
// kanister bandı (kırmızı işaret)
const bnd = rodBetween(lerp(back, front, 0.5), lerp(back, front, 0.57), 0.17, band, 'bant', { seg: 16 }); add(bnd);

// ---- termal nişan / güdüm ünitesi ----
const sight = mesh(box(0.4, 0.34, 0.26), sightCol, { flat: true, metal: 0.2, name: 'nisangah' });
sight.position.set(-0.15, 1.56, 0.3);
add(sight);
const obj = mesh(cyl(0.11, 0.11, 0.16, 16), thermal, { metal: 0.3, rough: 0.2, name: 'objektif' });
obj.rotation.z = Math.PI / 2;
obj.position.set(0.12, 1.56, 0.3);
add(obj);
const eyep = mesh(cyl(0.05, 0.05, 0.1, 12), dark, { name: 'mercek' });
eyep.rotation.z = Math.PI / 2;
eyep.position.set(-0.4, 1.54, 0.3);
add(eyep);
const scr = mesh(box(0.04, 0.2, 0.16), screen, { rough: 0.3, name: 'ekran' });
scr.position.set(-0.37, 1.58, 0.05);
add(scr);
// nişangah bağlantı kolu (kanistere)
add(rodBetween([-0.1, 1.36, 0.12], [-0.15, 1.5, 0.28], 0.03, metal, 'nisangah_kol', { metal: 0.4 }));

// ---- tutamaklar ----
[-1, 1].forEach((s, i) => {
  const grip = mesh(cyl(0.025, 0.025, 0.22, 8), dark, { name: 'tutamak_' + (i + 1) });
  grip.position.set(-0.55, 1.0, s * 0.16);
  add(grip);
});

// ---- yedek füze kanisteri (yerde, yanda) ----
const spare = mesh(cyl(0.16, 0.16, 1.7, 16), tubeG, { flat: true, name: 'yedek_kanister' });
spare.rotation.z = Math.PI / 2;
spare.position.set(-0.1, 0.16, -1.15);
add(spare);
const spareBand = mesh(cyl(0.165, 0.165, 0.08, 16), band, { name: 'yedek_bant' });
spareBand.rotation.z = Math.PI / 2;
spareBand.position.set(0.2, 0.16, -1.15);
add(spareBand);
const spareCap = mesh(cyl(0.18, 0.18, 0.1, 16), dark, { name: 'yedek_kapak' });
spareCap.rotation.z = Math.PI / 2;
spareCap.position.set(0.78, 0.16, -1.15);
add(spareCap);
