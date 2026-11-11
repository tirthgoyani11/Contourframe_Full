// Füze sahası / silo — merkezde açık silo + dik füze.
const dirt = '#6b6048', pad = '#7c8084', rim = '#6b6f73', hole = '#0e0f12', doorC = '#5e636a';
const mBody = '#c8ccd0', mNose = '#5a5240', band = '#b23a2e', tower = '#8a8f96', wire = '#3a3d33';
const bunker = '#6b6f5a', tank = '#cdd0d3', metal = '#9aa0a6', wall = '#74705c', spark = '#ffe08a';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);
function rod(p1, p2, r, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]), b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), 6), color, { name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}

// ---- zemin + platform ----
const ground = mesh(box(16, 0.1, 14), dirt, { flat: true, rough: 1, name: 'zemin' });
ground.position.set(0, 0.05, 0);
modelGroup.add(ground);
const platform = mesh(box(8.5, 0.14, 8.5), pad, { flat: true, rough: 0.95, name: 'platform' });
platform.position.set(0, 0.12, 0);
modelGroup.add(platform);

// ---- silo (açık) ----
const siloRim = mesh(cyl(1.5, 1.6, 0.45, 22), rim, { flat: true, name: 'silo_agzi' });
siloRim.position.set(0, 0.32, 0);
modelGroup.add(siloRim);
const siloHole = mesh(cyl(1.15, 1.15, 0.55, 22), hole, { name: 'silo_deligi' });
siloHole.position.set(0, 0.28, 0);
modelGroup.add(siloHole);
// kayan blast kapağı (yana açılmış) + raylar
const door = mesh(cyl(1.55, 1.55, 0.4, 22), doorC, { flat: true, metal: 0.3, name: 'blast_kapagi' });
door.position.set(3.3, 0.33, 0);
modelGroup.add(door);
[-0.85, 0.85].forEach((z, i) => {
  const rail = mesh(box(3.4, 0.1, 0.18), metal, { metal: 0.4, name: 'ray_' + (i + 1) });
  rail.position.set(1.7, 0.22, z);
  modelGroup.add(rail);
});

// ---- dik balistik füze (silodan çıkmış) ----
const MB = 4.6;
const body = mesh(cyl(0.8, 0.8, MB, 20), mBody, { flat: false, rough: 0.5, name: 'fuze_govde' });
body.position.set(0, 0.3 + MB / 2, 0);
modelGroup.add(body);
const nose = mesh(cyl(0.04, 0.8, 1.5, 20), mNose, { flat: false, name: 'savas_basligi' });
nose.position.set(0, 0.3 + MB + 0.75, 0);
modelGroup.add(nose);
[1.4, 3.4].forEach((y, i) => {
  const bnd = mesh(cyl(0.82, 0.82, 0.18, 20), band, { name: 'bant_' + (i + 1) });
  bnd.position.set(0, 0.3 + y, 0);
  modelGroup.add(bnd);
});

// ---- 4 yıldırım koruma kulesi + catenary teller ----
const apex = [0, 7.0, 0];
[[-3.6, -3.6], [3.6, -3.6], [-3.6, 3.6], [3.6, 3.6]].forEach((p, i) => {
  const mast = mesh(cyl(0.12, 0.28, 6.2, 4), tower, { flat: true, metal: 0.3, name: 'yildirim_kulesi_' + (i + 1) });
  mast.position.set(p[0], 3.1, p[1]);
  modelGroup.add(mast);
  const tip = mesh(cyl(0.0, 0.1, 0.5, 6), metal, { name: 'kule_ucu_' + (i + 1) });
  tip.position.set(p[0], 6.45, p[1]);
  modelGroup.add(tip);
  rod([p[0], 6.2, p[1]], apex, 0.02, wire, 'catenary_' + (i + 1));
});
const apexBall = mesh(cyl(0.1, 0.1, 0.2, 8), metal, { name: 'catenary_merkez' });
apexBall.position.set(0, 7.0, 0);
modelGroup.add(apexBall);

// ---- kalkış kontrol bunkeri ----
const cc = mesh(box(2.6, 1.0, 2.0), bunker, { flat: true, rough: 0.9, name: 'kontrol_bunkeri' });
cc.position.set(-5.2, 0.6, -4.0);
modelGroup.add(cc);
const ccBerm = mesh(box(3.0, 0.5, 0.5), '#5a5640', { flat: true, name: 'toprak_set' });
ccBerm.position.set(-5.2, 0.35, -2.85);
modelGroup.add(ccBerm);
const ccDoor = mesh(box(0.5, 0.7, 0.08), '#2e2a1c', { name: 'bunker_kapi' });
ccDoor.position.set(-5.2, 0.45, -3.0);
modelGroup.add(ccDoor);
const ccAnt = mesh(cyl(0.03, 0.03, 1.4, 6), metal, { name: 'bunker_anten' });
ccAnt.position.set(-6.2, 1.8, -4.0);
modelGroup.add(ccAnt);
const ccDish = mesh(cyl(0.4, 0.4, 0.1, 14), tank, { flat: true, name: 'bunker_canak' });
ccDish.rotation.z = Math.PI / 2.6; ccDish.position.set(-4.2, 1.4, -4.0);
modelGroup.add(ccDish);

// ---- yakıt tankları ----
[[5.3, 3.8], [5.3, 5.4], [6.5, 4.6]].forEach((p, i) => {
  const t = mesh(cyl(0.55, 0.6, 2.2, 16), tank, { flat: true, metal: 0.2, name: 'yakit_tanki_' + (i + 1) });
  t.position.set(p[0], 1.2, p[1]);
  modelGroup.add(t);
  const cap = mesh(cyl(0.55, 0.4, 0.4, 16), tank, { name: 'tank_kapak_' + (i + 1) });
  cap.position.set(p[0], 2.45, p[1]);
  modelGroup.add(cap);
});

// ---- güvenlik duvarı (kapı boşluklu) ----
const WH = 0.7, wy = 0.45;
function wseg(w, d, x, z, name) {
  const m = mesh(box(w, WH, d), wall, { flat: true, rough: 0.9, name: name });
  m.position.set(x, wy, z); modelGroup.add(m);
}
wseg(15.6, 0.3, 0, -6.7, 'duvar_arka');
wseg(0.3, 13.4, -7.7, 0, 'duvar_sol');
wseg(0.3, 13.4, 7.7, 0, 'duvar_sag');
wseg(5.5, 0.3, -4.9, 6.7, 'duvar_on_sol');
wseg(5.5, 0.3, 4.9, 6.7, 'duvar_on_sag');
