// Askeri üs dioraması — giriş +z tarafta.
const ground = '#6b6048', wall = '#7a7560', bld = '#6e6a4e', roof = '#44472f', tower = '#5e5a44';
const doorC = '#2e2a1c', glass = '#1a2026', flagCloth = '#b23a2e', pole = '#9aa0a6';
const sand = '#8a7d58', tent = '#566436', pad = '#3a3d36', white = '#dcdfe2', barrier = '#c23a2e';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 10);

// ---- zemin ----
const base = mesh(box(16, 0.1, 14), ground, { flat: true, rough: 1, name: 'zemin' });
base.position.set(0, 0.05, 0);
modelGroup.add(base);

// ---- çevre duvarı (önde kapı boşluğu) ----
const WT = 0.3, WH = 1.0, wy = 0.6;
function wallSeg(w, d, x, z, name) {
  const m = mesh(box(w, WH, d), wall, { flat: true, rough: 0.9, name: name });
  m.position.set(x, wy, z); modelGroup.add(m);
}
wallSeg(15, WT, 0, -6.8, 'arka_duvar');
wallSeg(5.5, WT, -4.6, 6.8, 'on_duvar_sol');
wallSeg(5.5, WT, 4.6, 6.8, 'on_duvar_sag');
wallSeg(WT, 13.6, -7.4, 0, 'sol_duvar');
wallSeg(WT, 13.6, 7.4, 0, 'sag_duvar');

// ---- gözetleme kuleleri (4 köşe) ----
function watchtower(px, pz, idx) {
  const g = new THREE.Group();
  [[0.5, 0.5], [0.5, -0.5], [-0.5, 0.5], [-0.5, -0.5]].forEach((p) => {
    const leg = mesh(box(0.12, 2.3, 0.12), tower, { name: 'kule_ayak' });
    leg.position.set(p[0], 1.15, p[1]); g.add(leg);
  });
  const plat = mesh(box(1.5, 0.14, 1.5), tower, { flat: true, name: 'kule_platform' });
  plat.position.set(0, 2.3, 0); g.add(plat);
  const cabin = mesh(box(1.3, 0.85, 1.3), tower, { flat: true, name: 'kule_kabin' });
  cabin.position.set(0, 2.8, 0); g.add(cabin);
  const cw = mesh(box(1.34, 0.3, 1.34), glass, { name: 'kule_cam' });
  cw.position.set(0, 2.9, 0); g.add(cw);
  const rf = mesh(box(1.6, 0.12, 1.6), roof, { flat: true, name: 'kule_cati' });
  rf.position.set(0, 3.28, 0); g.add(rf);
  g.position.set(px, 0, pz);
  modelGroup.add(g);
}
watchtower(-7.0, -6.4, 1);
watchtower(7.0, -6.4, 2);
watchtower(-7.0, 6.4, 3);
watchtower(7.0, 6.4, 4);

// ---- bina yardımcı ----
function building(px, pz, w, d, h, name) {
  const m = mesh(box(w, h, d), bld, { flat: true, rough: 0.85, name: name });
  m.position.set(px, h / 2 + 0.1, pz); modelGroup.add(m);
  const rf = mesh(box(w + 0.2, 0.16, d + 0.2), roof, { flat: true, name: name + '_cati' });
  rf.position.set(px, h + 0.1, pz); modelGroup.add(rf);
  const door = mesh(box(0.08, 0.7, 0.5), doorC, { name: name + '_kapi' });
  door.position.set(px + w / 2, 0.45, pz); modelGroup.add(door);
  const nWin = Math.max(2, Math.floor(w / 1.2));
  for (let i = 0; i < nWin; i++) {
    const win = mesh(box(0.4, 0.4, 0.06), glass, { name: name + '_pencere' });
    win.position.set(px - w / 2 + 0.8 + i * (w - 1.2) / (nWin - 1), h * 0.55 + 0.1, pz + d / 2);
    modelGroup.add(win);
  }
}
// karargâh (2 katlı, büyük) + 2 kışla
building(-3.5, -2.5, 3.0, 2.2, 2.4, 'karargah');
building(3.5, -3.5, 4.0, 1.6, 1.5, 'kisla_1');
building(3.5, -1.0, 4.0, 1.6, 1.5, 'kisla_2');

