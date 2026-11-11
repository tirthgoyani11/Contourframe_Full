// Uçak hangarı (quonset kemerli) — ön açık (+x girişi).
const roofCol = '#9aa0a6', floorCol = '#6b6f73', wallCol = '#7c8189', mark = '#d2a93a';
const lightCol = '#fff4d6', drumA = '#4a5a32', drumB = '#9a3a2e', tug = '#d2a93a', dark = '#2a2d31', metal = '#7e848c';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 14);

const R = 4.5, L = 11, N = 9;

// ---- zemin ----
const floor = mesh(box(L, 0.15, R * 2 + 0.4), floorCol, { flat: true, rough: 0.95, name: 'zemin' });
floor.position.set(0, 0.075, 0);
modelGroup.add(floor);
// taksi/işaret çizgileri
const centerLine = mesh(box(L - 1, 0.02, 0.18), mark, { name: 'orta_cizgi' });
centerLine.position.set(0, 0.16, 0);
modelGroup.add(centerLine);
[2.5, -1.5].forEach((x, i) => {
  const cross = mesh(box(0.18, 0.02, 2.4), mark, { name: 'isaret_' + (i + 1) });
  cross.position.set(x, 0.16, 0);
  modelGroup.add(cross);
});

// ---- kemer çatı (faceted) ----
for (let k = 0; k < N; k++) {
  const tm = (k + 0.5) * Math.PI / N;
  const yc = R * Math.sin(tm), zc = R * Math.cos(tm);
  const chord = 2 * R * Math.sin(Math.PI / (2 * N));
  const seg = mesh(box(L, 0.18, chord + 0.06), roofCol, { flat: true, rough: 0.7, metal: 0.2, name: 'cati_' + (k + 1) });
  seg.position.set(0, yc, zc);
  seg.rotation.x = (Math.PI / 2 - tm);
  modelGroup.add(seg);
}

// ---- arka duvar (yarım daire) ----
const backWall = mesh(new THREE.CircleGeometry(R - 0.05, 32, 0, Math.PI), wallCol, { flat: false, rough: 0.9, name: 'arka_duvar' });
backWall.rotation.y = Math.PI / 2;
backWall.position.set(-L / 2 + 0.1, 0, 0);
backWall.material.side = THREE.DoubleSide;
modelGroup.add(backWall);
// büyük kapı (arka duvarda) detay
const door = mesh(box(0.06, 2.2, 3.0), '#5e636a', { flat: true, name: 'arka_kapi' });
door.position.set(-L / 2 + 0.18, 1.1, 0);
modelGroup.add(door);

// ---- ön kemer çerçevesi (ince) ----
for (let k = 0; k < N; k++) {
  const tm = (k + 0.5) * Math.PI / N;
  const yc = R * Math.sin(tm), zc = R * Math.cos(tm);
  const chord = 2 * R * Math.sin(Math.PI / (2 * N));
  const fr = mesh(box(0.25, 0.28, chord + 0.04), wallCol, { flat: true, name: 'on_cerceve_' + (k + 1) });
  fr.position.set(L / 2 - 0.1, yc, zc);
  fr.rotation.x = (Math.PI / 2 - tm);
  modelGroup.add(fr);
}

// ---- tavan aydınlatmaları ----
[3, 0, -3].forEach((x, i) => {
  const lamp = mesh(box(0.7, 0.12, 0.4), lightCol, { rough: 0.4, name: 'tavan_lambasi_' + (i + 1) });
  lamp.position.set(x, R - 0.35, 0);
  modelGroup.add(lamp);
});

// ---- yakıt varilleri (köşe) ----
[[-3.5, 3.2], [-3.5, 3.7], [-3.9, 3.45]].forEach((p, i) => {
  const drum = mesh(cyl(0.22, 0.22, 0.6, 14), i === 2 ? drumB : drumA, { flat: true, name: 'varil_' + (i + 1) });
  drum.position.set(p[0], 0.38, p[1]);
  modelGroup.add(drum);
});

// ---- bakım merdiveni (platform) ----
const standLeg = mesh(box(0.1, 1.4, 0.1), metal, { name: 'merdiven_ayak' });
standLeg.position.set(2.6, 0.7, -3.2);
modelGroup.add(standLeg);
const standTop = mesh(box(1.2, 0.1, 0.8), metal, { flat: true, name: 'merdiven_platform' });
standTop.position.set(2.1, 1.4, -3.2);
modelGroup.add(standTop);
const ramp = mesh(box(1.0, 0.06, 0.4), metal, { flat: true, name: 'merdiven_egim' });
ramp.rotation.z = 0.6;
ramp.position.set(1.3, 0.7, -3.2);
modelGroup.add(ramp);

// ---- çekici traktör (tow tug) ----
const tugG = new THREE.Group();
const tBody = mesh(box(1.0, 0.4, 0.7), tug, { flat: true, name: 'cekici_govde' });
tBody.position.set(0, 0.45, 0); tugG.add(tBody);
const tCab = mesh(box(0.5, 0.35, 0.6), tug, { flat: true, name: 'cekici_kabin' });
tCab.position.set(-0.2, 0.82, 0); tugG.add(tCab);
[[0.35, 0.32], [0.35, -0.32], [-0.35, 0.32], [-0.35, -0.32]].forEach((p) => {
  const w = mesh(cyl(0.18, 0.18, 0.16, 12), dark, { name: 'cekici_teker' });
  w.rotation.x = Math.PI / 2; w.position.set(p[0], 0.18, p[1]); tugG.add(w);
});
tugG.position.set(3.2, 0, 2.8);
tugG.rotation.y = -0.4;
modelGroup.add(tugG);
