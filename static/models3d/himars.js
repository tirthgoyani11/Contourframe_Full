// HIMARS roketatar (6x6) — kabin +x, fırlatma pod'u arkada yukarı-geriye kalkık.
const green = '#5b6650', greenDark = '#4c5644', dark = '#23271c';
const tire = '#1b1b1e', hub = '#3a3a40', glass = '#1a1f18', metal = '#7e8378';
const tubeDark = '#101210', light = '#e6df8a';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);

function rodBetween(p1, p2, r, color, name, opts) {
  opts = opts || {};
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), 10), color, { metal: opts.metal || 0.4, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}

// ---- şasi ----
const chassis = mesh(box(5.6, 0.5, 2.0), greenDark, { flat: true, rough: 0.8, name: 'sasi' });
chassis.position.set(0, 1.0, 0); // 0.75 .. 1.25
modelGroup.add(chassis);

// ---- kabin (zırhlı) ----
const cab = mesh(box(1.5, 1.2, 2.0), green, { flat: true, rough: 0.75, name: 'kabin' });
cab.position.set(2.3, 1.75, 0); // 1.15 .. 2.35
modelGroup.add(cab);
const ws = mesh(box(0.06, 0.42, 1.6), glass, { rough: 0.2, metal: 0.3, name: 'on_cam' });
ws.rotation.z = 0.3; ws.position.set(3.0, 1.95, 0);
modelGroup.add(ws);
[-1, 1].forEach((s, i) => {
  const sw = mesh(box(0.8, 0.32, 0.05), glass, { rough: 0.2, metal: 0.3, name: 'yan_cam_' + (i + 1) });
  sw.position.set(2.3, 1.95, s * 1.0);
  modelGroup.add(sw);
  const head = mesh(box(0.1, 0.18, 0.3), light, { rough: 0.4, name: 'far_' + (i + 1) });
  head.position.set(3.07, 1.35, s * 0.7);
  modelGroup.add(head);
  const stalk = mesh(cyl(0.02, 0.02, 0.16, 6), dark, { name: 'ayna_kol_' + (i + 1) });
  stalk.rotation.x = Math.PI / 2; stalk.position.set(2.6, 1.95, s * 1.05);
  modelGroup.add(stalk);
  const mir = mesh(box(0.1, 0.16, 0.05), dark, { name: 'ayna_' + (i + 1) });
  mir.position.set(2.6, 1.95, s * 1.12);
  modelGroup.add(mir);
});

// ---- tekerlekler (6x6) ----
[2.2, -0.6, -1.6].forEach((x, ax) => {
  [-1, 1].forEach((s) => {
    const w = mesh(cyl(0.5, 0.5, 0.4, 18), tire, { rough: 0.9, name: 'teker_' + (ax + 1) + (s > 0 ? 'R' : 'L') });
    w.rotation.x = Math.PI / 2; w.position.set(x, 0.5, s * 1.0);
    modelGroup.add(w);
    const r = mesh(cyl(0.17, 0.17, 0.42, 8), hub, { metal: 0.5, name: 'jant' });
    r.rotation.x = Math.PI / 2; r.position.set(x, 0.5, s * 1.0);
    modelGroup.add(r);
  });
});

// ---- fırlatma modülü tabanı + döner tabla ----
const modBase = mesh(box(2.6, 0.5, 1.85), greenDark, { flat: true, name: 'modul_tabani' });
modBase.position.set(-1.1, 1.4, 0);
modelGroup.add(modBase);
const turntable = mesh(cyl(0.7, 0.8, 0.28, 16), dark, { metal: 0.3, name: 'doner_tabla' });
turntable.position.set(-1.0, 1.55, 0);
modelGroup.add(turntable);

// ---- fırlatma pod'u (grup olarak, yukarı-geriye kalkık) ----
const podG = new THREE.Group();
const pod = mesh(box(3.0, 1.1, 1.5), green, { flat: true, rough: 0.7, name: 'firlatma_podu' });
podG.add(pod);
// üst çerçeve kayışları
[-0.9, 0, 0.9].forEach((lx, i) => {
  const strap = mesh(box(0.12, 0.06, 1.55), greenDark, { name: 'pod_kayis_' + (i + 1) });
  strap.position.set(lx, 0.58, 0);
  podG.add(strap);
});
// roket tüpü ağızları (arka yüz, 2x3) — yerel -x ucu
[-0.3, 0.3].forEach((yy, ri) => {
  [-0.45, 0, 0.45].forEach((zz, ci) => {
    const open = mesh(cyl(0.19, 0.19, 0.16, 14), tubeDark, { name: 'tup_' + (ri * 3 + ci + 1) });
    open.rotation.z = Math.PI / 2;
    open.position.set(-1.5, yy, zz);
    podG.add(open);
    const rim = mesh(cyl(0.21, 0.21, 0.06, 14), dark, { name: 'tup_halka' });
    rim.rotation.z = Math.PI / 2;
    rim.position.set(-1.46, yy, zz);
    podG.add(rim);
  });
});
podG.position.set(-2.0, 2.45, 0);
podG.rotation.z = -0.6; // arka uç yukarı-geriye
modelGroup.add(podG);

// ---- hidrolik kalkış kolları ----
[-1, 1].forEach((s, i) => {
  rodBetween([0.0, 1.3, s * 0.5], [-1.0, 1.95, s * 0.5], 0.06, metal, 'hidrolik_kol_' + (i + 1), { metal: 0.5 });
});
