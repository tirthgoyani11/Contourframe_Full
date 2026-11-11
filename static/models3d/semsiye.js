// Plaj şemsiyesi (tekli, dik). Yukarı +y.
const umbR = '#e23b3b', umbW = '#f2f2f2', pole = '#c7ccd0';
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 12);
const sph = (r) => new THREE.SphereGeometry(r, 14, 10);
function tri(a, b, c, color, name) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(
    [a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]], 3));
  g.computeVertexNormals();
  const m = mesh(g, color, { flat: true, name: name });
  m.material.side = THREE.DoubleSide;
  return m;
}

const H = 2.6, R = 1.6, drop = 0.52, N = 12;
const mast = mesh(cyl(0.04, 0.055, 2.6, 10), pole, { metal: 0.4, name: 'direk' });
mast.position.set(0, 1.3, 0); modelGroup.add(mast);
const hub = mesh(cyl(0.07, 0.07, 0.12, 10), pole, { metal: 0.4, name: 'gobek' });
hub.position.set(0, H - 0.06, 0); modelGroup.add(hub);
for (let i = 0; i < N; i++) {
  const a0 = i / N * Math.PI * 2, a1 = (i + 1) / N * Math.PI * 2;
  const r0 = [Math.cos(a0) * R, H - drop, Math.sin(a0) * R];
  const r1 = [Math.cos(a1) * R, H - drop, Math.sin(a1) * R];
  modelGroup.add(tri([0, H, 0], r0, r1, i % 2 ? umbR : umbW, 'dilim_' + (i + 1)));
  const mid = [Math.cos((a0 + a1) / 2) * R * 1.06, H - drop - 0.17, Math.sin((a0 + a1) / 2) * R * 1.06];
  modelGroup.add(tri(r0, r1, mid, i % 2 ? umbR : umbW, 'kenar_' + (i + 1)));
}
const finial = mesh(sph(0.06), pole, { metal: 0.4, name: 'tepe_topu' });
finial.position.set(0, H + 0.07, 0); modelGroup.add(finial);
