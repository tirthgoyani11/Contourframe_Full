// Savaş uçağı — burun +x, yukarı +y, kanatlar ±z. İniş takımı üstünde durur.
const jet = '#828b96', panel = '#5f6772', canopyCol = '#2f4f5e', dark = '#3a3f47';
const nozzleCol = '#272a2e', tire = '#1b1b1e', metal = '#9aa0aa';
const yc = 1.05; // gövde ekseni yüksekliği (alçaltıldı -> takımlar kısaldı)

// yüzey üretici: shape XY -> ince kalınlıkta extrude (kanat/dümen profilleri)
function surf(pts, thick) {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, steps: 1 });
  g.translate(0, 0, -thick / 2);
  return g;
}

// ---- gövde ----
const body = mesh(new THREE.CylinderGeometry(0.42, 0.42, 4.2, 24), jet, { rough: 0.5, metal: 0.2, name: 'govde' });
body.rotation.z = Math.PI / 2;
body.position.set(-0.3, yc, 0); // x: -2.4 .. 1.8
modelGroup.add(body);

// burun konisi
const nose = mesh(new THREE.ConeGeometry(0.42, 1.4, 24), jet, { rough: 0.5, metal: 0.2, name: 'burun' });
nose.rotation.z = -Math.PI / 2;
nose.position.set(2.5, yc, 0); // taban 1.8 -> uç 3.2
modelGroup.add(nose);

// pitot
const pitot = mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.5, 8), metal, { metal: 0.6, name: 'pitot' });
pitot.rotation.z = Math.PI / 2;
pitot.position.set(3.4, yc, 0);
modelGroup.add(pitot);

// egzoz nozülü
const noz = mesh(new THREE.CylinderGeometry(0.3, 0.4, 0.6, 20), nozzleCol, { metal: 0.6, rough: 0.35, name: 'nozul' });
noz.rotation.z = Math.PI / 2;
noz.position.set(-2.55, yc, 0);
modelGroup.add(noz);

// kanopi (uzatılmış küre)
const canopy = mesh(new THREE.SphereGeometry(0.32, 18, 14), canopyCol, { rough: 0.2, metal: 0.3, name: 'kanopi' });
canopy.scale.set(2.0, 0.7, 0.9);
canopy.position.set(1.2, yc + 0.34, 0);
modelGroup.add(canopy);

// hava alıkları (intake)
[-1, 1].forEach((sgn, i) => {
  const intake = mesh(new THREE.BoxGeometry(1.2, 0.42, 0.34), dark, { flat: true, name: 'intake_' + (i + 1) });
  intake.position.set(0.55, yc - 0.22, sgn * 0.5);
  modelGroup.add(intake);
});

// ---- ana kanatlar (süpürülmüş) ----
const wingPts = [[1.0, 0], [-1.2, 0], [-1.1, 2.2], [-0.6, 2.2]];
const wR = mesh(surf(wingPts, 0.12), jet, { flat: true, name: 'kanat_sag' });
wR.rotation.x = Math.PI / 2; wR.position.set(0, yc - 0.05, 0);
modelGroup.add(wR);
const wL = mesh(surf(wingPts, 0.12), jet, { flat: true, name: 'kanat_sol' });
wL.rotation.x = -Math.PI / 2; wL.position.set(0, yc - 0.05, 0);
modelGroup.add(wL);

// ---- yatay dümenler ----
const stabPts = [[-1.5, 0], [-2.4, 0], [-2.45, 1.0], [-2.0, 1.0]];
const sR = mesh(surf(stabPts, 0.09), panel, { flat: true, name: 'yatay_dumen_sag' });
sR.rotation.x = Math.PI / 2; sR.position.set(0, yc, 0);
modelGroup.add(sR);
const sL = mesh(surf(stabPts, 0.09), panel, { flat: true, name: 'yatay_dumen_sol' });
sL.rotation.x = -Math.PI / 2; sL.position.set(0, yc, 0);
modelGroup.add(sL);

// ---- dikey dümen ----
const finPts = [[-1.5, 0], [-2.35, 0], [-2.5, 1.1], [-1.95, 1.1]];
const fin = mesh(surf(finPts, 0.1), panel, { flat: true, name: 'dikey_dumen' });
fin.position.set(0, yc + 0.28, 0);
modelGroup.add(fin);

// ---- kanat ucu füzeleri ----
[-1, 1].forEach((sgn, i) => {
  const m = mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.0, 12), '#cfd4da', { name: 'ucfuze_' + (i + 1) });
  m.rotation.z = Math.PI / 2;
  m.position.set(-0.3, yc - 0.05, sgn * 2.15);
  modelGroup.add(m);
  const mc = mesh(new THREE.ConeGeometry(0.06, 0.25, 12), '#c0392b', { name: 'ucfuze_burun_' + (i + 1) });
  mc.rotation.z = -Math.PI / 2;
  mc.position.set(0.32, yc - 0.05, sgn * 2.15);
  modelGroup.add(mc);
});

// ---- iniş takımı ----
// strut üstü gövde merkezine kadar uzanır (gövde içinde gizlenir) -> boşluk kalmaz.
function gear(x, z, tag) {
  const wheelY = 0.17;
  const len = yc - wheelY;
  const strut = mesh(new THREE.CylinderGeometry(0.04, 0.04, len, 8), metal, { metal: 0.5, name: 'takim_' + tag });
  strut.position.set(x, (wheelY + yc) / 2, z);
  modelGroup.add(strut);
  const wheel = mesh(new THREE.CylinderGeometry(0.17, 0.17, 0.12, 16), tire, { name: 'teker_' + tag });
  wheel.rotation.x = Math.PI / 2;
  wheel.position.set(x, wheelY, z);
  modelGroup.add(wheel);
}
gear(1.3, 0, 'burun');     // burun takımı (merkez hat)
gear(-0.2, 0.36, 'sag');   // ana takım sağ (gövde altına alındı)
gear(-0.2, -0.36, 'sol');  // ana takım sol
