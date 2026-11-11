// Denizaltı — pruva +x, kıç -x, yelken üstte. Bronz pervane döner.
const hull = '#1d1f23', hullDk = '#16181b', sail = '#1d1f23', plane = '#191b1e';
const bronze = '#8a7338', mast = '#0f1012', metal = '#6a6f73';
const YC = 0.7; // gövde yarıçapı -> tabanda durur

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 18);
const sph = (r) => new THREE.SphereGeometry(r, 20, 14);

// ---- gövde ----
const body = mesh(cyl(0.7, 0.7, 6.0, 24), hull, { flat: false, rough: 0.55, metal: 0.2, name: 'govde' });
body.rotation.z = Math.PI / 2;
body.position.set(0, YC, 0); // x: -3 .. 3
modelGroup.add(body);
// pruva (yuvarlak)
const bow = mesh(sph(0.7), hull, { flat: false, rough: 0.55, metal: 0.2, name: 'pruva' });
bow.scale.set(1.7, 1, 1);
bow.position.set(3.4, YC, 0);
modelGroup.add(bow);
// kıç konisi (daralan)
const stern = mesh(cyl(0.16, 0.7, 1.5, 20), hull, { flat: false, rough: 0.55, name: 'kic_konisi' });
stern.rotation.z = Math.PI / 2; // ince uç -x, taban +x (gövde)
stern.position.set(-3.7, YC, 0);
modelGroup.add(stern);

// ---- yelken (conning tower) ----
const sailBody = mesh(box(1.1, 1.3, 0.5), sail, { flat: true, rough: 0.55, name: 'yelken' });
sailBody.position.set(1.0, YC + 0.95, 0); // ~1.0 .. 2.3
modelGroup.add(sailBody);
const sailNose = mesh(cyl(0.25, 0.25, 1.3, 14), sail, { flat: false, name: 'yelken_on' });
sailNose.position.set(1.55, YC + 0.95, 0);
modelGroup.add(sailNose);
// dalış kanatçıkları (yelken planları)
const fairwater = mesh(box(0.45, 0.07, 1.5), plane, { flat: true, name: 'dalis_kanatciklari' });
fairwater.position.set(1.0, YC + 0.85, 0);
modelGroup.add(fairwater);
// periskop / direkler
[[0.85, 0.7, '#0f1012'], [1.1, 0.55, mast], [0.7, 0.45, metal]].forEach((m, i) => {
  const mst = mesh(cyl(0.03, 0.03, m[1], 8), m[2], { metal: 0.4, name: 'direk_' + (i + 1) });
  mst.position.set(m[0], YC + 1.6 + m[1] / 2 - 0.05, 0.05 * i);
  modelGroup.add(mst);
});

// ---- kıç dümenleri (artı form) ----
const rudderTop = mesh(box(0.8, 0.9, 0.07), plane, { flat: true, name: 'dümen_üst' });
rudderTop.position.set(-3.1, YC + 0.55, 0);
modelGroup.add(rudderTop);
const sternPlanes = mesh(box(0.8, 0.07, 2.0), plane, { flat: true, name: 'yatay_dümen' });
sternPlanes.position.set(-3.1, YC, 0);
modelGroup.add(sternPlanes);

// ---- pervane (bronz, x ekseninde döner) ----
const shaft = mesh(cyl(0.06, 0.06, 0.4, 8), metal, { metal: 0.5, name: 'saft' });
shaft.rotation.z = Math.PI / 2;
shaft.position.set(-4.35, YC, 0);
modelGroup.add(shaft);
const prop = spin({ pivot: [-4.55, YC, 0], axis: 'x', rpm: 70 });
const hubCone = mesh(cyl(0.0, 0.14, 0.3, 12), bronze, { flat: false, name: 'pervane_gobek' });
hubCone.rotation.z = Math.PI / 2; // sivri uç -x (kıç)
hubCone.position.set(-0.15, 0, 0);
prop.add(hubCone);
for (let i = 0; i < 5; i++) {
  const b = i * 2 * Math.PI / 5;
  const blade = mesh(box(0.06, 0.45, 0.18), bronze, { flat: true, name: 'pervane_' + (i + 1) });
  blade.position.set(0, Math.cos(b) * 0.28, Math.sin(b) * 0.28);
  blade.rotation.x = b;
  blade.rotation.z = 0.3; // hatve (pitch)
  prop.add(blade);
}
