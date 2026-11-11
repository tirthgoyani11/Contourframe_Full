// İnsansız deniz aracı (USV) — pruva +x. Küçük, kabinsiz, stealth.
const hullC = '#454c54', hullDk = '#23272d', sup = '#373d44';
const sensor = '#15171a', missile = '#8a8f96', gun = '#2a2d31', radarW = '#e6e8ea', dome = '#5a6068', lensC = '#2a6a7a';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 14);
const sph = (r) => new THREE.SphereGeometry(r, 14, 12);

// ---- gövde (sleek planing) ----
function hullPiece(depth, yBase, color, name) {
  const pts = [[2.3, 0], [1.4, 0.5], [-2.0, 0.5], [-2.0, -0.5], [1.4, -0.5]];
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: depth, bevelEnabled: false, steps: 1 });
  const m = mesh(g, color, { flat: true, rough: 0.7, name: name });
  m.rotation.x = -Math.PI / 2; m.position.set(0, yBase, 0);
  modelGroup.add(m);
}
hullPiece(0.24, 0.0, hullDk, 'tekne_alt');
hullPiece(0.32, 0.24, hullC, 'tekne_ust'); // güverte ~0.56
// pruva çıkıntısı (yukarı kıvrık)
const bowRise = mesh(box(0.8, 0.12, 0.9), hullC, { flat: true, name: 'pruva' });
bowRise.rotation.z = 0.2;
bowRise.position.set(1.7, 0.62, 0);
modelGroup.add(bowRise);

// ---- alçak stealth üst yapı (kabinsiz) ----
const sup1 = mesh(box(1.5, 0.42, 0.72), sup, { flat: true, rough: 0.65, name: 'ust_yapi' });
sup1.position.set(0.0, 0.77, 0);
modelGroup.add(sup1);
const sup2 = mesh(box(0.8, 0.3, 0.5), sup, { flat: true, name: 'ust_yapi_2' });
sup2.position.set(-0.1, 1.05, 0);
modelGroup.add(sup2);
// SATCOM kubbesi
const satcom = mesh(sph(0.16), dome, { rough: 0.5, name: 'satcom' });
satcom.scale.set(1, 0.8, 1);
satcom.position.set(0.45, 0.99, 0);
modelGroup.add(satcom);

// ---- sensör direği: EO/IR topu + dönen radar ----
const mast = mesh(cyl(0.05, 0.06, 0.5, 8), sup, { metal: 0.3, name: 'direk' });
mast.position.set(-0.1, 1.4, 0);
modelGroup.add(mast);
const eo = mesh(sph(0.13), sensor, { metal: 0.3, name: 'sensor_topu' });
eo.position.set(-0.1, 1.18, 0.0);
modelGroup.add(eo);
const eoL = mesh(cyl(0.05, 0.05, 0.05, 10), lensC, { metal: 0.4, name: 'sensor_lens' });
eoL.rotation.z = Math.PI / 2;
eoL.position.set(0.05, 1.18, 0);
modelGroup.add(eoL);
const radar = spin({ pivot: [-0.1, 1.7, 0], axis: 'y', rpm: 22 });
const dish = mesh(box(0.7, 0.12, 0.1), radarW, { flat: true, name: 'radar_anten' });
radar.add(dish);

// ---- öne uzaktan komutalı silah (RWS) ----
const rwsBase = mesh(cyl(0.16, 0.2, 0.15, 12), sup, { flat: true, name: 'rws_taban' });
rwsBase.position.set(1.25, 0.65, 0);
modelGroup.add(rwsBase);
const rwsBody = mesh(box(0.3, 0.2, 0.28), gun, { flat: true, name: 'rws_govde' });
rwsBody.position.set(1.2, 0.82, 0);
modelGroup.add(rwsBody);
const rwsGun = mesh(cyl(0.03, 0.03, 0.6, 8), gun, { metal: 0.4, name: 'makineli_namlu' });
rwsGun.rotation.z = Math.PI / 2;
rwsGun.position.set(1.6, 0.82, 0);
modelGroup.add(rwsGun);

// ---- kıç gemisavar füze kanisterleri (açılı) ----
[-1, 1].forEach((s, i) => {
  const rack = mesh(box(0.7, 0.32, 0.3), missile, { flat: true, name: 'fuze_kanister_' + (i + 1) });
  rack.rotation.z = 0.4;
  rack.position.set(-1.3, 0.8, s * 0.22);
  modelGroup.add(rack);
});

// ---- antenler ----
const ant1 = mesh(cyl(0.012, 0.012, 0.45, 6), sensor, { name: 'anten_1' });
ant1.position.set(-0.5, 1.25, 0.18);
modelGroup.add(ant1);
const ant2 = mesh(cyl(0.012, 0.012, 0.35, 6), sensor, { name: 'anten_2' });
ant2.position.set(-0.5, 1.2, -0.18);
modelGroup.add(ant2);
