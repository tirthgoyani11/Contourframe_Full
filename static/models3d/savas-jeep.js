// Savaş jeep (açık üstlü askeri 4x4) — burun +x, üst +y.
const od = '#4a5132', odDark = '#3d4329', grille = '#23271c';
const tire = '#1b1b1e', hub = '#3a3a40', glass = '#9fb6bc';
const seatCol = '#2e3320', metal = '#6a6f63', gun = '#27272a';
const lightCol = '#e6df8a', star = '#e8e8e8', jerry = '#41472c';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);

// beyaz yıldız (kaput dekali)
function starGeo(R, r, thick) {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const ang = -Math.PI / 2 + i * Math.PI / 5;
    const rad = (i % 2 === 0) ? R : r;
    const x = Math.cos(ang) * rad, y = Math.sin(ang) * rad;
    if (i === 0) s.moveTo(x, y); else s.lineTo(x, y);
  }
  s.closePath();
  return new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, steps: 1 });
}

// ---- açık gövde (tekne tipi: taban + duvarlar) ----
const floor = mesh(box(2.5, 0.12, 1.45), odDark, { flat: true, name: 'taban' });
floor.position.set(-0.1, 0.62, 0);
modelGroup.add(floor);
[-1, 1].forEach((s, i) => {
  const wall = mesh(box(2.5, 0.42, 0.09), od, { flat: true, name: 'yan_duvar_' + (i + 1) });
  wall.position.set(-0.1, 0.86, s * 0.68);
  modelGroup.add(wall);
});
const rearWall = mesh(box(0.09, 0.42, 1.45), od, { flat: true, name: 'arka_duvar' });
rearWall.position.set(-1.32, 0.86, 0);
modelGroup.add(rearWall);
const dash = mesh(box(0.12, 0.42, 1.45), od, { flat: true, name: 'gosterge_paneli' });
dash.position.set(1.1, 0.86, 0);
modelGroup.add(dash);

// ---- kaput + ızgara + farlar ----
const hood = mesh(box(1.0, 0.58, 1.38), od, { flat: true, name: 'kaput' });
hood.position.set(1.62, 0.83, 0); // aşağı doğru genişletildi (alt ~0.54 .. üst ~1.12)
modelGroup.add(hood);

const star1 = mesh(starGeo(0.26, 0.11, 0.02), star, { rough: 0.6, name: 'yildiz' });
star1.rotation.x = -Math.PI / 2;
star1.position.set(1.6, 1.115, 0);
modelGroup.add(star1);

const grillePlate = mesh(box(0.1, 0.44, 1.24), grille, { flat: true, name: 'izgara' });
grillePlate.position.set(2.1, 0.92, 0);
modelGroup.add(grillePlate);
for (let k = 0; k < 7; k++) {
  const slat = mesh(box(0.05, 0.38, 0.05), metal, { name: 'izgara_yarik' });
  slat.position.set(2.13, 0.92, -0.48 + k * 0.16);
  modelGroup.add(slat);
}
[-0.46, 0.46].forEach((z, i) => {
  const head = mesh(cyl(0.13, 0.13, 0.08, 16), lightCol, { rough: 0.4, name: 'far_' + (i + 1) });
  head.rotation.z = Math.PI / 2;
  head.position.set(2.16, 1.12, z);
  modelGroup.add(head);
});
const bumper = mesh(box(0.16, 0.12, 1.55), metal, { metal: 0.4, name: 'tampon' });
bumper.position.set(2.2, 0.62, 0);
modelGroup.add(bumper);

// ---- tekerlekler + çamurluklar ----
[[1.5, 0.72], [1.5, -0.72], [-0.75, 0.72], [-0.75, -0.72]].forEach((p, i) => {
  const w = mesh(cyl(0.4, 0.4, 0.3, 18), tire, { rough: 0.9, name: 'teker_' + (i + 1) });
  w.rotation.x = Math.PI / 2;
  w.position.set(p[0], 0.4, p[1]);
  modelGroup.add(w);
  const rim = mesh(cyl(0.15, 0.15, 0.32, 10), hub, { metal: 0.5, rough: 0.4, name: 'jant_' + (i + 1) });
  rim.rotation.x = Math.PI / 2;
  rim.position.set(p[0], 0.4, p[1]);
  modelGroup.add(rim);
  const fender = mesh(box(0.95, 0.08, 0.45), odDark, { flat: true, name: 'camurluk_' + (i + 1) });
  fender.position.set(p[0], 0.82, p[1]);
  modelGroup.add(fender);
});

