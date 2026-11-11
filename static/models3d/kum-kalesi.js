// Kum kalesi — plaj. Ön (kapı) +x, yukarı +y.
const sand = '#d8c187', sandDk = '#bfa46c', door = '#5c4a30', water = '#2f8fc0', flagC = '#e23b3b', pole = '#8a6a3f';
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 14);
function tri(a, b, c, color, name) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]], 3));
  g.computeVertexNormals();
  const m = mesh(g, color, { flat: true, name: name });
  m.material.side = THREE.DoubleSide; return m;
}

// ---- kum apron + su hendeği + kale platformu ----
const apron = mesh(box(4.6, 0.25, 4.6), sand, { flat: true, rough: 1, name: 'kum_apron' });
apron.position.set(0, 0.125, 0); modelGroup.add(apron);
const moat = mesh(box(3.9, 0.26, 3.9), water, { flat: true, rough: 0.2, metal: 0.15, name: 'su_hendegi' });
moat.position.set(0, 0.15, 0); moat.material.transparent = true; moat.material.opacity = 0.85; modelGroup.add(moat);
const BASE = 0.75;
const platform = mesh(box(3.2, 0.5, 3.2), sand, { flat: true, rough: 1, name: 'kale_platformu' });
platform.position.set(0, 0.5, 0); modelGroup.add(platform);
// köprü (kapının önünde, hendek üzerinden)
const bridge = mesh(box(0.9, 0.07, 0.5), sandDk, { flat: true, name: 'kopru' });
bridge.position.set(1.95, 0.6, 0); modelGroup.add(bridge);

// ---- mazgallar (battlement) ----
function crenelCyl(cx, cz, r, topY, n, name) {
  for (let k = 0; k < n; k++) {
    const a = k / n * Math.PI * 2;
    const m = mesh(box(0.13, 0.18, 0.13), sand, { flat: true, name: name });
    m.position.set(cx + Math.cos(a) * r, topY + 0.09, cz + Math.sin(a) * r); m.rotation.y = a;
    modelGroup.add(m);
  }
}
function crenelLine(x, z, len, horiz, topY, name) {
  const n = Math.max(3, Math.round(len / 0.36));
  for (let k = 0; k < n; k++) {
    const f = (k + 0.5) / n - 0.5;
    const m = mesh(box(0.16, 0.18, 0.16), sand, { flat: true, name: name });
    if (horiz) m.position.set(x + f * len, topY + 0.09, z); else m.position.set(x, topY + 0.09, z + f * len);
    modelGroup.add(m);
  }
}

// ---- köşe kuleleri (kova şekli: alt geniş, üst dar) ----
function tower(cx, cz, r, h, name) {
  const t = mesh(cyl(r * 0.82, r, h, 14), sand, { flat: false, rough: 1, name: name });
  t.position.set(cx, BASE + h / 2, cz); modelGroup.add(t);
  // kum bandı çizgileri
  for (let b = 1; b <= 2; b++) {
    const band = mesh(cyl(r * (1 - 0.06 * b) + 0.012, r * (1 - 0.06 * b) + 0.012, 0.04, 14), sandDk, { name: name + '_band' });
    band.position.set(cx, BASE + h * b / 3, cz); modelGroup.add(band);
  }
  crenelCyl(cx, cz, r * 0.82, BASE + h, 7, name + '_mazgal');
  // pencere (+x'e bakar)
  const w = mesh(box(0.1, 0.2, 0.16), door, { flat: true, name: name + '_pencere' });
  w.position.set(cx + r * 0.85, BASE + h * 0.55, cz); modelGroup.add(w);
}
tower(-1.0, -1.0, 0.32, 1.05, 'kule_1');
tower(-1.0, 1.0, 0.32, 1.05, 'kule_2');
tower(1.0, -1.0, 0.32, 1.05, 'kule_3');
tower(1.0, 1.0, 0.32, 1.05, 'kule_4');

// ---- surlar ----
const wallH = 0.55, wallTop = BASE + wallH;
// arka (-x) ve yanlar (z=±1)
const back = mesh(box(0.22, wallH, 1.7), sand, { flat: true, rough: 1, name: 'sur_arka' });
back.position.set(-1.0, BASE + wallH / 2, 0); modelGroup.add(back);
crenelLine(-1.0, 0, 1.7, false, wallTop, 'mazgal_arka');
[-1, 1].forEach((s, i) => {
  const w = mesh(box(1.7, wallH, 0.22), sand, { flat: true, rough: 1, name: 'sur_yan_' + (i + 1) });
  w.position.set(0, BASE + wallH / 2, s * 1.0); modelGroup.add(w);
  crenelLine(0, s * 1.0, 1.7, true, wallTop, 'mazgal_yan_' + (i + 1));
});
// ön (+x) iki parça + kapı boşluğu
[-0.65, 0.65].forEach((z, i) => {
  const w = mesh(box(0.22, wallH, 0.68), sand, { flat: true, rough: 1, name: 'sur_on_' + (i + 1) });
  w.position.set(1.0, BASE + wallH / 2, z); modelGroup.add(w);
  crenelLine(1.0, z, 0.68, false, wallTop, 'mazgal_on_' + (i + 1));
});
// kemerli kapı (koyu boşluk)
const gate = mesh(box(0.26, 0.42, 0.5), door, { flat: true, name: 'kapi' });
gate.position.set(1.0, BASE + 0.21, 0); modelGroup.add(gate);
const arch = mesh(cyl(0.25, 0.25, 0.26, 12, true), door, { name: 'kapi_kemer' });
arch.rotation.z = Math.PI / 2; arch.position.set(1.0, BASE + 0.42, 0); arch.scale.set(1, 1, 1); modelGroup.add(arch);

// ---- orta kale + bayrak ----
const keepH = 1.5, kr = 0.45;
const keep = mesh(cyl(kr * 0.85, kr, keepH, 16), sand, { flat: false, rough: 1, name: 'orta_kale' });
keep.position.set(0, BASE + keepH / 2, 0); modelGroup.add(keep);
for (let b = 1; b <= 2; b++) {
  const band = mesh(cyl(kr * (1 - 0.05 * b) + 0.012, kr * (1 - 0.05 * b) + 0.012, 0.05, 16), sandDk, { name: 'kale_band' });
  band.position.set(0, BASE + keepH * b / 3, 0); modelGroup.add(band);
}
crenelCyl(0, 0, kr * 0.85, BASE + keepH, 9, 'kale_mazgal');
const kw = mesh(box(0.12, 0.24, 0.18), door, { flat: true, name: 'kale_pencere' });
kw.position.set(kr * 0.88, BASE + keepH * 0.6, 0); modelGroup.add(kw);
// bayrak
const fpY = BASE + keepH;
const fpole = mesh(cyl(0.022, 0.022, 0.65, 6), pole, { metal: 0.2, name: 'bayrak_diregi' });
fpole.position.set(0, fpY + 0.32, 0); modelGroup.add(fpole);
const flag = tri([0.02, fpY + 0.58, 0], [0.02, fpY + 0.3, 0], [0.5, fpY + 0.44, 0], flagC, 'bayrak');
modelGroup.add(flag);
