// Liman / deniz üssü — deniz -z tarafta, rıhtım +z tarafta.
const water = '#2a5a72', quay = '#6b6f73', pier = '#7c8084', shipC = '#6b7780', shipRed = '#6e2b25';
const sup = '#7c8189', crane = '#b23a2e', beam = '#8a8f96', warehouse = '#8a8578', dark = '#2a2d31';
const cont = ['#b23a2e', '#2a6a8a', '#4a8a4a', '#d2a93a'], rock = '#54503f', white = '#dcdfe2', metal = '#9aa0a6';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 12);

// ---- deniz + rıhtım ----
const sea = mesh(box(18, 0.1, 9.5), water, { flat: true, rough: 0.3, metal: 0.15, name: 'deniz' });
sea.position.set(0, 0.05, -2.4);
modelGroup.add(sea);
const dock = mesh(box(18, 0.14, 5, 1), quay, { flat: true, rough: 0.95, name: 'rihtim' });
dock.position.set(0, 0.07, 4.8);
modelGroup.add(dock);

// ---- iskeleler ----
[-4, 4].forEach((x, i) => {
  const p = mesh(box(1.8, 0.18, 5.5), pier, { flat: true, rough: 0.9, name: 'iskele_' + (i + 1) });
  p.position.set(x, 0.12, -0.5);
  modelGroup.add(p);
});

// ---- liman vinçleri (jib su üstüne) ----
function portCrane(px, idx) {
  const g = new THREE.Group();
  [[-1, -0.7], [1, -0.7], [-1, 0.7], [1, 0.7]].forEach((p) => {
    const leg = mesh(box(0.2, 3.4, 0.2), beam, { flat: true, name: 'vinc_ayak' });
    leg.position.set(p[0], 1.7, p[1]); g.add(leg);
  });
  // üst çerçeve: ayakların üstüne oturan yan kirişler + çapraz bağlar (artık havada kalmaz)
  [-0.7, 0.7].forEach((z, i) => {
    const sb = mesh(box(2.4, 0.32, 0.32), crane, { flat: true, name: 'vinc_kiris_' + (i + 1) });
    sb.position.set(0, 3.45, z); g.add(sb);
  });
  [-1, 1].forEach((x, i) => {
    const cb = mesh(box(0.3, 0.3, 1.7), crane, { flat: true, name: 'vinc_capraz_' + (i + 1) });
    cb.position.set(x, 3.45, 0); g.add(cb);
  });
  const tower = mesh(box(0.5, 1.9, 0.5), crane, { flat: true, name: 'vinc_kule' });
  tower.position.set(0, 4.55, 0); g.add(tower);
  // jib tek parça, kuleden geçer (su üstü -z + arka denge +z)
  const jib = mesh(box(0.32, 0.3, 6.6), beam, { flat: true, name: 'vinc_kol' });
  jib.position.set(0, 5.35, -1.0); g.add(jib);
  const cw = mesh(box(0.5, 0.45, 0.6), dark, { name: 'vinc_agirlik' });
  cw.position.set(0, 5.35, 2.1); g.add(cw);
  const trolley = mesh(box(0.35, 0.22, 0.35), dark, { name: 'vinc_araba' });
  trolley.position.set(0, 5.15, -3.6); g.add(trolley);
  const cable = mesh(cyl(0.02, 0.02, 2.3, 6), dark, { name: 'halat' });
  cable.position.set(0, 3.95, -3.6); g.add(cable);
  const hook = mesh(box(0.35, 0.35, 0.5), '#444', { name: 'kanca_yuk' });
  hook.position.set(0, 2.75, -3.6); g.add(hook);
  g.position.set(px, 0.14, 2.0);
  modelGroup.add(g);
}
portCrane(-4, 1);
portCrane(4, 2);

