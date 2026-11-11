// Çekmeli karavan — önde (küçük) SUV, arkada (büyük) karavan römork. Ön (sürüş yönü) +x.
const carC = '#2f6db0', glass = '#2b3238', tire = '#1a1c1f', hub = '#c7ccd0';
const chrome = '#c7ccd0', headl = '#ffe9a0', tail = '#d8392f';
const cream = '#ede3c8', stripe = '#1f9bb0', doorC = '#dcd2b2', drawC = '#3a3d40';
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);
function wheel(x, z, r, i) {
  const t = mesh(cyl(r, r, 0.22, 18), tire, { flat: false, rough: 0.9, name: 'teker_' + i });
  t.rotation.x = Math.PI / 2; t.position.set(x, r, z); modelGroup.add(t);
  const hc = mesh(cyl(r * 0.5, r * 0.5, 0.24, 12), hub, { metal: 0.5, rough: 0.4, name: 'jant_' + i });
  hc.rotation.x = Math.PI / 2; hc.position.set(x, r, z); modelGroup.add(hc);
}
function rod(p1, p2, r, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]), b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), 8), color, { metal: 0.3, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}

// ================= ÇEKEN ARAÇ (küçük SUV) =================
const CX = 2.4;
const body = mesh(box(2.6, 0.66, 1.4), carC, { flat: true, rough: 0.5, name: 'arac_govde' });
body.position.set(CX, 0.74, 0); modelGroup.add(body);
const cabin = mesh(box(1.5, 0.56, 1.32), carC, { flat: true, rough: 0.5, name: 'arac_kabin' });
cabin.position.set(CX - 0.25, 1.28, 0); modelGroup.add(cabin);
const wsf = mesh(box(0.1, 0.5, 1.22), glass, { flat: true, rough: 0.1, metal: 0.2, name: 'on_cam' });
wsf.rotation.z = -0.26; wsf.position.set(CX + 0.46, 1.26, 0); modelGroup.add(wsf);
const wsr = mesh(box(0.1, 0.44, 1.22), glass, { flat: true, rough: 0.1, name: 'arka_cam' });
wsr.rotation.z = 0.22; wsr.position.set(CX - 0.97, 1.28, 0); modelGroup.add(wsr);
[0.66, -0.66].forEach((z, i) => {
  const sw = mesh(box(1.18, 0.4, 0.04), glass, { flat: true, rough: 0.1, name: 'yan_cam_' + (i + 1) });
  sw.position.set(CX - 0.25, 1.29, z); modelGroup.add(sw);
});
[0.46, -0.46].forEach((z, i) => {
  const hl = mesh(cyl(0.11, 0.11, 0.1, 12), headl, { flat: false, rough: 0.3, name: 'far_' + (i + 1) });
  hl.rotation.z = Math.PI / 2; hl.position.set(CX + 1.32, 0.8, z); modelGroup.add(hl);
  const tl = mesh(box(0.06, 0.2, 0.22), tail, { flat: true, name: 'stop_' + (i + 1) });
  tl.position.set(CX - 1.32, 0.85, z); modelGroup.add(tl);
});
const grille = mesh(box(0.05, 0.2, 0.78), '#23262a', { flat: true, name: 'izgara' });
grille.position.set(CX + 1.33, 0.6, 0); modelGroup.add(grille);
const fbump = mesh(box(0.15, 0.15, 1.36), chrome, { metal: 0.6, rough: 0.3, name: 'on_tampon' });
fbump.position.set(CX + 1.34, 0.5, 0); modelGroup.add(fbump);
const rbump = mesh(box(0.15, 0.15, 1.36), chrome, { metal: 0.6, rough: 0.3, name: 'arka_tampon' });
rbump.position.set(CX - 1.34, 0.5, 0); modelGroup.add(rbump);
wheel(CX + 0.75, 0.72, 0.32, 1); wheel(CX + 0.75, -0.72, 0.32, 2);
wheel(CX - 0.7, 0.72, 0.32, 3); wheel(CX - 0.7, -0.72, 0.32, 4);
// çeki demiri + top
const hitchBar = mesh(box(0.4, 0.08, 0.12), drawC, { flat: true, name: 'ceki_demiri' });
hitchBar.position.set(CX - 1.5, 0.46, 0); modelGroup.add(hitchBar);
const ball = mesh(new THREE.SphereGeometry(0.07, 10, 8), chrome, { metal: 0.6, name: 'ceki_topu' });
ball.position.set(CX - 1.68, 0.5, 0); modelGroup.add(ball);

