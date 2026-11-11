// Kundağı motorlu obüs (SPH) — namlu +x, paletli.
const green = '#5b6650', greenDark = '#4c5644', greenLt = '#69745c';
const steel = '#3a3f33', track = '#262629', rubber = '#1c1c20', hub = '#3c3c42', metal = '#8a8f86';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);

function lerp(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
function rodBetween(p1, p2, r, color, name, opts) {
  opts = opts || {};
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), opts.seg || 16), color, { metal: opts.metal || 0.3, rough: 0.6, flat: opts.flat, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
  return m;
}

// ---- paletler + yol tekerlekleri ----
const TZ = 1.15;
[-TZ, TZ].forEach((z, side) => {
  const belt = mesh(box(5.0, 0.8, 0.55), track, { flat: true, rough: 0.95, name: 'palet_' + (side + 1) });
  belt.position.set(0, 0.4, z);
  modelGroup.add(belt);
  [['arka', -2.5], ['on', 2.5]].forEach((c) => {
    const uc = mesh(cyl(0.4, 0.4, 0.55, 22), track, { rough: 0.95, name: 'palet_uc_' + c[0] + '_' + (side + 1) });
    uc.rotation.x = Math.PI / 2; uc.position.set(c[1], 0.4, z);
    modelGroup.add(uc);
  });
  for (let i = 0; i < 7; i++) {
    const x = -2.1 + i * 0.7;
    const w = mesh(cyl(0.32, 0.32, 0.5, 16), rubber, { rough: 0.9, name: 'teker_' + (side + 1) + '_' + (i + 1) });
    w.rotation.x = Math.PI / 2; w.position.set(x, 0.34, z);
    modelGroup.add(w);
    const cap = mesh(cyl(0.12, 0.12, 0.54, 10), hub, { metal: 0.5, name: 'gobek' });
    cap.rotation.x = Math.PI / 2; cap.position.set(x, 0.34, z);
    modelGroup.add(cap);
  }
  for (let i = 0; i < 4; i++) {
    const roller = mesh(cyl(0.1, 0.1, 0.46, 10), rubber, { name: 'makara' });
    roller.rotation.x = Math.PI / 2; roller.position.set(-1.5 + i * 1.0, 0.7, z);
    modelGroup.add(roller);
  }
  const fender = mesh(box(5.2, 0.1, 0.65), greenDark, { flat: true, name: 'camurluk_' + (side + 1) });
  fender.position.set(0, 0.84, z);
  modelGroup.add(fender);
});

// ---- gövde ----
const hull = mesh(box(5.0, 0.9, 2.2), green, { flat: true, rough: 0.85, name: 'govde' });
hull.position.set(0, 1.25, 0); // 0.80 .. 1.70
modelGroup.add(hull);
// ön eğimli plaka
const glacis = mesh(box(0.9, 0.9, 2.2), greenLt, { flat: true, name: 'on_zirh' });
glacis.rotation.z = -0.5;
glacis.position.set(2.55, 1.2, 0);
modelGroup.add(glacis);

// ---- büyük taret (arkada) ----
const turret = mesh(box(3.0, 1.0, 2.0), greenDark, { flat: true, rough: 0.85, name: 'taret' });
turret.position.set(-0.7, 2.15, 0); // 1.65 .. 2.65
modelGroup.add(turret);
// taret ön eğik plaka
const turFront = mesh(box(0.5, 1.0, 1.9), greenDark, { flat: true, name: 'taret_on' });
turFront.rotation.z = -0.45;
turFront.position.set(0.95, 2.15, 0);
modelGroup.add(turFront);
// arka mühimmat sandığı
const bustle = mesh(box(1.1, 0.8, 1.95), greenDark, { flat: true, name: 'muhimmat_sandigi' });
bustle.position.set(-2.05, 2.05, 0);
modelGroup.add(bustle);

// ---- uzun namlu (155mm) ----
const breech = [0.9, 2.28, 0];
const muzzle = [5.8, 2.9, 0];
rodBetween(breech, muzzle, 0.14, steel, 'namlu', { metal: 0.4, flat: true });
const mantlet = mesh(box(0.5, 0.6, 0.7), greenDark, { flat: true, name: 'mantle' });
mantlet.position.set(1.0, 2.28, 0);
modelGroup.add(mantlet);
// duman tahliye şişkinliği (fume extractor)
rodBetween(lerp(breech, muzzle, 0.42), lerp(breech, muzzle, 0.55), 0.22, steel, 'duman_tahliye', { metal: 0.4 });
// namlu freni
rodBetween(lerp(breech, muzzle, 0.9), muzzle, 0.22, steel, 'namlu_freni', { metal: 0.4 });

// ---- komutan kulesi + makineli ----
const cupola = mesh(cyl(0.35, 0.35, 0.3, 14), greenDark, { flat: true, name: 'komutan_kulesi' });
cupola.position.set(-1.3, 2.8, 0.5);
modelGroup.add(cupola);
const hatch = mesh(cyl(0.3, 0.3, 0.08, 14), green, { name: 'kapak' });
hatch.position.set(-1.3, 2.97, 0.5);
modelGroup.add(hatch);
const mg = mesh(cyl(0.045, 0.045, 0.8, 8), steel, { metal: 0.4, name: 'makineli' });
mg.rotation.z = Math.PI / 2;
mg.position.set(-0.9, 3.0, 0.5);
modelGroup.add(mg);

// ---- sis fırlatıcıları (taret yanları) ----
[-1, 1].forEach((s) => {
  for (let k = 0; k < 4; k++) {
    const tube = mesh(cyl(0.05, 0.05, 0.24, 8), '#2a2e24', { name: 'sis_' + (s > 0 ? 'sag' : 'sol') + '_' + (k + 1) });
    tube.rotation.z = -0.5;
    tube.position.set(0.5 - k * 0.16, 2.5, s * 0.95);
    modelGroup.add(tube);
  }
});

// ---- anten ----
rodBetween([-2.3, 2.45, 0.7], [-2.55, 3.5, 0.78], 0.02, '#15161a', 'anten');
