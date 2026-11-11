// Kontrol noktası — yol +x boyunca, trafik -x'ten gelir.
const dirt = '#6b6048', road = '#393d42', jersey = '#9a9a96', white = '#dcdfe2';
const boothC = '#6e6a4e', glass = '#1a2026', towerC = '#5e5a44', sand = '#8a7d58';
const red = '#c23a2e', metal = '#9aa0a6', wire = '#8d9298', gun = '#26282c', flagCloth = '#b23a2e';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 10);

// ---- zemin + yol ----
const base = mesh(box(16, 0.1, 9), dirt, { flat: true, rough: 1, name: 'zemin' });
base.position.set(0, 0.05, 0);
modelGroup.add(base);
const asphalt = mesh(box(16, 0.12, 3.2), road, { flat: true, rough: 0.95, name: 'yol' });
asphalt.position.set(0, 0.12, 0);
modelGroup.add(asphalt);
for (let i = 0; i < 7; i++) {
  const d = mesh(box(0.8, 0.02, 0.15), white, { name: 'yol_cizgi' });
  d.position.set(-6 + i * 2, 0.19, 0);
  modelGroup.add(d);
}

// ---- jersey bariyerler (zikzak) ----
function jerseyBar(px, pz, name) {
  const b = mesh(cyl(0.45, 0.7, 0.85, 4), jersey, { flat: true, name: name });
  b.rotation.y = Math.PI / 4;
  b.scale.set(1, 1, 2.2);
  b.position.set(px, 0.52, pz);
  modelGroup.add(b);
}
jerseyBar(-2.5, 0.7, 'jersey_1');
jerseyBar(0.0, -0.7, 'jersey_2');
jerseyBar(2.5, 0.7, 'jersey_3');

// ---- kapalı bom bariyer ----
function boom(px) {
  const post = mesh(box(0.25, 1.3, 0.25), white, { flat: true, name: 'bariyer_direk' });
  post.position.set(px, 0.65, 1.9); modelGroup.add(post);
  const cw = mesh(box(0.3, 0.3, 0.35), gun, { name: 'bariyer_agirlik' });
  cw.position.set(px, 1.05, 2.15); modelGroup.add(cw);
  for (let k = 0; k < 3; k++) {
    const seg = mesh(box(0.14, 0.14, 1.15), k % 2 === 0 ? red : white, { name: 'bariyer_kol_' + (k + 1) });
    seg.position.set(px, 1.05, 1.6 - k * 1.15);
    modelGroup.add(seg);
  }
}
boom(-4.8);

// ---- nöbet kulübesi ----
const booth = mesh(box(1.0, 1.4, 1.0), boothC, { flat: true, name: 'nobet_kulubesi' });
booth.position.set(-4.8, 0.8, 2.7); modelGroup.add(booth);
const boothW = mesh(box(1.02, 0.5, 0.6), glass, { name: 'kulube_cam' });
boothW.position.set(-4.8, 1.05, 2.35); modelGroup.add(boothW);
const boothRoof = mesh(box(1.2, 0.12, 1.2), towerC, { flat: true, name: 'kulube_cati' });
boothRoof.position.set(-4.8, 1.55, 2.7); modelGroup.add(boothRoof);

// ---- gözetleme kulesi ----
const tg = new THREE.Group();
[[0.45, 0.45], [0.45, -0.45], [-0.45, 0.45], [-0.45, -0.45]].forEach((p) => {
  const leg = mesh(box(0.1, 2.2, 0.1), towerC, { name: 'kule_ayak' }); leg.position.set(p[0], 1.1, p[1]); tg.add(leg);
});
const plat = mesh(box(1.4, 0.14, 1.4), towerC, { flat: true, name: 'kule_platform' }); plat.position.set(0, 2.2, 0); tg.add(plat);
const cabin = mesh(box(1.2, 0.8, 1.2), towerC, { flat: true, name: 'kule_kabin' }); cabin.position.set(0, 2.65, 0); tg.add(cabin);
const cwn = mesh(box(1.24, 0.3, 1.24), glass, { name: 'kule_cam' }); cwn.position.set(0, 2.75, 0); tg.add(cwn);
const rf = mesh(box(1.5, 0.12, 1.5), towerC, { flat: true, name: 'kule_cati' }); rf.position.set(0, 3.1, 0); tg.add(rf);
tg.position.set(5.3, 0, -2.6); modelGroup.add(tg);

// ---- kum torbası makineli mevzi ----
const bunker = new THREE.Group();
[[0, 0.5, 1.4, 0.3], [-0.6, -0.05, 0.3, 1.0], [0.6, -0.05, 0.3, 1.0]].forEach((s) => {
  const w = mesh(box(s[2], 0.55, s[3]), sand, { flat: true, name: 'mevzi_torba' });
  w.position.set(s[0], 0.375, s[1]); bunker.add(w); // tabanı zeminde (grup y=0)
});
// makineli: pintle + gövde + namlu + dipçik
const pintle = mesh(cyl(0.045, 0.05, 0.65, 8), gun, { metal: 0.4, name: 'mevzi_pintle' });
pintle.position.set(0, 0.42, 0.3); bunker.add(pintle);
const recv = mesh(box(0.42, 0.16, 0.17), gun, { flat: true, name: 'mevzi_govde' });
recv.position.set(0, 0.76, 0.32); bunker.add(recv);
const mgb = mesh(cyl(0.04, 0.04, 0.75, 8), gun, { metal: 0.4, name: 'mevzi_namlu' });
mgb.rotation.x = Math.PI / 2; mgb.position.set(0, 0.78, 0.78); bunker.add(mgb);
const stock = mesh(box(0.22, 0.12, 0.12), gun, { flat: true, name: 'mevzi_dipcik' });
stock.position.set(0, 0.72, 0.08); bunker.add(stock);
bunker.position.set(-2.0, 0, -2.6); modelGroup.add(bunker);

