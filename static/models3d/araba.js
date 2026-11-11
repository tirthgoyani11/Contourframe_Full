// Kırmızı araba
// Alt gövde
const body = mesh(new THREE.BoxGeometry(3.4, 0.7, 1.6), '#c0392b', { rough: 0.55, metal: 0.15, name: 'govde' });
body.position.y = 0.75;
modelGroup.add(body);

// Kabin
const cabin = mesh(new THREE.BoxGeometry(1.7, 0.7, 1.4), '#e74c3c', { rough: 0.55, metal: 0.15, name: 'kabin' });
cabin.position.set(-0.1, 1.35, 0);
modelGroup.add(cabin);

// Camlar
const wsFront = mesh(new THREE.BoxGeometry(0.06, 0.5, 1.2), '#9fd8e6', { rough: 0.3, metal: 0.2, name: 'on_cam' });
wsFront.position.set(0.76, 1.35, 0);
modelGroup.add(wsFront);

// Tekerlekler
const wx = 1.1, wz = 0.85;
[[-wx, -wz], [wx, -wz], [-wx, wz], [wx, wz]].forEach((p, i) => {
  const wheel = mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.3, 18), '#1b1b1b', { name: 'teker_' + (i + 1) });
  wheel.rotation.x = Math.PI / 2;
  wheel.position.set(p[0], 0.45, p[1]);
  modelGroup.add(wheel);

  const hub = mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.32, 12), '#c9ccd2', { metal: 0.6, rough: 0.3, name: 'jant_' + (i + 1) });
  hub.rotation.x = Math.PI / 2;
  hub.position.set(p[0], 0.45, p[1]);
  modelGroup.add(hub);
});

// Farlar
[-wz, wz].forEach((pz, i) => {
  const f = mesh(new THREE.SphereGeometry(0.13, 12, 12), '#ffe08a', { rough: 0.3, name: 'far_' + (i + 1) });
  f.position.set(1.72, 0.8, pz);
  modelGroup.add(f);
});
