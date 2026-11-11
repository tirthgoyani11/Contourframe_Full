// Şezlong + Şemsiye — plaj sahnesi. Ön +x, yukarı +y. Deniz arkada (-z), kum önde.
const sand = '#d8c187', sandWet = '#c4ac72', sea = '#2f8fc0', foam = '#eef4f7', wave = '#cfeaf4';
const umbR = '#e23b3b', umbW = '#f2f2f2', pole = '#c7ccd0';
const frameC = '#e6e8e6', cushA = '#1f9bb0', cushB = '#eef2f2', towelC = '#e6603a';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 12);
const sph = (r, a, b) => new THREE.SphereGeometry(r, a || 14, b || 10);
function tri(a, b, c, color, name) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(
    [a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]], 3));
  g.computeVertexNormals();
  const m = mesh(g, color, { flat: true, name: name });
  m.material.side = THREE.DoubleSide;
  return m;
}

// ---- kum zemin ----
const ground = mesh(box(8, 0.3, 7), sand, { flat: true, rough: 1, name: 'kum' });
ground.position.set(0, 0.15, -0.3); modelGroup.add(ground);
// ıslak kum şeridi (kıyı)
const wetband = mesh(box(8, 0.31, 0.7), sandWet, { flat: true, rough: 1, name: 'islak_kum' });
wetband.position.set(0, 0.155, -1.55); modelGroup.add(wetband);

// ---- deniz + köpük + hareketli dalgalar ----
const seaM = mesh(box(8, 0.12, 2.4), sea, { flat: true, rough: 0.2, metal: 0.15, name: 'deniz' });
seaM.position.set(0, 0.27, -2.6); seaM.material.transparent = true; seaM.material.opacity = 0.86;
modelGroup.add(seaM);
const foamLine = mesh(box(8, 0.06, 0.28), foam, { flat: true, name: 'kiyi_kopugu' });
foamLine.position.set(0, 0.31, -1.45); foamLine.material.transparent = true; foamLine.material.opacity = 0.9;
modelGroup.add(foamLine);
modelGroup.userData.flow = modelGroup.userData.flow || [];
for (let i = 0; i < 4; i++) {
  const wv = mesh(box(7.7, 0.04, 0.16), wave, { flat: true, name: 'dalga_' + (i + 1) });
  wv.position.set(0, 0.34, -3.6 + i * 0.62);
  wv.material.transparent = true; wv.material.opacity = 0.6;
  modelGroup.add(wv);
  modelGroup.userData.flow.push({ obj: wv, axis: 'z', speed: 0.33, min: -3.8, max: -1.45 });
}

// ---- plaj şemsiyesi (eğik, çizgili) ----
const umb = new THREE.Group();
umb.position.set(-1.1, 0.3, -0.2); umb.rotation.z = -0.2; // tepe +x'e (şezlonga) doğru eğik
modelGroup.add(umb);
const mast = mesh(cyl(0.035, 0.05, 2.5, 10), pole, { metal: 0.4, name: 'semsiye_direk' });
mast.position.set(0, 1.25, 0); umb.add(mast);
const H = 2.5, R = 1.55, drop = 0.5, N = 12;
for (let i = 0; i < N; i++) {
  const a0 = i / N * Math.PI * 2, a1 = (i + 1) / N * Math.PI * 2;
  const r0 = [Math.cos(a0) * R, H - drop, Math.sin(a0) * R];
  const r1 = [Math.cos(a1) * R, H - drop, Math.sin(a1) * R];
  umb.add(tri([0, H, 0], r0, r1, i % 2 ? umbR : umbW, 'semsiye_dilim_' + (i + 1)));
  // tırtıklı kenar (aşağı bakan küçük üçgen)
  const mid = [Math.cos((a0 + a1) / 2) * R * 1.06, H - drop - 0.16, Math.sin((a0 + a1) / 2) * R * 1.06];
  umb.add(tri(r0, r1, mid, i % 2 ? umbR : umbW, 'semsiye_kenar_' + (i + 1)));
}
const finial = mesh(sph(0.06), pole, { metal: 0.4, name: 'semsiye_tepe' });
finial.position.set(0, H + 0.06, 0); umb.add(finial);

// ---- şezlong ----
const L = new THREE.Group(); L.position.set(0.55, 0.3, 0.5); modelGroup.add(L); // kum üstü (y=0.3)
// ayaklar
[[-0.7, -0.27], [-0.7, 0.27], [0.7, -0.27], [0.7, 0.27]].forEach((p, i) => {
  const leg = mesh(box(0.06, 0.36, 0.06), frameC, { name: 'sezlong_ayak_' + (i + 1) });
  leg.position.set(p[0], 0.18, p[1]); L.add(leg);
});
// yan kirişler
[-0.27, 0.27].forEach((z, i) => {
  const rail = mesh(box(1.5, 0.06, 0.06), frameC, { name: 'sezlong_kiris_' + (i + 1) });
  rail.position.set(0, 0.37, z); L.add(rail);
});
// oturma minderi (çizgili)
const NS = 8, bedL = 1.46;
for (let i = 0; i < NS; i++) {
  const seg = mesh(box(bedL / NS - 0.012, 0.08, 0.54), i % 2 ? cushA : cushB, { flat: true, name: 'minder_' + (i + 1) });
  seg.position.set(-bedL / 2 + (i + 0.5) * (bedL / NS), 0.43, 0); L.add(seg);
}
// sırtlık (eğik) + çizgili minder
const headX = -0.72, topY = 0.40, bL = 0.74, ang = 2.25;
const dx = Math.cos(ang), dy = Math.sin(ang), nx = dy, ny = -dx;
const bcx = headX + bL / 2 * dx, bcy = topY + bL / 2 * dy;
const back = mesh(box(bL, 0.06, 0.56), frameC, { name: 'sirt_cerceve' });
back.rotation.z = ang; back.position.set(bcx, bcy, 0); L.add(back);
const NB = 5;
for (let i = 0; i < NB; i++) {
  const t = -bL / 2 + (i + 0.5) * (bL / NB);
  const seg = mesh(box(bL / NB - 0.012, 0.08, 0.5), i % 2 ? cushB : cushA, { flat: true, name: 'sirt_minder_' + (i + 1) });
  seg.rotation.z = ang;
  seg.position.set(bcx + t * dx + nx * 0.07, bcy + t * dy + ny * 0.07, 0); L.add(seg);
}
// havlu
const towel = mesh(box(0.52, 0.05, 0.5), towelC, { flat: true, name: 'havlu' });
towel.position.set(0.32, 0.48, 0); L.add(towel);
const towelS = mesh(box(0.52, 0.06, 0.12), '#f2f2f2', { flat: true, name: 'havlu_serit' });
towelS.position.set(0.32, 0.485, 0); L.add(towelS);

// ---- renkli plaj topu ----
const ballCols = ['#e23b3b', '#f2f2f2', '#f0c020', '#2f8fc0', '#36a85a', '#f2f2f2'];
const BX = 1.9, BZ = 1.4, BR = 0.3;
for (let i = 0; i < 6; i++) {
  const wseg = mesh(new THREE.SphereGeometry(BR, 6, 10, i * Math.PI / 3, Math.PI / 3), ballCols[i],
    { flat: false, rough: 0.4, name: 'top_dilim_' + (i + 1) });
  wseg.position.set(BX, 0.3 + BR, BZ); modelGroup.add(wseg); // kum üstünde otursun
}
