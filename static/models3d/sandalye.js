// Ahşap sandalye
const woodA = '#b07b46', woodB = '#9c6a3a';

// Oturak
const seat = mesh(new THREE.BoxGeometry(1.0, 0.12, 1.0), woodA, { name: 'oturak' });
seat.position.y = 1.0;
modelGroup.add(seat);

// Bacaklar
const lx = 0.42;
[[-lx, -lx], [lx, -lx], [-lx, lx], [lx, lx]].forEach((p, i) => {
  const leg = mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 10), woodB, { name: 'bacak_' + (i + 1) });
  leg.position.set(p[0], 0.5, p[1]);
  modelGroup.add(leg);
});

// Arkalık dikmeleri
[-lx, lx].forEach((px, i) => {
  const post = mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 10), woodB, { name: 'dikme_' + (i + 1) });
  post.position.set(px, 1.5, -lx);
  modelGroup.add(post);
});

// Arkalık tahtaları
[1.35, 1.65, 1.95].forEach((yy, i) => {
  const slat = mesh(new THREE.BoxGeometry(1.0, 0.12, 0.08), woodA, { name: 'tahta_' + (i + 1) });
  slat.position.set(0, yy, -lx);
  modelGroup.add(slat);
});
