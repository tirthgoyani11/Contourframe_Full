// Şezlong (tekli). Ön +x, yukarı +y. Sırtlık baş ucu (-x).
const frameC = '#e6e8e6', cushA = '#1f9bb0', cushB = '#eef2f2', towelC = '#e6603a';
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

// ayaklar
[[-0.7, -0.27], [-0.7, 0.27], [0.7, -0.27], [0.7, 0.27]].forEach((p, i) => {
  const leg = mesh(box(0.06, 0.36, 0.06), frameC, { name: 'ayak_' + (i + 1) });
  leg.position.set(p[0], 0.18, p[1]); modelGroup.add(leg);
});
// yan kirişler
[-0.27, 0.27].forEach((z, i) => {
  const rail = mesh(box(1.5, 0.06, 0.06), frameC, { name: 'kiris_' + (i + 1) });
  rail.position.set(0, 0.37, z); modelGroup.add(rail);
});
// oturma minderi (çizgili)
const NS = 8, bedL = 1.46;
for (let i = 0; i < NS; i++) {
  const seg = mesh(box(bedL / NS - 0.012, 0.08, 0.54), i % 2 ? cushA : cushB, { flat: true, name: 'minder_' + (i + 1) });
  seg.position.set(-bedL / 2 + (i + 0.5) * (bedL / NS), 0.43, 0); modelGroup.add(seg);
}
// eğik sırtlık + çizgili minder
const headX = -0.72, topY = 0.40, bL = 0.74, ang = 2.25;
const dx = Math.cos(ang), dy = Math.sin(ang), nx = dy, ny = -dx;
const bcx = headX + bL / 2 * dx, bcy = topY + bL / 2 * dy;
const back = mesh(box(bL, 0.06, 0.56), frameC, { name: 'sirt_cerceve' });
back.rotation.z = ang; back.position.set(bcx, bcy, 0); modelGroup.add(back);
const NB = 5;
for (let i = 0; i < NB; i++) {
  const t = -bL / 2 + (i + 0.5) * (bL / NB);
  const seg = mesh(box(bL / NB - 0.012, 0.08, 0.5), i % 2 ? cushB : cushA, { flat: true, name: 'sirt_minder_' + (i + 1) });
  seg.rotation.z = ang;
  seg.position.set(bcx + t * dx + nx * 0.07, bcy + t * dy + ny * 0.07, 0); modelGroup.add(seg);
}
// havlu
const towel = mesh(box(0.52, 0.05, 0.5), towelC, { flat: true, name: 'havlu' });
towel.position.set(0.32, 0.48, 0); modelGroup.add(towel);
const towelS = mesh(box(0.52, 0.06, 0.12), '#f2f2f2', { flat: true, name: 'havlu_serit' });
towelS.position.set(0.32, 0.485, 0); modelGroup.add(towelS);
