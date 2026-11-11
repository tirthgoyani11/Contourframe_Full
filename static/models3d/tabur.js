// Asker taburu — formasyonda 25 asker + bayraktar. Hepsi +x'e bakar.
const uniform = '#566436', vest = '#3f4a28', helmet = '#4a5330', boot = '#241f18';
const skin = '#caa074', rifle = '#1c1c1f', pack = '#4a4e30', flagPole = '#6a5230', flagCloth = '#b23a2e';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 8);
const sph = (r) => new THREE.SphereGeometry(r, 10, 8);

// tek asker (yerel grup, +x'e bakar). withFlag=true -> tüfek yerine bayrak
function soldier(px, pz, idx, withFlag) {
  const g = new THREE.Group();
  [-1, 1].forEach((s) => {
    const leg = mesh(box(0.16, 0.7, 0.17), uniform, { flat: true, name: 'bacak' });
    leg.position.set(0, 0.35, s * 0.12); g.add(leg);
    const bt = mesh(box(0.22, 0.12, 0.2), boot, { flat: true, name: 'postal' });
    bt.position.set(0.05, 0.06, s * 0.12); g.add(bt);
  });
  const torso = mesh(box(0.34, 0.5, 0.42), uniform, { flat: true, name: 'govde' });
  torso.position.set(0, 0.95, 0); g.add(torso);
  const pv = mesh(box(0.12, 0.42, 0.4), vest, { flat: true, name: 'yelek' });
  pv.position.set(0.16, 0.95, 0); g.add(pv);
  const bp = mesh(box(0.18, 0.36, 0.34), pack, { flat: true, name: 'canta' });
  bp.position.set(-0.22, 0.97, 0); g.add(bp);
  [-1, 1].forEach((s) => {
    const arm = mesh(box(0.11, 0.42, 0.11), uniform, { flat: true, name: 'kol' });
    arm.position.set(0.16, 0.93, s * 0.26); arm.rotation.z = 0.45; g.add(arm);
  });
  const head = mesh(box(0.19, 0.19, 0.19), skin, { flat: true, name: 'kafa' });
  head.position.set(0.02, 1.3, 0); g.add(head);
  const helm = mesh(sph(0.15), helmet, { flat: true, name: 'kask' });
  helm.scale.set(1, 0.8, 1); helm.position.set(0, 1.4, 0); g.add(helm);

  if (withFlag) {
    const pole = mesh(cyl(0.03, 0.03, 1.7, 8), flagPole, { name: 'bayrak_diregi' });
    pole.position.set(0.32, 1.05, 0.1); g.add(pole);
    const flag = mesh(box(0.04, 0.5, 0.8), flagCloth, { flat: true, name: 'bayrak' });
    flag.position.set(0.32, 1.65, 0.52); g.add(flag);
  } else {
    const gun = mesh(box(0.5, 0.08, 0.05), rifle, { flat: true, name: 'tufek' });
    gun.position.set(0.4, 1.0, 0.13); g.add(gun);
    const barrel = mesh(cyl(0.02, 0.02, 0.3, 6), rifle, { metal: 0.4, name: 'namlu' });
    barrel.rotation.z = Math.PI / 2; barrel.position.set(0.72, 1.0, 0.13); g.add(barrel);
  }
  g.position.set(px, 0, pz);
  modelGroup.add(g);
}

// ---- formasyon: 5 sıra x 5 kol ----
const rows = 5, cols = 5, dx = 1.0, dz = 0.85;
let n = 0;
for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const px = (rows - 1) / 2 * dx - r * dx;          // ön sıralar +x
    const pz = (c - (cols - 1) / 2) * dz;
    soldier(px, pz, ++n, false);
  }
}
// ---- önde bayraktar ----
soldier((rows - 1) / 2 * dx + 1.2, 0, 0, true);
