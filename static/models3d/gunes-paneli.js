// Tekli güneş paneli — eğimli PV modül, tek direk montaj.
const frameC = '#3a3d42', glassC = '#16314a', cellC = '#1d4a6e', metal = '#7e848c', ground = '#5a6147';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 12);

// zemin
const g0 = mesh(box(6, 0.1, 5), ground, { flat: true, rough: 1, name: 'zemin' });
g0.position.set(0, 0.05, 0);
modelGroup.add(g0);

// direk + tork borusu
const pylon = mesh(box(0.16, 1.0, 0.16), metal, { metal: 0.4, name: 'direk' });
pylon.position.set(0, 0.55, 0);
modelGroup.add(pylon);
const tube = mesh(cyl(0.06, 0.06, 2.6, 10), metal, { metal: 0.4, name: 'tork_borusu' });
tube.rotation.z = Math.PI / 2; tube.position.set(0, 1.05, 0);
modelGroup.add(tube);

// panel (eğimli grup)
const pg = new THREE.Group();
const frame = mesh(box(2.5, 0.08, 1.5), frameC, { flat: true, name: 'cerceve' });
frame.position.set(0, 0, 0); pg.add(frame);
const glass = mesh(box(2.42, 0.05, 1.42), glassC, { flat: true, rough: 0.2, metal: 0.3, name: 'cam' });
glass.position.set(0, 0.06, 0); pg.add(glass);
for (let cx = 0; cx < 6; cx++) {
  for (let cz = 0; cz < 4; cz++) {
    const cell = mesh(box(0.36, 0.04, 0.31), cellC, { flat: true, rough: 0.25, name: 'hucre' });
    cell.position.set(-1.01 + cx * 0.404, 0.1, -0.535 + cz * 0.355);
    pg.add(cell);
  }
}
pg.position.set(0, 1.05, 0);
pg.rotation.x = -0.5; // güneşe eğim
modelGroup.add(pg);
