// Kent enkazı / savaş alanı.
const street = '#5a5a55', concrete = '#7a766a', concDk = '#5e5a50', rebar = '#3a3d33';
const burned = '#2a2724', glassBroke = '#1a1f22', sand = '#8a7d58', rubbleC = '#6b6458';
const smoke = '#3a3a3a', lamp = '#4a4d50', crater = '#2e2b24';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 8);

// ---- zemin (sokak) ----
const ground = mesh(box(16, 0.1, 12), street, { flat: true, rough: 1, name: 'sokak' });
ground.position.set(0, 0.05, 0);
modelGroup.add(ground);
// hasar yamaları
[[-2, 1, 2.5], [3, -3, 2], [-4, 2, 1.6]].forEach((p, i) => {
  const patch = mesh(box(p[2], 0.02, p[2] * 0.8), rubbleC, { name: 'hasar_' + (i + 1) });
  patch.position.set(p[0], 0.11, p[1]);
  modelGroup.add(patch);
});

// ---- yıkık bina ----
function ruin(px, pz, w, d, h, idx) {
  const g = new THREE.Group();
  // arka duvar (pencere boşluklu)
  const back = mesh(box(w, h, 0.22), concrete, { flat: true, rough: 0.9, name: 'bina' + idx + '_arka' });
  back.position.set(0, h / 2, -d / 2); g.add(back);
  for (let c = 0; c < 2; c++) for (let r = 0; r < 2; r++) {
    const win = mesh(box(w * 0.22, h * 0.22, 0.26), glassBroke, { name: 'bina' + idx + '_pencere' });
    win.position.set(-w * 0.22 + c * w * 0.44, h * 0.32 + r * h * 0.34, -d / 2); g.add(win);
  }
  // sol duvar (kısmen yıkık)
  const left = mesh(box(0.22, h * 0.7, d), concrete, { flat: true, name: 'bina' + idx + '_sol' });
  left.position.set(-w / 2, h * 0.35, 0); g.add(left);
  // sağ duvar (daha yıkık)
  const right = mesh(box(0.22, h * 0.42, d * 0.7), concDk, { flat: true, name: 'bina' + idx + '_sag' });
  right.position.set(w / 2, h * 0.21, -d * 0.1); g.add(right);
  // ön kalıntı (çökmüş)
  const front = mesh(box(w * 0.45, h * 0.3, 0.22), concDk, { flat: true, name: 'bina' + idx + '_on' });
  front.position.set(-w * 0.2, h * 0.15, d / 2); g.add(front);
  // açıkta kat döşemesi (kırık)
  const floorSlab = mesh(box(w * 0.75, 0.14, d * 0.65), concDk, { flat: true, name: 'bina' + idx + '_kat' });
  floorSlab.position.set(-w * 0.05, h * 0.5, -d * 0.05); g.add(floorSlab);
  // jagged tepe parçaları
  [[-w * 0.3, h + 0.1], [0, h - 0.25], [w * 0.28, h - 0.5]].forEach((s, i) => {
    const chunk = mesh(box(w * 0.2, 0.3, 0.2), concrete, { name: 'bina' + idx + '_tepe' });
    chunk.position.set(s[0], s[1], -d / 2); g.add(chunk);
  });
  // fırlamış demirler
  [-w * 0.15, w * 0.1].forEach((x, i) => {
    const rb = mesh(cyl(0.02, 0.02, 0.5, 5), rebar, { name: 'demir' });
    rb.rotation.z = 0.2 * (i ? 1 : -1);
    rb.position.set(x, h + 0.25, -d / 2); g.add(rb);
  });
  g.position.set(px, 0.1, pz);
  modelGroup.add(g);
}
ruin(-4.0, -3.2, 4.0, 3.0, 4.2, 1);
ruin(4.2, -2.5, 3.2, 3.0, 3.2, 2);
ruin(3.5, 3.4, 2.6, 2.2, 2.2, 3);

