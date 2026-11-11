// Rüzgâr çiftliği — çok sayıda dönen türbin.
const towerC = '#e4e6e3', nacelleC = '#cfd2cd', bladeC = '#eef0ee', hubC = '#c0c3be';
const baseC = '#7e8279', grass = '#46523a', hill = '#3e4a32', road = '#6b6048';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 12);
const sph = (r) => new THREE.SphereGeometry(r, 16, 10);

// ---- arazi ----
const ground = mesh(box(18, 0.1, 14), grass, { flat: true, rough: 1, name: 'arazi' });
ground.position.set(0, 0.05, 0);
modelGroup.add(ground);
[[-4, -3, 3.5], [3, 2, 4], [6, -4, 2.5]].forEach((h, i) => {
  const hl = mesh(sph(h[2]), hill, { flat: true, rough: 1, name: 'tepe_' + (i + 1) });
  hl.scale.set(1, 0.18, 1); hl.position.set(h[0], 0.1, h[1]);
  modelGroup.add(hl);
});

// ---- servis yolu (kıvrımlı) ----
[[-6, -2, 0.5], [-2.5, 0, 0.3], [1, 1, -0.4], [4.5, 0.5, 0.2]].forEach((s, i) => {
  const seg = mesh(box(4.5, 0.04, 0.7), road, { name: 'yol_' + (i + 1) });
  seg.rotation.y = s[2]; seg.position.set(s[0], 0.12, s[1]);
  modelGroup.add(seg);
});

// ---- ortak kanat geometrisi ----
const bs = new THREE.Shape();
bs.moveTo(-0.16, 0); bs.lineTo(0.16, 0); bs.lineTo(0.04, 2.3); bs.lineTo(-0.04, 2.3); bs.closePath();
const bladeGeo = new THREE.ExtrudeGeometry(bs, { depth: 0.06, bevelEnabled: false, steps: 1 });
bladeGeo.translate(0, 0, -0.03);
bladeGeo.rotateY(Math.PI / 2);

// ---- türbin ----
function turbine(px, pz, h, rpm, phase) {
  const found = mesh(cyl(0.4, 0.5, 0.25, 12), baseC, { flat: true, name: 'temel' });
  found.position.set(px, 0.22, pz); modelGroup.add(found);
  const tower = mesh(cyl(0.12, 0.3, h, 12), towerC, { flat: false, rough: 0.6, name: 'kule' });
  tower.position.set(px, h / 2 + 0.1, pz); modelGroup.add(tower);
  const nac = mesh(box(0.95, 0.42, 0.42), nacelleC, { flat: true, name: 'nacelle' });
  nac.position.set(px - 0.12, h + 0.15, pz); modelGroup.add(nac);
  const HUBX = px + 0.5, HY = h + 0.15;
  const rotor = spin({ pivot: [HUBX, HY, pz], axis: 'x', rpm: rpm });
  const hub = mesh(cyl(0.0, 0.2, 0.4, 14), hubC, { flat: false, name: 'gobek' });
  hub.rotation.z = -Math.PI / 2; hub.position.set(0.15, 0, 0); rotor.add(hub);
  for (let i = 0; i < 3; i++) {
    const bl = mesh(bladeGeo, bladeC, { flat: false, rough: 0.5, name: 'kanat' });
    bl.rotation.x = i * 2 * Math.PI / 3 + phase;
    rotor.add(bl);
  }
}

// [px, pz, h, rpm, phase] — farklı boy/hız/faz
const FARM = [
  [-7.0, -4.0, 5.5, 22, 0.0], [-2.6, -5.0, 5.0, 26, 1.3], [2.4, -3.8, 6.0, 20, 2.1], [7.0, -4.8, 5.2, 27, 0.7],
  [-6.2, 1.6, 5.0, 24, 1.9], [-1.2, 2.6, 5.8, 21, 0.4], [4.0, 1.2, 5.3, 28, 2.6], [7.6, 3.0, 4.8, 23, 1.1]
];
FARM.forEach((f) => turbine(f[0], f[1], f[2], f[3], f[4]));
