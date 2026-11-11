// Hava üssü dioraması — pist x boyunca.
const grass = '#3f5235', asphalt = '#393d42', concrete = '#6b6f73', white = '#dfe3e6';
const yellow = '#d2a93a', tower = '#8a8f96', glass = '#1a2630', jet = '#c3c5c0', dark = '#23262b';
const sockA = '#d8543a', sockB = '#dfe3e6', lightR = '#d83a3a', lightW = '#fff4d6', metal = '#7e848c';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 12);

// ---- zemin (çimen) ----
const base = mesh(box(18, 0.12, 13), grass, { flat: true, rough: 1, name: 'zemin' });
base.position.set(0, 0.06, 0);
modelGroup.add(base);

// ---- pist ----
const RWZ = -2.6;
const runway = mesh(box(15, 0.14, 2.4), asphalt, { flat: true, rough: 0.95, name: 'pist' });
runway.position.set(0, 0.13, RWZ);
modelGroup.add(runway);
// orta çizgi (kesik)
for (let i = 0; i < 11; i++) {
  const d = mesh(box(0.7, 0.02, 0.13), white, { name: 'orta_cizgi' });
  d.position.set(-6.5 + i * 1.3, 0.21, RWZ);
  modelGroup.add(d);
}
// kenar çizgileri
[-1.05, 1.05].forEach((dz, i) => {
  const e = mesh(box(14.4, 0.02, 0.08), white, { name: 'kenar_cizgi_' + (i + 1) });
  e.position.set(0, 0.21, RWZ + dz);
  modelGroup.add(e);
});
// eşik piyano tuşları (iki uç)
[-7.0, 7.0].forEach((x, e) => {
  for (let k = 0; k < 5; k++) {
    const key = mesh(box(0.7, 0.02, 0.18), white, { name: 'esik_' + (e + 1) + '_' + (k + 1) });
    key.position.set(x + (e === 0 ? 0.5 : -0.5), 0.21, RWZ - 0.8 + k * 0.4);
    modelGroup.add(key);
  }
});
// pist kenar ışıkları
for (let i = 0; i < 8; i++) {
  [-1.25, 1.25].forEach((dz) => {
    const lp = mesh(box(0.08, 0.1, 0.08), i < 1 ? lightR : lightW, { rough: 0.4, name: 'pist_isik' });
    lp.position.set(-6.3 + i * 1.8, 0.22, RWZ + dz);
    modelGroup.add(lp);
  });
}

// ---- taksi yolu + apron ----
// taksi yolu pistin kenarında biter (z=-1.4), içine girmez
const taxi = mesh(box(2.0, 0.14, 2.85), concrete, { flat: true, rough: 0.95, name: 'taksi_yolu' });
taxi.position.set(4.5, 0.13, 0.03);
modelGroup.add(taxi);
const taxiLine = mesh(box(0.13, 0.02, 2.6), yellow, { name: 'taksi_cizgi' });
taxiLine.position.set(4.5, 0.21, 0.03);
modelGroup.add(taxiLine);
const apron = mesh(box(6.5, 0.14, 5.5), concrete, { flat: true, rough: 0.95, name: 'apron' });
apron.position.set(4.0, 0.13, 4.2);
modelGroup.add(apron);
[[3.0, 3.8], [5.4, 4.6]].forEach((p, i) => {
  const spot = mesh(new THREE.TorusGeometry(0.85, 0.05, 8, 24), yellow, { name: 'park_dairesi_' + (i + 1) });
  spot.rotation.x = Math.PI / 2;
  spot.position.set(p[0], 0.22, p[1]);
  modelGroup.add(spot);
});

