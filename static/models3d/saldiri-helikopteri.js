// Saldırı helikopteri — burun +x, kuyruk -x, ana rotor üstte (xz düzlemi), kuyruk rotoru yanda.
const body = '#4b5340', panel = '#3f4636', canopyCol = '#20302c';
const rotorCol = '#26271f', blade = '#2b2b26', metal = '#8a8f86';
const gunCol = '#262626', tire = '#1b1b1e', sensor = '#15161a';
const yc = 1.1; // gövde ekseni yüksekliği

// süpürülmüş yüzey (dikey kuyruk) üretici
function surf(pts, thick) {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, steps: 1 });
  g.translate(0, 0, -thick / 2);
  return g;
}

// iki nokta arasında açılı çubuk (iniş takımı bacakları)
function strutBetween(p1, p2, r, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const m = mesh(new THREE.CylinderGeometry(r, r, len, 8), metal, { metal: 0.5, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}

// ---- gövde ----
const hull = mesh(new THREE.BoxGeometry(2.8, 1.0, 0.86), body, { flat: true, rough: 0.7, name: 'govde' });
hull.position.set(0.2, yc, 0); // x: -1.2 .. 1.6
modelGroup.add(hull);

// burun (alçak gunner kısmı)
const nose = mesh(new THREE.BoxGeometry(0.95, 0.7, 0.72), body, { flat: true, name: 'burun' });
nose.position.set(2.0, yc - 0.12, 0);
modelGroup.add(nose);

// burun sensör topları (TADS/PNVS)
const tads = mesh(new THREE.SphereGeometry(0.22, 16, 14), sensor, { metal: 0.3, rough: 0.4, name: 'sensor_alt' });
tads.position.set(2.4, yc - 0.28, 0);
modelGroup.add(tads);
const pnvs = mesh(new THREE.SphereGeometry(0.16, 16, 14), sensor, { metal: 0.3, name: 'sensor_ust' });
pnvs.position.set(2.35, yc + 0.05, 0);
modelGroup.add(pnvs);

// çene topu (cannon)
const gunTurret = mesh(new THREE.CylinderGeometry(0.18, 0.22, 0.28, 12), gunCol, { metal: 0.3, name: 'top_taret' });
gunTurret.position.set(1.75, yc - 0.56, 0);
modelGroup.add(gunTurret);
const cannon = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.95, 10), gunCol, { metal: 0.5, name: 'top_namlu' });
cannon.rotation.z = Math.PI / 2;
cannon.position.set(2.2, yc - 0.62, 0);
modelGroup.add(cannon);

// ---- tandem kanopi (kademeli) ----
const canF = mesh(new THREE.BoxGeometry(0.7, 0.45, 0.66), canopyCol, { flat: true, rough: 0.2, metal: 0.2, name: 'kanopi_on' });
canF.position.set(1.3, yc + 0.5, 0);
modelGroup.add(canF);
const canR = mesh(new THREE.BoxGeometry(0.72, 0.56, 0.66), canopyCol, { flat: true, rough: 0.2, metal: 0.2, name: 'kanopi_arka' });
canR.position.set(0.6, yc + 0.62, 0);
modelGroup.add(canR);

// ---- yan motorlar + egzoz ----
[-1, 1].forEach((sgn, i) => {
  const eng = mesh(new THREE.BoxGeometry(1.1, 0.5, 0.4), panel, { flat: true, name: 'motor_' + (i + 1) });
  eng.position.set(-0.2, yc + 0.32, sgn * 0.5);
  modelGroup.add(eng);
  const exh = mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.3, 10), gunCol, { metal: 0.4, name: 'egzoz_' + (i + 1) });
  exh.rotation.z = Math.PI / 2;
  exh.position.set(-0.85, yc + 0.32, sgn * 0.5);
  modelGroup.add(exh);
});

// ---- ana rotor ----
const mast = mesh(new THREE.CylinderGeometry(0.1, 0.12, 0.7, 12), metal, { metal: 0.5, name: 'rotor_mili' });
mast.position.set(0.1, yc + 0.85, 0);
modelGroup.add(mast);
const hub = mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.22, 12), rotorCol, { flat: true, name: 'rotor_gobek' });
hub.position.set(0.1, yc + 1.25, 0);
modelGroup.add(hub);
const rotorY = yc + 1.27;
const mainRotor = spin({ pivot: [0.1, rotorY, 0], axis: 'y', rpm: 120 });
for (let i = 0; i < 4; i++) {
  const a = i * Math.PI / 2;
  const bl = mesh(new THREE.BoxGeometry(3.0, 0.05, 0.3), blade, { flat: true, name: 'pal_' + (i + 1) });
  bl.position.set(Math.cos(a) * 1.5, 0, Math.sin(a) * 1.5); // pivot'a göre
  bl.rotation.y = -a;
  mainRotor.add(bl);
}

