// Zırhlı araç (8x8 tekerlekli APC/IFV) — burun +x, top +y.
const hull = '#586146', hullDark = '#4a5239', turret = '#535b40';
const tire = '#1b1b1e', hub = '#3a3a40', steel = '#3a3f33';
const glass = '#202a2c', lightCol = '#e6df8a', smoke = '#2a2e24', metal = '#8a8f86';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s) => new THREE.CylinderGeometry(rt, rb, h, s || 16);

// gövdeye bağlı çubuk (anten) — eğim taban->uç'tan hesaplanır
function rod(p1, p2, r, color, name) {
  const a = new THREE.Vector3(p1[0], p1[1], p1[2]);
  const b = new THREE.Vector3(p2[0], p2[1], p2[2]);
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(cyl(r, r, dir.length(), 6), color, { name: name });
  m.position.set((p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2, (p1[2] + p2[2]) / 2);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  modelGroup.add(m);
}

// ---- gövde ----
const lower = mesh(box(4.4, 0.55, 1.7), hull, { flat: true, rough: 0.8, name: 'alt_govde' });
lower.position.set(0, 0.9, 0); // 0.625 .. 1.175
modelGroup.add(lower);
const upper = mesh(box(4.0, 0.55, 1.5), hull, { flat: true, rough: 0.8, name: 'ust_govde' });
upper.position.set(-0.1, 1.45, 0); // 1.175 .. 1.725
modelGroup.add(upper);

// ön eğimli zırh (glacis)
const glacis = mesh(box(1.05, 0.55, 1.72), hullDark, { flat: true, name: 'on_zirh' });
glacis.rotation.z = -0.62;
glacis.position.set(2.25, 1.0, 0);
modelGroup.add(glacis);
// arka rampa (eğik)
const ramp = mesh(box(0.9, 0.55, 1.55), hullDark, { flat: true, name: 'arka_rampa' });
ramp.rotation.z = 0.4;
ramp.position.set(-2.15, 1.0, 0);
modelGroup.add(ramp);

// yan zırh etekleri
[-1, 1].forEach((s, i) => {
  const skirt = mesh(box(4.3, 0.5, 0.05), hullDark, { flat: true, name: 'yan_zirh_' + (i + 1) });
  skirt.position.set(0, 0.85, s * 0.9);
  modelGroup.add(skirt);
});

// ---- tekerlekler (8x8) ----
const wz = 0.95, wxs = [1.6, 0.55, -0.55, -1.6];
[-1, 1].forEach((s) => {
  wxs.forEach((x, i) => {
    const w = mesh(cyl(0.45, 0.45, 0.34, 18), tire, { rough: 0.9, name: 'teker_' + (s > 0 ? 'sag' : 'sol') + '_' + (i + 1) });
    w.rotation.x = Math.PI / 2;
    w.position.set(x, 0.45, s * wz);
    modelGroup.add(w);
    const rim = mesh(cyl(0.17, 0.17, 0.36, 10), hub, { metal: 0.5, rough: 0.4, name: 'jant' });
    rim.rotation.x = Math.PI / 2;
    rim.position.set(x, 0.45, s * wz);
    modelGroup.add(rim);
  });
});

// ---- farlar + tampon ----
[-0.55, 0.55].forEach((z, i) => {
  const lamp = mesh(box(0.16, 0.16, 0.18), lightCol, { rough: 0.4, name: 'far_' + (i + 1) });
  lamp.position.set(2.55, 1.05, z);
  modelGroup.add(lamp);
});

// ---- periskoplar (ön üst) ----
[-0.4, 0, 0.4].forEach((z, i) => {
  const p = mesh(box(0.16, 0.08, 0.2), glass, { metal: 0.2, rough: 0.2, name: 'periskop_' + (i + 1) });
  p.position.set(1.3, 1.74, z);
  modelGroup.add(p);
});

// ---- taret + otomatik top ----
const tBase = mesh(box(1.5, 0.5, 1.4), turret, { flat: true, rough: 0.8, name: 'taret' });
tBase.position.set(-0.1, 1.95, 0);
modelGroup.add(tBase);
// eğik ön taret plakası
const tFront = mesh(box(0.45, 0.5, 1.2), turret, { flat: true, name: 'taret_on' });
tFront.rotation.z = -0.5;
tFront.position.set(0.72, 1.95, 0);
modelGroup.add(tFront);

// otomatik top namlusu + freni
const cannon = mesh(cyl(0.06, 0.06, 1.7, 12), steel, { metal: 0.4, name: 'top_namlu' });
cannon.rotation.z = Math.PI / 2;
cannon.position.set(1.5, 2.0, 0);
modelGroup.add(cannon);
const muzzle = mesh(cyl(0.09, 0.09, 0.3, 12), steel, { metal: 0.4, name: 'namlu_freni' });
muzzle.rotation.z = Math.PI / 2;
muzzle.position.set(2.3, 2.0, 0);
modelGroup.add(muzzle);
// eş eksenli makineli
const coax = mesh(cyl(0.035, 0.035, 0.8, 8), steel, { metal: 0.4, name: 'es_eksenli' });
coax.rotation.z = Math.PI / 2;
coax.position.set(1.1, 2.12, 0.25);
modelGroup.add(coax);

// komutan nişangahı (RWS/sight)
const sight = mesh(box(0.3, 0.22, 0.22), steel, { flat: true, name: 'nisangah' });
sight.position.set(-0.5, 2.32, 0.3);
modelGroup.add(sight);
const sightLens = mesh(box(0.04, 0.14, 0.14), glass, { metal: 0.3, name: 'nisangah_cam' });
sightLens.position.set(-0.34, 2.32, 0.3);
modelGroup.add(sightLens);
// komutan kapağı
const hatch = mesh(cyl(0.26, 0.26, 0.1, 14), turret, { flat: true, name: 'kapak' });
hatch.position.set(-0.55, 2.25, -0.2);
modelGroup.add(hatch);

// ---- sis bombası fırlatıcıları (taret yanları, 2x4) ----
[-1, 1].forEach((s) => {
  for (let k = 0; k < 4; k++) {
    const tube = mesh(cyl(0.05, 0.05, 0.22, 8), smoke, { name: 'sis_' + (s > 0 ? 'sag' : 'sol') + '_' + (k + 1) });
    tube.rotation.z = -0.5; // hafif öne/yukarı
    tube.position.set(0.35 - k * 0.13, 2.05, s * 0.62);
    modelGroup.add(tube);
  }
});

// ---- antenler (gövde arkasına bağlı) ----
[-1, 1].forEach((s, i) => {
  rod([-1.7, 1.7, s * 0.5], [-1.95, 2.55, s * 0.62], 0.02, '#15161a', 'anten_' + (i + 1));
});

// ---- çekme kancaları ----
[2.55, -2.4].forEach((x, i) => {
  const hook = mesh(box(0.18, 0.12, 0.12), metal, { metal: 0.4, name: 'kanca_' + (i + 1) });
  hook.position.set(x, 0.7, 0);
  modelGroup.add(hook);
});
