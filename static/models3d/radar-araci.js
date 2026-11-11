// Radar aracı (8x8) — kabin +x, arkada dönen faz dizinli panel.
const green = '#5e6248', greenDk = '#4c5038', frame = '#3a3e2e', face = '#1f242a';
const elem = '#3a4a55', tire = '#1b1b1e', rim = '#42453a', glass = '#161812', metal = '#7e8378', table = '#33372a';

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

// ---- döner radar (tabla + geriye yatık panel) ----
const radar = spin({ pivot: [-1.5, 1.7, 0], axis: 'y', rpm: 9 });
const turntable = mesh(cyl(0.9, 1.0, 0.28, 18), table, { flat: true, name: 'doner_tabla' });
radar.add(turntable);

// panel alt-grubu (kolay yerel koordinat, sonra geriye yatır)
const panelG = new THREE.Group();
const panel = mesh(box(0.2, 3.2, 2.8), frame, { flat: true, rough: 0.6, name: 'radar_paneli' });
panelG.add(panel);
const faceM = mesh(box(0.08, 2.9, 2.5), face, { flat: true, name: 'dizin_yuzeyi' });
faceM.position.set(0.13, 0, 0);
panelG.add(faceM);
// dizin elemanları (yatay sıralar)
for (let r = 0; r < 5; r++) {
  const row = mesh(box(0.05, 0.12, 2.4), elem, { name: 'dizin_sira_' + (r + 1) });
  row.position.set(0.18, -1.0 + r * 0.5, 0);
  panelG.add(row);
}
// arka destek kolları
[-1, 1].forEach((s, i) => {
  const arm = mesh(box(0.16, 2.6, 0.16), frame, { flat: true, name: 'destek_kol_' + (i + 1) });
  arm.position.set(-0.22, -0.3, s * 0.7);
  panelG.add(arm);
});
panelG.position.set(0.0, 1.85, 0);  // tabladan yukarı (pivot'a göre)
panelG.rotation.z = 0.2;            // geriye yatık
radar.add(panelG);

// ---- stabilizatör ayakları ----
[[-0.6, 1], [-0.6, -1], [-2.7, 1], [-2.7, -1]].forEach((o, i) => {
  const x = o[0], s = o[1];
  strut([x, 1.1, s * 0.95], [x, 0.0, s * 1.7], 0.08, metal, 'outrigger_' + (i + 1));
  const pad = mesh(cyl(0.22, 0.22, 0.1, 12), greenDk, { name: 'ayak_pad_' + (i + 1) });
  pad.position.set(x, 0.05, s * 1.7);
  modelGroup.add(pad);
});
