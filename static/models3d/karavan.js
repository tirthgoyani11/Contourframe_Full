// Karavan / kamp minibüsü (VW-combi tarzı). Ön +x, yukarı +y.
const teal = '#1f9bb0', white = '#f2f2f2', glass = '#2b3238', tire = '#1a1c1f';
const hub = '#c7ccd0', chrome = '#c7ccd0', headl = '#ffe9a0', rack = '#3a3d40';
const board = '#e6603a', boardS = '#f2f2f2';
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);
function tri(a, b, c, color, name) {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute([a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]], 3));
  g.computeVertexNormals();
  const m = mesh(g, color, { flat: true, name: name });
  m.material.side = THREE.DoubleSide; return m;
}

// ---- tekerler ----
function wheel(x, z, i) {
  const t = mesh(cyl(0.34, 0.34, 0.24, 18), tire, { flat: false, rough: 0.9, name: 'teker_' + i });
  t.rotation.x = Math.PI / 2; t.position.set(x, 0.34, z); modelGroup.add(t);
  const hc = mesh(cyl(0.16, 0.16, 0.26, 12), hub, { metal: 0.5, rough: 0.4, name: 'jant_' + i });
  hc.rotation.x = Math.PI / 2; hc.position.set(x, 0.34, z); modelGroup.add(hc);
}
wheel(1.05, 0.82, 1); wheel(1.05, -0.82, 2); wheel(-1.05, 0.82, 3); wheel(-1.05, -0.82, 4);

// ---- gövde (iki renkli) ----
const lower = mesh(box(3.3, 0.72, 1.62), teal, { flat: true, rough: 0.5, name: 'alt_govde' });
lower.position.set(0, 0.82, 0); modelGroup.add(lower);
const upper = mesh(box(3.24, 0.72, 1.58), white, { flat: true, rough: 0.5, name: 'ust_govde' });
upper.position.set(0, 1.5, 0); modelGroup.add(upper);
// çatı (hafif yuvarlatma izlenimi)
const roof = mesh(box(3.0, 0.12, 1.46), white, { flat: true, name: 'cati' });
roof.position.set(0, 1.9, 0); modelGroup.add(roof);

// ---- ön yüz: bölünmüş cam + farlar + V amblem + tampon ----
[0.34, -0.34].forEach((z, i) => {
  const ws = mesh(box(0.08, 0.5, 0.62), glass, { flat: true, rough: 0.1, metal: 0.2, name: 'on_cam_' + (i + 1) });
  ws.rotation.z = -0.12; ws.position.set(1.62, 1.5, z); modelGroup.add(ws);
});
const pillar = mesh(box(0.1, 0.52, 0.08), white, { flat: true, name: 'on_orta_direk' });
pillar.rotation.z = -0.12; pillar.position.set(1.62, 1.5, 0); modelGroup.add(pillar);
[0.45, -0.45].forEach((z, i) => {
  const hl = mesh(cyl(0.13, 0.13, 0.1, 14), headl, { flat: false, rough: 0.3, name: 'far_' + (i + 1) });
  hl.rotation.z = Math.PI / 2; hl.position.set(1.67, 1.02, z); modelGroup.add(hl);
});
// V amblem (ön-üst, turkuaz iki kol)
[1, -1].forEach((s) => {
  const arm = mesh(box(0.07, 0.46, 0.08), teal, { flat: true, name: 'amblem' });
  arm.rotation.x = s * 0.45; arm.position.set(1.66, 1.42, s * 0.14); modelGroup.add(arm);
});
const fBump = mesh(box(0.14, 0.14, 1.5), chrome, { metal: 0.6, rough: 0.3, name: 'on_tampon' });
fBump.position.set(1.69, 0.66, 0); modelGroup.add(fBump);
const rBump = mesh(box(0.14, 0.14, 1.5), chrome, { metal: 0.6, rough: 0.3, name: 'arka_tampon' });
rBump.position.set(-1.69, 0.66, 0); modelGroup.add(rBump);