// ---- moloz yığınları ----
function rubble(px, pz, sc) {
  const off = [[0, 0, 0.6], [0.4, 0.2, 0.4], [-0.35, 0.25, 0.45], [0.15, -0.35, 0.35], [-0.2, -0.2, 0.3]];
  off.forEach((o, i) => {
    const r = mesh(cyl(o[2] * sc * 0.5, o[2] * sc * 0.7, o[2] * sc * 0.6, 5), rubbleC, { flat: true, name: 'moloz' });
    r.rotation.y = i; r.position.set(px + o[0] * sc, o[2] * sc * 0.25, pz + o[1] * sc);
    modelGroup.add(r);
  });
}
rubble(-2.0, -1.6, 1.4);
rubble(2.4, 0.4, 1.2);
rubble(-4.0, -1.2, 1.0);

// ---- yanmış araç enkazı ----
const wreckG = new THREE.Group();
const wbody = mesh(box(2.4, 0.5, 1.3), burned, { flat: true, name: 'enkaz_govde' });
wbody.position.set(0, 0.5, 0); wreckG.add(wbody);
const wcab = mesh(box(1.2, 0.5, 1.2), burned, { flat: true, name: 'enkaz_kabin' });
wcab.position.set(-0.2, 0.95, 0); wreckG.add(wcab);
const whood = mesh(box(0.9, 0.1, 1.2), '#1c1a18', { flat: true, name: 'enkaz_kaput' });
whood.rotation.z = -0.3; whood.position.set(1.2, 0.7, 0); wreckG.add(whood);
[[0.8, 0.6], [0.8, -0.6]].forEach((p) => {
  const w = mesh(cyl(0.35, 0.35, 0.2, 10), '#15140f', { name: 'enkaz_teker' });
  w.rotation.x = Math.PI / 2; w.position.set(p[0], 0.3, p[1]); wreckG.add(w);
});
wreckG.position.set(-0.5, 0.1, 2.3); wreckG.rotation.z = 0.08; wreckG.rotation.y = 0.5;
modelGroup.add(wreckG);

// ---- sokak barikatı ----
for (let i = 0; i < 4; i++) {
  const sb = mesh(box(0.55, 0.35, 0.9), sand, { flat: true, name: 'barikat_torba_' + (i + 1) });
  sb.position.set(-0.6 + i * 0.55, 0.28 + (i % 2) * 0.34, 0.0);
  modelGroup.add(sb);
}
[[1.6, 0.0], [-1.6, 0.0]].forEach((p, i) => {
  const blk = mesh(cyl(0.4, 0.55, 0.8, 4), concrete, { flat: true, name: 'barikat_blok_' + (i + 1) });
  blk.rotation.y = Math.PI / 4; blk.position.set(p[0], 0.45, p[1]);
  modelGroup.add(blk);
});

// ---- krater ----
const cr = mesh(cyl(1.0, 0.6, 0.2, 16), crater, { flat: true, name: 'krater' });
cr.position.set(1.5, 0.1, -4.2);
modelGroup.add(cr);
for (let i = 0; i < 6; i++) {
  const a = i * Math.PI / 3;
  const deb = mesh(cyl(0.15, 0.2, 0.2, 5), rubbleC, { name: 'krater_moloz' });
  deb.position.set(1.5 + Math.cos(a) * 1.1, 0.18, -4.2 + Math.sin(a) * 1.1);
  modelGroup.add(deb);
}

// ---- eğik lamba direği ----
const lp = mesh(cyl(0.06, 0.08, 3.0, 8), lamp, { metal: 0.3, name: 'lamba_diregi' });
lp.rotation.z = 0.35; lp.position.set(-5.5, 1.4, 4.0);
modelGroup.add(lp);
const lpHead = mesh(box(0.6, 0.12, 0.2), lamp, { flat: true, name: 'lamba_kafa' });
lpHead.position.set(-5.0, 2.85, 4.0);
modelGroup.add(lpHead);

// ---- yükselen duman (ruin1 üstünden) ----
[[0.5, 0.5], [1.3, 0.75], [2.2, 1.0], [3.2, 1.3]].forEach((s, i) => {
  const puff = mesh(cyl(s[1], s[1] * 0.8, 0.8, 8), smoke, { flat: true, name: 'duman_' + (i + 1) });
  puff.position.set(-4.0 + i * 0.25, 4.4 + s[0], -3.2);
  puff.material.transparent = true; puff.material.opacity = 0.55 - i * 0.08;
  modelGroup.add(puff);
});