// ================= KARAVAN RÖMORK (büyük, alçaltıldı: teker yarısı gövdeye girer) =================
const VX = -1.8;
const cbody = mesh(box(3.4, 1.18, 1.7), cream, { flat: true, rough: 0.7, name: 'karavan_govde' });
cbody.position.set(VX, 0.92, 0); modelGroup.add(cbody);            // taban ~0.33 (teker merkezi hizası)
const croof = mesh(box(3.0, 0.22, 1.55), cream, { flat: true, rough: 0.7, name: 'karavan_cati' });
croof.position.set(VX, 1.62, 0); modelGroup.add(croof);
const cstripe = mesh(box(3.42, 0.18, 1.72), stripe, { flat: true, name: 'karavan_serit' });
cstripe.position.set(VX, 0.88, 0); modelGroup.add(cstripe);
const vent = mesh(box(0.34, 0.1, 0.34), '#f2f2f2', { flat: true, name: 'cati_menfezi' });
vent.position.set(VX - 0.6, 1.78, 0); modelGroup.add(vent);
// kapı (+z) + cam + kol
const door = mesh(box(0.72, 1.0, 0.05), doorC, { flat: true, name: 'kapi' });
door.position.set(VX + 0.5, 0.83, 0.86); modelGroup.add(door);
const dwin = mesh(box(0.44, 0.34, 0.06), glass, { flat: true, rough: 0.1, name: 'kapi_cami' });
dwin.position.set(VX + 0.5, 1.15, 0.87); modelGroup.add(dwin);
const handle = mesh(box(0.04, 0.13, 0.05), chrome, { metal: 0.5, name: 'kapi_kolu' });
handle.position.set(VX + 0.22, 0.82, 0.88); modelGroup.add(handle);
// yan + ön camlar
[0.86, -0.86].forEach((z, i) => {
  const sw = mesh(box(0.9, 0.48, 0.04), glass, { flat: true, rough: 0.1, name: 'karavan_cam_' + (i + 1) });
  sw.position.set(VX - 0.55, 1.15, z); modelGroup.add(sw);
});
const fwin = mesh(box(0.05, 0.46, 1.05), glass, { flat: true, rough: 0.1, name: 'karavan_on_cam' });
fwin.position.set(VX + 1.71, 1.15, 0); modelGroup.add(fwin);
// tekerler (arkada, üst yarısı gövdeye girer) + çamurluk (tekerin üstüne oturur)
wheel(VX - 0.55, 0.86, 0.34, 5); wheel(VX - 0.55, -0.86, 0.34, 6);
[0.86, -0.86].forEach((z, i) => {
  const fen = mesh(box(1.05, 0.13, 0.42), cream, { flat: true, name: 'camurluk_' + (i + 1) });
  fen.position.set(VX - 0.55, 0.72, z); modelGroup.add(fen);
});
// A-çatı oku (drawbar) — ön alt köşelerden çeki topuna
[0.5, -0.5].forEach((z) => {
  rod([VX + 1.7, 0.42, z], [CX - 1.68, 0.5, 0], 0.05, drawC, 'drawbar');
});
const coupler = mesh(box(0.2, 0.16, 0.18), drawC, { flat: true, name: 'kavrama' });
coupler.position.set(CX - 1.63, 0.5, 0); modelGroup.add(coupler);
const jock = mesh(cyl(0.04, 0.04, 0.34, 8), drawC, { metal: 0.3, name: 'on_ayak' });
jock.position.set(VX + 1.95, 0.42, 0); modelGroup.add(jock);