// ---- giriş kapısı + bom bariyer + nöbet kulübesi ----
[-1.6, 1.6].forEach((x, i) => {
  const pillar = mesh(box(0.4, 1.6, 0.4), wall, { flat: true, name: 'kapi_direk_' + (i + 1) });
  pillar.position.set(x, 0.9, 6.8); modelGroup.add(pillar);
});
const boom = mesh(box(2.6, 0.12, 0.12), barrier, { name: 'bom_bariyer' });
boom.rotation.z = 0.5; // kalkık
boom.position.set(-0.2, 1.5, 6.8); modelGroup.add(boom);
const booth = mesh(box(0.7, 1.2, 0.7), bld, { flat: true, name: 'nobet_kulubesi' });
booth.position.set(2.4, 0.7, 6.4); modelGroup.add(booth);
const boothW = mesh(box(0.72, 0.4, 0.4), glass, { name: 'kulube_cam' });
boothW.position.set(2.4, 0.95, 6.05); modelGroup.add(boothW);

// ---- bayrak direği ----
const fp = mesh(cyl(0.06, 0.06, 3.2, 8), pole, { metal: 0.4, name: 'bayrak_diregi' });
fp.position.set(-0.5, 1.6, 1.5); modelGroup.add(fp);
const flag = mesh(box(0.04, 0.55, 0.95), flagCloth, { flat: true, name: 'bayrak' });
flag.position.set(-0.5, 2.9, 0.99); modelGroup.add(flag);

// ---- helipad ----
const helipad = mesh(cyl(1.4, 1.4, 0.05, 24), pad, { flat: true, name: 'helipad' });
helipad.position.set(-4.5, 0.13, 3.5); modelGroup.add(helipad);
const ring = mesh(new THREE.TorusGeometry(1.05, 0.06, 8, 24), white, { name: 'helipad_halka' });
ring.rotation.x = Math.PI / 2; ring.position.set(-4.5, 0.17, 3.5); modelGroup.add(ring);
// H harfi
[[-0.3, 0.18, 0.7], [0.3, 0.18, 0.7], [0, 0.5, 0.18]].forEach((s, i) => {
  const bar = mesh(box(s[1], 0.03, s[2]), white, { name: 'H_' + (i + 1) });
  bar.position.set(-4.5 + s[0], 0.18, 3.5); modelGroup.add(bar);
});

// ---- çadırlar ----
function tentObj(px, pz, idx) {
  // üçgen prizma çadır — tabanı yere oturur
  const W = 0.7, H = 0.85, L = 1.8;
  const sh = new THREE.Shape();
  sh.moveTo(-W, 0); sh.lineTo(W, 0); sh.lineTo(0, H); sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth: L, bevelEnabled: false, steps: 1 });
  g.translate(0, 0, -L / 2);
  const m = mesh(g, tent, { flat: true, rough: 0.85, name: 'cadir_' + idx });
  m.rotation.y = Math.PI / 2; // uzunluk x boyunca
  m.position.set(px, 0.1, pz);
  modelGroup.add(m);
  const flap = mesh(box(0.04, 0.5, 0.5), '#2e3320', { flat: true, name: 'cadir_kapi_' + idx });
  flap.position.set(px + L / 2 - 0.02, 0.35, pz);
  modelGroup.add(flap);
}
tentObj(2.2, 3.5, 1);
tentObj(3.6, 3.5, 2);

// ---- kum torbası mevzi (giriş yanı) ----
for (let i = 0; i < 3; i++) {
  const sb = mesh(box(1.0, 0.5, 0.4), sand, { flat: true, name: 'kum_torbasi_' + (i + 1) });
  sb.position.set(-3.2, 0.35, 5.4 + i * 0.45);
  modelGroup.add(sb);
}