// ---- kuyruk kolu ----
const boom = mesh(new THREE.CylinderGeometry(0.16, 0.3, 2.6, 16), body, { flat: true, rough: 0.7, name: 'kuyruk_kolu' });
boom.rotation.z = Math.PI / 2; // ince uç -> arka (-x), kalın uç -> gövde
boom.position.set(-2.4, yc + 0.15, 0);
modelGroup.add(boom);

// dikey kuyruk (süpürülmüş)
const tfin = mesh(surf([[-3.0, 0], [-3.7, 0], [-3.85, 1.0], [-3.3, 1.0]], 0.1), panel, { flat: true, name: 'dikey_kuyruk' });
tfin.position.set(0, yc + 0.2, 0);
modelGroup.add(tfin);

// yatay stabilize
const stab = mesh(new THREE.BoxGeometry(0.6, 0.08, 1.7), panel, { flat: true, name: 'yatay_stabilize' });
stab.position.set(-3.05, yc + 0.2, 0);
modelGroup.add(stab);

// ---- kuyruk rotoru (yanda, z ekseninde) ----
const trHub = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.16, 10), rotorCol, { name: 'kuyruk_gobek' });
trHub.rotation.x = Math.PI / 2;
trHub.position.set(-3.6, yc + 0.75, 0.28);
modelGroup.add(trHub);
const tailRotor = spin({ pivot: [-3.6, yc + 0.75, 0.28], axis: 'z', rpm: 360 });
for (let i = 0; i < 4; i++) {
  const b = i * Math.PI / 2;
  const tb = mesh(new THREE.BoxGeometry(0.9, 0.16, 0.04), blade, { flat: true, name: 'kuyruk_pal_' + (i + 1) });
  tb.position.set(Math.cos(b) * 0.45, Math.sin(b) * 0.45, 0); // pivot'a göre (xy düzlemi)
  tb.rotation.z = b;
  tailRotor.add(tb);
}

// ---- silah kanatları + silahlar ----
[-1, 1].forEach((sgn, i) => {
  const wing = mesh(new THREE.BoxGeometry(0.7, 0.14, 1.3), panel, { flat: true, name: 'silah_kanadi_' + (i + 1) });
  wing.position.set(0.1, yc - 0.05, sgn * 0.95);
  modelGroup.add(wing);

  // roket kovanı (iç istasyon)
  const pod = mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.8, 16), gunCol, { metal: 0.3, name: 'roket_kovani_' + (i + 1) });
  pod.rotation.z = Math.PI / 2;
  pod.position.set(0.25, yc - 0.28, sgn * 0.7);
  modelGroup.add(pod);

  // füzeler (dış istasyon, 2 adet)
  for (let k = 0; k < 2; k++) {
    const dz = sgn * 1.25 + (k === 0 ? -0.13 : 0.13);
    const ms = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.7, 10), metal, { name: 'fuze_' + (i + 1) + '_' + (k + 1) });
    ms.rotation.z = Math.PI / 2;
    ms.position.set(0.2, yc - 0.28, dz);
    modelGroup.add(ms);
    const msc = mesh(new THREE.ConeGeometry(0.05, 0.18, 10), '#7a1f15', { name: 'fuze_burun_' + (i + 1) + '_' + (k + 1) });
    msc.rotation.z = -Math.PI / 2;
    msc.position.set(0.62, yc - 0.28, dz);
    modelGroup.add(msc);
  }
});

// ---- iniş takımı ----
[-1, 1].forEach((sgn, i) => {
  strutBetween([0.5, yc - 0.1, sgn * 0.2], [0.5, 0.2, sgn * 0.62], 0.05, 'takim_' + (i + 1));
  const wheel = mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.14, 16), tire, { name: 'teker_' + (i + 1) });
  wheel.rotation.x = Math.PI / 2;
  wheel.position.set(0.5, 0.2, sgn * 0.62);
  modelGroup.add(wheel);
});
// kuyruk tekeri
strutBetween([-3.3, yc + 0.1, 0], [-3.3, 0.13, 0], 0.04, 'kuyruk_takim');
const tw = mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.1, 14), tire, { name: 'kuyruk_teker' });
tw.rotation.x = Math.PI / 2;
tw.position.set(-3.3, 0.13, 0);
modelGroup.add(tw);