// ---- yanaşmış gemiler ----
// pruva kaması: gövde önünden (x0) öne doğru uca daralan üçgen, gövde yüksekliğinde
function bowWedge(g, x0, y0, bl, W, H, color, name) {
  const s = new THREE.Shape();
  s.moveTo(0, W / 2); s.lineTo(bl, 0); s.lineTo(0, -W / 2); s.closePath();
  const geo = new THREE.ExtrudeGeometry(s, { depth: H, bevelEnabled: false, steps: 1 });
  const m = mesh(geo, color, { flat: true, name: name });
  m.rotation.x = -Math.PI / 2;
  m.position.set(x0, y0, 0);
  g.add(m);
}
function ship(px, pz, len, ry, idx) {
  const g = new THREE.Group();
  const red = mesh(box(len, 0.22, 1.2), shipRed, { flat: true, name: 'gemi' + idx + '_suhatti' });
  red.position.set(0, 0.18, 0); g.add(red);
  const hull = mesh(box(len, 0.5, 1.15), shipC, { flat: true, name: 'gemi' + idx + '_govde' });
  hull.position.set(0, 0.52, 0); g.add(hull);
  // pruva (gövde önüne oturur): su hattı (kırmızı) + gövde (gri) kamaları
  bowWedge(g, len / 2, 0.07, 0.85, 1.2, 0.22, shipRed, 'gemi' + idx + '_pruva_su');
  bowWedge(g, len / 2, 0.27, 1.0, 1.15, 0.5, shipC, 'gemi' + idx + '_pruva');
  const s1 = mesh(box(len * 0.32, 0.55, 0.85), sup, { flat: true, name: 'gemi' + idx + '_ust' });
  s1.position.set(-len * 0.12, 0.98, 0); g.add(s1);
  const s2 = mesh(box(len * 0.18, 0.4, 0.65), sup, { flat: true, name: 'gemi' + idx + '_kopru' });
  s2.position.set(-len * 0.06, 1.4, 0); g.add(s2);
  const funnel = mesh(box(0.4, 0.5, 0.45), '#5a5e60', { flat: true, name: 'gemi' + idx + '_baca' });
  funnel.position.set(-len * 0.22, 1.15, 0); g.add(funnel);
  const mast = mesh(cyl(0.04, 0.04, 1.0, 6), dark, { name: 'gemi' + idx + '_direk' });
  mast.position.set(-len * 0.02, 1.85, 0); g.add(mast);
  g.position.set(px, 0.15, pz);
  g.rotation.y = ry;
  modelGroup.add(g);
}
ship(-2.4, -0.5, 5.0, Math.PI / 2, 1);
ship(2.4, -0.8, 4.4, Math.PI / 2, 2);

// ---- antrepolar ----
[-3.5, 3.5].forEach((x, i) => {
  const wh = mesh(box(3.2, 1.6, 2.2), warehouse, { flat: true, rough: 0.9, name: 'antrepo_' + (i + 1) });
  wh.position.set(x, 0.94, 5.6);
  modelGroup.add(wh);
  const roof = mesh(box(3.4, 0.16, 2.4), '#5a5648', { flat: true, name: 'antrepo_cati_' + (i + 1) });
  roof.position.set(x, 1.78, 5.6);
  modelGroup.add(roof);
});

// ---- konteyner istifi ----
let ci = 0;
for (let r = 0; r < 3; r++) {
  for (let h = 0; h < 2; h++) {
    const c = mesh(box(1.4, 0.6, 0.7), cont[(r + h) % cont.length], { flat: true, name: 'konteyner_' + (++ci) });
    c.position.set(-0.3 + r * 0.0, 0.44 + h * 0.62, 4.0 + r * 0.75);
    c.position.set(0.2, 0.44 + h * 0.62, 3.3 + r * 0.75);
    modelGroup.add(c);
  }
}

// ---- babalar (bollard) ----
[-6, -2, 2, 6].forEach((x, i) => {
  const b = mesh(cyl(0.12, 0.15, 0.4, 10), dark, { name: 'baba_' + (i + 1) });
  b.position.set(x, 0.27, 2.2);
  modelGroup.add(b);
});

// ---- dalgakıran + fener ----
for (let i = 0; i < 9; i++) {
  const rk = mesh(cyl(0.5, 0.7, 0.7, 5), rock, { flat: true, name: 'dalgakiran' });
  rk.rotation.y = i * 0.7;
  rk.position.set(-7 + i * 1.7, 0.32, -6.6);
  modelGroup.add(rk);
}
const fenerBase = mesh(cyl(0.35, 0.45, 1.6, 12), white, { flat: true, name: 'fener_govde' });
fenerBase.position.set(7.5, 0.9, -6.6);
modelGroup.add(fenerBase);
const fenerBand = mesh(cyl(0.37, 0.37, 0.4, 12), crane, { name: 'fener_serit' });
fenerBand.position.set(7.5, 1.1, -6.6);
modelGroup.add(fenerBand);
const fenerTop = mesh(cyl(0.28, 0.28, 0.35, 10), '#ffe08a', { rough: 0.3, name: 'fener_lamba' });
fenerTop.position.set(7.5, 1.9, -6.6);
modelGroup.add(fenerTop);
