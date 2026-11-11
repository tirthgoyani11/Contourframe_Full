// Hava savunma sistemi (S-400 tarzı 8x8 TEL) — kabin +x, fırlatma tüpleri arkada (-x), dik.
const green = '#5e6248', tubeG = '#565b41', frame = '#3a3e2e', dark = '#2a2d22';
const tire = '#1b1b1e', rim = '#42453a', glass = '#161812';
const metal = '#7e8378', light = '#e6df8a', cap = '#33372a';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);

// iki nokta arasında açılı çubuk (hidrolik kol / outrigger)
function strut(p1, p2, r, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), 8), color, { metal: 0.4, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}

// ---- şasi ----
const chassis = mesh(box(7.0, 0.55, 2.0), green, { flat: true, rough: 0.75, name: 'sasi' });
chassis.position.set(0, 1.2, 0); // 0.925 .. 1.475
modelGroup.add(chassis);

// ---- kabin ----
const cab = mesh(box(1.5, 1.25, 2.0), green, { flat: true, rough: 0.7, name: 'kabin' });
cab.position.set(2.85, 1.95, 0); // 1.325 .. 2.575
modelGroup.add(cab);
const ws = mesh(box(0.06, 0.5, 1.7), glass, { rough: 0.2, metal: 0.3, name: 'on_cam' });
ws.rotation.z = 0.3;
ws.position.set(3.55, 2.15, 0);
modelGroup.add(ws);
[-1, 1].forEach((s, i) => {
  const sw = mesh(box(0.9, 0.4, 0.05), glass, { rough: 0.2, metal: 0.3, name: 'yan_cam_' + (i + 1) });
  sw.position.set(2.85, 2.12, s * 1.0);
  modelGroup.add(sw);
  const head = mesh(box(0.1, 0.18, 0.3), light, { rough: 0.4, name: 'far_' + (i + 1) });
  head.position.set(3.62, 1.5, s * 0.7);
  modelGroup.add(head);
});

// ---- tekerlekler (8x8: ön ikili + arka ikili bogie) ----
[2.6, 1.7, -1.9, -2.8].forEach((x, ax) => {
  [-1, 1].forEach((s) => {
    const w = mesh(cyl(0.6, 0.6, 0.4, 18), tire, { rough: 0.9, name: 'teker_' + (ax + 1) + (s > 0 ? 'R' : 'L') });
    w.rotation.x = Math.PI / 2;
    w.position.set(x, 0.6, s * 1.0);
    modelGroup.add(w);
    const r = mesh(cyl(0.2, 0.2, 0.42, 8), rim, { metal: 0.5, rough: 0.4, name: 'jant' });
    r.rotation.x = Math.PI / 2;
    r.position.set(x, 0.6, s * 1.0);
    modelGroup.add(r);
  });
});

// ---- egzoz + anten ----
const exhaust = mesh(cyl(0.08, 0.08, 1.0, 10), '#2a2a2a', { metal: 0.5, name: 'egzoz' });
exhaust.position.set(2.0, 1.95, 0.92);
modelGroup.add(exhaust);
strut([2.4, 2.5, -0.8], [2.55, 3.5, -0.85], 0.02, '#0f1010', 'anten');

// ---- erektör tabanı + çerçeve ----
const erBase = mesh(box(2.4, 0.45, 1.95), frame, { flat: true, name: 'erektor_tabani' });
erBase.position.set(-2.0, 1.6, 0); // 1.375 .. 1.825
modelGroup.add(erBase);
const erFrame = mesh(box(1.8, 0.5, 1.8), frame, { flat: true, name: 'erektor_cerceve' });
erFrame.position.set(-2.1, 1.98, 0); // 1.73 .. 2.23
modelGroup.add(erFrame);
// hidrolik kalkış kolları (önde, açılı)
[-1, 1].forEach((s, i) => {
  strut([-0.5, 1.45, s * 0.7], [-1.35, 1.95, s * 0.7], 0.07, metal, 'hidrolik_kol_' + (i + 1));
});

// ---- 4 fırlatma tüpü (dik, 2x2) ----
const TUBE_H = 4.0, baseY = 2.23; // çerçeve tavanı
[[-2.6, 0.55], [-2.6, -0.55], [-1.65, 0.55], [-1.65, -0.55]].forEach((p, i) => {
  const tube = mesh(cyl(0.4, 0.4, TUBE_H, 18), tubeG, { flat: true, rough: 0.7, name: 'tup_' + (i + 1) });
  tube.position.set(p[0], baseY + TUBE_H / 2, p[1]);
  modelGroup.add(tube);
  const lid = mesh(cyl(0.43, 0.43, 0.22, 18), cap, { name: 'tup_kapak_' + (i + 1) });
  lid.position.set(p[0], baseY + TUBE_H + 0.05, p[1]);
  modelGroup.add(lid);
  const ring = mesh(cyl(0.43, 0.43, 0.12, 18), dark, { name: 'tup_halka_' + (i + 1) });
  ring.position.set(p[0], baseY + 0.6, p[1]);
  modelGroup.add(ring);
});

// ---- stabilizatör ayakları (outrigger, açık) ----
[[-0.6, 1], [-0.6, -1], [-3.3, 1], [-3.3, -1]].forEach((o, i) => {
  const x = o[0], s = o[1];
  strut([x, 1.1, s * 0.95], [x, 0.0, s * 1.7], 0.08, metal, 'outrigger_' + (i + 1));
  const pad = mesh(cyl(0.22, 0.22, 0.1, 12), dark, { name: 'ayak_pad_' + (i + 1) });
  pad.position.set(x, 0.05, s * 1.7);
  modelGroup.add(pad);
});