// ---- kontrol kulesi ----
const shaft = mesh(box(1.0, 4.6, 1.0), tower, { flat: true, rough: 0.7, name: 'kule_govde' });
shaft.position.set(7.6, 2.4, 5.6);
modelGroup.add(shaft);
const cab = mesh(box(1.9, 1.0, 1.9), tower, { flat: true, name: 'kule_kabin' });
cab.position.set(7.6, 5.1, 5.6);
modelGroup.add(cab);
const cabGlass = mesh(box(1.95, 0.55, 1.95), glass, { rough: 0.15, metal: 0.4, name: 'kule_cam' });
cabGlass.position.set(7.6, 5.15, 5.6);
modelGroup.add(cabGlass);
const cabRoof = mesh(box(2.2, 0.15, 2.2), dark, { flat: true, name: 'kule_cati' });
cabRoof.position.set(7.6, 5.7, 5.6);
modelGroup.add(cabRoof);
const ant = mesh(cyl(0.03, 0.03, 1.2, 6), metal, { name: 'kule_anten' });
ant.position.set(7.6, 6.4, 5.6);
modelGroup.add(ant);

// ---- rüzgâr tulumu ----
const sockPole = mesh(cyl(0.05, 0.05, 1.8, 8), metal, { name: 'tulum_diregi' });
sockPole.position.set(-6.5, 0.9, 1.0);
modelGroup.add(sockPole);
[[0.0, 0.16, sockA], [0.5, 0.13, sockB], [0.95, 0.1, sockA]].forEach((s, i) => {
  const seg = mesh(cyl(s[1], s[1] - 0.02, 0.45, 12), s[2], { name: 'tulum_' + (i + 1) });
  seg.rotation.z = Math.PI / 2;
  seg.position.set(-6.5 + 0.25 + s[0], 1.75, 1.0);
  modelGroup.add(seg);
});

// ---- park etmiş mini jetler ----
function miniJet(px, pz, ry, idx, py, pitch) {
  py = py == null ? 0.56 : py; pitch = pitch || 0;
  const g = new THREE.Group();
  const fus = mesh(box(1.6, 0.22, 0.28), jet, { flat: true, name: 'jet' + idx + '_govde' });
  g.add(fus);
  const nose = mesh(new THREE.ConeGeometry(0.13, 0.5, 8), jet, { flat: true, name: 'jet' + idx + '_burun' });
  nose.rotation.z = -Math.PI / 2; nose.position.set(1.0, 0, 0); g.add(nose);
  const wing = mesh(box(0.8, 0.06, 1.9), jet, { flat: true, name: 'jet' + idx + '_kanat' });
  wing.position.set(-0.1, -0.02, 0); g.add(wing);
  const tailp = mesh(box(0.45, 0.05, 0.9), jet, { flat: true, name: 'jet' + idx + '_kuyruk' });
  tailp.position.set(-0.65, 0, 0); g.add(tailp);
  const vt = mesh(box(0.4, 0.4, 0.05), jet, { flat: true, name: 'jet' + idx + '_dikey' });
  vt.position.set(-0.6, 0.25, 0); g.add(vt);
  const can = mesh(box(0.3, 0.13, 0.18), glass, { flat: true, name: 'jet' + idx + '_kanopi' });
  can.position.set(0.35, 0.15, 0); g.add(can);
  // iniş takımı (kısa)
  [[0.7, 0], [-0.3, 0.4], [-0.3, -0.4]].forEach((p) => {
    const w = mesh(cyl(0.1, 0.1, 0.08, 10), dark, { name: 'jet' + idx + '_teker' });
    w.rotation.x = Math.PI / 2; w.position.set(p[0], -0.28, p[1]); g.add(w);
  });
  g.position.set(px, py, pz);
  g.rotation.y = ry; g.rotation.z = pitch; g.scale.set(0.95, 0.95, 0.95);
  modelGroup.add(g);
}
miniJet(3.0, 3.8, 0.5, 1);                    // apron
miniJet(5.4, 4.6, -2.4, 2);                   // apron
miniJet(-4.5, -2.6, Math.PI, 3, 1.7, 0.35);  // pistten havalanmış (180°, burun yukarı tırmanış)