// ---- yan + arka camlar, kapı ----
[0.81, -0.81].forEach((z, i) => {
  const w1 = mesh(box(1.0, 0.42, 0.05), glass, { flat: true, rough: 0.1, name: 'yan_cam_' + (i + 1) });
  w1.position.set(0.25, 1.52, z); modelGroup.add(w1);
  const seam = mesh(box(0.03, 0.66, 0.04), '#9aa0a6', { name: 'kapi_kenar_' + (i + 1) });
  seam.position.set(-0.55, 1.15, z); modelGroup.add(seam);
  const handle = mesh(box(0.12, 0.05, 0.05), chrome, { metal: 0.5, name: 'kapi_kolu_' + (i + 1) });
  handle.position.set(-0.2, 1.1, z); modelGroup.add(handle);
});
const rearW = mesh(box(0.05, 0.4, 1.0), glass, { flat: true, rough: 0.1, name: 'arka_cam' });
rearW.position.set(-1.63, 1.52, 0); modelGroup.add(rearW);

// ---- çatı portu + sörf tahtası ----
[0.5, -0.5].forEach((z, i) => {
  const rail = mesh(box(2.6, 0.05, 0.06), rack, { name: 'port_ray_' + (i + 1) });
  rail.position.set(-0.1, 1.99, z); modelGroup.add(rail);
});
[-1.0, 0.3, 1.3].forEach((x, i) => {
  const bar = mesh(box(0.06, 0.05, 1.1), rack, { name: 'port_capraz_' + (i + 1) });
  bar.position.set(x, 1.99, 0); modelGroup.add(bar);
});
const surf = mesh(box(2.3, 0.09, 0.36), board, { flat: false, rough: 0.5, name: 'sorf_tahtasi' });
surf.position.set(-0.1, 2.06, 0.1); modelGroup.add(surf);
const surfTip = mesh(cyl(0.02, 0.18, 0.4, 3), board, { flat: true, name: 'sorf_burun' });
surfTip.rotation.z = -Math.PI / 2; surfTip.rotation.y = Math.PI; surfTip.position.set(1.18, 2.06, 0.1); modelGroup.add(surfTip);
const surfStripe = mesh(box(2.3, 0.1, 0.06), boardS, { name: 'sorf_serit' });
surfStripe.position.set(-0.1, 2.06, 0.1); modelGroup.add(surfStripe);

// ---- açık yan çadır / tente (+z) ----
const inZ = 0.83, outZ = 2.65, inY = 1.88, outY = 1.42, ax0 = -1.3, ax1 = 1.3;
const tentA = '#1f9bb0', tentB = '#f2f2f2', pole = '#9aa0a6';
// zemin matı
const mat = mesh(box(ax1 - ax0 + 0.1, 0.03, outZ - inZ), '#15727f', { flat: true, name: 'tente_zemin' });
mat.position.set((ax0 + ax1) / 2, 0.02, (inZ + outZ) / 2); modelGroup.add(mat);
// tente çatısı (şeritli, eğimli)
const NW = 8, wstep = (ax1 - ax0) / NW;
const depth = Math.hypot(outZ - inZ, inY - outY), ang = Math.atan2(inY - outY, outZ - inZ);
for (let i = 0; i < NW; i++) {
  const cx = ax0 + (i + 0.5) * wstep;
  const strip = mesh(box(wstep + 0.006, 0.04, depth), i % 2 ? tentA : tentB, { flat: true, name: 'tente_serit_' + (i + 1) });
  strip.rotation.x = ang; strip.position.set(cx, (inY + outY) / 2, (inZ + outZ) / 2); modelGroup.add(strip);
}
// dış destek direkleri + ön ray
[ax0 + 0.12, ax1 - 0.12].forEach((x, i) => {
  const pl = mesh(cyl(0.03, 0.03, outY, 8), pole, { metal: 0.4, name: 'tente_direk_' + (i + 1) });
  pl.position.set(x, outY / 2, outZ - 0.05); modelGroup.add(pl);
});
const frail = mesh(box(ax1 - ax0 + 0.24, 0.04, 0.04), pole, { metal: 0.4, name: 'tente_on_ray' });
frail.position.set((ax0 + ax1) / 2, outY - 0.02, outZ - 0.05); modelGroup.add(frail);
// (yanlar açık — gölgelik/tente; duvar yok)

