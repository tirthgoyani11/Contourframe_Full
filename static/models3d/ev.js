// Küçük ev
const body = mesh(new THREE.BoxGeometry(2.4, 1.6, 2.0), '#d9c3a3', { name: 'govde' });
body.position.y = 0.8;
modelGroup.add(body);

// Piramit çatı (4 kenarlı koni)
const roof = mesh(new THREE.ConeGeometry(1.9, 1.1, 4), '#8a3b2e', { flat: true, name: 'cati' });
roof.position.y = 1.6 + 0.55;
roof.rotation.y = Math.PI / 4;
modelGroup.add(roof);

// Kapı
const door = mesh(new THREE.BoxGeometry(0.5, 0.9, 0.08), '#5a3a22', { name: 'kapi' });
door.position.set(0, 0.45, 1.02);
modelGroup.add(door);

// Pencereler
[[-0.7, 1.0], [0.7, 1.0]].forEach((p, i) => {
  const w = mesh(new THREE.BoxGeometry(0.45, 0.45, 0.06), '#7fc7d6', { metal: 0.1, rough: 0.4, name: 'pencere_' + (i + 1) });
  w.position.set(p[0], p[1], 1.02);
  modelGroup.add(w);
});

// Baca
const chimney = mesh(new THREE.BoxGeometry(0.3, 0.7, 0.3), '#7a4a28', { name: 'baca' });
chimney.position.set(0.6, 2.2, 0.2);
modelGroup.add(chimney);
