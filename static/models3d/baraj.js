// Baraj (HES) — geniş baraj göl genişliğini tutar; iki yanda yüksek abutman, mansapta nehir.
// +x = rezervuar (yüksek göl), -x = mansap (alçak nehir). Dam/kanal z ∈ [-5.7, 5.7].
const earth = '#6e5232', grass = '#54963a', water = '#2f8fc0', concrete = '#e0e3e4';
const whitewater = '#eef4f7', treeG = '#2f7d3a', trunk = '#6a4a2a', powerhouse = '#cfd2cd';
const penstock = '#9aa0a6', road = '#3a3d40', rail = '#cfd2cd', metal = '#7e848c', wire = '#1a1c20', gate = '#39505e';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 12);
function rod(p1, p2, r, color, name, opts) {
  opts = opts || {};
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]), b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), opts.seg || 10), color, { metal: opts.metal || 0.3, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}
function tree(px, py, pz, s) {
  const tr = mesh(cyl(0.07 * s, 0.09 * s, 0.45 * s, 6), trunk, { name: 'agac_govde' });
  tr.position.set(px, py + 0.22 * s, pz); modelGroup.add(tr);
  [[0.5, 0.55], [0.38, 0.46], [0.26, 0.38]].forEach((c, i) => {
    const cone = mesh(new THREE.ConeGeometry(c[0] * s, c[1] * s, 7), treeG, { flat: true, name: 'agac_yaprak' });
    cone.position.set(px, py + 0.5 * s + i * 0.3 * s, pz); modelGroup.add(cone);
  });
}

const HIGH = 3.4, LOW = 1.0, DZ = 5.7; // plato/nehir seviyeleri, kanal yarı-genişliği

// ---- yan abutmanlar (yüksek yeşil vadi duvarları, gölü yanlardan tutar) ----
[6.35, -6.35].forEach((zc, i) => {
  const ab = mesh(box(18, HIGH, 1.3), earth, { flat: true, rough: 1, name: 'abutman_' + (i + 1) });
  ab.position.set(0, HIGH / 2, zc); modelGroup.add(ab);
  const abG = mesh(box(18, 0.14, 1.3), grass, { flat: true, rough: 1, name: 'abutman_cimen_' + (i + 1) });
  abG.position.set(0, HIGH + 0.06, zc); modelGroup.add(abG);
});

// ---- üst (rezervuar) blok + göl ----
const upEarth = mesh(box(9, HIGH, 11.4), earth, { flat: true, rough: 1, name: 'ust_toprak' });
upEarth.position.set(4.5, HIGH / 2, 0); modelGroup.add(upEarth);
const upGrass = mesh(box(9, 0.14, 11.4), grass, { flat: true, rough: 1, name: 'ust_cimen' });
upGrass.position.set(4.5, HIGH + 0.06, 0); modelGroup.add(upGrass);
const reservoir = mesh(box(8.6, 0.24, 11.0), water, { flat: true, rough: 0.2, metal: 0.15, name: 'rezervuar' });
reservoir.position.set(4.2, HIGH + 0.13, 0); reservoir.material.transparent = true; reservoir.material.opacity = 0.85;
modelGroup.add(reservoir);

// ---- alt (mansap) blok + nehir ----
const downEarth = mesh(box(9, LOW, 11.4), earth, { flat: true, rough: 1, name: 'alt_toprak' });
downEarth.position.set(-4.5, LOW / 2, 0); modelGroup.add(downEarth);
const downGrass = mesh(box(9, 0.14, 11.4), grass, { flat: true, rough: 1, name: 'alt_cimen' });
downGrass.position.set(-4.5, LOW + 0.06, 0); modelGroup.add(downGrass);
const river = mesh(box(9, 0.2, 8.4), water, { flat: true, rough: 0.2, metal: 0.15, name: 'mansap_nehri' });
river.position.set(-4.5, LOW + 0.06, 0); river.material.transparent = true; river.material.opacity = 0.85;
modelGroup.add(river);

// ---- mansap yamaçları: abutman tepesinden (yüksek) nehre (alçak) iner ----
function bank(side) {
  const s = new THREE.Shape();
  s.moveTo(side * 5.75, HIGH + 0.1); s.lineTo(side * 4.2, LOW); s.lineTo(side * 5.75, LOW); s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: 9, bevelEnabled: false, steps: 1 });
  const m = mesh(g, grass, { flat: true, rough: 1, name: 'yamac_' + (side > 0 ? 'sag' : 'sol') });
  m.rotation.y = -Math.PI / 2; m.position.set(0, 0, 0); modelGroup.add(m);
}
bank(1); bank(-1);

