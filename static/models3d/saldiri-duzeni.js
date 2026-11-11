// Saldırı düzeni — hücum mangası, +x yönüne ilerler. İlerleyen + diz çöken pozlar.
const uniform = '#566436', vest = '#3f4a28', helmet = '#4a5330', boot = '#241f18';
const skin = '#caa074', rifle = '#1c1c1f', pack = '#4a4e30';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 8);
const sph = (r) => new THREE.SphereGeometry(r, 10, 8);

function limb(g, p1, p2, r, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r * 1.05, dir.length(), 8), color, { rough: 0.85, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  g.add(m);
}
function part(g, geo, color, x, y, z, name, rz) {
  const m = mesh(geo, color, { flat: true, name: name });
  m.position.set(x, y, z); if (rz) m.rotation.z = rz;
  g.add(m); return m;
}

function trooper(px, pz, ry, kneel) {
  const g = new THREE.Group();
  if (kneel) {
    // ön bacak (ayak planlı) + arka diz yerde
    limb(g, [0, 0.6, 0.15], [0.3, 0.32, 0.16], 0.09, uniform, 'ust_bacak');
    limb(g, [0.3, 0.32, 0.16], [0.46, 0.07, 0.16], 0.075, uniform, 'alt_bacak');
    part(g, box(0.24, 0.12, 0.18), boot, 0.5, 0.06, 0.16, 'postal');
    limb(g, [0, 0.6, -0.15], [-0.04, 0.13, -0.16], 0.09, uniform, 'arka_ust_bacak');
    limb(g, [-0.04, 0.13, -0.16], [-0.3, 0.07, -0.16], 0.075, uniform, 'arka_alt_bacak');
    part(g, box(0.24, 0.12, 0.18), boot, -0.32, 0.06, -0.16, 'postal_arka');
    part(g, box(0.32, 0.2, 0.42), uniform, 0, 0.62, 0, 'kalca');
    part(g, box(0.32, 0.46, 0.42), uniform, 0.06, 0.92, 0, 'govde', -0.2);
    part(g, box(0.12, 0.4, 0.4), vest, 0.18, 0.92, 0, 'yelek', -0.2);
    part(g, box(0.16, 0.32, 0.34), pack, -0.16, 0.95, 0, 'canta', -0.2);
    limb(g, [0.14, 1.12, 0.18], [0.58, 1.05, 0.08], 0.06, uniform, 'kol');
    limb(g, [0.14, 1.12, -0.18], [0.58, 1.05, -0.04], 0.06, uniform, 'kol2');
    part(g, box(0.18, 0.18, 0.18), skin, 0.18, 1.24, 0, 'kafa');
    const h = part(g, sph(0.14), helmet, 0.16, 1.31, 0, 'kask'); h.scale.set(1, 0.8, 1);
    part(g, box(0.5, 0.08, 0.05), rifle, 0.7, 1.07, 0.02, 'tufek');
    const b = part(g, cyl(0.02, 0.02, 0.28, 6), rifle, 0.98, 1.07, 0.02, 'namlu'); b.rotation.z = Math.PI / 2;
  } else {
    // ilerleyen (adım + öne eğik gövde)
    limb(g, [0, 0.85, 0.12], [0.28, 0.5, 0.13], 0.09, uniform, 'on_ust_bacak');
    limb(g, [0.28, 0.5, 0.13], [0.42, 0.07, 0.13], 0.075, uniform, 'on_alt_bacak');
    part(g, box(0.24, 0.12, 0.18), boot, 0.47, 0.06, 0.13, 'postal');
    limb(g, [0, 0.85, -0.12], [-0.18, 0.5, -0.13], 0.09, uniform, 'arka_ust_bacak');
    limb(g, [-0.18, 0.5, -0.13], [-0.32, 0.07, -0.13], 0.075, uniform, 'arka_alt_bacak');
    part(g, box(0.24, 0.12, 0.18), boot, -0.3, 0.06, -0.13, 'postal_arka');
    part(g, box(0.32, 0.22, 0.42), uniform, 0, 0.88, 0, 'kalca');
    part(g, box(0.32, 0.5, 0.42), uniform, 0.13, 1.16, 0, 'govde', -0.35);
    part(g, box(0.12, 0.44, 0.4), vest, 0.27, 1.18, 0, 'yelek', -0.35);
    part(g, box(0.16, 0.36, 0.34), pack, -0.05, 1.12, 0, 'canta', -0.35);
    limb(g, [0.26, 1.42, 0.18], [0.7, 1.33, 0.08], 0.06, uniform, 'kol');
    limb(g, [0.26, 1.42, -0.18], [0.7, 1.33, -0.04], 0.06, uniform, 'kol2');
    part(g, box(0.18, 0.18, 0.18), skin, 0.38, 1.52, 0, 'kafa');
    const h = part(g, sph(0.14), helmet, 0.36, 1.59, 0, 'kask'); h.scale.set(1, 0.8, 1);
    part(g, box(0.52, 0.08, 0.05), rifle, 0.82, 1.36, 0.02, 'tufek');
    const b = part(g, cyl(0.02, 0.02, 0.28, 6), rifle, 1.1, 1.36, 0.02, 'namlu'); b.rotation.z = Math.PI / 2;
  }
  g.position.set(px, 0, pz);
  g.rotation.y = ry;
  modelGroup.add(g);
}

// ---- hücum düzeni (ok-ucu + serpme, +x yönü) ----
// [x, z, ry, kneel]
const FORM = [
  [2.7, 0, 0, false],          // uç (lider)
  [1.9, 0.95, -0.15, false],
  [1.9, -0.95, 0.15, false],
  [1.4, 0.35, 0, true],        // destek (diz çökmüş)
  [1.4, -0.35, 0, true],
  [1.05, 1.9, -0.2, false],
  [1.05, -1.9, 0.2, false],
  [0.5, 1.05, 0, false],
  [0.5, -1.05, 0, false],
  [0.2, 2.7, -0.25, false],
  [0.2, -2.7, 0.25, false],
  [-0.3, 0.0, 0, true],        // arka destek
  [-0.5, 1.6, 0, false],
  [-0.5, -1.6, 0, false]
];
FORM.forEach((f) => trooper(f[0], f[1], f[2], f[3]));