// ---- STOP tabelası (gelen trafiğe bakar, -x) ----
const signPole = mesh(cyl(0.04, 0.04, 1.5, 8), metal, { name: 'tabela_direk' });
signPole.position.set(-6.8, 0.75, 1.5); modelGroup.add(signPole);
const sign = mesh(cyl(0.42, 0.42, 0.06, 8), red, { flat: true, name: 'stop_tabela' });
sign.rotation.z = Math.PI / 2; sign.position.set(-6.8, 1.45, 1.5); modelGroup.add(sign);
const signBar = mesh(box(0.04, 0.1, 0.5), white, { name: 'stop_yazi' });
signBar.position.set(-6.74, 1.45, 1.5); modelGroup.add(signBar);

// ---- concertina tel (yol kenarı) ----
[-1, 1].forEach((s) => {
  for (let i = 0; i < 5; i++) {
    const coil = mesh(new THREE.TorusGeometry(0.22, 0.04, 6, 12), wire, { metal: 0.5, name: 'concertina' });
    coil.rotation.y = Math.PI / 2;
    coil.position.set(-3.5 + i * 1.7, 0.25, s * 2.0);
    modelGroup.add(coil);
  }
});

// ---- durmuş jip (boom önünde bekler) ----
const jg = new THREE.Group();
const jb = mesh(box(1.7, 0.45, 0.95), '#556', { flat: true, name: 'jip_govde' }); jb.position.set(0, 0.5, 0);
jb.material.color.set('#4a5560'); jg.add(jb);
const jcab = mesh(box(0.9, 0.5, 0.85), '#4a5560', { flat: true, name: 'jip_kabin' }); jcab.position.set(-0.2, 0.95, 0); jg.add(jcab);
const jw = mesh(box(0.05, 0.35, 0.8), glass, { name: 'jip_cam' }); jw.position.set(0.28, 0.95, 0); jg.add(jw);
[[0.6, 0.55], [0.6, -0.55], [-0.6, 0.55], [-0.6, -0.55]].forEach((p) => {
  const w = mesh(cyl(0.26, 0.26, 0.18, 12), '#1b1b1e', { name: 'jip_teker' }); w.rotation.x = Math.PI / 2; w.position.set(p[0], 0.26, p[1]); jg.add(w);
});
jg.position.set(-6.6, 0.1, 0); modelGroup.add(jg);

// ---- nöbetçi askerler ----
function guard(px, pz, ry) {
  const g = new THREE.Group();
  const uni = '#566436', helm = '#4a5330', sk = '#caa074', rf = '#1c1c1f', bt = '#241f18';
  [-1, 1].forEach((s) => {
    const leg = mesh(box(0.13, 0.6, 0.14), uni, { flat: true, name: 'asker_bacak' }); leg.position.set(0, 0.3, s * 0.1); g.add(leg);
    const b = mesh(box(0.18, 0.1, 0.16), bt, { flat: true, name: 'asker_postal' }); b.position.set(0.03, 0.05, s * 0.1); g.add(b);
  });
  const torso = mesh(box(0.3, 0.45, 0.36), uni, { flat: true, name: 'asker_govde' }); torso.position.set(0, 0.82, 0); g.add(torso);
  const head = mesh(box(0.17, 0.17, 0.17), sk, { flat: true, name: 'asker_kafa' }); head.position.set(0.01, 1.12, 0); g.add(head);
  const hm = mesh(new THREE.SphereGeometry(0.13, 10, 8), helm, { flat: true, name: 'asker_kask' }); hm.scale.set(1, 0.8, 1); hm.position.set(0, 1.2, 0); g.add(hm);
  const gun2 = mesh(box(0.45, 0.07, 0.05), rf, { flat: true, name: 'asker_tufek' }); gun2.position.set(0.32, 0.95, 0.1); g.add(gun2);
  g.position.set(px, 0.1, pz); g.rotation.y = ry; modelGroup.add(g);
}
guard(-5.3, 0.9, Math.PI);   // jipi kontrol eder (-x'e bakar)
guard(-4.6, -1.0, Math.PI);  // yol kenarı

// ---- bayrak ----
const fp = mesh(cyl(0.05, 0.05, 2.6, 8), metal, { metal: 0.4, name: 'bayrak_diregi' });
fp.position.set(-5.6, 1.4, 3.3); modelGroup.add(fp);
const flag = mesh(box(0.04, 0.45, 0.75), flagCloth, { flat: true, name: 'bayrak' });
flag.position.set(-5.6, 2.4, 0.41 + 3.3 - 3.3); flag.position.set(-5.6, 2.4, 3.7); modelGroup.add(flag);
