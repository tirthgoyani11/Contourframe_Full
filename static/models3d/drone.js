// Drone (quadcopter) — burun +x, X dizilim, 4 pervane döner.
const frame = '#26282d', bodyCol = '#3a3f47', accent = '#d8543a';
const motorCol = '#1d1f24', bell = '#9aa0aa', propCol = '#2b2e34';
const gimbalCol = '#1b1d22', lensCol = '#2a4a6a', metal = '#9aa0aa';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);
const sph = (r) => new THREE.SphereGeometry(r, 16, 12);

// iki nokta arasında açılı çubuk (iniş ayakları)
function strutBetween(p1, p2, r, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), 8), metal, { metal: 0.5, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}

// ---- merkez gövde ----
const plate = mesh(box(1.15, 0.08, 0.62), frame, { flat: true, name: 'sasi' });
plate.position.set(0, 0.55, 0);
modelGroup.add(plate);

const bodyTop = mesh(box(0.78, 0.26, 0.5), bodyCol, { flat: true, rough: 0.6, name: 'govde' });
bodyTop.position.set(0, 0.72, 0);
modelGroup.add(bodyTop);

const frontShell = mesh(box(0.32, 0.2, 0.46), accent, { flat: true, name: 'on_kabuk' });
frontShell.position.set(0.42, 0.7, 0);
modelGroup.add(frontShell);

const battery = mesh(box(0.6, 0.14, 0.4), '#15161a', { flat: true, name: 'batarya' });
battery.position.set(0, 0.45, 0);
modelGroup.add(battery);

const gps = mesh(cyl(0.12, 0.12, 0.06, 16), bodyCol, { name: 'gps' });
gps.position.set(-0.18, 0.88, 0);
modelGroup.add(gps);

// ---- kollar + motorlar + dönen pervaneler ----
const corners = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const MR = 0.85; // motor x,z
corners.forEach((c, i) => {
  const sx = c[0], sz = c[1];
  const mx = sx * MR, mz = sz * MR;
  const isFront = sx > 0;

  // kol
  const arm = mesh(box(Math.hypot(mx, mz) + 0.16, 0.07, 0.12), frame, { flat: true, name: 'kol_' + (i + 1) });
  arm.position.set(mx / 2, 0.55, mz / 2);
  arm.rotation.y = -Math.atan2(mz, mx);
  modelGroup.add(arm);

  // motor + metal kapak
  const motor = mesh(cyl(0.16, 0.16, 0.2, 16), motorCol, { metal: 0.4, name: 'motor_' + (i + 1) });
  motor.position.set(mx, 0.62, mz);
  modelGroup.add(motor);
  const cap = mesh(cyl(0.14, 0.14, 0.06, 16), bell, { metal: 0.6, rough: 0.3, name: 'motor_kapak_' + (i + 1) });
  cap.position.set(mx, 0.74, mz);
  modelGroup.add(cap);

  // pervane (döner) — çapraz çiftler ters yön
  const dirSign = (sx * sz > 0) ? 1 : -1;
  const prop = spin({ pivot: [mx, 0.8, mz], axis: 'y', rpm: dirSign * 600 });
  const pb = mesh(box(1.0, 0.02, 0.13), isFront ? accent : propCol, { flat: true, name: 'pervane_' + (i + 1) });
  prop.add(pb);
  const phub = mesh(cyl(0.05, 0.05, 0.06, 12), metal, { metal: 0.5, name: 'pervane_gobek_' + (i + 1) });
  phub.position.set(0, 0.02, 0);
  prop.add(phub);
});

// ---- ön kamera gimbali ----
const gimbal = mesh(box(0.2, 0.2, 0.24), gimbalCol, { flat: true, name: 'gimbal' });
gimbal.position.set(0.48, 0.36, 0);
modelGroup.add(gimbal);
const cam = mesh(sph(0.13), gimbalCol, { name: 'kamera' });
cam.position.set(0.56, 0.28, 0);
modelGroup.add(cam);
const lens = mesh(cyl(0.06, 0.06, 0.06, 16), lensCol, { metal: 0.5, rough: 0.2, name: 'lens' });
lens.rotation.z = Math.PI / 2;
lens.position.set(0.66, 0.28, 0);
modelGroup.add(lens);

// ---- antenler (gövdeye bağlı; eğim taban->uç'tan otomatik hesaplanır) ----
[-1, 1].forEach((s, i) => {
  const base = [-0.34, 0.80, s * 0.16];   // gövde arka-üstüne gömülü taban
  const tip = [-0.52, 1.24, s * 0.26];    // yukarı + geriye + dışa yatık uç
  const a = new THREE.Vector3(base[0], base[1], base[2]);
  const b = new THREE.Vector3(tip[0], tip[1], tip[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const ant = mesh(cyl(0.018, 0.018, dir.length(), 8), '#15161a', { name: 'anten_' + (i + 1) });
  ant.position.set((base[0] + tip[0]) / 2, (base[1] + tip[1]) / 2, (base[2] + tip[2]) / 2);
  ant.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(ant);
  const tipBall = mesh(sph(0.035), accent, { name: 'anten_uc_' + (i + 1) });
  tipBall.position.set(tip[0], tip[1], tip[2]); // tam çubuğun ucunda
  modelGroup.add(tipBall);
});

// ---- iniş ayakları (4) ----
const feet = [[0.42, 0.32], [0.42, -0.32], [-0.42, 0.32], [-0.42, -0.32]];
feet.forEach((f, i) => {
  strutBetween([f[0] * 0.6, 0.5, f[1] * 0.6], [f[0], 0.06, f[1]], 0.03, 'ayak_' + (i + 1));
  const pad = mesh(sph(0.05), frame, { name: 'ayak_pad_' + (i + 1) });
  pad.position.set(f[0], 0.05, f[1]);
  modelGroup.add(pad);
});
