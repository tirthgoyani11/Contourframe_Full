// Kamikaze drone (Shahed-136 tarzı delta) — burun +x, itici pervane arkada. Havada.
const wingCol = '#c4c6c1', bodyCol = '#b3b5b0', warhead = '#4f4a38';
const prop = '#2b2b2e', fin = '#bcbeb9', dark = '#23262b', lensC = '#2a4a6a';
const YC = 1.6;
modelGroup.userData.noGround = true; // havada bırak

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 14);
const sph = (r) => new THREE.SphereGeometry(r, 16, 12);

// yatay delta yüzey (shape XY -> extrude, sonra yatay yatır)
function delta(pts, thick, color, name) {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, steps: 1 });
  g.translate(0, 0, -thick / 2);
  const m = mesh(g, color, { flat: true, rough: 0.6, name: name });
  m.rotation.x = -Math.PI / 2;
  return m;
}

// ---- delta kanat ----
const wing = delta([[2.0, 0], [-1.4, 1.25], [-1.4, -1.25]], 0.12, wingCol, 'delta_kanat');
wing.position.y = YC;
modelGroup.add(wing);
// kanat üstü panel/sırt çizgileri
[0.5, -0.5].forEach((z, i) => {
  const seam = mesh(box(2.8, 0.03, 0.04), '#a9aba6', { name: 'panel_' + (i + 1) });
  seam.position.set(0.0, YC + 0.07, z);
  modelGroup.add(seam);
});

// ---- merkez gövde sırtı ----
const body = mesh(box(3.2, 0.3, 0.46), bodyCol, { flat: true, rough: 0.55, name: 'govde' });
body.position.set(0.25, YC + 0.18, 0);
modelGroup.add(body);
const bodyTaper = mesh(cyl(0.18, 0.23, 0.5, 14), bodyCol, { flat: true, name: 'govde_burun' });
bodyTaper.rotation.z = Math.PI / 2;
bodyTaper.position.set(1.75, YC + 0.13, 0);
modelGroup.add(bodyTaper);

// ---- savaş başlığı (burun) ----
const nose = mesh(new THREE.ConeGeometry(0.2, 0.85, 16), warhead, { rough: 0.5, name: 'savas_basligi' });
nose.rotation.z = -Math.PI / 2;
nose.position.set(2.25, YC + 0.1, 0);
modelGroup.add(nose);
// alt sensör (EO)
const eo = mesh(sph(0.1), dark, { metal: 0.3, name: 'sensor' });
eo.position.set(1.6, YC - 0.04, 0);
modelGroup.add(eo);
const eoL = mesh(cyl(0.04, 0.04, 0.05, 10), lensC, { metal: 0.4, name: 'sensor_lens' });
eoL.position.set(1.66, YC - 0.12, 0);
modelGroup.add(eoL);

// ---- itici pervane (arka merkez, x ekseninde döner) ----
const hub = mesh(cyl(0.08, 0.1, 0.16, 12), prop, { name: 'pervane_gobek' });
hub.rotation.z = Math.PI / 2;
hub.position.set(-1.45, YC + 0.13, 0);
modelGroup.add(hub);
const propeller = spin({ pivot: [-1.55, YC + 0.13, 0], axis: 'x', rpm: 900 });
const blade = mesh(box(0.04, 0.95, 0.1), prop, { flat: true, name: 'pervane' });
propeller.add(blade);
const spinner = mesh(cyl(0.0, 0.09, 0.22, 12), prop, { name: 'spinner' });
spinner.rotation.z = Math.PI / 2; // ucu arkaya (-x) sivrilir (pusher)
spinner.position.set(-0.12, 0, 0);
propeller.add(spinner);

// ---- kanat ucu dikey kanatçıkları ----
[-1, 1].forEach((s, i) => {
  const wf = mesh(box(0.55, 0.45, 0.05), fin, { flat: true, name: 'kanat_ucu_' + (i + 1) });
  wf.position.set(-1.15, YC + 0.2, s * 1.16);
  wf.rotation.x = -s * 0.3; // hafif dışa-yukarı
  modelGroup.add(wf);
});

// ---- üst anten ----
const ant = mesh(cyl(0.012, 0.012, 0.35, 6), dark, { name: 'anten' });
ant.position.set(-0.7, YC + 0.5, 0);
modelGroup.add(ant);
