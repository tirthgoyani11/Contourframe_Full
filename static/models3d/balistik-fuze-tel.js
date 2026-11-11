// Balistik füze TEL (8x8) — kabin +x, füze arkada dik.
const green = '#5e6248', greenDk = '#4c5038', mBody = '#c8ccd0', mNose = '#5a5240';
const fin = '#6b6f55', band = '#b23a2e', tire = '#1b1b1e', rim = '#42453a';
const glass = '#161812', metal = '#7e8378', table = '#3a3e2e';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);

function strut(p1, p2, r, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), 8), color, { metal: 0.4, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}
function finGeo(rootChord, span, leadSweep, tipChord, thick) {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(span, rootChord - leadSweep - tipChord);
  s.lineTo(span, rootChord - leadSweep);
  s.lineTo(0, rootChord);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, steps: 1 });
  g.translate(0, 0, -thick / 2);
  return g;
}

// ---- şasi + kabin ----
const chassis = mesh(box(7.0, 0.55, 2.0), green, { flat: true, rough: 0.8, name: 'sasi' });
chassis.position.set(0, 1.2, 0);
modelGroup.add(chassis);
const cab = mesh(box(1.5, 1.25, 2.0), green, { flat: true, rough: 0.75, name: 'kabin' });
cab.position.set(2.85, 1.95, 0);
modelGroup.add(cab);
const ws = mesh(box(0.06, 0.5, 1.7), glass, { rough: 0.2, metal: 0.3, name: 'on_cam' });
ws.rotation.z = 0.3; ws.position.set(3.55, 2.15, 0);
modelGroup.add(ws);
[-1, 1].forEach((s, i) => {
  const head = mesh(box(0.1, 0.18, 0.3), '#e6df8a', { rough: 0.4, name: 'far_' + (i + 1) });
  head.position.set(3.62, 1.5, s * 0.7);
  modelGroup.add(head);
});

// ---- tekerlekler (8x8) ----
[2.6, 1.7, -1.9, -2.8].forEach((x, ax) => {
  [-1, 1].forEach((s) => {
    const w = mesh(cyl(0.6, 0.6, 0.4, 18), tire, { rough: 0.9, name: 'teker_' + (ax + 1) + (s > 0 ? 'R' : 'L') });
    w.rotation.x = Math.PI / 2; w.position.set(x, 0.6, s * 1.0);
    modelGroup.add(w);
    const r = mesh(cyl(0.2, 0.2, 0.42, 8), rim, { metal: 0.5, name: 'jant' });
    r.rotation.x = Math.PI / 2; r.position.set(x, 0.6, s * 1.0);
    modelGroup.add(r);
  });
});

// ---- fırlatma masası + erektör kolları ----
const tableBase = mesh(box(2.3, 0.4, 1.9), table, { flat: true, name: 'firlatma_masasi' });
tableBase.position.set(-1.8, 1.6, 0);
modelGroup.add(tableBase);
const ring = mesh(cyl(0.7, 0.8, 0.25, 16), table, { name: 'firlatma_halkasi' });
ring.position.set(-1.8, 1.9, 0);
modelGroup.add(ring);
[-1, 1].forEach((s, i) => {
  strut([-0.5, 1.45, s * 0.7], [-1.4, 1.95, s * 0.7], 0.07, metal, 'erektor_kol_' + (i + 1));
});

// ---- büyük balistik füze (dik) ----
const MX = -1.8, baseY = 2.0;
const BODY_H = 4.4;
const body = mesh(cyl(0.5, 0.5, BODY_H, 20), mBody, { flat: false, rough: 0.5, name: 'fuze_govde' });
body.position.set(MX, baseY + BODY_H / 2, 0);
modelGroup.add(body);
// savaş başlığı (sivri)
const nose = mesh(cyl(0.04, 0.5, 1.2, 20), mNose, { flat: false, name: 'savas_basligi' });
nose.position.set(MX, baseY + BODY_H + 0.6, 0);
modelGroup.add(nose);
// bantlar
[baseY + 1.0, baseY + 3.4].forEach((y, i) => {
  const b = mesh(cyl(0.52, 0.52, 0.18, 20), band, { name: 'bant_' + (i + 1) });
  b.position.set(MX, y, 0);
  modelGroup.add(b);
});
// kuyruk kanatları (4, dipte)
for (let i = 0; i < 4; i++) {
  const a = i * Math.PI / 2;
  const f = mesh(finGeo(1.0, 0.7, 0.55, 0.3, 0.06), fin, { flat: true, name: 'kanat_' + (i + 1) });
  f.position.set(MX + Math.cos(a) * 0.45, baseY, Math.sin(a) * 0.45);
  f.rotation.y = -a;
  modelGroup.add(f);
}

// ---- stabilizatör ayakları ----
[[-0.6, 1], [-0.6, -1], [-3.2, 1], [-3.2, -1]].forEach((o, i) => {
  const x = o[0], s = o[1];
  strut([x, 1.1, s * 0.95], [x, 0.0, s * 1.7], 0.08, metal, 'outrigger_' + (i + 1));
  const pad = mesh(cyl(0.22, 0.22, 0.1, 12), greenDk, { name: 'ayak_pad_' + (i + 1) });
  pad.position.set(x, 0.05, s * 1.7);
  modelGroup.add(pad);
});

// ---- anten ----
strut([2.4, 2.5, -0.8], [2.55, 3.5, -0.85], 0.02, '#0f1010', 'anten');
