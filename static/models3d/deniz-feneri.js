// Deniz feneri — kayalık adacık üzerinde. Ön (kapı) +x, yukarı +y.
const sea = '#2f8fc0', foam = '#eef4f7', rock = '#5c5f63', rockDk = '#494c50';
const red = '#d8392f', white = '#f2f2f2', galC = '#cfd2d4', railC = '#b9bdc0';
const glass = '#bfe2ee', frameC = '#3a3d40', lightC = '#ffe49a', gold = '#e7c558', darkC = '#2f2a20';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);
const lerp = (a, b, t) => a + (b - a) * t;

// ---- deniz + köpük halkası ----
const seaM = mesh(cyl(2.6, 2.6, 0.16, 36), sea, { flat: false, rough: 0.2, metal: 0.15, name: 'deniz' });
seaM.position.set(0, 0.08, 0); seaM.material.transparent = true; seaM.material.opacity = 0.86; modelGroup.add(seaM);
const foamRing = mesh(new THREE.TorusGeometry(1.18, 0.08, 8, 30), foam, { flat: true, name: 'kopuk_halkasi' });
foamRing.rotation.x = Math.PI / 2; foamRing.position.set(0, 0.17, 0);
foamRing.material.transparent = true; foamRing.material.opacity = 0.85; modelGroup.add(foamRing);

// ---- kayalık adacık ----
const rockTop = 0.85;
const islet = mesh(cyl(0.85, 1.28, rockTop, 9), rock, { flat: true, rough: 1, name: 'kayalik' });
islet.position.set(0, rockTop / 2, 0); modelGroup.add(islet);
[0, 1, 2, 3].forEach((k) => {
  const a = k * Math.PI / 2 + 0.6;
  const r = mesh(box(0.55, 0.36, 0.46), rockDk, { flat: true, rough: 1, name: 'kaya_' + (k + 1) });
  r.position.set(Math.cos(a) * 1.05, 0.2, Math.sin(a) * 1.05); r.rotation.y = a; modelGroup.add(r);
});

// ---- kule (kırmızı-beyaz şeritli, sivrilen) ----
const towerH = 3.4, segN = 6, rBot = 0.62, rTop = 0.40;
for (let i = 0; i < segN; i++) {
  const r0 = lerp(rBot, rTop, i / segN), r1 = lerp(rBot, rTop, (i + 1) / segN), h = towerH / segN;
  const s = mesh(cyl(r1, r0, h + 0.006, 20), i % 2 ? white : red, { flat: false, rough: 0.85, name: 'kule_' + (i + 1) });
  s.position.set(0, rockTop + h * (i + 0.5), 0); modelGroup.add(s);
}
// kapı + pencereler (+x yüzü)
const dr = mesh(box(0.16, 0.54, 0.32), darkC, { flat: true, name: 'kapi' });
dr.position.set(rBot - 0.04, rockTop + 0.27, 0); modelGroup.add(dr);
[0.42, 0.72].forEach((t, i) => {
  const rr = lerp(rBot, rTop, t);
  const w = mesh(box(0.1, 0.18, 0.14), darkC, { flat: true, name: 'pencere_' + (i + 1) });
  w.position.set(rr, rockTop + towerH * t, 0); modelGroup.add(w);
});

// ---- galeri + korkuluk ----
const gY = rockTop + towerH;
const gal = mesh(cyl(rTop + 0.18, rTop + 0.2, 0.12, 20), galC, { flat: false, name: 'galeri' });
gal.position.set(0, gY + 0.02, 0); modelGroup.add(gal);
const railR = rTop + 0.16;
for (let k = 0; k < 12; k++) {
  const a = k / 12 * Math.PI * 2;
  const p = mesh(box(0.03, 0.2, 0.03), railC, { name: 'korkuluk_direk' });
  p.position.set(Math.cos(a) * railR, gY + 0.18, Math.sin(a) * railR); modelGroup.add(p);
}
const railTop = mesh(new THREE.TorusGeometry(railR, 0.022, 6, 24), railC, { name: 'korkuluk_ust' });
railTop.rotation.x = Math.PI / 2; railTop.position.set(0, gY + 0.29, 0); modelGroup.add(railTop);

// ---- fener odası (cam + çerçeve + ışık) ----
const lY = gY + 0.12;
const glassM = mesh(cyl(0.30, 0.33, 0.6, 16), glass, { flat: false, rough: 0.1, metal: 0.2, name: 'fener_cam' });
glassM.material.transparent = true; glassM.material.opacity = 0.32; glassM.position.set(0, lY + 0.3, 0); modelGroup.add(glassM);
for (let k = 0; k < 6; k++) {
  const a = k / 6 * Math.PI * 2;
  const p = mesh(box(0.035, 0.62, 0.035), frameC, { name: 'fener_cerceve' });
  p.position.set(Math.cos(a) * 0.31, lY + 0.3, Math.sin(a) * 0.31); modelGroup.add(p);
}
const ring1 = mesh(cyl(0.34, 0.34, 0.05, 16), frameC, { name: 'fener_alt' }); ring1.position.set(0, lY + 0.02, 0); modelGroup.add(ring1);
const core = mesh(new THREE.SphereGeometry(0.16, 12, 10), lightC, { flat: false, rough: 0.3, name: 'isik' });
core.position.set(0, lY + 0.3, 0); modelGroup.add(core);

// ---- kubbe + tepe ----
const dY = lY + 0.6;
const dome = mesh(new THREE.ConeGeometry(0.40, 0.5, 16), red, { flat: false, name: 'kubbe' });
dome.position.set(0, dY + 0.25, 0); modelGroup.add(dome);
const finial = mesh(new THREE.SphereGeometry(0.07, 10, 8), gold, { metal: 0.5, name: 'tepe_topu' });
finial.position.set(0, dY + 0.56, 0); modelGroup.add(finial);

// ---- dönen ışık huzmesi ----
const beamGrp = spin({ pivot: [0, lY + 0.3, 0], axis: 'y', rpm: 6 });
[1, -1].forEach((s) => {
  const c = mesh(new THREE.ConeGeometry(0.5, 2.4, 16, 1, true), lightC, { name: 'isik_huzmesi' });
  c.material.transparent = true; c.material.opacity = 0.16; c.material.side = THREE.DoubleSide;
  c.rotation.z = s > 0 ? Math.PI / 2 : -Math.PI / 2; c.position.set(s * 1.2, 0, 0); beamGrp.add(c);
});