// ---- GENİŞ BARAJ (göl genişliğini tutar, z ±5.7) ----
const sh = new THREE.Shape();
sh.moveTo(0, 0.8); sh.lineTo(0, 3.85); sh.lineTo(-0.8, 3.85); sh.lineTo(-2.2, 0.8); sh.closePath();
const damGeo = new THREE.ExtrudeGeometry(sh, { depth: DZ * 2, bevelEnabled: false, steps: 1 });
damGeo.translate(0, 0, -DZ);
const dam = mesh(damGeo, concrete, { flat: false, rough: 0.85, name: 'baraj_govdesi' });
dam.position.set(0, 0, 0); modelGroup.add(dam);
// mansap yüzü payanda çizgileri (genişlik boyunca)
for (let k = 0; k < 13; k++) {
  const seam = mesh(box(0.05, 3.5, 0.05), '#c9ccc9', { name: 'payanda' });
  seam.rotation.z = -0.43; seam.position.set(-1.25, 2.3, -5.3 + k * 0.88);
  modelGroup.add(seam);
}

// ---- dolu savak: ayaklar + kapaklar + akan su + köpük (orta bölüm) ----
for (let i = 0; i < 6; i++) {
  const pier = mesh(box(0.8, 1.5, 0.28), concrete, { flat: true, name: 'savak_ayagi_' + (i + 1) });
  pier.position.set(-0.5, 3.4, -3.4 + i * 1.36); modelGroup.add(pier);
}
for (let i = 0; i < 5; i++) {
  const z = -2.72 + i * 1.36;
  const gt = mesh(box(0.14, 1.0, 1.05), gate, { flat: true, metal: 0.3, name: 'savak_kapagi_' + (i + 1) });
  gt.position.set(0.03, 3.32, z); modelGroup.add(gt);
  const chute = mesh(box(1.7, 0.1, 1.0), whitewater, { flat: true, name: 'savak_akis_' + (i + 1) });
  chute.rotation.z = 0.74; chute.position.set(-1.25, 2.0, z);
  chute.material.transparent = true; chute.material.opacity = 0.92; modelGroup.add(chute);
  const foam = mesh(box(0.9, 0.22, 1.05), whitewater, { flat: true, name: 'kopuk_' + (i + 1) });
  foam.position.set(-2.5, 1.15, z); foam.material.transparent = true; foam.material.opacity = 0.85; modelGroup.add(foam);
}

// ---- cebri borular + santral ----
[-3.2, -1.6, 0, 1.6, 3.2].forEach((z, i) => {
  rod([-0.8, 3.3, z], [-2.6, 1.4, z], 0.24, penstock, 'penstock_' + (i + 1), { metal: 0.4, seg: 12 });
});
const ph = mesh(box(1.6, 0.9, 8.0), powerhouse, { flat: true, rough: 0.85, name: 'santral_binasi' });
ph.position.set(-3.0, 1.45, 0); modelGroup.add(ph);
const phRoof = mesh(box(1.8, 0.16, 8.2), '#7c8084', { flat: true, name: 'santral_cati' });
phRoof.position.set(-3.0, 1.98, 0); modelGroup.add(phRoof);

// ---- kret yolu + korkuluk ----
const crest = mesh(box(0.8, 0.1, DZ * 2), road, { flat: true, name: 'kret_yolu' });
crest.position.set(-0.4, 3.9, 0); modelGroup.add(crest);
[0.0, -0.8].forEach((x, i) => { rod([x, 4.1, -DZ], [x, 4.1, DZ], 0.025, rail, 'korkuluk_' + (i + 1)); });

// ---- enerji nakil direği + hatlar ----
const PX = -7.0, PZ = 5.0;
const pmast = mesh(cyl(0.1, 0.24, 3.2, 4), metal, { flat: true, name: 'nakil_direk' });
pmast.rotation.y = Math.PI / 4; pmast.position.set(PX, LOW + 1.6, PZ); modelGroup.add(pmast);
[1.0, 1.6].forEach((y, i) => {
  const arm = mesh(box(1.8, 0.08, 0.08), metal, { name: 'capraz_kol_' + (i + 1) });
  arm.position.set(PX, LOW + 1.6 + y, PZ); modelGroup.add(arm);
});
[-0.85, 0.85].forEach((dx, i) => { rod([PX + dx, LOW + 3.1, PZ], [-2.8, 2.0, 2.5], 0.02, wire, 'hat_' + (i + 1)); });

// ---- ağaçlar (abutman tepeleri + plato kenarı) ----
[[7.0, 6.4], [3.5, 6.4], [0.0, 6.4], [-3.5, 6.4], [-7.0, 6.4],
 [7.0, -6.4], [3.5, -6.4], [0.0, -6.4], [-3.5, -6.4], [-7.0, -6.4]].forEach((p) => tree(p[0], HIGH + 0.13, p[1], 0.95));

// ---- mansap nehri akıntısı (hareketli dalga şeritleri, -x'e akar) ----
modelGroup.userData.flow = modelGroup.userData.flow || [];
for (let i = 0; i < 6; i++) {
  const rip = mesh(box(0.22, 0.04, 7.0), '#bfe2f0', { flat: true, name: 'akinti_' + (i + 1) });
  rip.position.set(-4.3 - i * 0.78, LOW + 0.18, 0);
  rip.material.transparent = true; rip.material.opacity = 0.5;
  modelGroup.add(rip);
  modelGroup.userData.flow.push({ obj: rip, axis: 'x', speed: -0.7, min: -9.0, max: -4.0 });
}
