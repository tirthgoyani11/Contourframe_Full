// Atbaşı petrol pompası (pumpjack) — atbaşı +x'te. Beam salınır, krank döner.
const struct = '#46523a', weight = '#7c8084', baseC = '#6b6f6a', metal = '#9aa0a6';
const motor = '#3a3d40', valve = '#b23a2e', dirt = '#6b6048', dark = '#26282c';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 12);
function rod(g, p1, p2, r, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]), b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), 8), color, { metal: 0.4, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  g.add(m);
}

// zemin + saha
const ground = mesh(box(7, 0.1, 5), dirt, { flat: true, rough: 1, name: 'zemin' });
ground.position.set(0, 0.05, 0); modelGroup.add(ground);
const base = mesh(box(3.4, 0.3, 1.4), baseC, { flat: true, rough: 0.95, name: 'beton_kaide' });
base.position.set(0, 0.25, 0); modelGroup.add(base);

// Samson direği (A-frame, 4 ayak -> pivot)
const PIV = [0, 2.6, 0];
[[0.5, 0.45], [0.5, -0.45], [-0.5, 0.45], [-0.5, -0.45]].forEach((p) => {
  rod(modelGroup, [p[0], 0.4, p[1]], PIV, 0.07, struct, 'samson_ayak');
});
const saddle = mesh(box(0.45, 0.35, 0.6), struct, { flat: true, name: 'eyer' });
saddle.position.set(0, 2.55, 0); modelGroup.add(saddle);

// walking beam (salınır)
const beam = spin({ pivot: PIV, axis: 'z', nod: 0.2, rpm: 11 });
const bm = mesh(box(3.9, 0.22, 0.32), struct, { flat: true, name: 'denge_kolu' });
beam.add(bm);
// atbaşı (ön)
const head = mesh(box(0.5, 0.7, 0.34), struct, { flat: true, name: 'atbasi' });
head.position.set(1.95, -0.22, 0); beam.add(head);
const lip = mesh(box(0.3, 0.4, 0.3), struct, { flat: true, name: 'atbasi_alt' });
lip.rotation.z = 0.5; lip.position.set(2.15, -0.5, 0); beam.add(lip);
// köprü halatları (atbaşından sarkar)
[-0.12, 0.12].forEach((z) => { rod(beam, [2.05, -0.55, z], [2.05, -1.55, z], 0.02, dark, 'bridle'); });
// arka denge ağırlığı
const bw = mesh(box(0.5, 0.5, 0.42), weight, { flat: true, name: 'kol_agirlik' });
bw.position.set(-1.95, -0.05, 0); beam.add(bw);

// kuyubaşı (sabit): polisaj kolu + vana
const stuff = mesh(cyl(0.1, 0.12, 0.4, 10), dark, { name: 'stuffing_box' });
stuff.position.set(2.05, 0.45, 0); modelGroup.add(stuff);
const polish = mesh(cyl(0.04, 0.04, 1.2, 8), metal, { metal: 0.6, name: 'polisaj_kolu' });
polish.position.set(2.05, 1.1, 0); modelGroup.add(polish);
const tree = mesh(box(0.3, 0.3, 0.3), valve, { flat: true, name: 'kuyu_vanasi' });
tree.position.set(2.05, 0.3, 0); modelGroup.add(tree);

// redüktör + motor
const gear = mesh(box(0.8, 0.6, 1.0), motor, { flat: true, name: 'reduktor' });
gear.position.set(-1.5, 0.55, 0); modelGroup.add(gear);
const mot = mesh(box(0.5, 0.4, 0.4), motor, { flat: true, name: 'motor' });
mot.position.set(-1.5, 0.45, 0.7); modelGroup.add(mot);

// krank + karşı ağırlık (her iki yan, tam döner)
[0.55, -0.55].forEach((z, i) => {
  const crank = spin({ pivot: [-1.5, 0.85, z], axis: 'z', rpm: 11 });
  const web = mesh(box(1.1, 0.22, 0.12), weight, { flat: true, name: 'krank_kol_' + (i + 1) });
  beam.userData; crank.add(web);
  const cw = mesh(box(0.42, 0.55, 0.18), weight, { flat: true, name: 'karsi_agirlik_' + (i + 1) });
  cw.position.set(0.5, 0, 0); crank.add(cw);
  // pitman (krank pimi -> yukarı)
  const pit = mesh(cyl(0.04, 0.04, 1.2, 8), metal, { metal: 0.4, name: 'pitman_' + (i + 1) });
  pit.position.set(0.5, 0.6, 0); crank.add(pit);
});