// ---- girişte nöbetçi askerler ----
function guard(px, pz, ry) {
  const g = new THREE.Group();
  const uni = '#566436', helm = '#4a5330', sk = '#caa074', rf = '#1c1c1f', bt = '#241f18';
  [-1, 1].forEach((s) => {
    const leg = mesh(box(0.13, 0.6, 0.14), uni, { flat: true, name: 'asker_bacak' });
    leg.position.set(0, 0.3, s * 0.1); g.add(leg);
    const b = mesh(box(0.18, 0.1, 0.16), bt, { flat: true, name: 'asker_postal' });
    b.position.set(0.03, 0.05, s * 0.1); g.add(b);
  });
  const torso = mesh(box(0.3, 0.45, 0.36), uni, { flat: true, name: 'asker_govde' }); torso.position.set(0, 0.82, 0); g.add(torso);
  const head = mesh(box(0.17, 0.17, 0.17), sk, { flat: true, name: 'asker_kafa' }); head.position.set(0.01, 1.12, 0); g.add(head);
  const hm = mesh(new THREE.SphereGeometry(0.13, 10, 8), helm, { flat: true, name: 'asker_kask' }); hm.scale.set(1, 0.8, 1); hm.position.set(0, 1.2, 0); g.add(hm);
  const gun = mesh(box(0.06, 0.55, 0.05), rf, { flat: true, name: 'asker_tufek' }); gun.position.set(0.16, 0.85, 0.13); g.add(gun);
  g.position.set(px, 0.1, pz); g.rotation.y = ry;
  modelGroup.add(g);
}
guard(-1.05, 6.0, -Math.PI / 2); // kapı solu, dışa bakar
guard(1.05, 6.0, -Math.PI / 2);  // kapı sağı

// ---- araçlar (motor havuzu) ----
function truck(px, pz, ry) {
  const g = new THREE.Group();
  const c = '#4a5232', tireC = '#1b1b1e';
  const cab = mesh(box(0.9, 0.8, 1.0), c, { flat: true, name: 'kamyon_kabin' }); cab.position.set(1.0, 0.75, 0); g.add(cab);
  const cw = mesh(box(0.05, 0.4, 0.9), '#1a2026', { name: 'kamyon_cam' }); cw.position.set(1.46, 0.85, 0); g.add(cw);
  const cargo = mesh(box(2.0, 0.85, 1.1), c, { flat: true, name: 'kamyon_kasa' }); cargo.position.set(-0.6, 0.78, 0); g.add(cargo);
  const canvasTop = mesh(box(2.0, 0.5, 1.16), '#6b6048', { flat: true, name: 'branda' }); canvasTop.position.set(-0.6, 1.4, 0); g.add(canvasTop);
  [[1.0, 0.55], [1.0, -0.55], [-0.4, 0.55], [-0.4, -0.55], [-1.2, 0.55], [-1.2, -0.55]].forEach((p) => {
    const w = mesh(cyl(0.28, 0.28, 0.2, 12), tireC, { name: 'kamyon_teker' }); w.rotation.x = Math.PI / 2; w.position.set(p[0], 0.28, p[1]); g.add(w);
  });
  g.position.set(px, 0.1, pz); g.rotation.y = ry;
  modelGroup.add(g);
}
function jeep(px, pz, ry) {
  const g = new THREE.Group();
  const c = '#566436', tireC = '#1b1b1e';
  const body = mesh(box(1.6, 0.4, 0.9), c, { flat: true, name: 'jip_govde' }); body.position.set(0, 0.5, 0); g.add(body);
  const hood = mesh(box(0.5, 0.3, 0.85), c, { flat: true, name: 'jip_kaput' }); hood.position.set(0.75, 0.5, 0); g.add(hood);
  const ws2 = mesh(box(0.05, 0.3, 0.8), '#9fb6bc', { name: 'jip_cam' }); ws2.rotation.z = 0.25; ws2.position.set(0.35, 0.78, 0); g.add(ws2);
  [[0.55, 0.5], [0.55, -0.5], [-0.55, 0.5], [-0.55, -0.5]].forEach((p) => {
    const w = mesh(cyl(0.24, 0.24, 0.16, 12), tireC, { name: 'jip_teker' }); w.rotation.x = Math.PI / 2; w.position.set(p[0], 0.24, p[1]); g.add(w);
  });
  g.position.set(px, 0.1, pz); g.rotation.y = ry;
  modelGroup.add(g);
}
truck(2.6, 1.6, 0.2);
jeep(0.9, 4.8, -0.3);
