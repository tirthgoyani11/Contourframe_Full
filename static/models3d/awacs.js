// AWACS (E-3 Sentry tarzı) — burun +x, kuyruk -x. Üstte dönen rotodome. Havada.
const body = '#d9dbde', wingC = '#cbcdd1', engineC = '#bdbfc3';
const dark = '#1a1d22', dome = '#6a7079', stripe = '#9aa0a8', glass = '#10131a', metal = '#8a8f96';
const YC = 1.9;
modelGroup.userData.noGround = true;

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);
const sph = (r) => new THREE.SphereGeometry(r, 16, 12);

// yatay süpürülmüş yüzey (kanat / yatay kuyruk): shape XY(x=kiriş,y=açıklık) -> yatay
function wingFlat(pts, thick, color, name, side) {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, steps: 1 });
  g.translate(0, 0, -thick / 2);
  const m = mesh(g, color, { flat: true, rough: 0.6, name: name });
  m.rotation.x = side > 0 ? Math.PI / 2 : -Math.PI / 2;
  return m;
}
// dikey süpürülmüş yüzey (dikey kuyruk): shape XY(x=kiriş,y=yükseklik), thin z
function vfin(pts, thick, color, name) {
  const s = new THREE.Shape();
  s.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) s.lineTo(pts[i][0], pts[i][1]);
  s.closePath();
  const g = new THREE.ExtrudeGeometry(s, { depth: thick, bevelEnabled: false, steps: 1 });
  g.translate(0, 0, -thick / 2);
  return mesh(g, color, { flat: true, rough: 0.6, name: name });
}
function rod(p1, p2, r, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), 10), color, { metal: 0.4, name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}

// ---- gövde ----
const fus = mesh(cyl(0.42, 0.42, 7.0, 20), body, { flat: false, rough: 0.5, name: 'govde' });
fus.rotation.z = Math.PI / 2;
fus.position.set(0, YC, 0); // x: -3.5 .. 3.5
modelGroup.add(fus);
const nose = mesh(cyl(0.05, 0.42, 0.9, 20), body, { flat: false, name: 'burun' }); // uç önde, taban gövdede
nose.rotation.z = -Math.PI / 2; nose.position.set(3.95, YC, 0);
modelGroup.add(nose);
const tail = mesh(cyl(0.12, 0.42, 1.1, 20), body, { flat: false, name: 'kuyruk_konisi' }); // taban gövdede, daralarak arkaya
tail.rotation.z = Math.PI / 2; tail.position.set(-4.0, YC, 0);
modelGroup.add(tail);
// kokpit camları
const wsdw = mesh(box(0.5, 0.16, 0.5), glass, { rough: 0.2, metal: 0.3, name: 'kokpit_cam' });
wsdw.position.set(3.35, YC + 0.18, 0);
modelGroup.add(wsdw);
// yolcu pencere bandı
const winband = mesh(box(4.5, 0.06, 0.04), glass, { name: 'pencere_bandi' });
winband.position.set(0.2, YC + 0.12, 0.42);
modelGroup.add(winband);

// ---- kanatlar (süpürülmüş) ----
const WING = [[1.3, 0], [-1.1, 0], [-1.8, 3.4], [-1.1, 3.4]];
const wR = wingFlat(WING, 0.13, wingC, 'kanat_sag', 1); wR.position.set(0.1, YC - 0.12, 0); modelGroup.add(wR);
const wL = wingFlat(WING, 0.13, wingC, 'kanat_sol', -1); wL.position.set(0.1, YC - 0.12, 0); modelGroup.add(wL);

// ---- 4 podlu motor (her motor kanadın o açıklıktaki ön kenarına göre) ----
const leAt = (z) => 1.3 - 0.7059 * z; // kanat ön kenarı x'i (kök 1.3 -> uç -1.1 @ z=3.4)
[1.2, 2.5].forEach((zz, k) => {
  [-1, 1].forEach((s) => {
    const z = s * zz;
    const le = leAt(zz);
    const nx = le - 0.15; // nasel merkezi (önü kanat ön kenarından taşar, arkası kanat altında)
    const nac = mesh(cyl(0.2, 0.2, 0.95, 16), engineC, { flat: false, metal: 0.3, name: 'motor_' + (s > 0 ? 'R' : 'L') + (k + 1) });
    nac.rotation.z = Math.PI / 2;
    nac.position.set(nx, YC - 0.52, z);
    modelGroup.add(nac);
    const intake = mesh(cyl(0.21, 0.21, 0.12, 16), dark, { name: 'motor_agzi' });
    intake.rotation.z = Math.PI / 2;
    intake.position.set(nx + 0.5, YC - 0.52, z);
    modelGroup.add(intake);
    const pylon = mesh(box(0.4, 0.32, 0.08), engineC, { flat: true, name: 'pilon' });
    pylon.position.set(le - 0.05, YC - 0.3, z); // kanat ön kenarına bağlanır
    modelGroup.add(pylon);
  });
});

// ---- kuyruk: dikey + yatay ----
const vt = vfin([[-2.6, 0], [-3.7, 0], [-3.9, 1.5], [-3.0, 1.5]], 0.12, wingC, 'dikey_kuyruk');
vt.position.set(0, YC + 0.3, 0);
modelGroup.add(vt);
const HT = [[-2.9, 0], [-3.7, 0], [-3.9, 1.3], [-3.4, 1.3]];
const hR = wingFlat(HT, 0.1, wingC, 'yatay_kuyruk_sag', 1); hR.position.set(0, YC + 0.35, 0); modelGroup.add(hR);
const hL = wingFlat(HT, 0.1, wingC, 'yatay_kuyruk_sol', -1); hL.position.set(0, YC + 0.35, 0); modelGroup.add(hL);

// ---- rotodome: gövde üstünde iki direk + DÖNEN radar diski (kuyruğun önünde) ----
rod([-0.4, YC + 0.4, 0], [-1.0, YC + 1.32, 0], 0.07, metal, 'direk_1'); // ön direk (gövde üstü, merkez hat)
rod([-1.6, YC + 0.4, 0], [-1.0, YC + 1.32, 0], 0.07, metal, 'direk_2'); // arka direk
const rotodome = spin({ pivot: [-1.0, YC + 1.45, 0], axis: 'y', rpm: 6 });
const disc = mesh(cyl(1.4, 1.4, 0.24, 28), dome, { flat: false, rough: 0.5, name: 'radar_diski' });
rotodome.add(disc);
const discStripe = mesh(box(2.8, 0.26, 0.3), stripe, { name: 'radar_serit' });
rotodome.add(discStripe);
const discHub = mesh(cyl(0.18, 0.18, 0.34, 12), metal, { metal: 0.4, name: 'gobek' });
rotodome.add(discHub);