// ---- ön cam ----
const wsFrame = mesh(box(0.07, 0.52, 1.36), odDark, { flat: true, name: 'on_cam_cerceve' });
wsFrame.rotation.z = 0.32;
wsFrame.position.set(1.0, 1.34, 0);
modelGroup.add(wsFrame);
const wsGlass = mesh(box(0.04, 0.42, 1.2), glass, { rough: 0.15, metal: 0.2, name: 'on_cam' });
wsGlass.rotation.z = 0.32;
wsGlass.position.set(1.02, 1.34, 0);
modelGroup.add(wsGlass);

// ---- koltuklar + direksiyon ----
[-0.35, 0.35].forEach((z, i) => {
  const seat = mesh(box(0.5, 0.14, 0.45), seatCol, { flat: true, name: 'koltuk_' + (i + 1) });
  seat.position.set(0.45, 0.82, z);
  modelGroup.add(seat);
  const back = mesh(box(0.14, 0.5, 0.45), seatCol, { flat: true, name: 'koltuk_arkalik_' + (i + 1) });
  back.position.set(0.18, 1.05, z);
  modelGroup.add(back);
});
const column = mesh(cyl(0.03, 0.03, 0.4, 8), metal, { metal: 0.4, name: 'direksiyon_kolonu' });
column.rotation.z = 0.5;
column.position.set(0.85, 1.05, -0.35);
modelGroup.add(column);
const wheel = mesh(new THREE.TorusGeometry(0.13, 0.022, 8, 18), gun, { name: 'direksiyon' });
wheel.rotation.y = Math.PI / 2;
wheel.rotation.x = 0.5;
wheel.position.set(0.7, 1.2, -0.35);
modelGroup.add(wheel);

// ---- pintle makineli tüfek (arka) ----
const mount = mesh(cyl(0.04, 0.05, 0.85, 10), metal, { metal: 0.4, name: 'pintle' });
mount.position.set(-0.55, 1.05, 0);
modelGroup.add(mount);
const receiver = mesh(box(0.6, 0.13, 0.13), gun, { flat: true, metal: 0.3, name: 'makineli_govde' });
receiver.position.set(-0.35, 1.55, 0);
modelGroup.add(receiver);
const mgBarrel = mesh(cyl(0.028, 0.028, 0.8, 10), gun, { metal: 0.4, name: 'makineli_namlu' });
mgBarrel.rotation.z = Math.PI / 2;
mgBarrel.position.set(0.25, 1.55, 0);
modelGroup.add(mgBarrel);
const shroud = mesh(cyl(0.05, 0.05, 0.35, 12), gun, { metal: 0.3, name: 'namlu_kilifi' });
shroud.rotation.z = Math.PI / 2;
shroud.position.set(-0.05, 1.55, 0);
modelGroup.add(shroud);
[-0.08, 0.08].forEach((z, i) => {
  const grip = mesh(box(0.05, 0.22, 0.04), gun, { name: 'kabza_' + (i + 1) });
  grip.rotation.x = 0.4;
  grip.position.set(-0.62, 1.45, z);
  modelGroup.add(grip);
});
const ammo = mesh(box(0.2, 0.18, 0.14), odDark, { flat: true, name: 'cephane_kutusu' });
ammo.position.set(-0.45, 1.42, 0.2);
modelGroup.add(ammo);

// ---- yedek lastik (arka) ----
const spare = mesh(cyl(0.4, 0.4, 0.24, 18), tire, { rough: 0.9, name: 'yedek_lastik' });
spare.rotation.z = Math.PI / 2;
spare.position.set(-1.5, 0.95, 0);
modelGroup.add(spare);
const spareHub = mesh(cyl(0.14, 0.14, 0.26, 10), hub, { metal: 0.5, name: 'yedek_jant' });
spareHub.rotation.z = Math.PI / 2;
spareHub.position.set(-1.52, 0.95, 0);
modelGroup.add(spareHub);

// ---- jerrikan (arka köşe) ----
const can = mesh(box(0.18, 0.46, 0.34), jerry, { flat: true, name: 'jerrikan' });
can.position.set(-1.15, 1.05, 0.55);
modelGroup.add(can);

// ---- anten ----
const ant = mesh(cyl(0.015, 0.015, 0.9, 6), '#15161a', { name: 'anten' });
ant.rotation.z = 0.12;
ant.position.set(-1.2, 1.35, -0.6);
modelGroup.add(ant);
