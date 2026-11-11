// Çam ağacı
const trunk = mesh(new THREE.CylinderGeometry(0.22, 0.3, 1.0, 8), '#7a4a28', { name: 'govde' });
trunk.position.y = 0.5;
modelGroup.add(trunk);

const greens = ['#3f7d4a', '#458a51', '#4c9659'];
const sizes = [[1.35, 1.3], [1.05, 1.15], [0.72, 1.0]];
let y = 1.05;
sizes.forEach((s, i) => {
  const cone = mesh(new THREE.ConeGeometry(s[0], s[1], 9), greens[i], { flat: true, name: 'yaprak_' + (i + 1) });
  cone.position.y = y + s[1] / 2 - 0.15;
  modelGroup.add(cone);
  y += s[1] * 0.62;
});
